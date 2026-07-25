<?php

namespace App\Http\Controllers\Api\Business;

use App\Http\Controllers\Controller;
use App\Models\Sale;
use App\Services\InvoiceNumberService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class QuotationController extends Controller
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
            ->where('invoice_type', 'quotation');

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        return response()->json(['data' => $query->orderBy('id', 'desc')->paginate(20)]);
    }

    public function show($id, Request $request)
    {
        $quotation = Sale::with(['items.product', 'customer', 'user'])
            ->where('business_id', app('current_business_id'))
            ->where('invoice_type', 'quotation')
            ->findOrFail($id);

        return response()->json(['data' => $quotation]);
    }

    public function updateStatus($id, Request $request)
    {
        $validated = $request->validate([
            'status' => 'required|in:draft,sent,accepted,rejected,expired',
        ]);

        $quotation = Sale::where('business_id', app('current_business_id'))
            ->where('invoice_type', 'quotation')
            ->findOrFail($id);

        $quotation->update(['status' => $validated['status']]);

        return response()->json(['data' => $quotation, 'message' => 'Status updated']);
    }

    public function convert($id, Request $request)
    {
        $businessId = app('current_business_id');
        $quotation = Sale::with('items')
            ->where('business_id', $businessId)
            ->where('invoice_type', 'quotation')
            ->findOrFail($id);

        $targetType = $request->input('type', 'invoice');

        $invoice = DB::transaction(function () use ($quotation, $businessId, $request, $targetType) {
            $invoiceType = $targetType === 'invoice' ? 'sales_invoice' : 'proforma';
            $invoiceNumber = $this->invoiceNumberService->generate($businessId, $invoiceType);

            $invoice = $quotation->replicate();
            $invoice->invoice_number = $invoiceNumber;
            $invoice->invoice_type = $invoiceType;
            $invoice->status = $invoiceType === 'sales_invoice' ? 'pending' : 'draft';
            $invoice->parent_id = $quotation->id;
            $invoice->user_id = $request->user()->id;
            $invoice->date = now()->toDateString();
            $invoice->save();

            foreach ($quotation->items as $item) {
                $newItem = $item->replicate();
                $newItem->sale_id = $invoice->id;
                $newItem->save();
            }

            $quotation->update(['status' => 'converted']);

            return $invoice->load(['items.product', 'customer']);
        });

        return response()->json(['data' => $invoice, 'message' => 'Quotation converted successfully'], 201);
    }
}
