<?php

namespace App\Http\Controllers\Api\Business;

use App\Http\Controllers\Controller;
use App\Models\Sale;
use App\Models\SaleItem;
use App\Models\SalePayment;
use App\Models\InventoryMovement;
use App\Models\Product;
use App\Services\GstCalculationService;
use App\Services\InvoiceNumberService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Barryvdh\DomPDF\Facade\Pdf;

class InvoiceController extends Controller
{
    protected $gstService;
    protected $invoiceNumberService;

    public function __construct(GstCalculationService $gstService, InvoiceNumberService $invoiceNumberService)
    {
        $this->gstService = $gstService;
        $this->invoiceNumberService = $invoiceNumberService;
    }

    public function index(Request $request)
    {
        $query = Sale::with(['customer', 'user'])->where('business_id', app('current_business_id'));

        if ($request->has('invoice_type')) {
            $query->where('invoice_type', $request->invoice_type);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }
        
        if ($request->has('customer_id')) {
            $query->where('customer_id', $request->customer_id);
        }

        if ($request->has('start_date') && $request->has('end_date')) {
            $query->whereBetween('date', [$request->start_date, $request->end_date]);
        }

        $invoices = $query->orderBy('id', 'desc')->paginate(20);

        return response()->json(['data' => $invoices]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_id' => 'nullable|exists:customers,id',
            'invoice_type' => 'required|in:sales_invoice,proforma,delivery_challan,quotation,credit_note,debit_note,purchase_bill',
            'date' => 'required|date',
            'due_date' => 'nullable|date',
            'place_of_supply' => 'nullable|string|max:2',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|numeric|min:0.01',
            'items.*.rate' => 'required|numeric|min:0',
            'items.*.gst_rate' => 'required|numeric|min:0',
            'items.*.hsn_code' => 'nullable|string',
            'items.*.unit' => 'nullable|string',
            'discount' => 'nullable|numeric|min:0',
            'paid_amount' => 'nullable|numeric|min:0',
            'payment_mode' => 'nullable|string',
            'payments' => 'nullable|array',
            'payments.*.payment_mode' => 'nullable|string',
            'payments.*.amount' => 'nullable|numeric|min:0',
            'notes' => 'nullable|string',
            'terms_conditions' => 'nullable|string',
        ]);

        $businessId = app('current_business_id');
        $business = \App\Models\Business::find($businessId);
        $customer = $validated['customer_id'] ? \App\Models\Customer::find($validated['customer_id']) : null;

        // Determine tax type
        $businessState = $business->state_code ?? '27'; // fallback to arbitrary state code if missing
        $customerState = $validated['place_of_supply'] ?? ($customer->state_code ?? null);
        $taxType = $this->gstService->getTaxType($businessState, $customerState);

