<?php

namespace App\Http\Controllers\Api\Business;

use App\Http\Controllers\Controller;
use App\Models\StockTransfer;
use App\Models\StockTransferItem;
use App\Models\Product;
use App\Models\BusinessLocation;
use App\Services\Business\StockService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class StockTransferController extends Controller
{
    protected StockService $stockService;

    public function __construct(StockService $stockService)
    {
        $this->stockService = $stockService;
    }

    /**
     * GET /stock-transfers
     * List transfers with from/to location names.
     */
    public function index(Request $request)
    {
        $businessId = app('current_business_id') ?? $request->user()->business_id;
        $query = StockTransfer::with(['fromLocation', 'toLocation', 'transferredBy', 'items.product'])
            ->where('business_id', $businessId);

        if ($request->filled('from_location_id')) {
            $query->where('from_location_id', $request->input('from_location_id'));
        }
        if ($request->filled('to_location_id')) {
            $query->where('to_location_id', $request->input('to_location_id'));
        }
        if ($request->filled('from_date')) {
            $query->whereDate('transfer_date', '>=', $request->input('from_date'));
        }
        if ($request->filled('to_date')) {
            $query->whereDate('transfer_date', '<=', $request->input('to_date'));
        }
        if ($request->filled('search')) {
            $s = $request->input('search');
            $query->where('transfer_number', 'like', "%{$s}%");
        }

        $transfers = $query->orderBy('transfer_date', 'desc')->orderBy('id', 'desc')
            ->paginate($request->input('per_page', 20));

        return response()->json(['status' => 'success', 'data' => $transfers]);
    }

    /**
     * POST /stock-transfers
     * Create a new stock transfer between locations.
     */
    public function store(Request $request)
    {
        $businessId = app('current_business_id') ?? $request->user()->business_id;

        $validator = Validator::make($request->all(), [
            'from_location_id'  => 'required|exists:business_locations,id',
            'to_location_id'    => 'required|exists:business_locations,id|different:from_location_id',
            'transfer_date'     => 'nullable|date',
            'notes'             => 'nullable|string',
            'items'             => 'required|array|min:1',
            'items.*.product_id'=> 'required|exists:products,id',
            'items.*.quantity'  => 'required|numeric|min:0.001',
            'items.*.unit'      => 'nullable|string|max:20',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'errors' => $validator->errors()], 422);
        }

        // Validate both locations belong to this business
        $fromLocation = BusinessLocation::where('business_id', $businessId)
            ->find($request->input('from_location_id'));
        $toLocation = BusinessLocation::where('business_id', $businessId)
            ->find($request->input('to_location_id'));

        if (!$fromLocation || !$toLocation) {
            return response()->json(['status' => 'error', 'message' => 'Invalid location(s).'], 422);
        }

        // Pre-validate stock availability for all items before starting transaction
        foreach ($request->input('items') as $item) {
            $available = $this->stockService->getStockAtLocation(
                $item['product_id'],
                $request->input('from_location_id')
            );
            if ($available < $item['quantity']) {
                $product = Product::find($item['product_id']);
                return response()->json([
                    'status'  => 'error',
                    'message' => "Insufficient stock at '{$fromLocation->name}' for '{$product->name}'. Available: {$available}, Requested: {$item['quantity']}.",
                ], 422);
            }
        }

        try {
            $transfer = DB::transaction(function () use ($request, $businessId, $fromLocation, $toLocation) {
                // Generate transfer number: ST-0001
                $lastTransfer = StockTransfer::where('business_id', $businessId)
                    ->lockForUpdate()->orderBy('id', 'desc')->first();
                $nextNum = $lastTransfer
                    ? ((int) preg_replace('/\D/', '', $lastTransfer->transfer_number) + 1)
                    : 1;
                $transferNumber = 'ST-' . str_pad($nextNum, 4, '0', STR_PAD_LEFT);

                // Create transfer record
                $transfer = StockTransfer::create([
                    'business_id'      => $businessId,
                    'transfer_number'  => $transferNumber,
                    'from_location_id' => $request->input('from_location_id'),
                    'to_location_id'   => $request->input('to_location_id'),
                    'transfer_date'    => $request->input('transfer_date', Carbon::today()->toDateString()),
                    'notes'            => $request->input('notes'),
                    'status'           => 'completed',
                    'transferred_by'   => $request->user()->id,
                ]);

                // Process each item
                foreach ($request->input('items') as $itemData) {
                    StockTransferItem::create([
                        'stock_transfer_id' => $transfer->id,
                        'product_id'        => $itemData['product_id'],
                        'quantity'          => $itemData['quantity'],
                        'unit'              => $itemData['unit'] ?? null,
                        'notes'             => $itemData['notes'] ?? null,
                    ]);

                    // Move stock between locations
                    $this->stockService->transfer(
                        $itemData['product_id'],
                        $itemData['quantity'],
                        $request->input('from_location_id'),
                        $request->input('to_location_id'),
                        $transfer->id,
                        "Transfer {$transfer->transfer_number}"
                    );
                }

                return $transfer->load(['fromLocation', 'toLocation', 'transferredBy', 'items.product']);
            });

            return response()->json([
                'status'  => 'success',
                'data'    => $transfer,
                'message' => "Stock transfer {$transfer->transfer_number} completed successfully!",
            ], 201);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 422);
        }
    }

    /**
     * GET /stock-transfers/{id}
     * Full transfer with items, from/to location detail.
     */
    public function show(Request $request, int $id)
    {
        $businessId = app('current_business_id') ?? $request->user()->business_id;
        $transfer = StockTransfer::with(['fromLocation', 'toLocation', 'transferredBy', 'items.product'])
            ->where('business_id', $businessId)
            ->findOrFail($id);

        return response()->json(['status' => 'success', 'data' => $transfer]);
    }

    /**
     * PATCH /stock-transfers/{id}/cancel
     * Cancel a transfer and reverse stock movements.
     */
    public function cancel(Request $request, int $id)
    {
        $businessId = app('current_business_id') ?? $request->user()->business_id;
        $transfer = StockTransfer::where('business_id', $businessId)->findOrFail($id);

        if ($transfer->status === 'cancelled') {
            return response()->json(['status' => 'error', 'message' => 'Transfer already cancelled.'], 422);
        }

        try {
            DB::transaction(function () use ($transfer) {
                foreach ($transfer->items as $item) {
                    // Reverse: add back to source, deduct from destination
                    \App\Models\ProductStockLocation::where('product_id', $item->product_id)
                        ->where('location_id', $transfer->from_location_id)
                        ->increment('quantity', $item->quantity);

                    \App\Models\ProductStockLocation::where('product_id', $item->product_id)
                        ->where('location_id', $transfer->to_location_id)
                        ->decrement('quantity', $item->quantity);

                    // Delete the movement records
                    \App\Models\InventoryMovement::where('reference_type', 'transfer_out')
                        ->where('reference_id', $transfer->id)
                        ->where('product_id', $item->product_id)
                        ->delete();
                    \App\Models\InventoryMovement::where('reference_type', 'transfer_in')
                        ->where('reference_id', $transfer->id)
                        ->where('product_id', $item->product_id)
                        ->delete();
                }

                $transfer->update(['status' => 'cancelled']);
            });

            return response()->json(['status' => 'success', 'message' => 'Transfer cancelled and stock reversed.']);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * GET /stock-transfers/{id}/slip
     * Generate a simple transfer slip (JSON format for frontend printing).
     */
    public function generateSlip(Request $request, int $id)
    {
        $businessId = app('current_business_id') ?? $request->user()->business_id;
        $transfer   = StockTransfer::with(['fromLocation', 'toLocation', 'transferredBy', 'items.product'])
            ->where('business_id', $businessId)
            ->findOrFail($id);

        $business = \App\Models\Business::find($businessId);

        $slipData = [
            'transfer_number' => $transfer->transfer_number,
            'date'            => $transfer->transfer_date?->format('d/m/Y'),
            'from_location'   => $transfer->fromLocation?->name ?? 'N/A',
            'to_location'     => $transfer->toLocation?->name ?? 'N/A',
            'transferred_by'  => $transfer->transferredBy?->name ?? 'N/A',
            'notes'           => $transfer->notes,
            'business_name'   => $business?->name,
            'business_phone'  => $business?->phone,
            'items'           => $transfer->items->map(fn($item) => [
                'name'     => $item->product?->name,
                'item_code'=> $item->product?->item_code,
                'quantity' => $item->quantity,
                'unit'     => $item->unit ?? $item->product?->unit,
            ]),
        ];

        return response()->json(['status' => 'success', 'data' => $slipData]);
    }
}
