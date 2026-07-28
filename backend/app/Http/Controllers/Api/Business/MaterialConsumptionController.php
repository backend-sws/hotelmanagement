<?php

namespace App\Http\Controllers\Api\Business;

use App\Http\Controllers\Controller;
use App\Models\MaterialConsumption;
use App\Models\MaterialConsumptionItem;
use App\Models\Project;
use App\Models\Product;
use App\Services\Business\StockService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class MaterialConsumptionController extends Controller
{
    protected StockService $stockService;

    public function __construct(StockService $stockService)
    {
        $this->stockService = $stockService;
    }

    public function index(Request $request): JsonResponse
    {
        try {
            $business = $request->attributes->get('business') ?? auth()->user()->businesses()->first();
            if (!$business) {
                return response()->json(['message' => 'Business not found'], 404);
            }

            $query = MaterialConsumption::with(['project', 'enteredBy', 'items.product'])
                ->where('business_id', $business->id);

            if ($request->filled('project_id')) {
                $query->where('project_id', $request->project_id);
            }

            if ($request->filled('start_date') && $request->filled('end_date')) {
                $query->whereBetween('date', [$request->start_date, $request->end_date]);
            } elseif ($request->filled('date')) {
                $query->where('date', $request->date);
            }

            $consumptions = $query->orderBy('date', 'desc')->orderBy('id', 'desc')->get();

            $consumptions->transform(function ($consumption) {
                $consumption->total_items_count = $consumption->items->count();
                $consumption->total_cost = $consumption->items->sum('amount');
                return $consumption;
            });

            return response()->json([
                'status' => 'success',
                'data' => $consumptions
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching material consumptions: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to fetch material consumptions', 'error' => $e->getMessage()], 500);
        }
    }

    public function store(Request $request): JsonResponse
    {
        try {
            $business = $request->attributes->get('business') ?? auth()->user()->businesses()->first();
            if (!$business) {
                return response()->json(['message' => 'Business not found'], 404);
            }

            $validated = $request->validate([
                'project_id' => 'required|exists:projects,id',
                'date' => 'required|date',
                'notes' => 'nullable|string',
                'location_id' => 'nullable|exists:business_locations,id',
                'items' => 'required|array|min:1',
                'items.*.product_id' => 'required|exists:products,id',
                'items.*.quantity' => 'required|numeric|gt:0',
                'items.*.unit' => 'nullable|string|max:20',
                'items.*.rate' => 'nullable|numeric|min:0',
                'items.*.notes' => 'nullable|string|max:255',
            ]);

            // Verify project belongs to business
            $project = Project::where('business_id', $business->id)->findOrFail($validated['project_id']);
            $locationId = $validated['location_id'] ?? $project->location_id;

            DB::beginTransaction();

            // Auto-generate MC-001 numbering
            $lastConsumption = MaterialConsumption::where('business_id', $business->id)->orderBy('id', 'desc')->first();
            $nextNum = 1;
            if ($lastConsumption && !empty($lastConsumption->consumption_number)) {
                if (preg_match('/(\d+)$/', $lastConsumption->consumption_number, $matches)) {
                    $nextNum = intval($matches[1]) + 1;
                }
            }
            $consumptionNumber = 'MC-' . str_pad($nextNum, 3, '0', STR_PAD_LEFT);

            $consumption = MaterialConsumption::create([
                'business_id' => $business->id,
                'project_id' => $project->id,
                'consumption_number' => $consumptionNumber,
                'date' => $validated['date'],
                'notes' => $validated['notes'] ?? null,
                'entered_by' => auth()->id(),
            ]);

            foreach ($validated['items'] as $itemData) {
                $product = Product::where('business_id', $business->id)->findOrFail($itemData['product_id']);
                
                // Auto-fill rate from product purchase_rate or selling_price * 0.7 if not provided
                $rate = !empty($itemData['rate']) && $itemData['rate'] > 0 
                    ? floatval($itemData['rate']) 
                    : floatval($product->purchase_rate ?? ($product->selling_price * 0.7));
                
                $qty = floatval($itemData['quantity']);
                $amount = round($qty * $rate, 2);

                MaterialConsumptionItem::create([
                    'consumption_id' => $consumption->id,
                    'product_id' => $product->id,
                    'quantity' => $qty,
                    'unit' => $itemData['unit'] ?? ($product->unit ?? 'Pcs'),
                    'rate' => $rate,
                    'amount' => $amount,
                    'notes' => $itemData['notes'] ?? null,
                ]);

                // Deduct stock via StockService
                $this->stockService->deductStock(
                    $product->id,
                    $qty,
                    'material_consumption',
                    $consumption->id,
                    $locationId,
                    "Material consumed for Project: {$project->name} (#{$consumptionNumber})"
                );
            }

            DB::commit();

            $consumption->load(['project', 'enteredBy', 'items.product']);
            $consumption->total_items_count = $consumption->items->count();
            $consumption->total_cost = $consumption->items->sum('amount');

            return response()->json([
                'status' => 'success',
                'message' => 'Material consumption recorded and stock deducted successfully',
                'data' => $consumption
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error recording material consumption: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to record material consumption: ' . $e->getMessage(),
                'error' => $e->getMessage()
            ], 400);
        }
    }

    public function show(Request $request, $id): JsonResponse
    {
        try {
            $business = $request->attributes->get('business') ?? auth()->user()->businesses()->first();
            $consumption = MaterialConsumption::with(['project.location', 'enteredBy', 'items.product'])
                ->where('business_id', $business->id)
                ->findOrFail($id);

            $consumption->total_items_count = $consumption->items->count();
            $consumption->total_cost = $consumption->items->sum('amount');

            return response()->json([
                'status' => 'success',
                'data' => $consumption
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Material consumption not found', 'error' => $e->getMessage()], 404);
        }
    }

    public function projectConsumptionSummary(Request $request, $projectId): JsonResponse
    {
        try {
            $business = $request->attributes->get('business') ?? auth()->user()->businesses()->first();
            $project = Project::where('business_id', $business->id)->findOrFail($projectId);

            $consumptionIds = MaterialConsumption::where('project_id', $project->id)->pluck('id');

            // Item-wise aggregated summary for the project
            $summary = MaterialConsumptionItem::with('product')
                ->whereIn('consumption_id', $consumptionIds)
                ->select('product_id', 'unit', DB::raw('SUM(quantity) as total_quantity'), DB::raw('SUM(amount) as total_amount'), DB::raw('AVG(rate) as avg_rate'))
                ->groupBy('product_id', 'unit')
                ->get();

            $totalProjectMaterialCost = $summary->sum('total_amount');

            return response()->json([
                'status' => 'success',
                'data' => [
                    'project' => [
                        'id' => $project->id,
                        'name' => $project->name,
                        'project_code' => $project->project_code,
                    ],
                    'items_summary' => $summary,
                    'total_material_cost' => round($totalProjectMaterialCost, 2),
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to fetch project consumption summary', 'error' => $e->getMessage()], 500);
        }
    }

    public function generateSlip(Request $request, $id): JsonResponse
    {
        try {
            $business = $request->attributes->get('business') ?? auth()->user()->businesses()->first();
            $consumption = MaterialConsumption::with(['project', 'enteredBy', 'items.product', 'business'])
                ->where('business_id', $business->id)
                ->findOrFail($id);

            // Return structured data for frontend printing/slip generation
            return response()->json([
                'status' => 'success',
                'data' => [
                    'slip_number' => $consumption->consumption_number,
                    'date' => $consumption->date->format('d/m/Y'),
                    'business' => [
                        'name' => $consumption->business->name,
                        'address' => $consumption->business->address,
                    ],
                    'project' => [
                        'name' => $consumption->project->name,
                        'code' => $consumption->project->project_code,
                        'site_address' => $consumption->project->site_address,
                    ],
                    'items' => $consumption->items->map(function ($item) {
                        return [
                            'item_code' => $item->product->item_code ?? '',
                            'name' => $item->product->name ?? 'Item',
                            'unit' => $item->unit,
                            'quantity' => $item->quantity,
                            'rate' => $item->rate,
                            'amount' => $item->amount,
                            'notes' => $item->notes,
                        ];
                    }),
                    'total_items' => $consumption->items->count(),
                    'total_cost' => $consumption->items->sum('amount'),
                    'issued_by' => $consumption->enteredBy->name ?? 'System',
                    'notes' => $consumption->notes,
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to generate consumption slip', 'error' => $e->getMessage()], 500);
        }
    }
}
