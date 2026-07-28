<?php

namespace App\Http\Controllers\Api\Business;

use App\Http\Controllers\Controller;
use App\Models\Sale;
use App\Models\SupplierPurchase;
use Illuminate\Http\Request;
use Carbon\Carbon;

class GstReportController extends Controller
{
    protected function getBusinessId(Request $request)
    {
        return app()->bound('current_business_id') ? app('current_business_id') : ($request->user() ? ($request->user()->business_id ?? $request->user()->businesses()->first()?->id) : null);
    }

    protected function getDateRange(Request $request)
    {
        $fromDate = $request->input('from_date', Carbon::now()->startOfMonth()->toDateString());
        $toDate = $request->input('to_date', Carbon::now()->endOfMonth()->toDateString());
        return [$fromDate, $toDate];
    }

    public function gstr1(Request $request)
    {
        $businessId = $this->getBusinessId($request);
        list($fromDate, $toDate) = $this->getDateRange($request);

        $sales = Sale::with(['customer', 'items'])
            ->where('business_id', $businessId)
            ->whereIn('invoice_type', ['sales_invoice', 'credit_note', 'debit_note'])
            ->where('status', '!=', 'cancelled')
            ->whereBetween('date', [$fromDate, $toDate])
            ->get();

        $b2b = [];
        $b2cl = [];
        $b2cs = [];

        $totalTaxable = 0;
        $totalCgst = 0;
        $totalSgst = 0;
        $totalIgst = 0;
        $totalTax = 0;
        $totalInvoiceValue = 0;

        $docSummary = [
            'total_invoices' => $sales->count(),
            'sales_invoices' => $sales->where('invoice_type', 'sales_invoice')->count(),
            'credit_notes' => $sales->where('invoice_type', 'credit_note')->count(),
            'debit_notes' => $sales->where('invoice_type', 'debit_note')->count(),
        ];

        foreach ($sales as $sale) {
            $multiplier = $sale->invoice_type === 'credit_note' ? -1 : 1;

            $taxable = ($sale->taxable_amount ?? 0) * $multiplier;
            $cgst = ($sale->cgst_amount ?? 0) * $multiplier;
            $sgst = ($sale->sgst_amount ?? 0) * $multiplier;
            $igst = ($sale->igst_amount ?? 0) * $multiplier;
            $tax = ($sale->total_tax_amount ?? ($cgst + $sgst + $igst)) * $multiplier;
            $val = ($sale->final_amount ?? $sale->total_amount ?? 0) * $multiplier;

            $totalTaxable += $taxable;
            $totalCgst += $cgst;
            $totalSgst += $sgst;
            $totalIgst += $igst;
            $totalTax += $tax;
            $totalInvoiceValue += $val;

            $customer = $sale->customer;
            $gstin = $customer ? trim($customer->gstin ?? '') : '';
            $state = $customer ? ($customer->state ?? $sale->place_of_supply ?? 'Local') : ($sale->place_of_supply ?? 'Local');

            if (!empty($gstin)) {
                // B2B Supply
                $b2b[] = [
                    'id' => $sale->id,
                    'invoice_number' => $sale->invoice_number,
                    'date' => $sale->date,
                    'customer_name' => $customer ? $customer->name : 'Unknown Customer',
                    'gstin' => $gstin,
                    'state' => $state,
                    'invoice_type' => $sale->invoice_type,
                    'taxable_amount' => round($taxable, 2),
                    'cgst_amount' => round($cgst, 2),
                    'sgst_amount' => round($sgst, 2),
                    'igst_amount' => round($igst, 2),
                    'total_tax' => round($tax, 2),
                    'total_amount' => round($val, 2),
                ];
            } else {
                // B2C Supply
                // Check if Large (> 250,000 and IGST / Inter-state)
                $isInterState = ($igst != 0) || (strtolower($state) !== strtolower(app()->bound('current_business_state') ? app('current_business_state') : 'local'));
                if ($isInterState && abs($val) > 250000) {
                    $b2cl[] = [
                        'id' => $sale->id,
                        'invoice_number' => $sale->invoice_number,
                        'date' => $sale->date,
                        'customer_name' => $customer ? $customer->name : 'Retail Customer',
                        'state' => $state,
                        'invoice_type' => $sale->invoice_type,
                        'taxable_amount' => round($taxable, 2),
                        'igst_amount' => round($igst, 2),
                        'total_tax' => round($tax, 2),
                        'total_amount' => round($val, 2),
                    ];
                } else {
                    // B2C Small - grouped or individual list
                    $b2cs[] = [
                        'id' => $sale->id,
                        'invoice_number' => $sale->invoice_number,
                        'date' => $sale->date,
                        'customer_name' => $customer ? $customer->name : 'Retail Customer',
                        'state' => $state,
                        'invoice_type' => $sale->invoice_type,
                        'taxable_amount' => round($taxable, 2),
                        'cgst_amount' => round($cgst, 2),
                        'sgst_amount' => round($sgst, 2),
                        'igst_amount' => round($igst, 2),
                        'total_tax' => round($tax, 2),
                        'total_amount' => round($val, 2),
                    ];
                }
            }
        }

        return response()->json([
            'data' => [
                'b2b' => $b2b,
                'b2cl' => $b2cl,
                'b2cs' => $b2cs,
                'summary' => $docSummary,
                'totals' => [
                    'taxable_amount' => round($totalTaxable, 2),
                    'cgst_amount' => round($totalCgst, 2),
                    'sgst_amount' => round($totalSgst, 2),
                    'igst_amount' => round($totalIgst, 2),
                    'total_tax' => round($totalTax, 2),
                    'total_invoice_value' => round($totalInvoiceValue, 2),
                ],
                'from_date' => $fromDate,
                'to_date' => $toDate,
            ]
        ]);
    }

