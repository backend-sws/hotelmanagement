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
        $query = Sale::with(['customer', 'user'])
            ->where('business_id', app('current_business_id'))
            ->where('invoice_type', 'proforma');

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        return response()->json(['data' => $query->orderBy('id', 'desc')->paginate(20)]);
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

            $proforma->update(['status' => 'converted']);

            return $invoice->load(['items.product', 'customer']);
        });

        return response()->json(['data' => $invoice, 'message' => 'Proforma converted to invoice'], 201);
    }
}
