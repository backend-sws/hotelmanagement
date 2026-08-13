<?php

namespace App\Http\Controllers\Api\Business;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\SaleItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ProductAnalysisController extends Controller
{
    public function getAnalytics(Request $request)
    {
        $businessId = app('current_business_id');
        $days = (int) $request->input('days', 30);
        $startDate = Carbon::now()->subDays($days)->startOfDay();
        
        $products = Product::with('category')->where('business_id', $businessId)->get();
        
        // Group sales by product
        $sales = SaleItem::select('product_id', DB::raw('SUM(quantity) as total_sold'))
            ->whereHas('sale', function ($query) use ($businessId, $startDate) {
                $query->where('business_id', $businessId)
                      ->whereIn('invoice_type', ['sales_invoice', 'pos_bill'])
                      ->where('date', '>=', $startDate->format('Y-m-d'));
            })
            ->groupBy('product_id')
            ->pluck('total_sold', 'product_id');

        $analytics = $products->map(function ($product) use ($sales, $days) {
            $totalSold = (float) ($sales[$product->id] ?? 0);
            $avgDailySale = $totalSold / $days;
            $currentStock = (float) $product->quantity;
            
            $daysRemaining = $avgDailySale > 0 ? floor($currentStock / $avgDailySale) : -1;
            $expectedEndingDate = $daysRemaining >= 0 ? Carbon::now()->addDays($daysRemaining)->format('Y-m-d') : null;
            
            $status = 'healthy';
            if ($currentStock <= 0) {
                $status = 'out_of_stock';
            } elseif ($daysRemaining >= 0 && $daysRemaining <= 7) {
                $status = 'critical';
            } elseif ($daysRemaining > 7 && $daysRemaining <= 15) {
                $status = 'warning';
            } elseif ($daysRemaining === -1) {
                $status = 'unknown_demand';
            }

            return [
                'id' => $product->id,
                'name' => $product->name,
                'category' => $product->category->name ?? 'Uncategorized',
                'current_stock' => $currentStock,
                'total_sold' => $totalSold,
                'avg_daily_sale' => round($avgDailySale, 2),
                'estimated_days_remaining' => $daysRemaining,
                'expected_ending_date' => $expectedEndingDate,
                'status' => $status
            ];
        })->sortBy('estimated_days_remaining')->values();

        // Time of day analysis
        $timeAnalysis = DB::table('sale_items')
            ->join('sales', 'sale_items.sale_id', '=', 'sales.id')
            ->select(DB::raw('HOUR(sales.created_at) as hour'), DB::raw('SUM(sale_items.quantity) as total_quantity'))
            ->where('sales.business_id', $businessId)
            ->whereIn('sales.invoice_type', ['sales_invoice', 'pos_bill'])
            ->where('sales.date', '>=', $startDate->format('Y-m-d'))
            ->groupBy('hour')
            ->orderBy('hour')
            ->get()
            ->map(function ($item) {
                // Convert 24h to 12h format
                $hour = (int)$item->hour;
                $ampm = $hour >= 12 ? 'PM' : 'AM';
                $hour12 = $hour % 12;
                $hour12 = $hour12 ? $hour12 : 12;
                $item->formatted_time = $hour12 . ' ' . $ampm;
                return $item;
            });

        return response()->json([
            'products' => $analytics,
            'time_analysis' => $timeAnalysis
        ]);
    }
}
