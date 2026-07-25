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

class CreditNoteController extends Controller
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
            ->where('invoice_type', 'credit_note');

        return response()->json(['data' => $query->orderBy('id', 'desc')->paginate(20)]);
    }

    public function store(Request $request)
    {
        $businessId = app('current_business_id');
        $validated = $request->validate([
            'parent_id' => 'required|exists:sales,id',
            'reason' => 'required|in:damaged,wrong_item,rate_correction,partial_return,other',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|numeric|min:0.01',
            'items.*.rate' => 'required|numeric|min:0',
            'items.*.gst_rate' => 'required|numeric|min:0',
            'items.*.hsn_code' => 'nullable|string',
            'items.*.unit' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        $originalInvoice = Sale::where('business_id', $businessId)->findOrFail($validated['parent_id']);

        $creditNote = DB::transaction(function () use ($validated, $businessId, $request, $originalInvoice) {
            $cnNumber = $this->invoiceNumberService->generate($businessId, 'credit_note');

            $taxableTotal = 0;
            $cgstTotal = 0;
            $sgstTotal = 0;
            $igstTotal = 0;

            $gstService = app(GstCalculationService::class);
            $taxType = $originalInvoice->tax_type ?? 'gst';
            $itemsPayload = [];

            foreach ($validated['items'] as $itemData) {
                $taxData = $gstService->calculateItemTax($itemData['rate'], $itemData['quantity'], $itemData['gst_rate'], $taxType);
                $itemsPayload[] = array_merge($itemData, $taxData);
                $taxableTotal += $taxData['taxable_amount'];
                $cgstTotal += $taxData['cgst_amount'];
                $sgstTotal += $taxData['sgst_amount'];
                $igstTotal += $taxData['igst_amount'];
            }

            $taxTotal = $cgstTotal + $sgstTotal + $igstTotal;
            $totalAmount = $taxableTotal + $taxTotal;
            $roundedTotal = round($totalAmount);

            $cn = Sale::create([
                'business_id' => $businessId,
                'customer_id' => $originalInvoice->customer_id,
                'user_id' => $request->user()->id,
                'invoice_number' => $cnNumber,
                'invoice_type' => 'credit_note',
                'tax_type' => $taxType,
                'date' => now()->toDateString(),
                'parent_id' => $originalInvoice->id,
                'taxable_amount' => $taxableTotal,
                'cgst_amount' => $cgstTotal,
                'sgst_amount' => $sgstTotal,
                'igst_amount' => $igstTotal,
                'total_tax_amount' => $taxTotal,
                'total_amount' => $totalAmount,
                'final_amount' => $roundedTotal,
                'round_off' => round($roundedTotal - $totalAmount, 2),
                'discount' => 0,
                'paid_amount' => 0,
                'status' => 'completed',
                'notes' => ($validated['reason'] ?? '') . ': ' . ($validated['notes'] ?? ''),
            ]);

            foreach ($itemsPayload as $ip) {
                SaleItem::create([
                    'sale_id' => $cn->id,
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

                // Restore stock for returned items
                $product = Product::find($ip['product_id']);
                if ($product) {
                    $product->increment('quantity', $ip['quantity']);
                    InventoryMovement::create([
                        'product_id' => $product->id,
                        'type' => 'in',
                        'quantity' => $ip['quantity'],
                        'reference_type' => 'credit_note',
                        'reference_id' => $cn->id,
                    ]);
                }
            }

            return $cn->load(['items.product', 'customer']);
        });

        return response()->json(['data' => $creditNote], 201);
    }

    public function show($id, Request $request)
    {
        $cn = Sale::with(['items.product', 'customer', 'user'])
            ->where('business_id', app('current_business_id'))
            ->where('invoice_type', 'credit_note')
            ->findOrFail($id);

        return response()->json(['data' => $cn]);
    }
}
