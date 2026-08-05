<?php

namespace App\Http\Controllers\Api\Business;

use App\Http\Controllers\Controller;
use App\Models\SupplierPurchase;
use App\Models\SupplierPurchaseItem;
use App\Models\SupplierPayment;
use App\Models\Product;
use App\Models\InventoryMovement;
use App\Models\ItcLedger;
use App\Services\InvoiceNumberService;
use App\Services\LedgerService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class PurchaseController extends Controller
{
    protected InvoiceNumberService $invoiceNumberService;
    protected LedgerService $ledgerService;

    public function __construct(InvoiceNumberService $invoiceNumberService, LedgerService $ledgerService)
    {
        $this->invoiceNumberService = $invoiceNumberService;
        $this->ledgerService = $ledgerService;
    }

    public function index(Request $request)
    {
        $businessId = app()->get('current_business_id') ?? $request->user()->business_id;

        $query = SupplierPurchase::with(['supplier', 'location'])
            ->where('business_id', $businessId);

        if ($request->filled('supplier_id')) {
            $query->where('supplier_id', $request->supplier_id);
        }

        if ($request->filled('status') && $request->status !== 'all') {
            if ($request->status === 'unpaid') {
                $query->where('paid_amount', 0)->where('bill_amount', '>', 0);
            } elseif ($request->status === 'partially_paid' || $request->status === 'partial') {
                $query->where('paid_amount', '>', 0)->whereColumn('paid_amount', '<', 'bill_amount');
            } elseif ($request->status === 'paid') {
                $query->whereColumn('paid_amount', '>=', 'bill_amount');
            } else {
                $query->where('status', $request->status);
            }
        }

        if ($request->filled('from_date')) {
            $query->where('purchase_date', '>=', $request->from_date);
        }
        if ($request->filled('to_date')) {
            $query->where('purchase_date', '<=', $request->to_date);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('purchase_number', 'LIKE', "%{$search}%")
                  ->orWhere('bill_number', 'LIKE', "%{$search}%")
                  ->orWhereHas('supplier', function ($sq) use ($search) {
                      $sq->where('name', 'LIKE', "%{$search}%")
                        ->orWhere('phone', 'LIKE', "%{$search}%");
                  });
            });
        }

        // FIX BUG-06: Use SQL aggregation instead of loading ALL purchases into PHP memory
        $aggStats = SupplierPurchase::where('business_id', $businessId)
            ->selectRaw('SUM(bill_amount) as total_purchases, SUM(paid_amount) as total_paid, SUM(balance_amount) as total_payable')
            ->first();
        $totalPurchases = (float) ($aggStats->total_purchases ?? 0);
        $totalPaid      = (float) ($aggStats->total_paid ?? 0);
        $totalPayable   = (float) ($aggStats->total_payable ?? 0);

        $totalItc = ItcLedger::where('business_id', $businessId)->sum('total_itc');

        $purchases = $query->orderBy('purchase_date', 'desc')->orderBy('id', 'desc')->paginate($request->get('per_page', 15));

        return response()->json([
            'data' => $purchases->items(),
            'current_page' => $purchases->currentPage(),
            'last_page' => $purchases->lastPage(),
            'total' => $purchases->total(),
            'stats' => [
                'total_purchases' => round($totalPurchases, 2),
                'total_paid' => round($totalPaid, 2),
                'total_payable' => round($totalPayable, 2),
                'total_itc' => round($totalItc, 2),
            ]
        ]);
    }

    public function store(Request $request)
    {
        $businessId = app()->get('current_business_id') ?? $request->user()->business_id;

        $validated = $request->validate([
            'supplier_id' => 'required|exists:suppliers,id',
            'bill_number' => 'nullable|string|max:50',
            'bill_date' => 'nullable|date',
            'purchase_date' => 'required|date',
            'due_date' => 'nullable|date',
            'location_id' => 'nullable|exists:business_locations,id',
            'notes' => 'nullable|string',
            'is_itc_eligible' => 'nullable|boolean',
            'payments' => 'nullable|array',
            'payments.*.amount' => 'required|numeric|min:0',
            'payments.*.mode' => 'required|string|max:50',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.hsn_code' => 'nullable|string|max:20',
            'items.*.unit' => 'nullable|string|max:20',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.purchase_price' => 'required|numeric|min:0',
            'items.*.gst_rate' => 'required|numeric|min:0',
        ]);

        $purchase = DB::transaction(function () use ($businessId, $validated, $request) {
            $purchaseNumber = $this->invoiceNumberService->generate($businessId, 'purchase_bill');

            $taxableTotal = 0;
            $cgstTotal = 0;
            $sgstTotal = 0;
            $igstTotal = 0;
            $itemsPayload = [];

            // Compute taxes for items
            foreach ($validated['items'] as $item) {
                $qty = (int) $item['quantity'];
                $rate = (float) $item['purchase_price'];
                $gstRate = (float) ($item['gst_rate'] ?? 0);
                
                $lineTaxable = $qty * $rate;
                $lineGst = round(($lineTaxable * $gstRate) / 100, 2);
                
                // Assuming int-state (CGST/SGST equal split by default unless IGST specified)
                $cgst = round($lineGst / 2, 2);
                $sgst = $lineGst - $cgst;
                $igst = 0;

                $lineTotal = $lineTaxable + $lineGst;

                $taxableTotal += $lineTaxable;
                $cgstTotal += $cgst;
                $sgstTotal += $sgst;
                $igstTotal += $igst;

                $itemsPayload[] = array_merge($item, [
                    'total_price' => $lineTotal,
                    'taxable_amount' => $lineTaxable,
                    'cgst_amount' => $cgst,
                    'sgst_amount' => $sgst,
                    'igst_amount' => $igst,
                ]);
            }

            $totalTax = $cgstTotal + $sgstTotal + $igstTotal;
            $billAmount = round($taxableTotal + $totalTax, 2);
            $payments = $validated['payments'] ?? [];
            $paidAmount = 0;
            foreach ($payments as $p) {
                $paidAmount += (float) ($p['amount'] ?? 0);
            }
            $balanceAmount = max(0, $billAmount - $paidAmount);

            $status = 'confirmed';
            if ($balanceAmount <= 0) {
                $status = 'paid';
            } elseif ($paidAmount > 0) {
                $status = 'partial';
            }

            // 1. Create supplier purchase bill
            $supplierPurchase = SupplierPurchase::create([
                'business_id' => $businessId,
                'purchase_number' => $purchaseNumber,
                'invoice_type' => 'purchase_bill',
                'supplier_id' => $validated['supplier_id'],
                'bill_number' => $validated['bill_number'] ?? null,
                'bill_date' => $validated['bill_date'] ?? $validated['purchase_date'],
                'purchase_date' => $validated['purchase_date'],
                'due_date' => $validated['due_date'] ?? null,
                'location_id' => $validated['location_id'] ?? null,
                'taxable_amount' => $taxableTotal,
                'cgst_amount' => $cgstTotal,
                'sgst_amount' => $sgstTotal,
                'igst_amount' => $igstTotal,
                'total_tax_amount' => $totalTax,
                'bill_amount' => $billAmount,
                'paid_amount' => $paidAmount,
                'balance_amount' => $balanceAmount,
                'notes' => $validated['notes'] ?? null,
                'status' => $status,
                'is_itc_eligible' => $validated['is_itc_eligible'] ?? true,
            ]);

            // FIX EDGE-04: Pre-fetch all products in one query to eliminate N+1 inside loop
            $productIds = collect($itemsPayload)->pluck('product_id')->unique()->values();
            $productsMap = Product::whereIn('id', $productIds)->get()->keyBy('id');

            // 2. Create items & increment inventory stock
            $purchaseItemsToInsert = [];
            $movementsToInsert     = [];

            foreach ($itemsPayload as $itemData) {
                $purchaseItemsToInsert[] = [
                    'supplier_purchase_id' => $supplierPurchase->id,
                    'product_id'           => $itemData['product_id'],
                    'hsn_code'             => $itemData['hsn_code'] ?? null,
                    'unit'                 => $itemData['unit'] ?? null,
                    'quantity'             => $itemData['quantity'],
                    'purchase_price'       => $itemData['purchase_price'],
                    'gst_rate'             => $itemData['gst_rate'],
                    'total_price'          => $itemData['total_price'],
                    'taxable_amount'       => $itemData['taxable_amount'],
                    'cgst_amount'          => $itemData['cgst_amount'],
                    'sgst_amount'          => $itemData['sgst_amount'],
                    'igst_amount'          => $itemData['igst_amount'],
                    'created_at'           => now(),
                    'updated_at'           => now(),
                ];

                // Increment stock using pre-fetched product
                $product = $productsMap[$itemData['product_id']] ?? null;
                if ($product) {
                    $product->increment('quantity', $itemData['quantity']);
                    $movementsToInsert[] = [
                        'product_id'     => $product->id,
                        'type'           => 'in',
                        'quantity'       => $itemData['quantity'],
                        'reference_type' => 'purchase_bill',
                        'reference_id'   => $supplierPurchase->id,
                        'created_at'     => now(),
                        'updated_at'     => now(),
                    ];
                }
            }

            SupplierPurchaseItem::insert($purchaseItemsToInsert);
            if (!empty($movementsToInsert)) {
                InventoryMovement::insert($movementsToInsert);
            }

            // 3. Record ITC ledger if eligible and tax exists
            if (($validated['is_itc_eligible'] ?? true) && $totalTax > 0) {
                $month = Carbon::parse($validated['purchase_date'])->format('Y-m');
                ItcLedger::create([
                    'business_id' => $businessId,
                    'supplier_purchase_id' => $supplierPurchase->id,
                    'month' => $month,
                    'cgst_amount' => $cgstTotal,
                    'sgst_amount' => $sgstTotal,
                    'igst_amount' => $igstTotal,
                    'total_itc' => $totalTax,
                    'is_claimed' => false,
                ]);
            }

            // 4. Record supplier ledger entry (Credit => payable increases)
            $this->ledgerService->createEntry([
                'business_id' => $businessId,
                'party_type' => 'supplier',
                'party_id' => $validated['supplier_id'],
                'entry_type' => 'purchase_bill',
                'reference_type' => 'purchase_bill',
                'reference_id' => $supplierPurchase->id,
                'date' => $validated['purchase_date'],
                'debit' => 0,
                'credit' => $billAmount,
                'narration' => "Purchase Bill #{$purchaseNumber}" . ($supplierPurchase->bill_number ? " (Supplier Bill: {$supplierPurchase->bill_number})" : ""),
            ]);

            // 5. If upfront payment was made, record supplier payment & debit ledger entry
            // 5. If upfront payment was made, record supplier payment & debit ledger entry
            foreach ($payments as $p) {
                $amt = (float) ($p['amount'] ?? 0);
                if ($amt > 0) {
                    SupplierPayment::create([
                        'supplier_id' => $validated['supplier_id'],
                        'supplier_purchase_id' => $supplierPurchase->id,
                        'amount' => $amt,
                        'payment_mode' => $p['mode'] ?? 'Bank Transfer',
                        'date' => $validated['purchase_date'],
                        'notes' => 'Upfront split payment against bill #' . $purchaseNumber,
                    ]);

                    $this->ledgerService->createEntry([
                        'business_id' => $businessId,
                        'party_type' => 'supplier',
                        'party_id' => $validated['supplier_id'],
                        'entry_type' => 'payment',
                        'reference_type' => 'payment',
                        'reference_id' => $supplierPurchase->id,
                        'date' => $validated['purchase_date'],
                        'debit' => $amt,
                        'credit' => 0,
                        'narration' => "Payment against #{$purchaseNumber} via " . ($p['mode'] ?? 'Bank Transfer'),
                    ]);
                }
            }

            return $supplierPurchase->load(['supplier', 'items.product', 'location', 'itc']);
        });

        return response()->json(['data' => $purchase], 201);
    }

    public function show($id)
    {
        $businessId = app()->get('current_business_id') ?? auth()->user()->business_id;
        $purchase = SupplierPurchase::with(['supplier', 'items.product', 'payments', 'location', 'itc'])
            ->where('business_id', $businessId)
            ->findOrFail($id);

        return response()->json(['data' => $purchase]);
    }

    public function recordPayment($id, Request $request)
    {
        $businessId = app()->get('current_business_id') ?? $request->user()->business_id;
        $purchase = SupplierPurchase::where('business_id', $businessId)->findOrFail($id);

        $validated = $request->validate([
            'amount'       => 'required|numeric|min:0.01',
            'payment_mode' => 'required|string|max:50',
            'payment_date' => 'nullable|date',
            'notes'        => 'nullable|string',
        ]);

        $paymentDate = $validated['payment_date'] ?? Carbon::today()->format('Y-m-d');
        $amount = (float) $validated['amount'];

        // FIX BUG-12: Prevent overpayment — balance cannot go negative
        if ($amount > ($purchase->balance_amount + 0.01)) {
            return response()->json([
                'message' => 'Payment amount (' . number_format($amount, 2) . ') exceeds outstanding balance (' . number_format($purchase->balance_amount, 2) . '). Please enter a valid amount.',
            ], 422);
        }

        DB::transaction(function () use ($purchase, $validated, $amount, $paymentDate, $businessId) {
            // Record payment
            SupplierPayment::create([
                'supplier_id' => $purchase->supplier_id,
                'supplier_purchase_id' => $purchase->id,
                'amount' => $amount,
                'payment_mode' => $validated['payment_mode'],
                'date' => $paymentDate,
                'notes' => $validated['notes'] ?? null,
            ]);

            // Update purchase amounts and status
            $newPaid = $purchase->paid_amount + $amount;
            $newBalance = max(0, $purchase->bill_amount - $newPaid);
            
            $status = 'partial';
            if ($newBalance <= 0) {
                $status = 'paid';
            }

            $purchase->update([
                'paid_amount' => $newPaid,
                'balance_amount' => $newBalance,
                'status' => $status,
            ]);

            // Create ledger entry (Debit => payable decreases)
            $this->ledgerService->createEntry([
                'business_id' => $businessId,
                'party_type' => 'supplier',
                'party_id' => $purchase->supplier_id,
                'entry_type' => 'payment',
                'reference_type' => 'payment',
                'reference_id' => $purchase->id,
                'date' => $paymentDate,
                'debit' => $amount,
                'credit' => 0,
                'narration' => "Payment towards Purchase #{$purchase->purchase_number} via {$validated['payment_mode']}" . (!empty($validated['notes']) ? " ({$validated['notes']})" : ""),
            ]);
        });

        return response()->json([
            'message' => 'Payment recorded successfully',
            'data' => $purchase->fresh(['payments', 'supplier', 'items.product'])
        ]);
    }

    public function itcSummary(Request $request)
    {
        $businessId = app()->get('current_business_id') ?? $request->user()->business_id;
        
        $query = ItcLedger::with('supplierPurchase.supplier')
            ->where('business_id', $businessId);

        if ($request->filled('month')) {
            $query->where('month', $request->month);
        }
        if ($request->filled('is_claimed')) {
            $query->where('is_claimed', filter_var($request->is_claimed, FILTER_VALIDATE_BOOLEAN));
        }

        $allItc = ItcLedger::where('business_id', $businessId)->get();

        $summary = [
            'total_itc' => round($allItc->sum('total_itc'), 2),
            'claimed_itc' => round($allItc->where('is_claimed', true)->sum('total_itc'), 2),
            'unclaimed_itc' => round($allItc->where('is_claimed', false)->sum('total_itc'), 2),
            'total_cgst' => round($allItc->sum('cgst_amount'), 2),
            'total_sgst' => round($allItc->sum('sgst_amount'), 2),
            'total_igst' => round($allItc->sum('igst_amount'), 2),
        ];

        // Month-wise breakdown
        $monthwise = $allItc->groupBy('month')->map(function ($items, $month) {
            return [
                'month' => $month,
                'total_itc' => round($items->sum('total_itc'), 2),
                'claimed_itc' => round($items->where('is_claimed', true)->sum('total_itc'), 2),
                'unclaimed_itc' => round($items->where('is_claimed', false)->sum('total_itc'), 2),
                'bills_count' => $items->count(),
            ];
        })->values()->sortByDesc('month')->values();

        $list = $query->orderBy('month', 'desc')->orderBy('id', 'desc')->paginate(20);

        return response()->json([
            'summary' => $summary,
            'monthwise' => $monthwise,
            'list' => $list
        ]);
    }

    public function toggleItcClaim($id, Request $request)
    {
        $businessId = app()->get('current_business_id') ?? $request->user()->business_id;
        $itc = ItcLedger::where('business_id', $businessId)->findOrFail($id);

        $isClaimed = $request->input('is_claimed', !$itc->is_claimed);
        $itc->update([
            'is_claimed' => $isClaimed,
            'claimed_at' => $isClaimed ? now() : null,
        ]);

        return response()->json(['message' => 'ITC claim status updated', 'data' => $itc]);
    }

    public function generatePdf($id)
    {
        $businessId = app()->get('current_business_id') ?? auth()->user()->business_id;
        $purchase = SupplierPurchase::with(['supplier', 'items.product', 'payments', 'location', 'itc'])
            ->where('business_id', $businessId)
            ->findOrFail($id);

        return response()->json([
            'message' => 'Purchase Bill PDF configuration generated successfully.',
            'data' => $purchase,
            'print_url' => url("/api/v1/business/purchases/{$id}/print-view")
        ]);
    }
}
