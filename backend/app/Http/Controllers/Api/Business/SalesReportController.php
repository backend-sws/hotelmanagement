<?php

namespace App\Http\Controllers\Api\Business;

use App\Http\Controllers\Controller;
use App\Models\Sale;
use App\Models\SaleItem;
use App\Models\Customer;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class SalesReportController extends Controller
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

    public function index(Request $request)
    {
        $businessId = $this->getBusinessId($request);
        list($fromDate, $toDate) = $this->getDateRange($request);

        // 1. By Customer
        $salesByCustomer = Sale::with('customer')
            ->where('business_id', $businessId)
            ->where('invoice_type', 'sales_invoice')
            ->where('status', '!=', 'cancelled')
            ->whereBetween('date', [$fromDate, $toDate])
            ->get();

        $customerMap = [];
        $totalSalesAmount = 0;
        $totalInvoicesCount = $salesByCustomer->count();

        foreach ($salesByCustomer as $sale) {
            $cid = $sale->customer_id ?? 0;
            $cname = $sale->customer ? $sale->customer->name : 'Walk-in / Retail';
            $cphone = $sale->customer ? ($sale->customer->phone ?? '') : '';
            $amt = floatval($sale->final_amount ?? $sale->total_amount ?? 0);

            $totalSalesAmount += $amt;

            if (!isset($customerMap[$cid])) {
                $customerMap[$cid] = [
                    'customer_id' => $cid,
                    'customer_name' => $cname,
                    'phone' => $cphone,
                    'invoice_count' => 0,
                    'total_revenue' => 0,
                ];
            }
            $customerMap[$cid]['invoice_count']++;
            $customerMap[$cid]['total_revenue'] += $amt;
        }

        $byCustomerList = array_values($customerMap);
        usort($byCustomerList, fn($a, $b) => $b['total_revenue'] <=> $a['total_revenue']);
        $topCustomers = array_slice($byCustomerList, 0, 10);

        // 2. By Product / Item
        $saleIds = $salesByCustomer->pluck('id');
        $saleItems = SaleItem::with('product')
            ->whereIn('sale_id', $saleIds)
            ->get();

        $productMap = [];
        foreach ($saleItems as $item) {
            $pid = $item->product_id ?? 0;
            $pname = $item->product ? $item->product->name : 'Unknown Item';
            $uom = $item->unit ?? ($item->product->unit ?? 'PCS');
            $qty = floatval($item->quantity ?? 0);
            $amt = floatval($item->amount ?? ($item->rate * $item->quantity));

            if (!isset($productMap[$pid])) {
                $productMap[$pid] = [
                    'product_id' => $pid,
                    'product_name' => $pname,
                    'uom' => $uom,
                    'total_quantity' => 0,
                    'total_revenue' => 0,
                ];
            }
            $productMap[$pid]['total_quantity'] += $qty;
            $productMap[$pid]['total_revenue'] += $amt;
        }

        $byProductList = array_values($productMap);
        usort($byProductList, fn($a, $b) => $b['total_revenue'] <=> $a['total_revenue']);
        $topProducts = array_slice($byProductList, 0, 10);

        // 3. By Sales Rep / User
        $repMap = [];
        foreach ($salesByCustomer as $sale) {
            $uid = $sale->user_id ?? 0;
            $uname = 'System / Admin';
            if ($sale->user_id) {
                $userObj = User::find($sale->user_id);
                if ($userObj) $uname = $userObj->name;
            }
            $amt = floatval($sale->final_amount ?? $sale->total_amount ?? 0);

            if (!isset($repMap[$uid])) {
                $repMap[$uid] = [
                    'user_id' => $uid,
                    'rep_name' => $uname,
                    'invoice_count' => 0,
                    'total_revenue' => 0,
                ];
            }
            $repMap[$uid]['invoice_count']++;
            $repMap[$uid]['total_revenue'] += $amt;
        }

        $byRepList = array_values($repMap);
        usort($byRepList, fn($a, $b) => $b['total_revenue'] <=> $a['total_revenue']);

        // 4. Daily Volume Trends
        $trendMap = [];
        foreach ($salesByCustomer as $sale) {
            $dt = is_object($sale->date) ? $sale->date->format('Y-m-d') : (string)$sale->date;
            $amt = floatval($sale->final_amount ?? $sale->total_amount ?? 0);
            if (!isset($trendMap[$dt])) {
                $trendMap[$dt] = [
                    'date' => $dt,
                    'invoice_count' => 0,
                    'total_revenue' => 0,
                ];
            }
            $trendMap[$dt]['invoice_count']++;
            $trendMap[$dt]['total_revenue'] += $amt;
        }
        ksort($trendMap);
        $trendsList = array_values($trendMap);

        return response()->json([
            'data' => [
                'summary' => [
                    'total_revenue' => round($totalSalesAmount, 2),
                    'total_invoices' => $totalInvoicesCount,
                    'average_invoice_value' => $totalInvoicesCount > 0 ? round($totalSalesAmount / $totalInvoicesCount, 2) : 0,
                ],
                'by_customer' => $topCustomers,
                'by_product' => $topProducts,
                'by_sales_rep' => $byRepList,
                'trends' => $trendsList,
                'from_date' => $fromDate,
                'to_date' => $toDate,
            ]
        ]);
    }
}
