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
        $businessId = app('current_business_id') ?? ($request->user() ? $request->user()->business_id : null);
        $query = Sale::with(['customer', 'user'])
            ->where('business_id', $businessId)
            ->where('invoice_type', 'quotation');

        if ($request->filled('status') && $request->status !== 'all') {
            $status = $request->status;
            if ($status === 'converted') {
                $query->where(function ($q) {
                    $q->where('status', 'converted')->orWhereNotNull('converted_at');
                });
            } elseif ($status === 'draft') {
                $query->where(function ($q) {
                    $q->where('status', 'draft')
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

            $quotation->update(['status' => 'converted', 'converted_at' => now()]);

            return $invoice->load(['items.product', 'customer']);
        });

        return response()->json(['data' => $invoice, 'message' => 'Quotation converted successfully'], 201);
    }
}
