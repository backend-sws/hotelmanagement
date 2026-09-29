<?php

namespace App\Services\WhatsApp;

use App\Models\BusinessWallet;
use App\Models\WalletTransaction;
use Illuminate\Support\Facades\DB;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Exception;

class WhatsAppWalletService
{
    protected WhatsAppPricingService $pricingService;

    public function __construct(WhatsAppPricingService $pricingService)
    {
        $this->pricingService = $pricingService;
    }

    /**
     * Ensure all registered businesses have an initialized wallet record.
     */
    public function ensureWalletsExist(): void
    {
        $businessIds = \App\Models\Business::pluck('id');
        $existingWalletIds = BusinessWallet::pluck('business_id')->toArray();
        $missingIds = $businessIds->diff($existingWalletIds);

        if ($missingIds->isNotEmpty()) {
            $now = now();
            $records = [];
            foreach ($missingIds as $bId) {
                $records[] = [
                    'business_id'           => $bId,
                    'balance'               => 0.0000,
                    'currency'              => 'INR',
                    'low_balance_threshold' => 200.00,
                    'status'                => 'active',
                    'total_recharged'       => 0.0000,
                    'total_consumed'        => 0.0000,
                    'created_at'            => $now,
                    'updated_at'            => $now,
                ];
            }
            BusinessWallet::insert($records);
        }
    }

    /**
     * Get or initialize wallet for a business
     */
    public function getWallet(int $businessId): BusinessWallet
    {
        return BusinessWallet::firstOrCreate(
            ['business_id' => $businessId],
            [
                'balance'               => 0.0000,
                'currency'              => 'INR',
                'low_balance_threshold' => 200.00,
                'status'                => 'active',
            ]
        );
    }

    /**
     * Check if a business has enough wallet balance for an action
     */
    public function canAfford(int $businessId, string $category): bool
    {
        $wallet = $this->getWallet($businessId);
        $rate = $this->pricingService->getRateForTenant($businessId, $category);

        // Allow a small soft buffer of -₹50 so critical ongoing conversations aren't abruptly truncated
        return ($wallet->balance - $rate->retail_price) >= -50.00;
    }

    /**
     * Atomic debit with row locking to prevent race conditions during high-concurrency check-ins
     *
     * @throws Exception if balance is severely depleted
     */
    public function debit(int $businessId, string $category, string $description, array $meta = []): WalletTransaction
    {
        return DB::transaction(function () use ($businessId, $category, $description, $meta) {
            // Lock the wallet row for update
            $wallet = BusinessWallet::where('business_id', $businessId)->lockForUpdate()->first();

            if (!$wallet) {
                $wallet = BusinessWallet::create([
                    'business_id' => $businessId,
                    'balance'     => 0.0000,
                    'status'      => 'depleted',
                ]);
            }

            $rate = $this->pricingService->getRateForTenant($businessId, $category);
            $chargeAmount = (float)$rate->retail_price;

            // Balance check with soft buffer (-₹50.00)
            if (($wallet->balance - $chargeAmount) < -50.00) {
                throw new Exception("INSUFFICIENT_WALLET_BALANCE: Balance is ₹" . number_format($wallet->balance, 2) . ". Minimum required is ₹" . number_format($chargeAmount, 2));
            }

            $balanceBefore = (float)$wallet->balance;
            $balanceAfter = $balanceBefore - $chargeAmount;

            // Update wallet balance & metrics
            $wallet->balance = $balanceAfter;
            $wallet->total_consumed = (float)$wallet->total_consumed + $chargeAmount;

            if ($balanceAfter <= 0) {
                $wallet->status = 'depleted';
            } elseif ($balanceAfter < (float)$wallet->low_balance_threshold) {
                $wallet->status = 'low_balance';
            } else {
                $wallet->status = 'active';
            }
            $wallet->save();

            // Enrich metadata with profit analytics
            $meta['wholesale_cost'] = $rate->wholesale_cost;
            $meta['retail_price']   = $rate->retail_price;
            $meta['platform_profit'] = round($rate->retail_price - $rate->wholesale_cost, 4);

            $transCategory = match($category) {
                'authentication', 'auth' => 'whatsapp_auth',
                'utility'                => 'whatsapp_utility',
                'service'                => 'whatsapp_service',
                'marketing'              => 'whatsapp_marketing',
                'ai_vision'              => 'ai_vision_check',
                default                  => str_starts_with($category, 'whatsapp_') ? $category : "whatsapp_{$category}",
            };

            return WalletTransaction::create([
                'business_id'    => $businessId,
                'wallet_id'      => $wallet->id,
                'type'           => 'debit',
                'category'       => $transCategory,
                'amount'         => $chargeAmount,
                'balance_before' => $balanceBefore,
                'balance_after'  => $balanceAfter,
                'reference_id'   => $meta['message_id'] ?? null,
                'description'    => $description,
                'metadata'       => $meta,
            ]);
        });
    }

