<?php

namespace App\Http\Controllers\Api\Business;

use App\Http\Controllers\BaseController;
use App\Services\WhatsApp\WhatsAppPricingService;
use App\Services\WhatsApp\WhatsAppWalletService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WhatsAppWalletController extends BaseController
{
    protected WhatsAppWalletService $walletService;
    protected WhatsAppPricingService $pricingService;

    public function __construct(WhatsAppWalletService $walletService, WhatsAppPricingService $pricingService)
    {
        $this->walletService = $walletService;
        $this->pricingService = $pricingService;
    }

    protected function getBusinessId(Request $request): int
    {
        if (app()->bound('current_business_id')) {
            return (int)app('current_business_id');
        }

        $headerId = $request->header('X-Tenant-ID');
        if ($headerId && is_numeric($headerId)) {
            return (int)$headerId;
        }

        $userBizId = $request->user()?->businesses()->first()?->id;
        if ($userBizId) {
            return (int)$userBizId;
        }

        return (int)(\App\Models\Business::value('id') ?? 1);
    }

    /**
     * Get wallet details, live balance, low balance alert, and effective rates for this business
     */
    public function getWallet(Request $request): JsonResponse
    {
        $businessId = $this->getBusinessId($request);
        $wallet = $this->walletService->getWallet($businessId);

        // Fetch effective rate card for this business
        $categories = ['utility', 'authentication', 'service', 'marketing', 'ai_vision'];
        $rates = [];
        foreach ($categories as $cat) {
            $rate = $this->pricingService->getRateForTenant($businessId, $cat);
            $rates[$cat] = [
                'category'     => $cat,
                'retail_price' => $rate->retail_price,
                'is_custom'    => $rate->is_custom,
            ];
        }

        $balance = (float)$wallet->balance;
        $lowThreshold = (float)$wallet->low_balance_threshold;

        return $this->success([
            'wallet' => [
                'id'                    => $wallet->id,
                'business_id'           => $wallet->business_id,
                'balance'               => $balance,
                'currency'              => $wallet->currency,
                'status'                => $wallet->status,
                'low_balance_threshold' => $lowThreshold,
                'is_low_balance'        => $balance < $lowThreshold,
                'is_depleted'           => $balance <= 0,
                'total_recharged'       => (float)$wallet->total_recharged,
                'total_consumed'        => (float)$wallet->total_consumed,
            ],
            'rates' => $rates,
            'packs' => [
                ['amount' => 500,  'label' => 'Starter Pack',    'tag' => 'Good for ~660 messages'],
                ['amount' => 1000, 'label' => 'Growth Pack',     'tag' => 'Most Popular (~1,330 msgs)', 'popular' => true],
                ['amount' => 2500, 'label' => 'Business Pack',   'tag' => 'Good for ~3,330 messages'],
                ['amount' => 5000, 'label' => 'Enterprise Pack', 'tag' => 'Good for ~6,660 messages'],
            ],
        ], 'Wallet retrieved successfully');
    }

    /**
     * Get paginated transaction passbook / ledger
     */
    public function getTransactions(Request $request): JsonResponse
    {
        $businessId = $this->getBusinessId($request);
        $perPage = (int)$request->input('per_page', 20);
        $filters = $request->only(['type', 'category']);

        $paginated = $this->walletService->getTransactions($businessId, $perPage, $filters);
        return $this->success($paginated, 'Transactions retrieved');
    }

    protected function getRazorpayCredentials(): array
    {
        $key = config('services.razorpay.key') ?: (\App\Models\Setting::where('key', 'razorpay_key')->value('value') ?? env('RAZORPAY_KEY'));
        $secret = config('services.razorpay.secret') ?: (\App\Models\Setting::where('key', 'razorpay_secret')->value('value') ?? env('RAZORPAY_SECRET'));

        return [(string)$key, (string)$secret];
    }

    /**
     * Create Razorpay order for WhatsApp prepaid wallet recharge
     */
    public function createRechargeOrder(Request $request): JsonResponse
    {
        $businessId = $this->getBusinessId($request);

        $validated = $request->validate([
            'amount' => 'required|numeric|min:10|max:100000',
        ]);

        $amount = (float)$validated['amount'];
        [$key, $secret] = $this->getRazorpayCredentials();

        if (empty($key) || empty($secret)) {
            return $this->error('Razorpay payment gateway credentials are not configured. Please contact administrator.', 500);
        }

        try {
            $api = new \Razorpay\Api\Api($key, $secret);
            $amountInPaise = intval(round($amount * 100));

            $order = $api->order->create([
                'receipt'  => 'wa_wlt_' . $businessId . '_' . substr(uniqid(), -6),
                'amount'   => $amountInPaise,
                'currency' => 'INR',
                'notes'    => [
                    'business_id' => $businessId,
                    'type'        => 'whatsapp_wallet_recharge',
                ],
            ]);

            return $this->success([
                'order_id' => $order['id'],
                'amount'   => $amountInPaise,
                'currency' => 'INR',
                'key'      => $key,
            ], 'Razorpay recharge order generated');
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Razorpay Wallet Order Creation Error: ' . $e->getMessage());
            return $this->error('Failed to initiate Razorpay payment: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Verify Razorpay payment signature and credit wallet
     */
    public function verifyRechargePayment(Request $request): JsonResponse
    {
        $businessId = $this->getBusinessId($request);

        $validated = $request->validate([
            'amount'              => 'required|numeric|min:10|max:100000',
            'razorpay_order_id'   => 'required|string',
            'razorpay_payment_id' => 'required|string',
            'razorpay_signature'  => 'required|string',
        ]);

        $amount = (float)$validated['amount'];
        [$key, $secret] = $this->getRazorpayCredentials();

        if (empty($key) || empty($secret)) {
            return $this->error('Razorpay payment gateway credentials not configured', 500);
        }

        try {
            $api = new \Razorpay\Api\Api($key, $secret);
            $api->utility->verifyPaymentSignature([
                'razorpay_order_id'   => $validated['razorpay_order_id'],
                'razorpay_payment_id' => $validated['razorpay_payment_id'],
                'razorpay_signature'  => $validated['razorpay_signature'],
            ]);
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Razorpay Wallet Signature Verification Failed: ' . $e->getMessage());
            return $this->error('Payment verification failed: invalid signature', 400);
        }

        // Idempotency: avoid double crediting
        $existing = \App\Models\WalletTransaction::where('reference_id', $validated['razorpay_payment_id'])->first();
        if ($existing) {
            $currentWallet = $this->walletService->getWallet($businessId);
            return $this->success([
                'transaction' => $existing,
                'wallet'      => $currentWallet,
            ], 'Payment already processed and credited');
        }

        $txn = $this->walletService->credit(
            $businessId,
            $amount,
            "Prepaid Wallet Recharge via Razorpay ({$validated['razorpay_payment_id']})",
            $validated['razorpay_payment_id'],
            'recharge'
        );

        $updatedWallet = $this->walletService->getWallet($businessId);

        return $this->success([
            'transaction' => $txn,
            'wallet'      => $updatedWallet,
        ], "Wallet successfully recharged with ₹" . number_format($amount, 2));
    }

    /**
     * Fallback recharge (manual/admin credit)
     */
    public function recharge(Request $request): JsonResponse
    {
        $businessId = $this->getBusinessId($request);

        $validated = $request->validate([
            'amount'         => 'required|numeric|min:10|max:100000',
            'payment_id'     => 'nullable|string|max:100',
            'payment_method' => 'nullable|string|max:50',
        ]);

        $amount = (float)$validated['amount'];
        $paymentId = $validated['payment_id'] ?? ('PAY_' . strtoupper(uniqid()));
        $method = $validated['payment_method'] ?? 'Online Payment';

        $txn = $this->walletService->credit(
            $businessId,
            $amount,
            "WhatsApp Wallet Recharge via {$method}",
            $paymentId,
            'recharge'
        );

        $updatedWallet = $this->walletService->getWallet($businessId);

        return $this->success([
            'transaction' => $txn,
            'wallet'      => $updatedWallet,
        ], "Wallet successfully recharged with ₹" . number_format($amount, 2));
    }

    /**
     * Get WhatsApp bot attendance logs with selfie photos and GPS coordinates
     */
    public function getBotAttendanceLogs(Request $request): JsonResponse
    {
        $businessId = $this->getBusinessId($request);
        $perPage = (int)$request->input('per_page', 25);
        $date = $request->input('date', today()->toDateString());

        $query = \App\Models\Attendance::with(['user:id,name,phone,avatar'])
            ->where('business_id', $businessId)
            ->where(function ($q) {
                $q->where('notes', 'like', '%WhatsApp%')
                  ->orWhereNotNull('check_in_latitude');
            });

        if ($request->filled('date')) {
            $query->whereDate('date', $request->input('date'));
        }

        $logs = $query->orderBy('created_at', 'desc')->paginate($perPage);

        // Compute summary metrics for today
        $todayPunches = \App\Models\Attendance::where('business_id', $businessId)
            ->whereDate('date', today())
            ->where('notes', 'like', '%WhatsApp%')
            ->count();

        $withinFenceCount = \App\Models\Attendance::where('business_id', $businessId)
            ->whereDate('date', today())
            ->where('notes', 'like', '%WhatsApp%')
            ->where('is_within_geofence', true)
            ->count();

        $complianceRate = $todayPunches > 0 ? round(($withinFenceCount / $todayPunches) * 100, 1) : 100;

        return $this->success([
            'logs' => $logs,
            'stats' => [
                'today_punches'    => $todayPunches,
                'within_geofence'  => $withinFenceCount,
                'compliance_rate'  => $complianceRate,
            ],
        ], 'Bot attendance logs retrieved successfully');
    }
}
