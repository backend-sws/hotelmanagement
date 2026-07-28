<?php

namespace App\Http\Controllers\Api\Business;

use App\Http\Controllers\Controller;
use App\Models\CashBankEntry;
use App\Models\BankAccount;
use App\Services\LedgerService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class CashBankController extends Controller
{
    protected LedgerService $ledgerService;

    public function __construct(LedgerService $ledgerService)
    {
        $this->ledgerService = $ledgerService;
    }

    public function index(Request $request)
    {
        $businessId = $request->user()->business_id;
        $query = CashBankEntry::with(['bankAccount', 'user'])->where('business_id', $businessId);

        if ($request->filled('account_type')) {
            $query->where('account_type', $request->input('account_type'));
        }
        if ($request->filled('entry_type')) {
            $query->where('entry_type', $request->input('entry_type'));
        }
        if ($request->filled('bank_account_id')) {
            $query->where('bank_account_id', $request->input('bank_account_id'));
        }
        if ($request->filled('party_type') && $request->filled('party_id')) {
            $query->where('party_type', $request->input('party_type'))->where('party_id', $request->input('party_id'));
        }
        if ($request->filled('from_date')) {
            $query->whereDate('date', '>=', $request->input('from_date'));
        }
        if ($request->filled('to_date')) {
            $query->whereDate('date', '<=', $request->input('to_date'));
        }
        if ($request->filled('search')) {
            $s = $request->input('search');
            $query->where(function($q) use ($s) {
                $q->where('narration', 'like', "%{$s}%")
                  ->orWhere('reference_no', 'like', "%{$s}%")
                  ->orWhere('account_name', 'like', "%{$s}%");
            });
        }

        // Use SQL aggregation instead of loading all rows into PHP (fix BUG-06 pattern)
        $cashStats = CashBankEntry::where('business_id', $businessId)
            ->where('account_type', 'cash')
            ->selectRaw("
                SUM(CASE WHEN entry_type = 'cash_receipt' THEN amount ELSE 0 END) as total_receipts,
                SUM(CASE WHEN entry_type = 'cash_payment' THEN amount ELSE 0 END) as total_payments
            ")
            ->first();

        $cashInHand = ($cashStats->total_receipts ?? 0) - ($cashStats->total_payments ?? 0);

        $bankAccounts = BankAccount::where('business_id', $businessId)->get();
        $totalBankBalance = $bankAccounts->sum('current_balance');

        $entries = $query->orderBy('date', 'desc')->orderBy('id', 'desc')->paginate($request->input('per_page', 30));

        return response()->json([
            'status' => 'success',
            'data' => $entries,
            'summary' => [
                'cash_in_hand' => round($cashInHand, 2),
                'total_bank_balance' => round($totalBankBalance, 2),
                'bank_accounts' => $bankAccounts,
                'total_liquidity' => round($cashInHand + $totalBankBalance, 2)
            ]
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'entry_type'     => 'required|in:cash_receipt,cash_payment,bank_receipt,bank_payment,contra',
            'account_type'   => 'nullable|in:cash,bank',
            'bank_account_id'=> 'nullable|exists:bank_accounts,id',
            'account_name'   => 'nullable|string|max:100',
            'party_type'     => 'nullable|in:customer,supplier,expense,other',
            'party_id'       => 'nullable|integer',
            'amount'         => 'required|numeric|min:0.01',
            'payment_mode'   => 'nullable|string|max:50',
            'reference_no'   => 'nullable|string|max:100',
            'narration'      => 'nullable|string',
            'date'           => 'nullable|date',
            'reference_type' => 'nullable|string|max:50',
            'reference_id'   => 'nullable|integer',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'errors' => $validator->errors()], 422);
        }

        $businessId = $request->user()->business_id;
        $entryType  = $request->input('entry_type');
        $amount     = floatval($request->input('amount'));
        $date       = $request->input('date', Carbon::today()->toDateString());
        $narration  = $request->input('narration', 'Cash/Bank transaction recorded');

        $accountType = $request->input('account_type');
        if (!$accountType) {
            $accountType = in_array($entryType, ['bank_receipt', 'bank_payment']) ? 'bank' : 'cash';
        }

        DB::beginTransaction();
        try {
            $entry = CashBankEntry::create([
                'business_id'    => $businessId,
                'bank_account_id'=> $request->input('bank_account_id'),
                'entry_type'     => $entryType,
                'account_type'   => $accountType,
                'account_name'   => $request->input('account_name', $accountType === 'cash' ? 'Petty Cash' : 'Bank Account'),
                'party_type'     => $request->input('party_type'),
                'party_id'       => $request->input('party_id'),
                'amount'         => $amount,
                'payment_mode'   => $request->input('payment_mode', $accountType === 'cash' ? 'cash' : 'bank'),
                'reference_no'   => $request->input('reference_no'),
                'narration'      => $narration,
                'date'           => $date,
                'entered_by'     => $request->user()->id,
                'reference_type' => $request->input('reference_type'),
                'reference_id'   => $request->input('reference_id'),
            ]);

            // Update Bank Account running balance if bank entry
            if ($accountType === 'bank' && $entry->bank_account_id) {
                $bankAcc = BankAccount::where('business_id', $businessId)->find($entry->bank_account_id);
                if ($bankAcc) {
                    if ($entryType === 'bank_receipt') {
                        $bankAcc->increment('current_balance', $amount);
                    } elseif ($entryType === 'bank_payment') {
                        $bankAcc->decrement('current_balance', $amount);
                    }
                }
            }

            // FIX BUG-01 & BUG-02: Use injected $this->ledgerService->createEntry() (instance method)
            // instead of the invalid static LedgerService::recordCredit/recordDebit calls
            if ($entry->party_type && $entry->party_id) {
                if ($entry->party_type === 'customer' && in_array($entryType, ['cash_receipt', 'bank_receipt'])) {
                    // Customer paid us → credit reduces their receivable balance
                    $this->ledgerService->createEntry([
                        'business_id'    => $businessId,
                        'party_type'     => 'customer',
                        'party_id'       => $entry->party_id,
                        'entry_type'     => 'payment_received',
                        'reference_type' => 'cash_bank_entry',
                        'reference_id'   => $entry->id,
                        'date'           => $date,
                        'debit'          => 0,
                        'credit'         => $amount,
                        'narration'      => $narration,
                    ]);
                } elseif ($entry->party_type === 'supplier' && in_array($entryType, ['cash_payment', 'bank_payment'])) {
                    // We paid supplier → debit reduces their payable balance
                    $this->ledgerService->createEntry([
                        'business_id'    => $businessId,
                        'party_type'     => 'supplier',
                        'party_id'       => $entry->party_id,
                        'entry_type'     => 'payment_sent',
                        'reference_type' => 'cash_bank_entry',
                        'reference_id'   => $entry->id,
                        'date'           => $date,
                        'debit'          => $amount,
                        'credit'         => 0,
                        'narration'      => $narration,
                    ]);
                }
            }

            DB::commit();

            return response()->json([
                'status'  => 'success',
                'data'    => $entry,
                'message' => 'Transaction recorded and account balance updated successfully!'
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['status' => 'error', 'message' => 'Transaction failed: ' . $e->getMessage()], 500);
        }
    }

    public function show(Request $request, $id)
    {
        $entry = CashBankEntry::with(['bankAccount', 'user'])->where('business_id', $request->user()->business_id)->findOrFail($id);
        return response()->json(['status' => 'success', 'data' => $entry]);
    }

    public function destroy(Request $request, $id)
    {
        $businessId = $request->user()->business_id;
        $entry = CashBankEntry::where('business_id', $businessId)->findOrFail($id);

        DB::beginTransaction();
        try {
            // Revert bank balance
            if ($entry->account_type === 'bank' && $entry->bank_account_id) {
                $bankAcc = BankAccount::where('business_id', $businessId)->find($entry->bank_account_id);
                if ($bankAcc) {
                    if ($entry->entry_type === 'bank_receipt') {
                        $bankAcc->decrement('current_balance', $entry->amount);
                    } elseif ($entry->entry_type === 'bank_payment') {
                        $bankAcc->increment('current_balance', $entry->amount);
                    }
                }
            }

            // Delete associated ledger entry
            \App\Models\LedgerEntry::where('business_id', $businessId)
                ->where('reference_type', 'cash_bank_entry')
                ->where('reference_id', $entry->id)
                ->delete();

            $entry->delete();

            DB::commit();
            return response()->json(['status' => 'success', 'message' => 'Transaction removed and balances reversed']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['status' => 'error', 'message' => 'Failed to remove entry: ' . $e->getMessage()], 500);
        }
    }

    public function dayBook(Request $request)
    {
        $businessId = $request->user()->business_id;
        $date = $request->input('date', Carbon::today()->toDateString());

        // Opening cash balance before this date using SQL aggregation
        $priorStats = CashBankEntry::where('business_id', $businessId)
            ->where('account_type', 'cash')
            ->whereDate('date', '<', $date)
            ->selectRaw("
                SUM(CASE WHEN entry_type = 'cash_receipt' THEN amount ELSE 0 END) as receipts,
                SUM(CASE WHEN entry_type = 'cash_payment' THEN amount ELSE 0 END) as payments
            ")
            ->first();

        $openingCash = ($priorStats->receipts ?? 0) - ($priorStats->payments ?? 0);

        // Entries for this day
        $entries = CashBankEntry::with(['bankAccount', 'user'])
            ->where('business_id', $businessId)
            ->whereDate('date', $date)
            ->orderBy('created_at', 'asc')
            ->get();

        $dayCashReceipts  = $entries->where('account_type', 'cash')->where('entry_type', 'cash_receipt')->sum('amount');
        $dayCashPayments  = $entries->where('account_type', 'cash')->where('entry_type', 'cash_payment')->sum('amount');
        $closingCash      = $openingCash + $dayCashReceipts - $dayCashPayments;
        $dayBankReceipts  = $entries->where('account_type', 'bank')->where('entry_type', 'bank_receipt')->sum('amount');
        $dayBankPayments  = $entries->where('account_type', 'bank')->where('entry_type', 'bank_payment')->sum('amount');

        return response()->json([
            'status' => 'success',
            'date'   => $date,
            'data'   => $entries,
            'summary' => [
                'opening_cash_balance' => round($openingCash, 2),
                'total_cash_receipts'  => round($dayCashReceipts, 2),
                'total_cash_payments'  => round($dayCashPayments, 2),
                'closing_cash_balance' => round($closingCash, 2),
                'total_bank_receipts'  => round($dayBankReceipts, 2),
                'total_bank_payments'  => round($dayBankPayments, 2),
            ]
        ]);
    }

    public function cashBalance(Request $request)
    {
        $businessId = $request->user()->business_id;

        $stats = CashBankEntry::where('business_id', $businessId)
            ->where('account_type', 'cash')
            ->selectRaw("
                SUM(CASE WHEN entry_type = 'cash_receipt' THEN amount ELSE 0 END) as receipts,
                SUM(CASE WHEN entry_type = 'cash_payment' THEN amount ELSE 0 END) as payments
            ")
            ->first();

        $cashInHand = ($stats->receipts ?? 0) - ($stats->payments ?? 0);

        return response()->json([
            'status'      => 'success',
            'cash_in_hand' => round($cashInHand, 2)
        ]);
    }

    public function bankBalance(Request $request, $accountId)
    {
        $businessId = $request->user()->business_id;
        $account = BankAccount::where('business_id', $businessId)->findOrFail($accountId);

        return response()->json([
            'status'          => 'success',
            'bank_account_id' => $account->id,
            'account_name'    => $account->account_name,
            'current_balance' => round($account->current_balance, 2)
        ]);
    }
}