    /**
     * Credit funds to wallet (recharge, trial grant, refund)
     */
    public function credit(int $businessId, float $amount, string $description, ?string $referenceId = null, string $category = 'recharge'): WalletTransaction
    {
        return DB::transaction(function () use ($businessId, $amount, $description, $referenceId, $category) {
            $wallet = BusinessWallet::firstOrCreate(
                ['business_id' => $businessId],
                ['balance' => 0.0000, 'currency' => 'INR']
            );

            // Lock row
            $wallet = BusinessWallet::where('id', $wallet->id)->lockForUpdate()->first();

            $balanceBefore = (float)$wallet->balance;
            $balanceAfter = $balanceBefore + $amount;

            $wallet->balance = $balanceAfter;
            $wallet->total_recharged = (float)$wallet->total_recharged + $amount;
            $wallet->status = $balanceAfter >= (float)$wallet->low_balance_threshold ? 'active' : 'low_balance';
            $wallet->save();

            return WalletTransaction::create([
                'business_id'    => $businessId,
                'wallet_id'      => $wallet->id,
                'type'           => 'credit',
                'category'       => $category,
                'amount'         => $amount,
                'balance_before' => $balanceBefore,
                'balance_after'  => $balanceAfter,
                'reference_id'   => $referenceId,
                'description'    => $description,
            ]);
        });
    }

    /**
     * Get paginated transactions for a business
     */
    public function getTransactions(int $businessId, int $perPage = 20, array $filters = []): LengthAwarePaginator
    {
        $query = WalletTransaction::where('business_id', $businessId);

        if (!empty($filters['type'])) {
            $query->where('type', $filters['type']);
        }

        if (!empty($filters['category'])) {
            $query->where('category', $filters['category']);
        }

        return $query->orderBy('created_at', 'desc')->paginate($perPage);
    }

    /**
     * Get Platform-wide financial metrics for Super Admin
     */
    public function getPlatformMetrics(): array
    {
        $this->ensureWalletsExist();

        $totalFloat = (float)BusinessWallet::sum('balance');
        $totalRecharged = (float)BusinessWallet::sum('total_recharged');
        $totalConsumed = (float)BusinessWallet::sum('total_consumed');

        // Calculate gross profit across all debit transactions
        $transactions = WalletTransaction::where('type', 'debit')->whereNotNull('metadata')->get();
        $totalProfit = 0.0;
        $totalWholesaleCost = 0.0;

        foreach ($transactions as $txn) {
            if (isset($txn->metadata['platform_profit'])) {
                $totalProfit += (float)$txn->metadata['platform_profit'];
            }
            if (isset($txn->metadata['wholesale_cost'])) {
                $totalWholesaleCost += (float)$txn->metadata['wholesale_cost'];
            }
        }

        $activeWalletsCount = BusinessWallet::where('balance', '>', 0)->count();
        $totalWalletsCount = BusinessWallet::count();

        return [
            'total_float'            => round($totalFloat, 2),
            'total_recharged'        => round($totalRecharged, 2),
            'total_consumed'         => round($totalConsumed, 2),
            'total_wholesale_cost'   => round($totalWholesaleCost, 2),
            'total_platform_profit'  => round($totalProfit, 2),
            'margin_percentage'      => $totalConsumed > 0 ? round(($totalProfit / $totalConsumed) * 100, 1) : 0,
            'active_wallets_count'   => $activeWalletsCount,
            'total_wallets_count'    => $totalWalletsCount,
        ];
    }
}