        $invoice = DB::transaction(function () use ($validated, $businessId, $taxType, $request) {
            $invoiceNumber = $this->invoiceNumberService->generate($businessId, $validated['invoice_type']);

            // Prepare items and calculate taxes
            $itemsPayload = [];
            foreach ($validated['items'] as $itemData) {
                $taxData = $this->gstService->calculateItemTax($itemData['rate'], $itemData['quantity'], $itemData['gst_rate'], $taxType);
                $itemsPayload[] = array_merge($itemData, $taxData);
            }

            $invoiceTotals = $this->gstService->calculateInvoice($itemsPayload, $taxType, $validated['discount'] ?? 0);
            
            // Round off logic (simple nearest rupee)
            $roundedTotal = round($invoiceTotals['grand_total']);
            $roundOff = round($roundedTotal - $invoiceTotals['grand_total'], 2);

            $paidAmount = $validated['paid_amount'] ?? 0;
            // FIX BUG-09: Use consistent status values that match OutstandingController filters
            $status = 'paid';
            if ($validated['invoice_type'] === 'proforma' || $validated['invoice_type'] === 'quotation') {
                $status = 'draft';
            } elseif ($paidAmount == 0) {
                $status = 'unpaid';
            } elseif ($paidAmount < $roundedTotal) {
                $status = 'partially_paid';
            }

            $sale = Sale::create([
                'business_id' => $businessId,
                'customer_id' => $validated['customer_id'] ?? null,
                'user_id' => $request->user()->id,
                'invoice_number' => $invoiceNumber,
                'invoice_type' => $validated['invoice_type'],
                'tax_type' => $taxType,
                'date' => $validated['date'],
                'due_date' => $validated['due_date'] ?? null,
                'place_of_supply' => $validated['place_of_supply'] ?? null,
                
                'taxable_amount' => $invoiceTotals['taxable_total'],
                'cgst_amount' => $invoiceTotals['cgst_total'],
                'sgst_amount' => $invoiceTotals['sgst_total'],
                'igst_amount' => $invoiceTotals['igst_total'],
                'total_tax_amount' => $invoiceTotals['tax_total'],
                
                'total_amount' => $invoiceTotals['taxable_total'] + $invoiceTotals['tax_total'],
                'discount' => $validated['discount'] ?? 0,
                'round_off' => $roundOff,
                'final_amount' => $roundedTotal,
                'paid_amount' => $paidAmount,
                'payment_mode' => $validated['payment_mode'] ?? null,
                'status' => $status,
                'notes' => $validated['notes'] ?? null,
                'terms_conditions' => $validated['terms_conditions'] ?? null,
            ]);

            foreach ($itemsPayload as $ip) {
                SaleItem::create([
                    'sale_id' => $sale->id,
                    'product_id' => $ip['product_id'],
                    'quantity' => $ip['quantity'],
                    'rate' => $ip['rate'],
                    'hsn_code' => $ip['hsn_code'] ?? null,
                    'unit' => $ip['unit'] ?? null,
                    'gst_rate' => $ip['gst_rate'],
                    'taxable_amount' => $ip['taxable_amount'],
                    'cgst_amount' => $ip['cgst_amount'],
                    'sgst_amount' => $ip['sgst_amount'],
                    'igst_amount' => $ip['igst_amount'],
                    'amount' => $ip['total_amount'],
                ]);

                // FIX EDGE-03: Check stock level BEFORE deducting — prevent negative inventory
                if (in_array($validated['invoice_type'], ['sales_invoice', 'delivery_challan'])) {
                    $product = Product::find($ip['product_id']);
                    if ($product) {
                        if ($product->quantity < $ip['quantity']) {
                            throw new \Exception(
                                "Insufficient stock for '{$product->model_name}': Available {$product->quantity}, Requested {$ip['quantity']}."
                            );
                        }
                        $product->decrement('quantity', $ip['quantity']);

                        InventoryMovement::create([
                            'product_id'     => $product->id,
                            'type'           => 'out',
                            'quantity'       => $ip['quantity'],
                            'reference_type' => 'sale',
                            'reference_id'   => $sale->id,
                        ]);
                    }
                }
            }

            if (!empty($validated['payments']) && is_array($validated['payments'])) {
                foreach ($validated['payments'] as $p) {
                    if (($p['amount'] ?? 0) > 0) {
                        SalePayment::create([
                            'sale_id' => $sale->id,
                            'payment_mode' => $p['payment_mode'] ?? 'Cash',
                            'amount' => $p['amount'],
                        ]);
                    }
                }
            } elseif ($paidAmount > 0) {
                SalePayment::create([
                    'sale_id' => $sale->id,
                    'payment_mode' => $validated['payment_mode'] ?? 'Cash',
                    'amount' => $paidAmount,
                ]);
            }

            // Integrate automatic party ledger entries via LedgerService
            if ($validated['invoice_type'] === 'sales_invoice' && $sale->customer_id) {
                $ledgerService = app(\App\Services\LedgerService::class);
                
                // Record invoice debit (customer owes us)
                $ledgerService->createEntry([
                    'business_id' => $businessId,
                    'party_type' => 'customer',
                    'party_id' => $sale->customer_id,
                    'entry_type' => 'invoice',
                    'reference_type' => 'invoice',
                    'reference_id' => $sale->id,
                    'date' => $sale->date,
                    'debit' => $roundedTotal,
                    'credit' => 0,
                    'narration' => "Sales Invoice #{$sale->invoice_number}",
                ]);

                // If upfront payment was made, record payment credit
                if ($paidAmount > 0) {
                    $ledgerService->createEntry([
                        'business_id' => $businessId,
                        'party_type' => 'customer',
                        'party_id' => $sale->customer_id,
                        'entry_type' => 'payment',
                        'reference_type' => 'payment',
                        'reference_id' => $sale->id,
                        'date' => $sale->date,
                        'debit' => 0,
                        'credit' => $paidAmount,
                        'narration' => "Payment received for #{$sale->invoice_number}" . (!empty($validated['payment_mode']) ? " via {$validated['payment_mode']}" : ""),
                    ]);
                }
            }

            return $sale->load(['items.product', 'customer']);
        });

