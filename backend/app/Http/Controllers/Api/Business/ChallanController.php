<?php

namespace App\Http\Controllers\Api\Business;

use App\Http\Controllers\Controller;
use App\Models\Sale;
use App\Models\SaleItem;
use App\Models\Product;
use App\Models\InventoryMovement;
use App\Services\GstCalculationService;
use App\Services\InvoiceNumberService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Barryvdh\DomPDF\Facade\Pdf;

class ChallanController extends Controller
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
        $query = Sale::with(['customer', 'user'])
            ->where('business_id', $businessId)
            ->where('invoice_type', 'delivery_challan');

        if ($request->filled('status') && $request->status !== 'all') {
            $status = $request->status;
            if ($status === 'pending') {
                $query->whereIn('status', ['pending', 'unpaid', 'draft'])
                      ->whereNull('converted_at')
                      ->where('status', '!=', 'converted');
            } elseif ($status === 'completed' || $status === 'delivered') {
                $query->whereIn('status', ['completed', 'delivered', 'paid']);
            } elseif ($status === 'converted') {
                $query->where(function ($q) {
                    $q->where('status', 'converted')->orWhereNotNull('converted_at');
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
                  ->orWhere('vehicle_number', 'LIKE', "%{$search}%")
                  ->orWhere('driver_name', 'LIKE', "%{$search}%")
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
        $challan = Sale::with(['items.product', 'customer', 'user', 'payments'])
            ->where('business_id', app('current_business_id'))
            ->where('invoice_type', 'delivery_challan')
            ->findOrFail($id);

        return response()->json(['data' => $challan]);
    }

    public function pendingChallans(Request $request)
    {
        $businessId = app('current_business_id');
        $query = Sale::with(['items.product', 'customer'])
            ->where('business_id', $businessId)
            ->where('invoice_type', 'delivery_challan')
            ->whereNotIn('status', ['converted', 'cancelled']);

        if ($request->has('customer_id')) {
            $query->where('customer_id', $request->customer_id);
        }

        return response()->json(['data' => $query->orderBy('id', 'desc')->get()]);
    }

    public function generateTruckSlip($id, Request $request)
    {
        $challan = Sale::with(['items.product', 'customer', 'business'])
            ->where('business_id', app('current_business_id'))
            ->findOrFail($id);

        $pdf = Pdf::loadView('pdfs.truck_slip', compact('challan'));
        return $pdf->download("DC-{$challan->invoice_number}.pdf");
    }

    public function convert(Request $request)
    {
        $businessId = app('current_business_id');
        $validated = $request->validate([
            'challan_ids' => 'required|array|min:1',
            'challan_ids.*' => 'exists:sales,id',
        ]);

        $invoice = DB::transaction(function () use ($validated, $businessId, $request) {
            $challans = Sale::with('items')
                ->where('business_id', $businessId)
                ->where('invoice_type', 'delivery_challan')
                ->whereIn('id', $validated['challan_ids'])
                ->get();

            if ($challans->isEmpty()) {
                abort(404, 'No challans found');
            }

            $customerId = $challans->first()->customer_id;
            $invoiceNumber = $this->invoiceNumberService->generate($businessId, 'sales_invoice');

            // Merge items from all challans
            $allItems = $challans->flatMap->items;
            $taxableTotal = $allItems->sum('taxable_amount');
            $cgstTotal = $allItems->sum('cgst_amount');
            $sgstTotal = $allItems->sum('sgst_amount');
            $igstTotal = $allItems->sum('igst_amount');
            $taxTotal = $cgstTotal + $sgstTotal + $igstTotal;
            $totalAmount = $taxableTotal + $taxTotal;
            $roundedTotal = round($totalAmount);
            $roundOff = round($roundedTotal - $totalAmount, 2);

            $invoice = Sale::create([
                'business_id' => $businessId,
                'customer_id' => $customerId,
                'user_id' => $request->user()->id,
                'invoice_number' => $invoiceNumber,
                'invoice_type' => 'sales_invoice',
                'tax_type' => $challans->first()->tax_type ?? 'gst',
                'date' => now()->toDateString(),
                'taxable_amount' => $taxableTotal,
                'cgst_amount' => $cgstTotal,
                'sgst_amount' => $sgstTotal,
                'igst_amount' => $igstTotal,
                'total_tax_amount' => $taxTotal,
                'total_amount' => $totalAmount,
                'discount' => 0,
                'round_off' => $roundOff,
                'final_amount' => $roundedTotal,
                'paid_amount' => 0,
                'status' => 'pending',
            ]);

            // Copy items to invoice
            foreach ($allItems as $item) {
                SaleItem::create([
                    'sale_id' => $invoice->id,
                    'product_id' => $item->product_id,
                    'quantity' => $item->quantity,
                    'rate' => $item->rate,
                    'hsn_code' => $item->hsn_code,
                    'unit' => $item->unit,
                    'gst_rate' => $item->gst_rate,
                    'taxable_amount' => $item->taxable_amount,
                    'cgst_amount' => $item->cgst_amount,
                    'sgst_amount' => $item->sgst_amount,
                    'igst_amount' => $item->igst_amount,
                    'amount' => $item->amount,
                ]);
            }

            // Mark challans as converted
            foreach ($challans as $c) {
                $c->update(['status' => 'converted', 'converted_at' => now(), 'parent_id' => $invoice->id]);
            }

            return $invoice->load(['items.product', 'customer']);
        });

        return response()->json(['data' => $invoice, 'message' => 'Challans converted to invoice successfully'], 201);
    }
}
