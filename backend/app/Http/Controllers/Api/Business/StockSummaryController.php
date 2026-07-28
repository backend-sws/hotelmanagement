<?php

namespace App\Http\Controllers\Api\Business;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\BusinessLocation;
use App\Models\InventoryMovement;
use App\Services\Business\StockService;
use Illuminate\Http\Request;

class StockSummaryController extends Controller
{
    protected StockService $stockService;

    public function __construct(StockService $stockService)
    {
        $this->stockService = $stockService;
    }

    /**
     * GET /stock/summary
     * All products with current stock, value, low-stock status.
     * Optionally filter by location, category, or low_stock_only.
     */
    public function index(Request $request)
    {
        $businessId = app('current_business_id') ?? $request->user()->business_id;
        $locationId = $request->input('location_id') ? (int) $request->input('location_id') : null;

        $summary = $this->stockService->getSummary($businessId, $locationId);

        // Apply filters
        if ($request->boolean('low_stock_only')) {
            $summary = $summary->filter(fn($item) => $item['is_low_stock'] || $item['is_out_of_stock'])->values();
        }

        if ($request->filled('category_id')) {
            $catId = (int) $request->input('category_id');
            $productIds = Product::where('business_id', $businessId)->where('category_id', $catId)->pluck('id');
            $summary = $summary->filter(fn($item) => $productIds->contains($item['id']))->values();
        }

        if ($request->filled('search')) {
            $s = strtolower($request->input('search'));
            $summary = $summary->filter(function ($item) use ($s) {
                return str_contains(strtolower($item['name']), $s)
                    || str_contains(strtolower($item['item_code'] ?? ''), $s);
            })->values();
        }

        // Aggregate stats
        $totalItems    = $summary->count();
        $lowStockCount = $summary->where('is_low_stock', true)->count();
        $outOfStock    = $summary->where('is_out_of_stock', true)->count();
        $totalValue    = round($summary->sum('stock_value'), 2);

        return response()->json([
            'status' => 'success',
            'data'   => $summary,
            'stats'  => [
                'total_items'     => $totalItems,
                'low_stock_count' => $lowStockCount,
                'out_of_stock'    => $outOfStock,
                'total_value'     => $totalValue,
            ],
        ]);
    }

    /**
     * GET /stock/location-wise
     * Each location → products + quantities.
     */
    public function locationWise(Request $request)
    {
        $businessId = app('current_business_id') ?? $request->user()->business_id;
        $locations  = BusinessLocation::where('business_id', $businessId)->get();

        $result = $locations->map(function (BusinessLocation $loc) use ($businessId) {
            $stockEntries = \App\Models\ProductStockLocation::where('business_id', $businessId)
                ->where('location_id', $loc->id)
                ->where('quantity', '>', 0)
                ->with('product:id,model_name,item_code,unit,purchase_rate,purchase_price,min_stock_alert')
                ->get();

            $totalValue = $stockEntries->sum(function ($entry) {
                $rate = $entry->product?->purchase_rate ?? $entry->product?->purchase_price ?? 0;
                return $entry->quantity * $rate;
            });

            return [
                'location_id'   => $loc->id,
                'location_name' => $loc->name,
                'items_count'   => $stockEntries->count(),
                'total_value'   => round($totalValue, 2),
                'products'      => $stockEntries->map(fn($e) => [
                    'product_id'   => $e->product_id,
                    'name'         => $e->product?->name,
                    'item_code'    => $e->product?->item_code,
                    'unit'         => $e->product?->unit,
                    'quantity'     => (float) $e->quantity,
                    'purchase_rate'=> (float) ($e->product?->purchase_rate ?? $e->product?->purchase_price ?? 0),
                    'stock_value'  => round($e->quantity * ($e->product?->purchase_rate ?? $e->product?->purchase_price ?? 0), 2),
                    'is_low_stock' => $e->product?->min_stock_alert > 0 && $e->quantity <= $e->product?->min_stock_alert,
                ]),
            ];
        });

        return response()->json([
            'status' => 'success',
            'data'   => $result,
        ]);
    }

    /**
     * GET /stock/movements/{productId}
     * Date-wise running balance ledger for a product.
     */
    public function movements(Request $request, int $productId)
    {
        $businessId = app('current_business_id') ?? $request->user()->business_id;
        $product    = Product::where('business_id', $businessId)->findOrFail($productId);
        $locationId = $request->input('location_id') ? (int) $request->input('location_id') : null;
        $from       = $request->input('from_date');
        $to         = $request->input('to_date');

        $movements = $this->stockService->getMovements($productId, $from, $to, $locationId);

        // Aggregate stats
        $totalIn  = $movements->where('type', 'in')->sum('quantity');
        $totalOut = $movements->where('type', 'out')->sum('quantity');

        return response()->json([
            'status'  => 'success',
            'product' => [
                'id'          => $product->id,
                'name'        => $product->name,
                'item_code'   => $product->item_code,
                'unit'        => $product->unit,
                'current_qty' => (float) $product->quantity,
            ],
            'data'    => $movements,
            'stats'   => [
                'total_in'  => round($totalIn, 3),
                'total_out' => round($totalOut, 3),
                'net'       => round($totalIn - $totalOut, 3),
            ],
        ]);
    }

    /**
     * GET /stock/low-stock
     * Items at or below minimum stock level.
     */
    public function lowStock(Request $request)
    {
        $businessId = app('current_business_id') ?? $request->user()->business_id;
        $items      = $this->stockService->getLowStockItems($businessId);

        return response()->json([
            'status' => 'success',
            'data'   => $items,
            'count'  => $items->count(),
        ]);
    }
}