        return response()->json(['data' => $invoice], 201);
    }

    public function show($id, Request $request)
    {
        $invoice = Sale::with(['items.product', 'customer', 'user', 'payments'])
            ->where('business_id', app('current_business_id'))
            ->findOrFail($id);

        return response()->json(['data' => $invoice]);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'customer_id' => 'nullable|exists:customers,id',
            'invoice_type' => 'required|in:sales_invoice,proforma,delivery_challan,quotation,credit_note,debit_note,purchase_bill',
            'date' => 'required|date',
            'due_date' => 'nullable|date',
            'place_of_supply' => 'nullable|string|max:2',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|numeric|min:0.01',
            'items.*.rate' => 'required|numeric|min:0',
            'items.*.gst_rate' => 'required|numeric|min:0',
            'items.*.hsn_code' => 'nullable|string',
            'items.*.unit' => 'nullable|string',
            'discount' => 'nullable|numeric|min:0',
            'paid_amount' => 'nullable|numeric|min:0',
            'payment_mode' => 'nullable|string',
            'payments' => 'nullable|array',
            'payments.*.payment_mode' => 'nullable|string',
            'payments.*.amount' => 'nullable|numeric|min:0',
            'notes' => 'nullable|string',
            'terms_conditions' => 'nullable|string',
        ]);

        $businessId = app('current_business_id');
        $business = \App\Models\Business::find($businessId);
        $customer = $validated['customer_id'] ? \App\Models\Customer::find($validated['customer_id']) : null;
        $sale = Sale::with('items')->where('business_id', $businessId)->findOrFail($id);

        // Determine tax type
        $businessState = $business->state_code ?? '27';
        $customerState = $validated['place_of_supply'] ?? ($customer->state_code ?? null);
        $taxType = $this->gstService->getTaxType($businessState, $customerState);

        $updatedInvoice = DB::transaction(function () use ($validated, $businessId, $taxType, $request, $sale) {
            // 1. Restore old inventory if it was reduced
            if (in_array($sale->invoice_type, ['sales_invoice', 'delivery_challan'])) {
                foreach ($sale->items as $oldItem) {
                    $product = Product::find($oldItem->product_id);
                    if ($product) {
                        $product->increment('quantity', $oldItem->quantity);
                    }
                }
                InventoryMovement::where('reference_type', 'sale')->where('reference_id', $sale->id)->delete();
            }

            // FIX BUG-04: Delete old ledger entries for this invoice BEFORE creating new ones.
            // Without this, update creates duplicate debit+credit entries causing double-counted outstanding balance.
            \App\Models\LedgerEntry::where('business_id', $businessId)
                ->where('reference_type', 'invoice')
                ->where('reference_id', $sale->id)
                ->delete();

            // Also delete ledger payment entries linked to this sale (they will be recreated below)
            \App\Models\LedgerEntry::where('business_id', $businessId)
                ->where('reference_type', 'payment')
                ->where('reference_id', $sale->id)
                ->delete();

            // 2. Clear old items & payments
            $sale->items()->delete();
            $sale->payments()->delete();

            // 3. Calculate new items & totals
            $itemsPayload = [];
            foreach ($validated['items'] as $itemData) {
                $taxData = $this->gstService->calculateItemTax($itemData['rate'], $itemData['quantity'], $itemData['gst_rate'], $taxType);
                $itemsPayload[] = array_merge($itemData, $taxData);
            }

            $invoiceTotals = $this->gstService->calculateInvoice($itemsPayload, $taxType, $validated['discount'] ?? 0);
            
            $roundedTotal = round($invoiceTotals['grand_total']);
            $roundOff = round($roundedTotal - $invoiceTotals['grand_total'], 2);

            $paidAmount = $validated['paid_amount'] ?? 0;
            // FIX BUG-09: consistent status values
            $status = 'paid';
            if ($validated['invoice_type'] === 'proforma' || $validated['invoice_type'] === 'quotation') {
                $status = 'draft';
            } elseif ($paidAmount == 0) {
                $status = 'unpaid';
            } elseif ($paidAmount < $roundedTotal) {
                $status = 'partially_paid';
            }

            // 4. Update Sale record
            $sale->update([
                'customer_id' => $validated['customer_id'] ?? null,
                'invoice_type' => $validated['invoice_type'],
                'tax_type' => $taxType,
                'date' => $validated['date'],
                'due_date' => $validated['due_date'] ?? null,
                'place_of_supply' => $validated['place_of_supply'] ?? null,
                'taxable_amount' => $invoiceTotals['taxable_total'],
                'cgst_amount' => $invoiceTotals['cgst_total'],
                'sgst_amount' => $invoiceTotals['sgst_total'],
                'igst_amount' => $invoiceTotals['igst_total'],
                'total_tax_amount' => $invoiceTotals['tax_total'],
                'total_amount' => $invoiceTotals['taxable_total'] + $invoiceTotals['tax_total'],
                'discount' => $validated['discount'] ?? 0,
                'round_off' => $roundOff,
                'final_amount' => $roundedTotal,
                'paid_amount' => $paidAmount,
                'payment_mode' => $validated['payment_mode'] ?? null,
                'status' => $status,
                'notes' => $validated['notes'] ?? null,
                'terms_conditions' => $validated['terms_conditions'] ?? null,
            ]);

            // 5. Create new items and deduct stock if needed
            foreach ($itemsPayload as $ip) {
                SaleItem::create([
                    'sale_id' => $sale->id,
                    'product_id' => $ip['product_id'],
                    'quantity' => $ip['quantity'],
                    'rate' => $ip['rate'],
                    'hsn_code' => $ip['hsn_code'] ?? null,
                    'unit' => $ip['unit'] ?? null,
                    'gst_rate' => $ip['gst_rate'],
                    'taxable_amount' => $ip['taxable_amount'],
                    'cgst_amount' => $ip['cgst_amount'],
                    'sgst_amount' => $ip['sgst_amount'],
                    'igst_amount' => $ip['igst_amount'],
                    'amount' => $ip['total_amount'],
                ]);

                // FIX EDGE-03: Stock check before deducting on update too
                if (in_array($validated['invoice_type'], ['sales_invoice', 'delivery_challan'])) {
                    $product = Product::find($ip['product_id']);
                    if ($product) {
                        if ($product->quantity < $ip['quantity']) {
                            throw new \Exception(
                                "Insufficient stock for '{$product->model_name}': Available {$product->quantity}, Requested {$ip['quantity']}."
                            );
                        }
                        $product->decrement('quantity', $ip['quantity']);

                        InventoryMovement::create([
                            'product_id'     => $product->id,
                            'type'           => 'out',
                            'quantity'       => $ip['quantity'],
                            'reference_type' => 'sale',
                            'reference_id'   => $sale->id,
                        ]);
                    }
                }
            }

            if (!empty($validated['payments']) && is_array($validated['payments'])) {
                foreach ($validated['payments'] as $p) {
                    if (($p['amount'] ?? 0) > 0) {
                        SalePayment::create([
                            'sale_id' => $sale->id,
                            'payment_mode' => $p['payment_mode'] ?? 'Cash',
                            'amount' => $p['amount'],
                        ]);
                    }
                }
            } elseif ($paidAmount > 0) {
                SalePayment::create([
                    'sale_id' => $sale->id,
                    'payment_mode' => $validated['payment_mode'] ?? 'Cash',
                    'amount' => $paidAmount,
                ]);
            }

            return $sale->load(['items.product', 'customer']);
        });

        return response()->json(['data' => $updatedInvoice]);
    }

    public function generatePdf($id, Request $request)
    {
        $invoice = Sale::with(['items.product', 'customer', 'business', 'payments'])
            ->where('business_id', app('current_business_id'))
            ->findOrFail($id);

        if (!view()->exists('pdfs.gst_invoice')) {
            return response()->json(['error' => 'View not found'], 500);
        }

        $pdf = Pdf::loadView('pdfs.gst_invoice', compact('invoice'));
        return $pdf->download("{$invoice->invoice_number}.pdf");
    }

    public function stats(Request $request)
    {
        $businessId = app('current_business_id');
        $query = Sale::where('business_id', $businessId);

        return response()->json(['data' => [
            'total_invoiced' => (clone $query)->whereIn('invoice_type', ['sales_invoice'])->sum('total_amount'),
            'total_collected' => (clone $query)->whereIn('invoice_type', ['sales_invoice'])->sum('paid_amount'),
            'total_outstanding' => (clone $query)->whereIn('invoice_type', ['sales_invoice'])->sum(DB::raw('final_amount - paid_amount')),
        ]]);
    }

    public function convert($id, Request $request)
    {
        $businessId = app('current_business_id');
        $parentInvoice = Sale::with('items')->where('business_id', $businessId)->findOrFail($id);
        
        // Example conversion logic: Proforma -> Sales Invoice
        // We'll leave this basic for now
        $parentInvoice->converted_at = now();
        $parentInvoice->save();

        return response()->json(['message' => 'Converted successfully']);
    }

    public function sendWhatsapp($id, Request $request)
    {
        $businessId = app('current_business_id');
        $invoice = Sale::with('customer')->where('business_id', $businessId)->findOrFail($id);
        
        $phone = $invoice->customer->phone ?? '';
        $text = "Hello, here is your invoice {$invoice->invoice_number}. Link: " . $invoice->public_url;
        $url = "https://api.whatsapp.com/send?phone=91{$phone}&text=" . urlencode($text);

        return response()->json(['data' => ['whatsapp_url' => $url]]);
    }
}
