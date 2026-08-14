<?php

namespace App\Http\Controllers\Api\Business;

use App\Http\Controllers\Controller;
use App\Models\Sale;
use App\Models\Product;
use App\Models\InventoryMovement;
use App\Services\InvoiceNumberService;
use App\Services\LedgerService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProformaController extends Controller
{
    protected $invoiceNumberService;

    public function __construct(InvoiceNumberService $invoiceNumberService)
    {
        $this->invoiceNumberService = $invoiceNumberService;
    }

    public function index(Request $request)
    {
        $businessId = app('current_business_id') ?? ($request->user() ? $request->user()->business_id : null);
        $query = Sale::with(['customer', 'user'])
            ->where('business_id', $businessId)
            ->where('invoice_type', 'proforma');

        if ($request->filled('status') && $request->status !== 'all') {
            $status = $request->status;
            if ($status === 'converted') {
                $query->where(function ($q) {
                    $q->where('status', 'converted')->orWhereNotNull('converted_at');
                });
            } elseif ($status === 'draft') {
                $query->where(function ($q) {
                    $q->whereIn('status', ['draft', 'pending'])
                      ->whereNull('converted_at')
                      ->where('status', '!=', 'converted');
                });
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
        return response()->json(['data' => $query->orderBy('id', 'desc')->paginate($perPage)]);
    }

    public function show($id, Request $request)
    {
        $proforma = Sale::with(['items.product', 'customer', 'user'])
            ->where('business_id', app('current_business_id'))
            ->where('invoice_type', 'proforma')
            ->findOrFail($id);

        return response()->json(['data' => $proforma]);
    }

    public function convert($id, Request $request)
    {
        $businessId = app('current_business_id');
        $proforma = Sale::with('items')
            ->where('business_id', $businessId)
            ->where('invoice_type', 'proforma')
            ->findOrFail($id);

        $invoice = DB::transaction(function () use ($proforma, $businessId, $request) {
            $invoiceNumber = $this->invoiceNumberService->generate($businessId, 'sales_invoice');

            $invoice = $proforma->replicate();
            $invoice->invoice_number = $invoiceNumber;
            $invoice->invoice_type = 'sales_invoice';
            $invoice->status = 'pending';
            $invoice->parent_id = $proforma->id;
            $invoice->user_id = $request->user()->id;
            $invoice->date = now()->toDateString();
            $invoice->save();

            foreach ($proforma->items as $item) {
                $newItem = $item->replicate();
                $newItem->sale_id = $invoice->id;
                $newItem->save();

                // Deduct inventory
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

            // Record invoice in Ledger
            if ($invoice->customer_id) {
                $ledgerService = app(LedgerService::class);
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
                    'narration' => "Sales Invoice #{$invoice->invoice_number} (Converted from Proforma)",
                ]);
                
                if ($invoice->paid_amount > 0) {
                    $ledgerService->createEntry([
                        'business_id' => $businessId,
                        'party_type' => 'customer',
                        'party_id' => $invoice->customer_id,
                        'entry_type' => 'payment',
                        'reference_type' => 'invoice',
                        'reference_id' => $invoice->id,
                        'date' => $invoice->date,
                        'debit' => 0,
                        'credit' => $invoice->paid_amount,
                        'narration' => "Payment received for Invoice #{$invoice->invoice_number}",
                    ]);
                }
            }

            $proforma->update(['status' => 'converted', 'converted_at' => now()]);

            return $invoice->load(['items.product', 'customer']);
        });

        return response()->json(['data' => $invoice, 'message' => 'Proforma converted to invoice'], 201);
    }
}
