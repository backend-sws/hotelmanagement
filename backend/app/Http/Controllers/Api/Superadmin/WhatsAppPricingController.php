<?php

namespace App\Http\Controllers\Api\Superadmin;

use App\Http\Controllers\BaseController;
use App\Models\Business;
use App\Models\BusinessWallet;
use App\Services\WhatsApp\WhatsAppPricingService;
use App\Services\WhatsApp\WhatsAppWalletService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WhatsAppPricingController extends BaseController
{
    protected WhatsAppPricingService $pricingService;
    protected WhatsAppWalletService $walletService;

    public function __construct(WhatsAppPricingService $pricingService, WhatsAppWalletService $walletService)
    {
        $this->pricingService = $pricingService;
        $this->walletService = $walletService;
    }

    /**
     * Get all rate cards and platform financial metrics
     */
    public function index(): JsonResponse
    {
        $globalRates = $this->pricingService->getGlobalRates();
        $metrics = $this->walletService->getPlatformMetrics();

        return $this->success([
            'global_rates'     => $globalRates,
            'platform_metrics' => $metrics,
        ], 'WhatsApp pricing configuration retrieved');
    }

    /**
     * Update or create a global rate
     */
    public function updateGlobalRate(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'category'       => 'required|in:utility,authentication,service,marketing,ai_vision',
            'wholesale_cost' => 'required|numeric|min:0',
            'retail_price'   => 'required|numeric|min:0',
        ]);

        $rate = $this->pricingService->setGlobalRate(
            $validated['category'],
            (float)$validated['wholesale_cost'],
            (float)$validated['retail_price']
        );

        return $this->success($rate, 'Global rate updated successfully');
    }

    /**
     * Set a custom rate override for a tenant
     */
    public function setTenantRate(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'business_id'    => 'required|exists:businesses,id',
            'category'       => 'required|in:utility,authentication,service,marketing,ai_vision',
            'wholesale_cost' => 'required|numeric|min:0',
            'retail_price'   => 'required|numeric|min:0',
        ]);

        $rate = $this->pricingService->setTenantRate(
            (int)$validated['business_id'],
            $validated['category'],
            (float)$validated['wholesale_cost'],
            (float)$validated['retail_price']
        );

        return $this->success($rate, 'Tenant custom rate set successfully');
    }

    /**
     * Remove custom rate override for a tenant
     */
    public function deleteTenantRate(int $businessId, string $category): JsonResponse
    {
        $deleted = $this->pricingService->deleteTenantRate($businessId, $category);
        return $this->success(['deleted' => $deleted], 'Tenant custom rate removed, reverted to global default');
    }

    /**
     * List all tenant wallets with current balances and metrics
     */
    public function getTenantWallets(Request $request): JsonResponse
    {
        $this->walletService->ensureWalletsExist();

        $perPage = (int)$request->input('per_page', 10);

        $query = BusinessWallet::with(['business:id,name,phone,email,status'])
            ->whereHas('business');

        if ($request->filled('search')) {
            $search = trim($request->input('search'));
            $query->whereHas('business', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        if ($request->filled('status')) {
            $status = $request->input('status');
            if ($status === 'depleted') {
                $query->where('balance', '<=', 0);
            } elseif ($status === 'low_balance') {
                $query->where('balance', '>', 0)
                      ->whereColumn('balance', '<', 'low_balance_threshold');
            } elseif ($status === 'healthy') {
                $query->whereColumn('balance', '>=', 'low_balance_threshold');
            } elseif ($status !== 'all') {
                $query->where('status', $status);
            }
        }

        $sortBy = $request->input('sort_by', 'balance');
        $sortOrder = $request->input('sort_order', 'desc');
        $allowedSorts = ['balance', 'total_recharged', 'total_consumed', 'business_id', 'created_at'];

        if (in_array($sortBy, $allowedSorts)) {
            $query->orderBy($sortBy, $sortOrder === 'asc' ? 'asc' : 'desc');
        } else {
            $query->orderBy('balance', 'desc');
        }

        $query->orderBy('business_id', 'asc');

        if ($request->input('all') === 'true' || $perPage === -1) {
            $wallets = $query->get();
            return $this->success($wallets, 'Tenant wallets retrieved');
        }

        $wallets = $query->paginate($perPage);

        return $this->success($wallets, 'Tenant wallets retrieved');
    }

    /**
     * Super Admin manual credit or trial grant to a tenant wallet
     */
    public function manualCreditTenant(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'business_id' => 'required|exists:businesses,id',
            'amount'      => 'required|numeric|min:1',
            'description' => 'required|string|max:255',
            'reference'   => 'nullable|string|max:100',
        ]);

        $txn = $this->walletService->credit(
            (int)$validated['business_id'],
            (float)$validated['amount'],
            $validated['description'],
            $validated['reference'] ?? 'SUPERADMIN_MANUAL_CREDIT',
            'admin_adjustment'
        );

        return $this->success($txn, 'Funds credited to tenant wallet successfully');
    }
}
