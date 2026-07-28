<?php

namespace App\Http\Controllers\Api\Business;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\Supplier;
use App\Models\Sale;
use App\Models\SupplierPurchase;
use App\Models\LedgerEntry;
use App\Services\LedgerService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class OutstandingController extends Controller
{
    protected LedgerService $ledgerService;

    public function __construct(LedgerService $ledgerService)
    {
        $this->ledgerService = $ledgerService;
    }

    public function customers(Request $request)
    {
        $businessId = app()->get('current_business_id') ?? $request->user()->business_id;

        $query = Customer::where('business_id', $businessId);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'LIKE', "%{$search}%")
                  ->orWhere('phone', 'LIKE', "%{$search}%")
                  ->orWhere('gstin', 'LIKE', "%{$search}%");
            });
        }

        $customers = $query->get();
        $customerIds = $customers->pluck('id')->toArray();

        if (empty($customerIds)) {
            return response()->json(['data' => [], 'total_receivables' => 0, 'count' => 0]);
        }

        // FIX BUG-05: Fetch all latest ledger balances in ONE query instead of 1 per customer
        $balancesMap = LedgerEntry::where('business_id', $businessId)
            ->where('party_type', 'customer')
            ->whereIn('party_id', $customerIds)
            ->select('party_id', DB::raw('MAX(id) as last_id'))
            ->groupBy('party_id')
            ->pluck('last_id', 'party_id')
            ->toArray();

        $latestBalances = [];
        if (!empty($balancesMap)) {
            LedgerEntry::whereIn('id', array_values($balancesMap))
                ->get()
                ->each(fn($e) => $latestBalances[$e->party_id] = (float) $e->balance);
        }

        // FIX EDGE-06: Include 'pending' (zero-paid) invoices in outstanding aging — was missing 'pending' and 'unpaid'
        // FIX BUG-09: Also include 'completed' since old records may have that status
        $allUnpaidInvoices = Sale::where('business_id', $businessId)
            ->whereIn('customer_id', $customerIds)
            ->where('invoice_type', 'sales_invoice')
            ->whereIn('status', ['unpaid', 'pending', 'partially_paid', 'overdue'])
            ->orderBy('date', 'desc')
            ->get()
            ->groupBy('customer_id');

        $agingData = [];
        $now = Carbon::today();

        foreach ($customers as $customer) {
            $outstanding = $latestBalances[$customer->id] ?? 0.0;
            // Outstanding is positive = receivable. Negative = customer has credit/advance.
            $outstanding = max(0.0, $outstanding);

            if ($outstanding <= 0 && !$request->boolean('show_zero')) {
                continue;
            }

            $unpaidInvoices = $allUnpaidInvoices[$customer->id] ?? collect();

            $current = 0;
            $overdue30 = 0;
            $overdue60 = 0;
            $overdue90 = 0;
            $remainingToAllocate = $outstanding;
            $lastInvoiceDate = $unpaidInvoices->first()?->date
                ? Carbon::parse($unpaidInvoices->first()->date)->format('Y-m-d')
                : null;

            foreach ($unpaidInvoices as $inv) {
                if ($remainingToAllocate <= 0) break;
                $due = max(0, (float) $inv->final_amount - (float) $inv->paid_amount);
                if ($due <= 0) continue;

                $amountToAssign = min($remainingToAllocate, $due);
                $daysOld = Carbon::parse($inv->date)->diffInDays($now);

                if ($daysOld <= 30)      { $current   += $amountToAssign; }
                elseif ($daysOld <= 60) { $overdue30 += $amountToAssign; }
                elseif ($daysOld <= 90) { $overdue60 += $amountToAssign; }
                else                    { $overdue90 += $amountToAssign; }

                $remainingToAllocate -= $amountToAssign;
            }

            if ($remainingToAllocate > 0) {
                $overdue90 += $remainingToAllocate;
            }

            $agingData[] = [
                'party_id'          => $customer->id,
                'party_type'        => 'customer',
                'name'              => $customer->name,
                'phone'             => $customer->phone ?? '',
                'gstin'             => $customer->gstin ?? '',
                'credit_limit'      => (float) ($customer->credit_limit ?? 0),
                'total_outstanding' => round($outstanding, 2),
                'current_0_30'      => round($current, 2),
                'overdue_31_60'     => round($overdue30, 2),
                'overdue_61_90'     => round($overdue60, 2),
                'overdue_90_plus'   => round($overdue90, 2),
                'last_invoice_date' => $lastInvoiceDate,
            ];
        }

        // Sort descending by total outstanding
        usort($agingData, function ($a, $b) {
            return $b['total_outstanding'] <=> $a['total_outstanding'];
        });

        return response()->json([
            'data' => $agingData,
            'total_receivables' => round(array_sum(array_column($agingData, 'total_outstanding')), 2),
            'count' => count($agingData),
        ]);
    }

    public function suppliers(Request $request)
    {
        $businessId = app()->get('current_business_id') ?? $request->user()->business_id;

        $query = Supplier::where('business_id', $businessId);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'LIKE', "%{$search}%")
                  ->orWhere('phone', 'LIKE', "%{$search}%")
                  ->orWhere('gstin', 'LIKE', "%{$search}%");
            });
        }

        $suppliers = $query->get();
        $supplierIds = $suppliers->pluck('id')->toArray();

        if (empty($supplierIds)) {
            return response()->json(['data' => [], 'total_payables' => 0, 'count' => 0]);
        }

        // FIX BUG-05: Batch ledger balance reads for all suppliers in one query
        $supplierBalancesMap = LedgerEntry::where('business_id', $businessId)
            ->where('party_type', 'supplier')
            ->whereIn('party_id', $supplierIds)
            ->select('party_id', DB::raw('MAX(id) as last_id'))
            ->groupBy('party_id')
            ->pluck('last_id', 'party_id')
            ->toArray();

        $supplierLatestBalances = [];
        if (!empty($supplierBalancesMap)) {
            LedgerEntry::whereIn('id', array_values($supplierBalancesMap))
                ->get()
                ->each(fn($e) => $supplierLatestBalances[$e->party_id] = (float) $e->balance);
        }

        // Batch-load all unpaid purchase bills
        $allUnpaidBills = SupplierPurchase::where('business_id', $businessId)
            ->whereIn('supplier_id', $supplierIds)
            ->where('balance_amount', '>', 0)
            ->orderBy('purchase_date', 'desc')
            ->get()
            ->groupBy('supplier_id');

        $agingData = [];
        $now = Carbon::today();

        foreach ($suppliers as $supplier) {
            $outstanding = max(0.0, $supplierLatestBalances[$supplier->id] ?? 0.0);

            if ($outstanding <= 0 && !$request->boolean('show_zero')) {
                continue;
            }

            $unpaidBills = $allUnpaidBills[$supplier->id] ?? collect();

            $current = 0;
            $overdue30 = 0;
            $overdue60 = 0;
            $overdue90 = 0;
            $remainingToAllocate = $outstanding;
            $lastBillDate = $unpaidBills->first()?->purchase_date
                ? Carbon::parse($unpaidBills->first()->purchase_date)->format('Y-m-d')
                : null;

            foreach ($unpaidBills as $bill) {
                if ($remainingToAllocate <= 0) break;
                $due = (float) $bill->balance_amount;
                if ($due <= 0) continue;

                $amountToAssign = min($remainingToAllocate, $due);
                $daysOld = Carbon::parse($bill->purchase_date)->diffInDays($now);

                if ($daysOld <= 30)      { $current   += $amountToAssign; }
                elseif ($daysOld <= 60) { $overdue30 += $amountToAssign; }
                elseif ($daysOld <= 90) { $overdue60 += $amountToAssign; }
                else                    { $overdue90 += $amountToAssign; }

                $remainingToAllocate -= $amountToAssign;
            }

            if ($remainingToAllocate > 0) {
                $overdue90 += $remainingToAllocate;
            }

            $agingData[] = [
                'party_id'          => $supplier->id,
                'party_type'        => 'supplier',
                'name'              => $supplier->name,
                'phone'             => $supplier->phone ?? '',
                'gstin'             => $supplier->gstin ?? '',
                'total_outstanding' => round($outstanding, 2),
                'current_0_30'      => round($current, 2),
                'overdue_31_60'     => round($overdue30, 2),
                'overdue_61_90'     => round($overdue60, 2),
                'overdue_90_plus'   => round($overdue90, 2),
                'last_invoice_date' => $lastBillDate,
            ];
        }

        usort($agingData, function ($a, $b) {
            return $b['total_outstanding'] <=> $a['total_outstanding'];
        });

        return response()->json([
            'data' => $agingData,
            'total_payables' => round(array_sum(array_column($agingData, 'total_outstanding')), 2),
            'count' => count($agingData),
        ]);
    }

    public function summary(Request $request)
    {
        $businessId = app()->get('current_business_id') ?? $request->user()->business_id;

        // FIX BUG-05: Use single aggregated query for summary — no looping per party
        $customerIds = Customer::where('business_id', $businessId)->pluck('id')->toArray();
        $supplierIds = Supplier::where('business_id', $businessId)->pluck('id')->toArray();

        $totalReceivable = 0.0;
        if (!empty($customerIds)) {
            $latestCustomerEntries = LedgerEntry::where('business_id', $businessId)
                ->where('party_type', 'customer')
                ->whereIn('party_id', $customerIds)
                ->select('party_id', DB::raw('MAX(id) as last_id'))
                ->groupBy('party_id')
                ->pluck('last_id');

            $totalReceivable = LedgerEntry::whereIn('id', $latestCustomerEntries)
                ->where('balance', '>', 0)
                ->sum('balance');
        }

        $totalPayable = 0.0;
        if (!empty($supplierIds)) {
            $latestSupplierEntries = LedgerEntry::where('business_id', $businessId)
                ->where('party_type', 'supplier')
                ->whereIn('party_id', $supplierIds)
                ->select('party_id', DB::raw('MAX(id) as last_id'))
                ->groupBy('party_id')
                ->pluck('last_id');

            $totalPayable = LedgerEntry::whereIn('id', $latestSupplierEntries)
                ->where('balance', '>', 0)
                ->sum('balance');
        }

        $netPosition = $totalReceivable - $totalPayable;

        return response()->json([
            'total_receivable' => round($totalReceivable, 2),
            'total_payable' => round($totalPayable, 2),
            'net_position' => round($netPosition, 2),
            'status' => $netPosition >= 0 ? 'Surplus (Favorable)' : 'Deficit (Payables Exceed Receivables)',
        ]);
    }

    public function sendReminder(Request $request, $partyType, $partyId)
    {
        $businessId = app()->get('current_business_id') ?? $request->user()->business_id;
        
        $outstanding = $this->ledgerService->getOutstanding($partyType, (int) $partyId, $businessId);
        
        if ($partyType === 'customer') {
            $party = Customer::where('business_id', $businessId)->findOrFail($partyId);
            $message = "Dear {$party->name},\n\nThis is a gentle reminder that your account outstanding balance is ₹" . number_format($outstanding, 2) . " (Udhar Khata).\nWe request you to kindly clear the dues at your earliest convenience.\n\nThank you for doing business with us!";
        } else {
            $party = Supplier::where('business_id', $businessId)->findOrFail($partyId);
            $message = "Respected {$party->name},\n\nWe have noted our outstanding accounts payable balance of ₹" . number_format($outstanding, 2) . " in our purchase ledger. We are initiating the payment settlement shortly.\n\nThank you!";
        }

        $phone = preg_replace('/[^0-9]/', '', $party->phone ?? '');
        if (strlen($phone) == 10) {
            $phone = '91' . $phone;
        }

        $whatsappUrl = "https://api.whatsapp.com/send?phone={$phone}&text=" . urlencode($message);

        return response()->json([
            'whatsapp_url' => $whatsappUrl,
            'message' => $message,
            'party_name' => $party->name,
            'phone' => $phone,
            'outstanding' => round($outstanding, 2)
        ]);
    }
}
