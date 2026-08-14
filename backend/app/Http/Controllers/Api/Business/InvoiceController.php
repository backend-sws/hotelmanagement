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
        $businessId = app('current_business_id') ?? ($request->user() ? $request->user()->business_id : null);
        $query = Sale::with(['customer', 'user'])->where('business_id', $businessId);

        if ($request->filled('invoice_type') && $request->invoice_type !== 'all') {
            $query->where('invoice_type', $request->invoice_type);
        }

        if ($request->filled('status') && $request->status !== 'all') {
            $status = $request->status;
            if ($status === 'paid' || $status === 'completed') {
                $query->where(function ($q) {
                    $q->whereIn('status', ['paid', 'completed'])
                      ->orWhereRaw('paid_amount >= final_amount AND final_amount > 0');
                });
            } elseif ($status === 'unpaid' || $status === 'pending') {
                $query->where(function ($q) {
                    $q->whereIn('status', ['unpaid', 'pending'])
                      ->orWhere(function ($sq) {
                          $sq->where('paid_amount', 0)->where('final_amount', '>', 0);
                      });
                });
            } elseif ($status === 'partially_paid' || $status === 'partial') {
                $query->where(function ($q) {
                    $q->whereIn('status', ['partially_paid', 'partial'])
                      ->orWhereRaw('paid_amount > 0 AND paid_amount < final_amount');
                });
            } elseif ($status === 'converted') {
                $query->where(function ($q) {
                    $q->where('status', 'converted')
                      ->orWhereNotNull('converted_at');
                });
            } elseif ($status === 'draft') {
                $query->where(function ($q) {
                    $q->whereIn('status', ['draft', 'pending'])
                      ->whereNull('converted_at')
                      ->where('status', '!=', 'converted');
                });
            } elseif ($status === 'cancelled') {
                $query->where('status', 'cancelled');
            } else {
                $query->where('status', $status);
            }
        }
        
        if ($request->filled('customer_id')) {
            $query->where('customer_id', $request->customer_id);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('invoice_number', 'LIKE', "%{$search}%")
                  ->orWhere('reference_number', 'LIKE', "%{$search}%")
                  ->orWhere('notes', 'LIKE', "%{$search}%")
                  ->orWhereHas('customer', function ($cq) use ($search) {
                      $cq->where('name', 'LIKE', "%{$search}%")
                        ->orWhere('phone', 'LIKE', "%{$search}%");
                  });
            });
        }

        if ($request->filled('start_date') && $request->filled('end_date')) {
            $query->whereBetween('date', [$request->start_date, $request->end_date]);
        } elseif ($request->filled('from_date') && $request->filled('to_date')) {
            $query->whereBetween('date', [$request->from_date, $request->to_date]);
        }

        $perPage = (int) $request->input('per_page', 20);
        $invoices = $query->orderBy('id', 'desc')->paginate($perPage);

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
            'tax_type' => 'nullable|in:gst,custom_vat,exempt',
            'reference_number' => 'nullable|string|max:100',
            'vehicle_number' => 'nullable|string|max:50',
            'driver_name' => 'nullable|string|max:100',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|numeric|min:0.01',
            'items.*.rate' => 'required|numeric|min:0',
            'items.*.gst_rate' => 'required|numeric|min:0',
            'items.*.cess_rate' => 'nullable|numeric|min:0',
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
        
        $taxType = $validated['tax_type'] ?? 'gst';
        if ($taxType === 'gst') {
            $taxType = $this->gstService->getTaxType($businessState, $customerState);
        }

        $invoice = DB::transaction(function () use ($validated, $businessId, $taxType, $request) {
            $invoiceNumber = $this->invoiceNumberService->generate($businessId, $validated['invoice_type']);

            // Prepare items and calculate taxes
            $itemsPayload = [];
            foreach ($validated['items'] as $itemData) {
                $cessRate = $itemData['cess_rate'] ?? 0;
                $taxData = $this->gstService->calculateItemTax($itemData['rate'], $itemData['quantity'], $itemData['gst_rate'], $taxType, $cessRate);
                $itemsPayload[] = array_merge($itemData, $taxData, ['cess_rate' => $cessRate]);
            }

            $invoiceTotals = $this->gstService->calculateInvoice($itemsPayload, $taxType, $validated['discount'] ?? 0);
            
            // Round off logic (simple nearest rupee)
            // Credit Limit Check
            if ($validated['invoice_type'] === 'sales_invoice' && !empty($validated['customer_id'])) {
                $customerModel = \App\Models\Customer::find($validated['customer_id']);
                if ($customerModel && $customerModel->credit_limit > 0) {
                    $ledgerService = app(\App\Services\LedgerService::class);
                    $currentOutstanding = $ledgerService->getCustomerOutstanding($customerModel->id);
                    $pendingAmount = $invoiceTotals['grand_total'] - ($validated['paid_amount'] ?? 0);
                    if ($pendingAmount > 0) {
                        $newOutstanding = $currentOutstanding + $pendingAmount;
                        if ($newOutstanding > $customerModel->credit_limit) {
                            throw new \Exception("Invoice pending amount exceeds customer credit limit. Current limit: {$customerModel->credit_limit}, New outstanding would be: " . number_format($newOutstanding, 2));
                        }
                    }
                }
            }

            $roundedTotal = round($invoiceTotals['grand_total']);
            $roundOff = round($roundedTotal - $invoiceTotals['grand_total'], 2);

            $paidAmount = $validated['paid_amount'] ?? 0;
            // FIX BUG-09: Use consistent status values that match OutstandingController filters
            $status = 'paid';
            if ($validated['invoice_type'] === 'proforma' || $validated['invoice_type'] === 'quotation') {
                $status = 'draft';
            } elseif ($validated['invoice_type'] === 'delivery_challan') {
                $status = 'pending';
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
                'cess_amount' => $invoiceTotals['cess_total'] ?? 0,
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
                'bank_details' => $validated['bank_details'] ?? null,
                'reference_number' => $validated['reference_number'] ?? null,
                'vehicle_number' => $validated['vehicle_number'] ?? null,
                'driver_name' => $validated['driver_name'] ?? null,
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
                    'cess_rate' => $ip['cess_rate'] ?? 0,
                    'cess_amount' => $ip['cess_amount'] ?? 0,
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
            'tax_type' => 'nullable|in:gst,custom_vat,exempt',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|numeric|min:0.01',
            'items.*.rate' => 'required|numeric|min:0',
            'items.*.gst_rate' => 'required|numeric|min:0',
            'items.*.cess_rate' => 'nullable|numeric|min:0',
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
        
        $taxType = $validated['tax_type'] ?? 'gst';
        if ($taxType === 'gst') {
            $taxType = $this->gstService->getTaxType($businessState, $customerState);
        }

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
                $cessRate = $itemData['cess_rate'] ?? 0;
                $taxData = $this->gstService->calculateItemTax($itemData['rate'], $itemData['quantity'], $itemData['gst_rate'], $taxType, $cessRate);
                $itemsPayload[] = array_merge($itemData, $taxData, ['cess_rate' => $cessRate]);
            }

            $invoiceTotals = $this->gstService->calculateInvoice($itemsPayload, $taxType, $validated['discount'] ?? 0);
            
            // Credit Limit Check
            if ($validated['invoice_type'] === 'sales_invoice' && !empty($validated['customer_id'])) {
                $customerModel = \App\Models\Customer::find($validated['customer_id']);
                if ($customerModel && $customerModel->credit_limit > 0) {
                    $ledgerService = app(\App\Services\LedgerService::class);
                    $currentOutstanding = $ledgerService->getCustomerOutstanding($customerModel->id);
                    
                    // Adjust current outstanding by removing the old pending amount of THIS invoice
                    $oldPending = $sale->final_amount - $sale->paid_amount;
                    $adjustedOutstanding = $currentOutstanding - $oldPending;
                    
                    $newPendingAmount = $invoiceTotals['grand_total'] - ($validated['paid_amount'] ?? 0);
                    
                    if ($newPendingAmount > 0) {
                        $newOutstanding = $adjustedOutstanding + $newPendingAmount;
                        if ($newOutstanding > $customerModel->credit_limit) {
                            throw new \Exception("Invoice pending amount exceeds customer credit limit. Current limit: {$customerModel->credit_limit}, New outstanding would be: " . number_format($newOutstanding, 2));
                        }
                    }
                }
            }

            $roundedTotal = round($invoiceTotals['grand_total']);
            $roundOff = round($roundedTotal - $invoiceTotals['grand_total'], 2);

            $paidAmount = $validated['paid_amount'] ?? 0;
            // FIX BUG-09: consistent status values
            $status = 'paid';
            if ($validated['invoice_type'] === 'proforma' || $validated['invoice_type'] === 'quotation') {
                $status = ($sale->status === 'converted' || $sale->converted_at) ? 'converted' : 'draft';
            } elseif ($validated['invoice_type'] === 'delivery_challan') {
                $status = in_array($sale->status, ['completed', 'delivered', 'converted', 'cancelled']) ? $sale->status : 'pending';
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
                'cess_amount' => $invoiceTotals['cess_total'] ?? 0,
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
                'bank_details' => $validated['bank_details'] ?? null,
                'reference_number' => $validated['reference_number'] ?? null,
                'vehicle_number' => $validated['vehicle_number'] ?? null,
                'driver_name' => $validated['driver_name'] ?? null,
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
                    'cess_rate' => $ip['cess_rate'] ?? 0,
                    'cess_amount' => $ip['cess_amount'] ?? 0,
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
            
        $business = $invoice->business ?? \App\Models\Business::find($invoice->business_id);
        $settings = $business->settings['invoice_settings'] ?? [];
        
        $template = $settings['template'] ?? 'default';
        $viewName = "pdfs.invoice_templates.{$template}";
        
        if (!view()->exists($viewName)) {
            $viewName = 'pdfs.invoice_templates.default';
        }

        if (!view()->exists($viewName)) {
            $viewName = 'pdfs.gst_invoice';
        }

        $pdf = Pdf::loadView($viewName, compact('invoice', 'settings'))->setOptions([
            'isRemoteEnabled' => true, 
            'isHtml5ParserEnabled' => true,
        ]);
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

        $invoice = DB::transaction(function () use ($parentInvoice, $businessId, $request) {
            $invoiceNumber = $this->invoiceNumberService->generate($businessId, 'sales_invoice');

            $invoice = $parentInvoice->replicate();
            $invoice->invoice_number = $invoiceNumber;
            $invoice->invoice_type = 'sales_invoice';
            $invoice->status = 'unpaid';
            $invoice->parent_id = $parentInvoice->id;
            $invoice->user_id = $request->user() ? $request->user()->id : $parentInvoice->user_id;
            $invoice->date = now()->toDateString();
            $invoice->converted_at = null;
            $invoice->save();

            foreach ($parentInvoice->items as $item) {
                $newItem = $item->replicate();
                $newItem->sale_id = $invoice->id;
                $newItem->save();

                // If converting from proforma or quotation (inventory wasn't deducted yet), deduct now
                if (in_array($parentInvoice->invoice_type, ['proforma', 'quotation'])) {
                    $product = Product::find($item->product_id);
                    if ($product) {
                        if ($product->quantity < $item->quantity) {
                            throw new \Exception(
                                "Insufficient stock for '{$product->model_name}': Available {$product->quantity}, Requested {$item->quantity}."
                            );
                        }
                        $product->decrement('quantity', $item->quantity);

                        InventoryMovement::create([
                            'product_id'     => $product->id,
                            'type'           => 'out',
                            'quantity'       => $item->quantity,
                            'reference_type' => 'sale',
                            'reference_id'   => $invoice->id,
                        ]);
                    }
                }
            }

            // Record invoice in Ledger
            if ($invoice->customer_id) {
                $ledgerService = app(\App\Services\LedgerService::class);
                $docName = ucfirst(str_replace('_', ' ', $parentInvoice->invoice_type));
                $ledgerService->createEntry([
                    'business_id' => $businessId,
                    'party_type' => 'customer',
                    'party_id' => $invoice->customer_id,
                    'entry_type' => 'invoice',
                    'reference_type' => 'invoice',
                    'reference_id' => $invoice->id,
                    'date' => $invoice->date,
                    'debit' => $invoice->final_amount,
                    'credit' => 0,
                    'narration' => "Sales Invoice #{$invoice->invoice_number} (Converted from {$docName} #{$parentInvoice->invoice_number})",
                ]);
            }

            $parentInvoice->update([
                'status' => 'converted',
                'converted_at' => now(),
            ]);

            return $invoice->load(['items.product', 'customer']);
        });

        return response()->json(['data' => $invoice, 'message' => 'Document converted to Sales Invoice successfully'], 200);
    }

    public function sendWhatsapp($id, Request $request)
    {
        $businessId = app('current_business_id');
        $invoice = Sale::with('customer')->where('business_id', $businessId)->findOrFail($id);
        $business = \App\Models\Business::find($businessId);
        
        $settings = $business->settings ?? [];
        $template = $settings['whatsapp_invoice_template'] ?? "Hello *[Customer Name]*,\n\nThank you for shopping with us! Your invoice *[Invoice Number]* for Rs.*[Amount]* has been generated.\n\nView or download your invoice here:\n[Invoice Link]\n\nRegards,\n*[Business Name]*";

        $phone = $invoice->customer->phone ?? '';
        $frontendUrl = env('FRONTEND_URL', 'http://localhost:8000');
        $publicUrl = $frontendUrl . '/invoice/' . $invoice->uuid;

        $text = str_replace(
            ['[Customer Name]', '[Invoice Number]', '[Amount]', '[Invoice Link]', '[Business Name]'],
            [
                $invoice->customer->name ?? 'Customer',
                $invoice->invoice_number,
                $invoice->final_amount,
                $publicUrl,
                $business->name ?? 'Our Business'
            ],
            $template
        );

        $url = "https://api.whatsapp.com/send?phone=91{$phone}&text=" . urlencode($text);

        return response()->json(['data' => ['whatsapp_url' => $url]]);
    }
}
