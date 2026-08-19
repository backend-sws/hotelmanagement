<?php

namespace App\Http\Controllers\Api\Business;

use App\Http\Controllers\Controller;
use App\Models\ChequeRegister;
use App\Models\BankAccount;
use App\Models\CashBankEntry;
use App\Services\LedgerService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ChequeController extends Controller
{
    protected LedgerService $ledgerService;

    public function __construct(LedgerService $ledgerService)
    {
        $this->ledgerService = $ledgerService;
    }

    public function index(Request $request)
    {
        $businessId = $request->user()->business_id;
        $query = ChequeRegister::with(['bankAccount'])->where('business_id', $businessId);

        if ($request->filled('type')) {
            $query->where('type', $request->input('type')); // received / issued
        }
        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }
        if ($request->filled('party_type') && $request->filled('party_id')) {
            $query->where('party_type', $request->input('party_type'))->where('party_id', $request->input('party_id'));
        }
        if ($request->filled('from_date')) {
            $query->whereDate('cheque_date', '>=', $request->input('from_date'));
        }
        if ($request->filled('to_date')) {
            $query->whereDate('cheque_date', '<=', $request->input('to_date'));
        }
        if ($request->filled('search')) {
            $s = $request->input('search');
            $query->where(function($q) use ($s) {
                $q->where('cheque_number', 'like', "%{$s}%")
                  ->orWhere('bank_name', 'like', "%{$s}%")
                  ->orWhere('in_favour_of', 'like', "%{$s}%")
                  ->orWhere('notes', 'like', "%{$s}%");
            });
        }

        $cheques = $query->orderBy('cheque_date', 'desc')->orderBy('id', 'desc')->paginate($request->input('per_page', 30));

        // FIX BUG-07: Single conditional aggregation query instead of 6 separate queries
        $rawStats = ChequeRegister::where('business_id', $businessId)
            ->selectRaw("
                SUM(CASE WHEN type='received' AND status='pending' THEN amount ELSE 0 END) as pending_deposit,
                COUNT(CASE WHEN type='received' AND status='pending' THEN 1 END) as pending_deposit_count,
                SUM(CASE WHEN status='deposited' THEN amount ELSE 0 END) as total_deposited,
                SUM(CASE WHEN status='cleared' THEN amount ELSE 0 END) as total_cleared,
                SUM(CASE WHEN status='bounced' THEN amount ELSE 0 END) as total_bounced,
                SUM(CASE WHEN type='issued' AND status IN ('pending','deposited') THEN amount ELSE 0 END) as total_issued_pending
            ")->first();

        $stats = [
            'pending_deposit'       => (float) ($rawStats->pending_deposit ?? 0),
            'pending_deposit_count' => (int)   ($rawStats->pending_deposit_count ?? 0),
            'total_deposited'       => (float) ($rawStats->total_deposited ?? 0),
            'total_cleared'         => (float) ($rawStats->total_cleared ?? 0),
            'total_bounced'         => (float) ($rawStats->total_bounced ?? 0),
            'total_issued_pending'  => (float) ($rawStats->total_issued_pending ?? 0),
        ];

        return response()->json([
            'status' => 'success',
            'data'   => $cheques,
            'stats'  => $stats
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'cheque_number' => 'required|string|max:50',
            'bank_name' => 'required|string|max:100',
            'branch' => 'nullable|string|max:100',
            'cheque_date' => 'required|date',
            'amount' => 'required|numeric|min:0.01',
            'type' => 'required|in:received,issued',
            'party_type' => 'nullable|string|max:50',
            'party_id' => 'nullable|integer',
            'in_favour_of' => 'nullable|string|max:150',
            'bank_account_id' => 'nullable|exists:bank_accounts,id',
            'reference_invoice_id' => 'nullable|integer',
            'notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'errors' => $validator->errors()], 422);
        }

        $cheque = ChequeRegister::create([
            'business_id' => $request->user()->business_id,
            'bank_account_id' => $request->input('bank_account_id'),
            'cheque_number' => $request->input('cheque_number'),
            'bank_name' => $request->input('bank_name'),
            'branch' => $request->input('branch'),
            'cheque_date' => $request->input('cheque_date'),
            'amount' => $request->input('amount'),
            'type' => $request->input('type'),
            'party_type' => $request->input('party_type', 'customer'),
            'party_id' => $request->input('party_id'),
            'in_favour_of' => $request->input('in_favour_of'),
            'status' => 'pending',
            'reference_invoice_id' => $request->input('reference_invoice_id'),
            'notes' => $request->input('notes'),
        ]);

        return response()->json(['status' => 'success', 'data' => $cheque, 'message' => 'Cheque recorded in register successfully!'], 201);
    }

    public function show(Request $request, $id)
    {
        $cheque = ChequeRegister::with(['bankAccount'])->where('business_id', $request->user()->business_id)->findOrFail($id);
        return response()->json(['status' => 'success', 'data' => $cheque]);
    }

    public function update(Request $request, $id)
    {
        $cheque = ChequeRegister::where('business_id', $request->user()->business_id)->findOrFail($id);

        $validator = Validator::make($request->all(), [
            'cheque_number' => 'sometimes|required|string|max:50',
            'bank_name' => 'sometimes|required|string|max:100',
            'branch' => 'nullable|string|max:100',
            'cheque_date' => 'sometimes|required|date',
            'amount' => 'sometimes|required|numeric|min:0.01',
            'in_favour_of' => 'nullable|string|max:150',
            'notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'errors' => $validator->errors()], 422);
        }

        $cheque->update($request->only([
            'cheque_number', 'bank_name', 'branch', 'cheque_date', 'amount', 'in_favour_of', 'notes'
        ]));

        return response()->json(['status' => 'success', 'data' => $cheque, 'message' => 'Cheque detail updated successfully']);
    }

    public function destroy(Request $request, $id)
    {
        $cheque = ChequeRegister::where('business_id', $request->user()->business_id)->findOrFail($id);
        $cheque->delete();
        return response()->json(['status' => 'success', 'message' => 'Cheque removed from register']);
    }

    public function updateStatus(Request $request, $id)
    {
        $businessId = $request->user()->business_id;

        $validator = Validator::make($request->all(), [
            'status'         => 'required|in:pending,deposited,cleared,bounced,cancelled',
            'deposit_date'   => 'nullable|date',
            'clearance_date' => 'nullable|date',
            'bounce_date'    => 'nullable|date',
            'bounce_reason'  => 'nullable|string|max:255',
            'bank_account_id'=> 'nullable|exists:bank_accounts,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'errors' => $validator->errors()], 422);
        }

        $newStatus = $request->input('status');

        DB::beginTransaction();
        try {
            // FIX EDGE-02: Use lockForUpdate to prevent concurrent double-update race conditions
            $cheque = ChequeRegister::where('business_id', $businessId)->lockForUpdate()->findOrFail($id);
            $oldStatus = $cheque->status;

            // FIX EDGE-01: Enforce valid state machine transitions
            $allowedTransitions = [
                'pending'   => ['deposited', 'cancelled'],
                'deposited' => ['cleared', 'bounced', 'cancelled'],
                'cleared'   => ['bounced'], // e.g., bank reversal after clearance
                'bounced'   => [],
                'cancelled' => [],
            ];
            if (!in_array($newStatus, $allowedTransitions[$oldStatus] ?? [])) {
                DB::rollBack();
                return response()->json([
                    'status'  => 'error',
                    'message' => "Invalid transition: Cannot move cheque from '{$oldStatus}' to '{$newStatus}'."
                ], 422);
            }
            $updates = ['status' => $newStatus];

            if ($request->filled('bank_account_id')) {
                $updates['bank_account_id'] = $request->input('bank_account_id');
            }

            if ($newStatus === 'deposited') {
                $updates['deposit_date'] = $request->input('deposit_date', Carbon::today()->toDateString());
            } elseif ($newStatus === 'cleared') {
                $clearDate = $request->input('clearance_date', Carbon::today()->toDateString());
                $updates['clearance_date'] = $clearDate;

                // When cleared, sync with Bank Account and Ledger if not already cleared
                if ($oldStatus !== 'cleared') {
                    $bankAccId = $updates['bank_account_id'] ?? $cheque->bank_account_id;
                    if (!$bankAccId) {
                        $defaultBank = BankAccount::where('business_id', $businessId)->where('is_default', true)->first();
                        $bankAccId = $defaultBank ? $defaultBank->id : null;
                    }

                    if ($bankAccId) {
                        $bankAcc = BankAccount::where('business_id', $businessId)->find($bankAccId);
                        if ($bankAcc) {
                            if ($cheque->type === 'received') {
                                $bankAcc->increment('current_balance', $cheque->amount);
                            } else {
                                $bankAcc->decrement('current_balance', $cheque->amount);
                            }

                            // Create CashBankEntry for audit trail
                            CashBankEntry::create([
                                'business_id' => $businessId,
                                'bank_account_id' => $bankAcc->id,
                                'entry_type' => $cheque->type === 'received' ? 'bank_receipt' : 'bank_payment',
                                'account_type' => 'bank',
                                'account_name' => $bankAcc->account_name,
                                'party_type' => $cheque->party_type,
                                'party_id' => $cheque->party_id,
                                'amount' => $cheque->amount,
                                'payment_mode' => 'cheque',
                                'reference_no' => 'CHQ #' . $cheque->cheque_number,
                                'narration' => 'Cheque clearance (' . $cheque->bank_name . ')',
                                'date' => $clearDate,
                                'entered_by' => $request->user()->id,
                                'reference_type' => 'cheque',
                                'reference_id' => $cheque->id,
                            ]);
                        }
                    }

                    // FIX BUG-01 (ChequeController): Use instance ledgerService->createEntry() not static calls
                    if ($cheque->party_type && $cheque->party_id) {
                        if ($cheque->type === 'received' && $cheque->party_type === 'customer') {
                            $this->ledgerService->createEntry([
                                'business_id'    => $businessId,
                                'party_type'     => 'customer',
                                'party_id'       => $cheque->party_id,
                                'entry_type'     => 'payment_received',
                                'reference_type' => 'cheque',
                                'reference_id'   => $cheque->id,
                                'date'           => $clearDate,
                                'debit'          => 0,
                                'credit'         => $cheque->amount,
                                'narration'      => 'Cheque cleared #' . $cheque->cheque_number,
                            ]);
                        } elseif ($cheque->type === 'issued' && $cheque->party_type === 'supplier') {
                            $this->ledgerService->createEntry([
                                'business_id'    => $businessId,
                                'party_type'     => 'supplier',
                                'party_id'       => $cheque->party_id,
                                'entry_type'     => 'payment_sent',
                                'reference_type' => 'cheque',
                                'reference_id'   => $cheque->id,
                                'date'           => $clearDate,
                                'debit'          => $cheque->amount,
                                'credit'         => 0,
                                'narration'      => 'Cheque cleared #' . $cheque->cheque_number,
                            ]);
                        }
                    }
                }
            } elseif ($newStatus === 'bounced') {
                $bounceDate = $request->input('bounce_date', Carbon::today()->toDateString());
                $updates['bounce_date'] = $bounceDate;
                $updates['bounce_reason'] = $request->input('bounce_reason', 'Insufficient funds / Signature mismatch');

                // FIX BUG-03: Handle both cleared→bounced AND deposited→bounced transitions.
                // Only 'cleared' status had an effect on the bank account balance;
                // 'deposited' does NOT affect bank balance so no reversal needed there.
                if ($oldStatus === 'cleared' && $cheque->bank_account_id) {
                    $bankAcc = BankAccount::where('business_id', $businessId)->find($cheque->bank_account_id);
                    if ($bankAcc) {
                        // Reverse the bank credit that was applied when cheque was cleared
                        if ($cheque->type === 'received') {
                            $bankAcc->decrement('current_balance', $cheque->amount);
                        } else {
                            $bankAcc->increment('current_balance', $cheque->amount);
                        }
                    }

                    // Also delete the CashBankEntry that was created at clearance
                    CashBankEntry::where('business_id', $businessId)
                        ->where('reference_type', 'cheque')
                        ->where('reference_id', $cheque->id)
                        ->delete();
                }

                // FIX BUG-03 (continued): Reverse ledger entry for BOTH cleared→bounced
                // AND deposited→bounced if party ledger was already credited
                if ($cheque->party_type === 'customer' && $cheque->party_id && $cheque->type === 'received') {
                    // Delete any payment_received entry for this cheque
                    \App\Models\LedgerEntry::where('business_id', $businessId)
                        ->where('reference_type', 'cheque')
                        ->where('reference_id', $cheque->id)
                        ->delete();

                    // Re-open the customer's balance (add the debt back)
                    $this->ledgerService->createEntry([
                        'business_id'    => $businessId,
                        'party_type'     => 'customer',
                        'party_id'       => $cheque->party_id,
                        'entry_type'     => 'adjustment',
                        'reference_type' => 'cheque',
                        'reference_id'   => $cheque->id,
                        'date'           => $bounceDate,
                        'debit'          => $cheque->amount,
                        'credit'         => 0,
                        'narration'      => 'Cheque Bounced #' . $cheque->cheque_number . ' — ' . $updates['bounce_reason'],
                    ]);
                } elseif ($cheque->party_type === 'supplier' && $cheque->party_id && $cheque->type === 'issued') {
                    // If we issued a cheque to supplier and it bounced, the payment is void — reopen payable
                    \App\Models\LedgerEntry::where('business_id', $businessId)
                        ->where('reference_type', 'cheque')
                        ->where('reference_id', $cheque->id)
                        ->delete();

                    $this->ledgerService->createEntry([
                        'business_id'    => $businessId,
                        'party_type'     => 'supplier',
                        'party_id'       => $cheque->party_id,
                        'entry_type'     => 'adjustment',
                        'reference_type' => 'cheque',
                        'reference_id'   => $cheque->id,
                        'date'           => $bounceDate,
                        'debit'          => 0,
                        'credit'         => $cheque->amount,
                        'narration'      => 'Issued Cheque Bounced #' . $cheque->cheque_number . ' — ' . $updates['bounce_reason'],
                    ]);
                }
            }

            $cheque->update($updates);

            $cheque->logActivity("cheque_{$newStatus}", "Cheque #{$cheque->cheque_number} ({$cheque->bank_name}, ₹" . number_format($cheque->amount, 2) . ") marked as " . strtoupper($newStatus), [
                'cheque_number' => $cheque->cheque_number,
                'amount' => $cheque->amount,
                'old_status' => $oldStatus,
                'new_status' => $newStatus,
            ]);

            DB::commit();

            return response()->json([
                'status' => 'success',
                'data' => $cheque,
                'message' => 'Cheque status updated to ' . strtoupper($newStatus) . ' successfully!'
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['status' => 'error', 'message' => 'Failed to update cheque status: ' . $e->getMessage()], 500);
        }
    }

    public function pending(Request $request)
    {
        $businessId = $request->user()->business_id;
        $cheques = ChequeRegister::with(['bankAccount'])
            ->where('business_id', $businessId)
            ->where('type', 'received')
            ->where('status', 'pending')
            ->orderBy('cheque_date', 'asc')
            ->get();

        return response()->json(['status' => 'success', 'data' => $cheques]);
    }

    public function upcoming(Request $request)
    {
        $businessId = $request->user()->business_id;
        $today = Carbon::today()->toDateString();
        $nextWeek = Carbon::today()->addDays(7)->toDateString();

        $cheques = ChequeRegister::with(['bankAccount'])
            ->where('business_id', $businessId)
            ->whereIn('status', ['pending', 'deposited'])
            ->whereBetween('cheque_date', [$today, $nextWeek])
            ->orderBy('cheque_date', 'asc')
            ->get();

        return response()->json(['status' => 'success', 'data' => $cheques]);
    }

    public function summary(Request $request)
    {
        $businessId = $request->user()->business_id;

        // FIX IMP-05: Single aggregation query instead of 5+ separate queries
        $raw = ChequeRegister::where('business_id', $businessId)
            ->selectRaw("
                SUM(CASE WHEN type='received' AND status='pending' THEN amount ELSE 0 END) as received_pending,
                COUNT(CASE WHEN type='received' AND status='pending' THEN 1 END) as received_pending_count,
                SUM(CASE WHEN type='issued' AND status IN ('pending','deposited') THEN amount ELSE 0 END) as issued_pending,
                SUM(CASE WHEN status='cleared' THEN amount ELSE 0 END) as cleared_total,
                SUM(CASE WHEN status='bounced' THEN amount ELSE 0 END) as bounced_total
            ")->first();

        $upcomingCount = ChequeRegister::where('business_id', $businessId)
            ->whereIn('status', ['pending', 'deposited'])
            ->whereBetween('cheque_date', [Carbon::today()->toDateString(), Carbon::today()->addDays(7)->toDateString()])
            ->count();

        $stats = [
            'received_pending'       => (float) ($raw->received_pending ?? 0),
            'received_pending_count' => (int)   ($raw->received_pending_count ?? 0),
            'issued_pending'         => (float) ($raw->issued_pending ?? 0),
            'cleared_total'          => (float) ($raw->cleared_total ?? 0),
            'bounced_total'          => (float) ($raw->bounced_total ?? 0),
            'upcoming_count'         => $upcomingCount,
        ];

        return response()->json(['status' => 'success', 'data' => $stats]);
    }
}
