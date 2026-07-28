<?php

namespace App\Http\Controllers\Api\Business;

use App\Http\Controllers\Controller;
use App\Models\CashBankEntry;
use App\Models\BankAccount;
use App\Models\Customer;
use App\Models\Supplier;
use App\Models\LedgerEntry;
use App\Models\ChequeRegister;
use App\Services\Business\StockService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class BalanceSheetController extends Controller
{
    protected StockService $stockService;

    public function __construct(StockService $stockService)
    {
        $this->stockService = $stockService;
    }

    protected function getBusinessId(Request $request)
    {
        return app()->bound('current_business_id') ? app('current_business_id') : ($request->user() ? ($request->user()->business_id ?? $request->user()->businesses()->first()?->id) : null);
    }

    public function index(Request $request)
    {
        $businessId = $this->getBusinessId($request);
        $asOfDate = $request->input('date', Carbon::now()->toDateString());

        // 1. Current Assets
        // A. Cash in Hand
        $cashStats = CashBankEntry::where('business_id', $businessId)
            ->where('account_type', 'cash')
            ->whereDate('date', '<=', $asOfDate)
            ->selectRaw("
                SUM(CASE WHEN entry_type = 'cash_receipt' THEN amount ELSE 0 END) as receipts,
                SUM(CASE WHEN entry_type = 'cash_payment' THEN amount ELSE 0 END) as payments
            ")
            ->first();
        $cashInHand = floatval(($cashStats->receipts ?? 0) - ($cashStats->payments ?? 0));

        // B. Bank Balances
        $bankAccounts = BankAccount::where('business_id', $businessId)->get();
        $totalBankBalance = floatval($bankAccounts->sum('current_balance'));
        $bankList = $bankAccounts->map(function ($acc) {
            return [
                'id' => $acc->id,
                'name' => $acc->bank_name . ' (' . $acc->account_number . ')',
                'balance' => round(floatval($acc->current_balance), 2),
            ];
        })->values()->toArray();

        // C. Customer Accounts Receivable (Khata Outstanding)
        $customerIds = Customer::where('business_id', $businessId)->pluck('id')->toArray();
        $totalReceivable = 0.0;
        if (!empty($customerIds)) {
            $latestCustomerEntries = LedgerEntry::where('business_id', $businessId)
                ->where('party_type', 'customer')
                ->whereIn('party_id', $customerIds)
                ->whereDate('created_at', '<=', $asOfDate . ' 23:59:59')
                ->select('party_id', DB::raw('MAX(id) as last_id'))
                ->groupBy('party_id')
                ->pluck('last_id');

            $totalReceivable = floatval(LedgerEntry::whereIn('id', $latestCustomerEntries)
                ->where('balance', '>', 0)
                ->sum('balance'));
        }

        // D. Closing Inventory Valuation
        $stockSummary = $this->stockService->getSummary($businessId, null);
        $inventoryValuation = floatval($stockSummary->sum('stock_value'));

        $totalCurrentAssets = $cashInHand + $totalBankBalance + $totalReceivable + $inventoryValuation;
        $totalAssets = $totalCurrentAssets; // Can add fixed assets in future

        // 2. Liabilities
        // A. Supplier Accounts Payable (Khata Outstanding)
        $supplierIds = Supplier::where('business_id', $businessId)->pluck('id')->toArray();
        $totalPayable = 0.0;
        if (!empty($supplierIds)) {
            $latestSupplierEntries = LedgerEntry::where('business_id', $businessId)
                ->where('party_type', 'supplier')
                ->whereIn('party_id', $supplierIds)
                ->whereDate('created_at', '<=', $asOfDate . ' 23:59:59')
                ->select('party_id', DB::raw('MAX(id) as last_id'))
                ->groupBy('party_id')
                ->pluck('last_id');

            $totalPayable = floatval(LedgerEntry::whereIn('id', $latestSupplierEntries)
                ->where('balance', '>', 0)
                ->sum('balance'));
        }

        // B. Uncleared / Pending Cheques Issued
        $pendingCheques = floatval(ChequeRegister::where('business_id', $businessId)
            ->where('type', 'issued')
            ->whereIn('status', ['pending', 'deposited'])
            ->whereDate('cheque_date', '<=', $asOfDate)
            ->sum('amount'));

        $totalLiabilities = $totalPayable + $pendingCheques;

        // 3. Equity & Retained Earnings (The Balancing Figure: A - L)
        $retainedEarnings = $totalAssets - $totalLiabilities;
        $totalLiabilitiesAndEquity = $totalLiabilities + $retainedEarnings;

        return response()->json([
            'data' => [
                'as_of_date' => $asOfDate,
                'assets' => [
                    'current_assets' => [
                        'cash_in_hand' => round($cashInHand, 2),
                        'bank_accounts' => [
                            'items' => $bankList,
                            'total_balance' => round($totalBankBalance, 2),
                        ],
                        'accounts_receivable' => round($totalReceivable, 2),
                        'inventory_valuation' => round($inventoryValuation, 2),
                    ],
                    'total_assets' => round($totalAssets, 2),
                ],
                'liabilities' => [
                    'current_liabilities' => [
                        'accounts_payable' => round($totalPayable, 2),
                        'uncleared_cheques' => round($pendingCheques, 2),
                    ],
                    'total_liabilities' => round($totalLiabilities, 2),
                ],
                'equity' => [
                    'retained_earnings' => round($retainedEarnings, 2),
                    'total_equity' => round($retainedEarnings, 2),
                ],
                'total_liabilities_and_equity' => round($totalLiabilitiesAndEquity, 2),
                'is_balanced' => round($totalAssets, 2) === round($totalLiabilitiesAndEquity, 2),
            ]
        ]);
    }
}
