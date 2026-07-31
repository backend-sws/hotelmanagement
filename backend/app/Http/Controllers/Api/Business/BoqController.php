<?php

namespace App\Http\Controllers\Api\Business;

use App\Http\Controllers\Controller;
use App\Models\BoqTemplate;
use App\Models\BoqSection;
use App\Models\BoqItem;
use App\Models\Project;
use App\Models\Customer;
use App\Models\Product;
use App\Services\Business\SaleService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Barryvdh\DomPDF\Facade\Pdf;

class BoqController extends Controller
{
    protected SaleService $saleService;

    public function __construct(SaleService $saleService)
    {
        $this->saleService = $saleService;
    }

    public function index(Request $request): JsonResponse
    {
        try {
            $business = $request->attributes->get('business') ?? auth()->user()->businesses()->first();
            if (!$business) {
                return response()->json(['message' => 'Business not found'], 404);
            }

            $query = BoqTemplate::with(['project'])
                ->where('business_id', $business->id);

            if ($request->filled('status')) {
                $query->where('status', $request->status);
            }

            if ($request->filled('project_id')) {
                $query->where('project_id', $request->project_id);
            }

            if ($request->filled('search')) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('client_name', 'like', "%{$search}%")
                      ->orWhere('project_name', 'like', "%{$search}%");
                });
            }

            $boqs = $query->orderBy('id', 'desc')->get();

            return response()->json([
                'status' => 'success',
                'data' => $boqs
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching BOQs: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to fetch BOQs', 'error' => $e->getMessage()], 500);
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
                'name' => 'required|string|max:100',
                'client_name' => 'nullable|string|max:100',
                'project_name' => 'nullable|string|max:100',
                'project_id' => 'nullable|exists:projects,id',
                'validity_date' => 'nullable|date',
                'notes' => 'nullable|string',
                'status' => 'nullable|in:draft,sent,approved,rejected',
                'sections' => 'required|array|min:1',
                'sections.*.section_name' => 'required|string|max:100',
                'sections.*.sort_order' => 'nullable|integer',
                'sections.*.items' => 'required|array|min:1',
                'sections.*.items.*.item_name' => 'required|string|max:200',
                'sections.*.items.*.description' => 'nullable|string',
                'sections.*.items.*.unit' => 'nullable|string|max:20',
                'sections.*.items.*.quantity' => 'required|numeric|min:0.001',
                'sections.*.items.*.rate' => 'required|numeric|min:0',
                'sections.*.items.*.product_id' => 'nullable|exists:products,id',
            ]);

            DB::beginTransaction();

            // Verify project belongs to business if provided
            if (!empty($validated['project_id'])) {
                $proj = Project::where('business_id', $business->id)->findOrFail($validated['project_id']);
                $validated['project_name'] = $proj->name;
                $validated['client_name'] = $validated['client_name'] ?? $proj->client_name;
            }

            $totalBoqAmount = 0;

            $boq = BoqTemplate::create([
                'business_id' => $business->id,
                'project_id' => $validated['project_id'] ?? null,
                'name' => $validated['name'],
                'client_name' => $validated['client_name'] ?? null,
                'project_name' => $validated['project_name'] ?? null,
                'status' => $validated['status'] ?? 'draft',
                'validity_date' => $validated['validity_date'] ?? null,
                'notes' => $validated['notes'] ?? null,
                'total_amount' => 0,
            ]);

            foreach ($validated['sections'] as $secIndex => $sectionData) {
                $section = BoqSection::create([
                    'boq_id' => $boq->id,
                    'section_name' => $sectionData['section_name'],
                    'sort_order' => $sectionData['sort_order'] ?? $secIndex,
                ]);

                foreach ($sectionData['items'] as $itemIndex => $itemData) {
                    $qty = floatval($itemData['quantity']);
                    $rate = floatval($itemData['rate']);
                    $amount = round($qty * $rate, 2);
                    $totalBoqAmount += $amount;

                    BoqItem::create([
                        'boq_section_id' => $section->id,
                        'boq_id' => $boq->id,
                        'item_name' => $itemData['item_name'],
                        'description' => $itemData['description'] ?? null,
                        'unit' => $itemData['unit'] ?? 'nos',
                        'quantity' => $qty,
                        'rate' => $rate,
                        'amount' => $amount,
                        'product_id' => $itemData['product_id'] ?? null,
                        'sort_order' => $itemIndex,
                    ]);
                }
            }

            $boq->update(['total_amount' => $totalBoqAmount]);

            DB::commit();

            $boq->load(['project', 'sections.items']);

            return response()->json([
                'status' => 'success',
                'message' => 'BOQ created successfully',
                'data' => $boq
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error creating BOQ: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to create BOQ: ' . $e->getMessage(), 'error' => $e->getMessage()], 400);
        }
    }

    public function show(Request $request, $id): JsonResponse
    {
        try {
            $business = $request->attributes->get('business') ?? auth()->user()->businesses()->first();
            $boq = BoqTemplate::with(['project', 'sections.items.product'])
                ->where('business_id', $business->id)
                ->findOrFail($id);

            return response()->json([
                'status' => 'success',
                'data' => $boq
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'BOQ not found', 'error' => $e->getMessage()], 404);
        }
    }

    public function update(Request $request, $id): JsonResponse
    {
        try {
            $business = $request->attributes->get('business') ?? auth()->user()->businesses()->first();
            $boq = BoqTemplate::where('business_id', $business->id)->findOrFail($id);

            $validated = $request->validate([
                'name' => 'sometimes|required|string|max:100',
                'client_name' => 'nullable|string|max:100',
                'project_name' => 'nullable|string|max:100',
                'project_id' => 'nullable|exists:projects,id',
                'validity_date' => 'nullable|date',
                'notes' => 'nullable|string',
                'status' => 'nullable|in:draft,sent,approved,rejected',
                'sections' => 'nullable|array|min:1',
            ]);

            DB::beginTransaction();

            $boq->update([
                'name' => $validated['name'] ?? $boq->name,
                'client_name' => $validated['client_name'] ?? $boq->client_name,
                'project_name' => $validated['project_name'] ?? $boq->project_name,
                'project_id' => $validated['project_id'] ?? $boq->project_id,
                'validity_date' => $validated['validity_date'] ?? $boq->validity_date,
                'notes' => $validated['notes'] ?? $boq->notes,
                'status' => $validated['status'] ?? $boq->status,
            ]);

            if (isset($validated['sections'])) {
                // Remove existing sections and items and rebuild
                BoqItem::where('boq_id', $boq->id)->delete();
                BoqSection::where('boq_id', $boq->id)->delete();

                $totalBoqAmount = 0;
                foreach ($validated['sections'] as $secIndex => $sectionData) {
                    $section = BoqSection::create([
                        'boq_id' => $boq->id,
                        'section_name' => $sectionData['section_name'],
                        'sort_order' => $sectionData['sort_order'] ?? $secIndex,
                    ]);

                    if (!empty($sectionData['items'])) {
                        foreach ($sectionData['items'] as $itemIndex => $itemData) {
                            $qty = floatval($itemData['quantity'] ?? 1);
                            $rate = floatval($itemData['rate'] ?? 0);
                            $amount = round($qty * $rate, 2);
                            $totalBoqAmount += $amount;

                            BoqItem::create([
                                'boq_section_id' => $section->id,
                                'boq_id' => $boq->id,
                                'item_name' => $itemData['item_name'],
                                'description' => $itemData['description'] ?? null,
                                'unit' => $itemData['unit'] ?? 'nos',
                                'quantity' => $qty,
                                'rate' => $rate,
                                'amount' => $amount,
                                'product_id' => $itemData['product_id'] ?? null,
                                'sort_order' => $itemIndex,
                            ]);
                        }
                    }
                }
                $boq->update(['total_amount' => $totalBoqAmount]);
            }

            DB::commit();
            $boq->load(['project', 'sections.items']);

            return response()->json([
                'status' => 'success',
                'message' => 'BOQ updated successfully',
                'data' => $boq
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Failed to update BOQ', 'error' => $e->getMessage()], 500);
        }
    }

    public function destroy(Request $request, $id): JsonResponse
    {
        try {
            $business = $request->attributes->get('business') ?? auth()->user()->businesses()->first();
            $boq = BoqTemplate::where('business_id', $business->id)->findOrFail($id);

            $boq->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'BOQ deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to delete BOQ', 'error' => $e->getMessage()], 500);
        }
    }

    public function updateStatus(Request $request, $id): JsonResponse
    {
        try {
            $business = $request->attributes->get('business') ?? auth()->user()->businesses()->first();
            $boq = BoqTemplate::where('business_id', $business->id)->findOrFail($id);

            $validated = $request->validate([
                'status' => 'required|in:draft,sent,approved,rejected',
            ]);

            $boq->update(['status' => $validated['status']]);

            return response()->json([
                'status' => 'success',
                'message' => 'BOQ status updated to ' . $validated['status'],
                'data' => $boq
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to update BOQ status', 'error' => $e->getMessage()], 500);
        }
    }

    public function duplicate(Request $request, $id): JsonResponse
    {
        try {
            $business = $request->attributes->get('business') ?? auth()->user()->businesses()->first();
            $boq = BoqTemplate::with(['sections.items'])->where('business_id', $business->id)->findOrFail($id);

            DB::beginTransaction();

            $newBoq = BoqTemplate::create([
                'business_id' => $business->id,
                'project_id' => $boq->project_id,
                'name' => $boq->name . ' (Copy)',
                'client_name' => $boq->client_name,
                'project_name' => $boq->project_name,
                'status' => 'draft',
                'validity_date' => now()->addDays(30),
                'notes' => $boq->notes,
                'total_amount' => $boq->total_amount,
            ]);

            foreach ($boq->sections as $section) {
                $newSec = BoqSection::create([
                    'boq_id' => $newBoq->id,
                    'section_name' => $section->section_name,
                    'sort_order' => $section->sort_order,
                ]);

                foreach ($section->items as $item) {
                    BoqItem::create([
                        'boq_section_id' => $newSec->id,
                        'boq_id' => $newBoq->id,
                        'item_name' => $item->item_name,
                        'description' => $item->description,
                        'unit' => $item->unit,
                        'quantity' => $item->quantity,
                        'rate' => $item->rate,
                        'amount' => $item->amount,
                        'product_id' => $item->product_id,
                        'sort_order' => $item->sort_order,
                    ]);
                }
            }

            DB::commit();
            $newBoq->load(['project', 'sections.items']);

            return response()->json([
                'status' => 'success',
                'message' => 'BOQ duplicated successfully',
                'data' => $newBoq
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Failed to duplicate BOQ', 'error' => $e->getMessage()], 500);
        }
    }

    public function convertToInvoice(Request $request, $id): JsonResponse
    {
        try {
            $business = $request->attributes->get('business') ?? auth()->user()->businesses()->first();
            $boq = BoqTemplate::with(['sections.items.product'])->where('business_id', $business->id)->findOrFail($id);

            if ($boq->status !== 'approved') {
                // Auto-approve when converting if not already approved
                $boq->update(['status' => 'approved']);
            }

            // Find customer by name or phone if available, or create dummy / leave null
            $customerId = null;
            if (!empty($boq->client_name)) {
                $cust = Customer::where('business_id', $business->id)
                    ->where('name', 'like', trim($boq->client_name))
                    ->first();
                if ($cust) {
                    $customerId = $cust->id;
                }
            }

            // Fetch or create a default category for BOQ items
            $boqCategory = \App\Models\Category::firstOrCreate([
                'business_id' => $business->id,
                'name' => 'BOQ Services'
            ]);

            // Flatten all items across all room sections into invoice items
            $invoiceItems = [];
            foreach ($boq->sections as $section) {
                foreach ($section->items as $item) {
                    // Try to find a matching product or use dummy item
                    $productId = $item->product_id;
                    if (!$productId) {
                        // Look for a service/product named same as item or create a default service product
                        $prod = Product::where('business_id', $business->id)->where('model_name', trim($item->item_name))->first();
                        if ($prod) {
                            $productId = $prod->id;
                        } else {
                            // Create a generic service product for this BOQ item
                            $prod = Product::create([
                                'business_id' => $business->id,
                                'model_name' => $item->item_name . ' (' . $section->section_name . ')',
                                'item_code' => 'BOQ-' . strtoupper(substr(md5(uniqid()), 0, 6)),
                                'category_id' => $boqCategory->id,
                                'selling_price' => $item->rate,
                                'purchase_rate' => $item->rate * 0.7,
                                'quantity' => 1000,
                                'unit' => $item->unit,
                                'track_inventory' => false,
                            ]);
                            $productId = $prod->id;
                        }
                    }

                    $invoiceItems[] = [
                        'product_id' => $productId,
                        'quantity' => floatval($item->quantity),
                        'unit_price' => floatval($item->rate),
                    ];
                }
            }

            if (empty($invoiceItems)) {
                return response()->json(['message' => 'Cannot convert an empty BOQ without any items'], 400);
            }

            $saleData = [
                'customer_id' => $customerId,
                'items' => $invoiceItems,
                'discount' => 0,
                'round_off' => 0,
                'date' => now()->toDateString(),
                'notes' => "Converted from BOQ: {$boq->name} (Client: {$boq->client_name})",
                'status' => 'Draft', // Create as draft invoice so user can review
            ];

            // Set current business id for service
            app()->instance('current_business_id', $business->id);
            $sale = $this->saleService->createSale($saleData);

            // Link sale to project and boq parent
            $sale->update([
                'project_id' => $boq->project_id,
                'parent_id' => $boq->id,
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'BOQ successfully converted to Draft Sales Invoice',
                'data' => [
                    'boq' => $boq,
                    'sale' => $sale,
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Error converting BOQ to Invoice: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to convert BOQ: ' . $e->getMessage(), 'error' => $e->getMessage()], 500);
        }
    }

    public function generatePdf(Request $request, $id)
    {
        try {
            $business = $request->attributes->get('business') ?? auth()->user()->businesses()->first();
            $boq = BoqTemplate::with(['project', 'sections.items', 'business'])->where('business_id', $business->id)->findOrFail($id);

            $pdf = Pdf::loadView('pdfs.boq', compact('boq'))->setOptions([
                'defaultFont' => 'sans-serif',
                'isHtml5ParserEnabled' => true,
                'isRemoteEnabled' => true
            ]);

            return $pdf->download("BOQ-{$boq->id}.pdf");
        } catch (\Exception $e) {
            Log::error('Error generating BOQ PDF: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to generate PDF', 'error' => $e->getMessage()], 500);
        }
    }
}