    public function gstr3b(Request $request)
    {
        $businessId = $this->getBusinessId($request);
        list($fromDate, $toDate) = $this->getDateRange($request);

        // 3.1 Outward supplies (Sales Invoices + Debit Notes - Credit Notes)
        $sales = Sale::where('business_id', $businessId)
            ->whereIn('invoice_type', ['sales_invoice', 'credit_note', 'debit_note'])
            ->where('status', '!=', 'cancelled')
            ->whereBetween('date', [$fromDate, $toDate])
            ->get();

        $outwardTaxable = 0;
        $outwardCgst = 0;
        $outwardSgst = 0;
        $outwardIgst = 0;
        $outwardTotalTax = 0;

        foreach ($sales as $sale) {
            $multiplier = $sale->invoice_type === 'credit_note' ? -1 : 1;
            $outwardTaxable += ($sale->taxable_amount ?? 0) * $multiplier;
            $outwardCgst += ($sale->cgst_amount ?? 0) * $multiplier;
            $outwardSgst += ($sale->sgst_amount ?? 0) * $multiplier;
            $outwardIgst += ($sale->igst_amount ?? 0) * $multiplier;
            $outwardTotalTax += ($sale->total_tax_amount ?? (($sale->cgst_amount ?? 0) + ($sale->sgst_amount ?? 0) + ($sale->igst_amount ?? 0))) * $multiplier;
        }

        // 4. Eligible ITC (Supplier Purchases where is_itc_eligible = true)
        $purchases = SupplierPurchase::where('business_id', $businessId)
            ->where('status', '!=', 'cancelled')
            ->where('is_itc_eligible', true)
            ->where(function ($q) use ($fromDate, $toDate) {
                $q->whereBetween('bill_date', [$fromDate, $toDate])
                  ->orWhereBetween('purchase_date', [$fromDate, $toDate]);
            })
            ->get();

        $itcTaxable = 0;
        $itcCgst = 0;
        $itcSgst = 0;
        $itcIgst = 0;
        $itcTotalTax = 0;

        foreach ($purchases as $purchase) {
            $itcTaxable += $purchase->taxable_amount ?? 0;
            $itcCgst += $purchase->cgst_amount ?? 0;
            $itcSgst += $purchase->sgst_amount ?? 0;
            $itcIgst += $purchase->igst_amount ?? 0;
            $itcTotalTax += $purchase->total_tax_amount ?? (($purchase->cgst_amount ?? 0) + ($purchase->sgst_amount ?? 0) + ($purchase->igst_amount ?? 0));
        }

        // Net Payable Liability vs Carry Forward
        $netCgst = max(0, $outwardCgst - $itcCgst);
        $netSgst = max(0, $outwardSgst - $itcSgst);
        $netIgst = max(0, $outwardIgst - $itcIgst);
        $netTotalPayable = $netCgst + $netSgst + $netIgst;

        $carryCgst = max(0, $itcCgst - $outwardCgst);
        $carrySgst = max(0, $itcSgst - $outwardSgst);
        $carryIgst = max(0, $itcIgst - $outwardIgst);
        $totalCarryForward = $carryCgst + $carrySgst + $carryIgst;

        return response()->json([
            'data' => [
                'outward_supplies' => [
                    'taxable_amount' => round($outwardTaxable, 2),
                    'cgst_amount' => round($outwardCgst, 2),
                    'sgst_amount' => round($outwardSgst, 2),
                    'igst_amount' => round($outwardIgst, 2),
                    'total_tax' => round($outwardTotalTax, 2),
                ],
                'eligible_itc' => [
                    'taxable_amount' => round($itcTaxable, 2),
                    'cgst_amount' => round($itcCgst, 2),
                    'sgst_amount' => round($itcSgst, 2),
                    'igst_amount' => round($itcIgst, 2),
                    'total_tax' => round($itcTotalTax, 2),
                ],
                'net_payable' => [
                    'cgst_amount' => round($netCgst, 2),
                    'sgst_amount' => round($netSgst, 2),
                    'igst_amount' => round($netIgst, 2),
                    'total_tax' => round($netTotalPayable, 2),
                ],
                'itc_carry_forward' => [
                    'cgst_amount' => round($carryCgst, 2),
                    'sgst_amount' => round($carrySgst, 2),
                    'igst_amount' => round($carryIgst, 2),
                    'total_tax' => round($totalCarryForward, 2),
                ],
                'from_date' => $fromDate,
                'to_date' => $toDate,
            ]
        ]);
    }

