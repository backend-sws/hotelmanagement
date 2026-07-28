<?php

namespace App\Http\Controllers\Api\Business;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\BusinessLocation;
use App\Models\Sale;
use App\Models\Expense;
use App\Models\MaterialConsumption;
use App\Models\MaterialConsumptionItem;
use App\Models\Payroll;
use App\Models\Attendance;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ProjectController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        try {
            $business = $request->attributes->get('business') ?? auth()->user()->businesses()->first();
            if (!$business) {
                return response()->json(['message' => 'Business not found'], 404);
            }

            $query = Project::where('business_id', $business->id);

            if ($request->filled('status')) {
                $query->where('status', $request->status);
            }

            if ($request->filled('search')) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('project_code', 'like', "%{$search}%")
                      ->orWhere('client_name', 'like', "%{$search}%")
                      ->orWhere('city', 'like', "%{$search}%");
                });
            }

            $projects = $query->orderBy('id', 'desc')->get();

            // Append summary financial metrics to each project
            $projects->transform(function ($project) {
                $stats = $this->calculateProjectFinancials($project);
                $project->total_invoiced = $stats['total_invoiced'];
                $project->total_received = $stats['total_received'];
                $project->total_cost = $stats['total_cost'];
                $project->net_profit = $stats['net_profit'];
                return $project;
            });

            return response()->json([
                'status' => 'success',
                'data' => $projects
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching projects: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to fetch projects', 'error' => $e->getMessage()], 500);
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
                'client_phone' => 'nullable|string|max:20',
                'site_address' => 'nullable|string',
                'city' => 'nullable|string|max:100',
                'start_date' => 'nullable|date',
                'end_date' => 'nullable|date',
                'contract_value' => 'nullable|numeric|min:0',
                'status' => 'nullable|in:planning,active,on_hold,completed,cancelled',
                'description' => 'nullable|string',
                'notes' => 'nullable|string',
                'create_location' => 'nullable|boolean',
            ]);

            DB::beginTransaction();

            // Auto-generate project code PROJ-001
            $lastProject = Project::where('business_id', $business->id)->orderBy('id', 'desc')->first();
            $nextNum = 1;
            if ($lastProject && !empty($lastProject->project_code)) {
                if (preg_match('/(\d+)$/', $lastProject->project_code, $matches)) {
                    $nextNum = intval($matches[1]) + 1;
                }
            }
            $projectCode = 'PROJ-' . str_pad($nextNum, 3, '0', STR_PAD_LEFT);

            $locationId = null;
            if (!empty($validated['create_location']) && $validated['create_location']) {
                $loc = BusinessLocation::create([
                    'business_id' => $business->id,
                    'name' => 'Site: ' . $validated['name'],
                    'address' => $validated['site_address'] ?? 'Site Godown',
                    'latitude' => 0.00000000,
                    'longitude' => 0.00000000,
                    'radius_meters' => 200,
                    'is_default' => false,
                ]);
                $locationId = $loc->id;
            }

            $project = Project::create([
                'business_id' => $business->id,
                'name' => $validated['name'],
                'project_code' => $projectCode,
                'client_name' => $validated['client_name'] ?? null,
                'client_phone' => $validated['client_phone'] ?? null,
                'site_address' => $validated['site_address'] ?? null,
                'city' => $validated['city'] ?? null,
                'start_date' => $validated['start_date'] ?? null,
                'end_date' => $validated['end_date'] ?? null,
                'contract_value' => $validated['contract_value'] ?? 0,
                'status' => $validated['status'] ?? 'active',
                'description' => $validated['description'] ?? null,
                'notes' => $validated['notes'] ?? null,
                'location_id' => $locationId,
                'created_by' => auth()->id(),
            ]);

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Project created successfully',
                'data' => $project
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error creating project: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to create project', 'error' => $e->getMessage()], 500);
        }
    }

    public function show(Request $request, $id): JsonResponse
    {
        try {
            $business = $request->attributes->get('business') ?? auth()->user()->businesses()->first();
            $project = Project::with(['location', 'creator'])->where('business_id', $business->id)->findOrFail($id);

            $stats = $this->calculateProjectFinancials($project);
            $project->summary = $stats;

            return response()->json([
                'status' => 'success',
                'data' => $project
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Project not found or error occurred', 'error' => $e->getMessage()], 404);
        }
    }

    public function update(Request $request, $id): JsonResponse
    {
        try {
            $business = $request->attributes->get('business') ?? auth()->user()->businesses()->first();
            $project = Project::where('business_id', $business->id)->findOrFail($id);

            $validated = $request->validate([
                'name' => 'sometimes|required|string|max:100',
                'client_name' => 'nullable|string|max:100',
                'client_phone' => 'nullable|string|max:20',
                'site_address' => 'nullable|string',
                'city' => 'nullable|string|max:100',
                'start_date' => 'nullable|date',
                'end_date' => 'nullable|date',
                'contract_value' => 'nullable|numeric|min:0',
                'status' => 'nullable|in:planning,active,on_hold,completed,cancelled',
                'description' => 'nullable|string',
                'notes' => 'nullable|string',
            ]);

            $project->update($validated);

            return response()->json([
                'status' => 'success',
                'message' => 'Project updated successfully',
                'data' => $project
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to update project', 'error' => $e->getMessage()], 500);
        }
    }

    public function destroy(Request $request, $id): JsonResponse
    {
        try {
            $business = $request->attributes->get('business') ?? auth()->user()->businesses()->first();
            $project = Project::where('business_id', $business->id)->findOrFail($id);

            $project->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Project deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to delete project', 'error' => $e->getMessage()], 500);
        }
    }

    public function stats(Request $request, $id): JsonResponse
    {
        try {
            $business = $request->attributes->get('business') ?? auth()->user()->businesses()->first();
            $project = Project::where('business_id', $business->id)->findOrFail($id);

            $stats = $this->calculateProjectFinancials($project);

            return response()->json([
                'status' => 'success',
                'data' => $stats
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to get project stats', 'error' => $e->getMessage()], 500);
        }
    }

    public function invoices(Request $request, $id): JsonResponse
    {
        try {
            $business = $request->attributes->get('business') ?? auth()->user()->businesses()->first();
            $invoices = Sale::with(['customer', 'items'])
                ->where('business_id', $business->id)
                ->where('project_id', $id)
                ->orderBy('date', 'desc')
                ->get();

            return response()->json([
                'status' => 'success',
                'data' => $invoices
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to fetch project invoices', 'error' => $e->getMessage()], 500);
        }
    }

    public function expenses(Request $request, $id): JsonResponse
    {
        try {
            $business = $request->attributes->get('business') ?? auth()->user()->businesses()->first();
            $expenses = Expense::with(['addedBy', 'project'])
                ->where('business_id', $business->id)
                ->where('project_id', $id)
                ->orderBy('expense_date', 'desc')
                ->get();

            return response()->json([
                'status' => 'success',
                'data' => $expenses
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to fetch project expenses', 'error' => $e->getMessage()], 500);
        }
    }

    private function calculateProjectFinancials(Project $project): array
    {
        // 1. Invoiced to client & received
        $invoices = Sale::where('project_id', $project->id)->get();
        $totalInvoiced = $invoices->sum('final_amount');
        $totalReceived = $invoices->sum('paid_amount');

        // 2. Material cost (sum of items in all consumptions of this project)
        $consumptionIds = MaterialConsumption::where('project_id', $project->id)->pluck('id');
        $materialCost = MaterialConsumptionItem::whereIn('consumption_id', $consumptionIds)->sum('amount');

        // 3. Labour cost (payroll + labour expenses)
        $payrollCost = Payroll::where('project_id', $project->id)->sum('final_salary');
        
        // Expenses linked to project
        $expenses = Expense::where('project_id', $project->id)->get();
        
        $labourExpenseCost = 0;
        $otherExpenseCost = 0;
        foreach ($expenses as $exp) {
            $catName = is_string($exp->category) ? strtolower($exp->category) : ($exp->category ? strtolower($exp->category->name ?? '') : '');
            if (str_contains($catName, 'labour') || str_contains(strtolower($exp->description ?? ''), 'labour')) {
                $labourExpenseCost += $exp->amount;
            } else {
                $otherExpenseCost += $exp->amount;
            }
        }

        $totalLabourCost = $payrollCost + $labourExpenseCost;
        $totalCost = $materialCost + $totalLabourCost + $otherExpenseCost;

        // Profit/Loss can be evaluated against Contract Value or against Total Received
        $netProfit = ($project->contract_value > 0 ? $project->contract_value : $totalReceived) - $totalCost;
        $profitMargin = ($project->contract_value > 0) ? ($netProfit / $project->contract_value) * 100 : ($totalReceived > 0 ? ($netProfit / $totalReceived) * 100 : 0);

        return [
            'contract_value' => floatval($project->contract_value),
            'total_invoiced' => floatval($totalInvoiced),
            'total_received' => floatval($totalReceived),
            'material_cost' => floatval($materialCost),
            'labour_cost' => floatval($totalLabourCost),
            'expense_cost' => floatval($otherExpenseCost),
            'total_cost' => floatval($totalCost),
            'net_profit' => floatval($netProfit),
            'profit_margin' => round(floatval($profitMargin), 1),
        ];
    }
}
