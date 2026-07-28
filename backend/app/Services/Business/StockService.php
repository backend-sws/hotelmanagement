<?php

namespace App\Services\Business;

use App\Models\Product;
use App\Models\InventoryMovement;
use App\Models\ProductStockLocation;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Collection;

class StockService
{
    /**
     * Add stock to a product (on purchase, opening stock, transfer in).
     */
    public function addStock(
        int $productId,
        float $qty,
        string $referenceType,
        int $referenceId,
        ?int $locationId = null,
        ?string $notes = null,
        ?int $businessId = null
    ): void {
        DB::transaction(function () use ($productId, $qty, $referenceType, $referenceId, $locationId, $notes, $businessId) {
            // Update total product quantity
            Product::where('id', $productId)->increment('quantity', $qty);

            // Update per-location quantity if location provided
            if ($locationId) {
                $bId = $businessId ?? Product::where('id', $productId)->value('business_id');
                // updateOrCreate with defaults only; then increment separately to avoid race conditions
                ProductStockLocation::firstOrCreate(
                    ['product_id' => $productId, 'location_id' => $locationId],
                    ['business_id' => $bId, 'quantity' => 0]
                );
                ProductStockLocation::where('product_id', $productId)
                    ->where('location_id', $locationId)
                    ->increment('quantity', $qty);
            }

            // Record movement
            InventoryMovement::create([
                'product_id'     => $productId,
                'type'           => 'in',
                'quantity'       => $qty,
                'reference_type' => $referenceType,
                'reference_id'   => $referenceId,
                'location_id'    => $locationId,
                'notes'          => $notes,
            ]);
        });
    }

    /**
     * Deduct stock from a product (on invoice, challan, material consumption).
     *
     * @throws \Exception if stock is insufficient
     */
    public function deductStock(
        int $productId,
        float $qty,
        string $referenceType,
        int $referenceId,
        ?int $locationId = null,
        ?string $notes = null
    ): void {
        DB::transaction(function () use ($productId, $qty, $referenceType, $referenceId, $locationId, $notes) {
            // Lock product row to prevent race conditions
            $product = Product::lockForUpdate()->findOrFail($productId);

            if (!$this->checkAvailability($productId, $qty, $locationId)) {
                $available = $locationId
                    ? $this->getStockAtLocation($productId, $locationId)
                    : $product->quantity;
                throw new \Exception(
                    "Insufficient stock for '{$product->name}'. Available: {$available}, Requested: {$qty}."
                );
            }

            // Deduct total quantity
            $product->decrement('quantity', $qty);

            // Deduct per-location quantity if location provided
            if ($locationId) {
                ProductStockLocation::where('product_id', $productId)
                    ->where('location_id', $locationId)
                    ->decrement('quantity', $qty);
            }

            // Record movement
            InventoryMovement::create([
                'product_id'     => $productId,
                'type'           => 'out',
                'quantity'       => $qty,
                'reference_type' => $referenceType,
                'reference_id'   => $referenceId,
                'location_id'    => $locationId,
                'notes'          => $notes,
            ]);
        });
    }

    /**
     * Transfer stock between two locations.
     * Deducts from source, adds to destination, logs two movements.
     *
     * @throws \Exception if source stock is insufficient
     */
    public function transfer(
        int $productId,
        float $qty,
        int $fromLocationId,
        int $toLocationId,
        int $transferId,
        ?string $notes = null
    ): void {
        DB::transaction(function () use ($productId, $qty, $fromLocationId, $toLocationId, $transferId, $notes) {
            $product = Product::lockForUpdate()->findOrFail($productId);

            // Check availability at source location
            $sourceQty = $this->getStockAtLocation($productId, $fromLocationId);
            if ($sourceQty < $qty) {
                throw new \Exception(
                    "Insufficient stock at source for '{$product->name}'. Available: {$sourceQty}, Requested: {$qty}."
                );
            }

            // Deduct from source
            ProductStockLocation::where('product_id', $productId)
                ->where('location_id', $fromLocationId)
                ->decrement('quantity', $qty);

            // Add to destination
            ProductStockLocation::updateOrCreate(
                ['product_id' => $productId, 'location_id' => $toLocationId],
                ['business_id' => $product->business_id, 'quantity' => 0]
            );
            ProductStockLocation::where('product_id', $productId)
                ->where('location_id', $toLocationId)
                ->increment('quantity', $qty);

            // Note: total product quantity stays the same (just moved between locations)

            // Record transfer_out movement
            InventoryMovement::create([
                'product_id'     => $productId,
                'type'           => 'out',
                'quantity'       => $qty,
                'reference_type' => 'transfer_out',
                'reference_id'   => $transferId,
                'location_id'    => $fromLocationId,
                'notes'          => $notes ?? "Stock transferred to location #{$toLocationId}",
            ]);

            // Record transfer_in movement
            InventoryMovement::create([
                'product_id'     => $productId,
                'type'           => 'in',
                'quantity'       => $qty,
                'reference_type' => 'transfer_in',
                'reference_id'   => $transferId,
                'location_id'    => $toLocationId,
                'notes'          => $notes ?? "Stock received from location #{$fromLocationId}",
            ]);
        });
    }