    public function hsnSummary(Request $request)
    {
        $businessId = $this->getBusinessId($request);
        list($fromDate, $toDate) = $this->getDateRange($request);

        $sales = Sale::with(['items.product'])
            ->where('business_id', $businessId)
            ->whereIn('invoice_type', ['sales_invoice', 'credit_note', 'debit_note'])
            ->where('status', '!=', 'cancelled')
            ->whereBetween('date', [$fromDate, $toDate])
            ->get();

        $hsnMap = [];

        foreach ($sales as $sale) {
            $multiplier = $sale->invoice_type === 'credit_note' ? -1 : 1;

            foreach ($sale->items as $item) {
                $hsn = trim($item->hsn_code ?? ($item->product->hsn_code ?? 'UNSPECIFIED'));
                if (empty($hsn)) {
                    $hsn = 'UNSPECIFIED';
                }
                $rate = floatval($item->gst_rate ?? ($item->product->gst_rate ?? 0));
                $key = $hsn . '_' . $rate;

                if (!isset($hsnMap[$key])) {
                    $hsnMap[$key] = [
                        'hsn_code' => $hsn,
                        'description' => $item->product ? $item->product->name : 'Item Supply',
                        'uom' => $item->unit ?? ($item->product->unit ?? 'PCS'),
                        'gst_rate' => $rate,
                        'total_quantity' => 0,
                        'taxable_value' => 0,
                        'cgst_amount' => 0,
                        'sgst_amount' => 0,
                        'igst_amount' => 0,
                        'total_tax' => 0,
                        'total_value' => 0,
                    ];
                }

                $qty = floatval($item->quantity ?? 0) * $multiplier;
                $taxable = floatval($item->taxable_amount ?? ($item->rate * $item->quantity)) * $multiplier;
                $cgst = floatval($item->cgst_amount ?? 0) * $multiplier;
                $sgst = floatval($item->sgst_amount ?? 0) * $multiplier;
                $igst = floatval($item->igst_amount ?? 0) * $multiplier;
                $tax = ($cgst + $sgst + $igst);
                $val = ($taxable + $tax);

                $hsnMap[$key]['total_quantity'] += $qty;
                $hsnMap[$key]['taxable_value'] += $taxable;
                $hsnMap[$key]['cgst_amount'] += $cgst;
                $hsnMap[$key]['sgst_amount'] += $sgst;
                $hsnMap[$key]['igst_amount'] += $igst;
                $hsnMap[$key]['total_tax'] += $tax;
                $hsnMap[$key]['total_value'] += $val;
            }
        }

        $result = array_values(array_map(function ($item) {
            return [
                'hsn_code' => $item['hsn_code'],
                'description' => $item['description'],
                'uom' => $item['uom'],
                'gst_rate' => $item['gst_rate'],
                'total_quantity' => round($item['total_quantity'], 2),
                'taxable_value' => round($item['taxable_value'], 2),
                'cgst_amount' => round($item['cgst_amount'], 2),
                'sgst_amount' => round($item['sgst_amount'], 2),
                'igst_amount' => round($item['igst_amount'], 2),
                'total_tax' => round($item['total_tax'], 2),
                'total_value' => round($item['total_value'], 2),
            ];
        }, $hsnMap));

        return response()->json([
            'data' => [
                'items' => $result,
                'from_date' => $fromDate,
                'to_date' => $toDate,
            ]
        ]);
    }
}
