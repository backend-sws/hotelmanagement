<?php

namespace App\Services;

use App\Models\LedgerEntry;
use App\Models\Customer;
use App\Models\Supplier;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class LedgerService
{
    /**
     * Create a new ledger entry and calculate the cumulative running balance.
     */
    public function createEntry(array $data): LedgerEntry
    {
        $businessId = $data['business_id'] ?? app()->get('current_business_id') ?? auth()->user()?->business_id ?? null;
        $partyType = $data['party_type'];
        $partyId = $data['party_id'];

        // FIX BUG-13: Use lockForUpdate inside a transaction to prevent race condition where
        // two concurrent requests both read count=0 and both create duplicate opening balance entries.
        DB::transaction(function () use ($businessId, $partyType, $partyId, $data) {
            $existingCount = LedgerEntry::where('business_id', $businessId)
                ->where('party_type', $partyType)
                ->where('party_id', $partyId)
                ->lockForUpdate()
                ->count();

            if ($existingCount === 0 && ($data['entry_type'] ?? '') !== 'opening_balance') {
                $this->initializeOpeningBalance($businessId, $partyType, $partyId);
            }
        });

        // Fetch latest running balance (after opening balance may have been created)
        $lastEntry = LedgerEntry::where('business_id', $businessId)
            ->where('party_type', $partyType)
            ->where('party_id', $partyId)
            ->latest('id')
            ->first();

        $currentBalance = $lastEntry ? (float) $lastEntry->balance : 0.0;
        $debit = (float) ($data['debit'] ?? 0);
        $credit = (float) ($data['credit'] ?? 0);

        // For Customers: Debit (+) increases receivables, Credit (-) decreases receivables.
        // For Suppliers: Credit (+) increases payables, Debit (-) decreases payables.
        $newBalance = $partyType === 'customer'
            ? ($currentBalance + $debit - $credit)
            : ($currentBalance + $credit - $debit);

        return LedgerEntry::create([
            'business_id' => $businessId,
            'party_type' => $partyType,
            'party_id' => $partyId,
            'entry_type' => $data['entry_type'] ?? 'adjustment',
            'reference_type' => $data['reference_type'] ?? null,
            'reference_id' => $data['reference_id'] ?? null,
            'date' => $data['date'] ?? Carbon::today()->format('Y-m-d'),
            'debit' => $debit,
            'credit' => $credit,
            'balance' => $newBalance,
            'narration' => $data['narration'] ?? null,
        ]);
    }

    /**
     * Initialize opening balance for a party if they have one.
     */
    protected function initializeOpeningBalance(?int $businessId, string $partyType, int $partyId): void
    {
        $party = $partyType === 'customer'
            ? Customer::withoutGlobalScopes()->find($partyId)
            : Supplier::withoutGlobalScopes()->find($partyId);

        if ($party && (float) ($party->opening_balance ?? 0) > 0) {
            $openingBal = (float) $party->opening_balance;
            $balType = strtolower($party->balance_type ?? ($partyType === 'customer' ? 'debit' : 'credit'));
            
            $debit = ($balType === 'debit' || $balType === 'to_collect' || $balType === 'receivable') ? $openingBal : 0;
            $credit = ($balType === 'credit' || $balType === 'to_pay' || $balType === 'payable') ? $openingBal : 0;

            if ($partyType === 'supplier' && $debit === 0 && $credit === 0) {
                $credit = $openingBal;
            } elseif ($partyType === 'customer' && $debit === 0 && $credit === 0) {
                $debit = $openingBal;
            }

            $initialBal = $partyType === 'customer' ? ($debit - $credit) : ($credit - $debit);

            LedgerEntry::create([
                'business_id' => $businessId ?? $party->business_id,
                'party_type' => $partyType,
                'party_id' => $partyId,
                'entry_type' => 'opening_balance',
                'reference_type' => null,
                'reference_id' => null,
                'date' => $party->created_at ? $party->created_at->format('Y-m-d') : Carbon::today()->format('Y-m-d'),
                'debit' => $debit,
                'credit' => $credit,
                'balance' => $initialBal,
                'narration' => 'Opening Balance brought forward',
            ]);
        }
    }

    /**
     * Get running net balance for a party.
     */
    public function getBalance(string $partyType, int $partyId, ?int $businessId = null): float
    {
        $businessId = $businessId ?? app()->get('current_business_id') ?? auth()->user()?->business_id;

        $lastEntry = LedgerEntry::where('business_id', $businessId)
            ->where('party_type', $partyType)
            ->where('party_id', $partyId)
            ->latest('id')
            ->first();

        if ($lastEntry) {
            return (float) $lastEntry->balance;
        }

        // Fallback to model opening balance if no ledger entries exist
        $party = $partyType === 'customer'
            ? Customer::withoutGlobalScopes()->find($partyId)
            : Supplier::withoutGlobalScopes()->find($partyId);

        if ($party && (float) ($party->opening_balance ?? 0) > 0) {
            $bal = (float) $party->opening_balance;
            $balType = strtolower($party->balance_type ?? ($partyType === 'customer' ? 'debit' : 'credit'));
            if ($partyType === 'customer') {
                return ($balType === 'credit' || $balType === 'to_pay') ? -$bal : $bal;
            } else {
                return ($balType === 'debit' || $balType === 'to_collect' || $balType === 'advance') ? -$bal : $bal;
            }
        }

        return 0.0;
    }

    /**
     * Get comprehensive statement for a party within a date range.
     */
    public function getStatement(string $partyType, int $partyId, ?string $from = null, ?string $to = null, ?int $businessId = null): array
    {
        $businessId = $businessId ?? app()->get('current_business_id') ?? auth()->user()?->business_id;

        // Ensure opening balance is initialized if no entries yet
        $existingCount = LedgerEntry::where('business_id', $businessId)
            ->where('party_type', $partyType)
            ->where('party_id', $partyId)
            ->count();

        if ($existingCount === 0) {
            $this->initializeOpeningBalance($businessId, $partyType, $partyId);
        }

        $party = $partyType === 'customer'
            ? Customer::withoutGlobalScopes()->where('id', $partyId)->first()
            : Supplier::withoutGlobalScopes()->where('id', $partyId)->first();

        $query = LedgerEntry::where('business_id', $businessId)
            ->where('party_type', $partyType)
            ->where('party_id', $partyId);

        $openingBalance = 0.0;
        
        if ($from) {
            // Calculate balance before $from date
            $beforeEntries = LedgerEntry::where('business_id', $businessId)
                ->where('party_type', $partyType)
                ->where('party_id', $partyId)
                ->where('date', '<', $from)
                ->get();

            $totalDebitBefore = $beforeEntries->sum('debit');
            $totalCreditBefore = $beforeEntries->sum('credit');

            $openingBalance = $partyType === 'customer'
                ? ($totalDebitBefore - $totalCreditBefore)
                : ($totalCreditBefore - $totalDebitBefore);

            $query->where('date', '>=', $from);
        }

        if ($to) {
            $query->where('date', '<=', $to);
        }

        $entries = $query->orderBy('date', 'asc')->orderBy('id', 'asc')->get();

        // Calculate dynamic running balances inside the filtered period
        $runningBalance = $openingBalance;
        $formattedEntries = $entries->map(function ($entry) use (&$runningBalance, $partyType) {
            $debit = (float) $entry->debit;
            $credit = (float) $entry->credit;

            if ($partyType === 'customer') {
                $runningBalance = $runningBalance + $debit - $credit;
            } else {
                $runningBalance = $runningBalance + $credit - $debit;
            }

            return [
                'id' => $entry->id,
                'date' => $entry->date->format('Y-m-d'),
                'entry_type' => $entry->entry_type,
                'reference_type' => $entry->reference_type,
                'reference_id' => $entry->reference_id,
                'narration' => $entry->narration,
                'debit' => $debit,
                'credit' => $credit,
                'balance' => round($runningBalance, 2),
            ];
        });

        return [
            'party_type' => $partyType,
            'party' => $party ? [
                'id' => $party->id,
                'name' => $party->name,
                'phone' => $party->phone ?? '',
                'address' => $party->address ?? '',
                'gstin' => $party->gstin ?? '',
                'state_name' => $party->state_name ?? '',
            ] : null,
            'period' => [
                'from' => $from,
                'to' => $to,
            ],
            'opening_balance' => round($openingBalance, 2),
            'closing_balance' => round($runningBalance, 2),
            'total_debit' => round($entries->sum('debit'), 2),
            'total_credit' => round($entries->sum('credit'), 2),
            'entries' => $formattedEntries,
        ];
    }

    /**
     * Get current outstanding amount for a party.
     */
    public function getOutstanding(string $partyType, int $partyId, ?int $businessId = null): float
    {
        $balance = $this->getBalance($partyType, $partyId, $businessId);
        // Positive balance represents amount receivable from customer or payable to supplier
        return $balance > 0 ? $balance : 0.0;
    }
}