    /**
     * Check if sufficient stock is available.
     */
    public function checkAvailability(int $productId, float $qty, ?int $locationId = null): bool
    {
        $available = $locationId
            ? $this->getStockAtLocation($productId, $locationId)
            : (float) (Product::find($productId)?->quantity ?? 0);

        return $available >= $qty;
    }

    /**
     * Get stock quantity at a specific location.
     */
    public function getStockAtLocation(int $productId, int $locationId): float
    {
        return (float) ProductStockLocation::where('product_id', $productId)
            ->where('location_id', $locationId)
            ->value('quantity') ?? 0.0;
    }

    /**
     * Get total stock across all locations.
     */
    public function getTotalStock(int $productId): float
    {
        return (float) (Product::find($productId)?->quantity ?? 0.0);
    }

    /**
     * Get stock summary for all products in a business.
     * Includes per-location breakdown if location_id provided.
     */
    public function getSummary(?int $businessId = null, ?int $locationId = null): Collection
    {
        $businessId = $businessId ?? app('current_business_id') ?? auth()->user()?->business_id;
        $query = Product::where('business_id', $businessId)
            ->whereNull('deleted_at')
            ->with(['category', 'brand']);

        if ($locationId) {
            // Filter products that have stock at this location
            $query->whereHas('stockLocations', function ($q) use ($locationId) {
                $q->where('location_id', $locationId)->where('quantity', '>', 0);
            })->with(['stockLocations' => function ($q) use ($locationId) {
                $q->where('location_id', $locationId);
            }]);
        }

        return $query->get()->map(function (Product $product) use ($locationId) {
            $qty = $locationId
                ? ($product->stockLocations->first()?->quantity ?? 0)
                : $product->quantity;

            // Last movement info via subquery
            $lastMovement = \App\Models\InventoryMovement::where('product_id', $product->id)
                ->when($locationId, fn($q) => $q->where('location_id', $locationId))
                ->latest()
                ->first();

            return [
                'id'              => $product->id,
                'name'            => $product->name,
                'model_name'      => $product->model_name,
                'item_code'       => $product->item_code,
                'category'        => $product->category?->name,
                'brand'           => $product->brand?->name,
                'unit'            => $product->unit,
                'current_qty'     => (float) $qty,
                'min_stock_alert' => (float) ($product->min_stock_alert ?? 0),
                'is_low_stock'    => $product->min_stock_alert > 0 && $qty <= $product->min_stock_alert,
                'is_out_of_stock' => $qty <= 0,
                'purchase_rate'   => (float) ($product->purchase_rate ?? $product->purchase_price ?? 0),
                'sale_rate'       => (float) ($product->sale_rate ?? $product->mrp ?? 0),
                'stock_value'     => round((float) $qty * (float) ($product->purchase_rate ?? $product->purchase_price ?? 0), 2),
                'last_movement_at'=> $lastMovement?->created_at?->toDateString(),
                'last_movement_type' => $lastMovement?->type,
                'track_by_location'  => (bool) $product->track_by_location,
            ];
        });
    }

    /**
     * Get all products where stock is at or below min_stock_alert.
     */
    public function getLowStockItems(?int $businessId = null): Collection
    {
        $businessId = $businessId ?? app('current_business_id') ?? auth()->user()?->business_id;
        return Product::where('business_id', $businessId)
            ->whereNull('deleted_at')
            ->whereNotNull('min_stock_alert')
            ->where('min_stock_alert', '>', 0)
            ->whereRaw('quantity <= min_stock_alert')
            ->orderBy('quantity', 'asc')
            ->get()
            ->map(fn(Product $p) => [
                'id'              => $p->id,
                'name'            => $p->name,
                'item_code'       => $p->item_code,
                'current_qty'     => (float) $p->quantity,
                'min_stock_alert' => (float) $p->min_stock_alert,
                'unit'            => $p->unit,
                'shortage'        => max(0, (float) $p->min_stock_alert - (float) $p->quantity),
                'is_out_of_stock' => $p->quantity <= 0,
            ]);
    }

    /**
     * Get inventory movements for a product with running balance.
     */
    public function getMovements(int $productId, ?string $from = null, ?string $to = null, ?int $locationId = null): Collection
    {
        $query = InventoryMovement::where('product_id', $productId)
            ->when($locationId, fn($q) => $q->where('location_id', $locationId))
            ->when($from, fn($q) => $q->whereDate('created_at', '>=', $from))
            ->when($to, fn($q) => $q->whereDate('created_at', '<=', $to))
            ->orderBy('id', 'asc');

        $movements = $query->get();

        // Calculate running balance
        $runningBalance = 0.0;
        return $movements->map(function ($m) use (&$runningBalance) {
            if ($m->type === 'in') {
                $runningBalance += $m->quantity;
            } else {
                $runningBalance -= $m->quantity;
            }
            return [
                'id'             => $m->id,
                'date'           => $m->created_at->toDateString(),
                'type'           => $m->type,
                'quantity'       => (float) $m->quantity,
                'reference_type' => $m->reference_type,
                'reference_id'   => $m->reference_id,
                'location_id'    => $m->location_id,
                'notes'          => $m->notes,
                'balance'        => round($runningBalance, 3),
            ];
        });
    }
}
