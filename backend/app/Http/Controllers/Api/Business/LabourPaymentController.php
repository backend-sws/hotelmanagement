<?php

namespace App\Http\Controllers\Api\Business;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Expense;
use App\Models\ExpenseCategory;
use App\Models\Project;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class LabourPaymentController extends Controller
{
    public function summary(Request $request): JsonResponse
    {
        try {
            $business = $request->attributes->get('business') ?? auth()->user()->businesses()->first();
            if (!$business) {
                return response()->json(['message' => 'Business not found'], 404);
            }

            // 1. Project-wise labour cost breakdown
            $projects = Project::where('business_id', $business->id)->get();
            $projectSummary = $projects->map(function ($proj) use ($business) {
                $workerDays = Attendance::where('business_id', $business->id)
                    ->where('project_id', $proj->id)
                    ->whereIn('status', ['present', 'half_day'])
                    ->count();

                // Sum expenses linked to this project categorized under labour
                $expenses = Expense::where('business_id', $business->id)
                    ->where('project_id', $proj->id)
                    ->get();

                $labourCost = 0;
                foreach ($expenses as $exp) {
                    $catName = is_string($exp->category) ? strtolower($exp->category) : ($exp->category ? strtolower($exp->category->name ?? '') : '');
                    if (str_contains($catName, 'labour') || str_contains(strtolower($exp->description ?? ''), 'labour')) {
                        $labourCost += $exp->amount;
                    }
                }

                return [
                    'project_id' => $proj->id,
                    'project_name' => $proj->name,
                    'project_code' => $proj->project_code,
                    'worker_days' => $workerDays,
                    'total_labour_cost' => round($labourCost, 2),
                ];
            });

            // 2. Total overall stats
            $totalWorkerDays = Attendance::where('business_id', $business->id)
                ->whereIn('status', ['present', 'half_day'])
                ->count();

            $allExpenses = Expense::where('business_id', $business->id)->get();
            $totalLabourCost = 0;
            foreach ($allExpenses as $exp) {
                $catName = is_string($exp->category) ? strtolower($exp->category) : ($exp->category ? strtolower($exp->category->name ?? '') : '');
                if (str_contains($catName, 'labour') || str_contains(strtolower($exp->description ?? ''), 'labour')) {
                    $totalLabourCost += $exp->amount;
                }
            }

            $avgDailyCost = $totalWorkerDays > 0 ? round($totalLabourCost / $totalWorkerDays, 2) : 0;

            // 3. Recent labour payments (expenses)
            $recentPayments = Expense::with(['addedBy', 'project'])
                ->where('business_id', $business->id)
                ->where(function ($q) {
                    $q->where('category', 'like', '%labour%')
                      ->orWhere('description', 'like', '%labour%');
                })
                ->orderBy('expense_date', 'desc')
                ->take(30)
                ->get();

            return response()->json([
                'status' => 'success',
                'data' => [
                    'total_worker_days' => $totalWorkerDays,
                    'total_labour_cost' => round($totalLabourCost, 2),
                    'avg_daily_cost' => $avgDailyCost,
                    'project_summary' => $projectSummary,
                    'recent_payments' => $recentPayments,
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching labour summary: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to fetch labour summary', 'error' => $e->getMessage()], 500);
        }
    }

    public function projectLabour(Request $request, $projectId): JsonResponse
    {
        try {
            $business = $request->attributes->get('business') ?? auth()->user()->businesses()->first();
            $project = Project::where('business_id', $business->id)->findOrFail($projectId);

            $attendances = Attendance::with('user')
                ->where('business_id', $business->id)
                ->where('project_id', $project->id)
                ->orderBy('date', 'desc')
                ->get();

            $workerDays = $attendances->whereIn('status', ['present', 'half_day'])->count();

            $expenses = Expense::with(['addedBy', 'project'])
                ->where('business_id', $business->id)
                ->where('project_id', $project->id)
                ->get();

            $labourExpenses = [];
            $totalCost = 0;
            foreach ($expenses as $exp) {
                $catName = is_string($exp->category) ? strtolower($exp->category) : ($exp->category ? strtolower($exp->category->name ?? '') : '');
                if (str_contains($catName, 'labour') || str_contains(strtolower($exp->description ?? ''), 'labour')) {
                    $labourExpenses[] = $exp;
                    $totalCost += $exp->amount;
                }
            }

            return response()->json([
                'status' => 'success',
                'data' => [
                    'project' => $project,
                    'total_worker_days' => $workerDays,
                    'total_labour_cost' => round($totalCost, 2),
                    'attendances' => $attendances,
                    'payments' => $labourExpenses,
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to fetch project labour data', 'error' => $e->getMessage()], 500);
        }
    }

    public function recordPayment(Request $request): JsonResponse
    {
        try {
            $business = $request->attributes->get('business') ?? auth()->user()->businesses()->first();
            if (!$business) {
                return response()->json(['message' => 'Business not found'], 404);
            }

            $validated = $request->validate([
                'project_id' => 'nullable|exists:projects,id',
                'worker_name' => 'required|string|max:100',
                'amount' => 'required|numeric|gt:0',
                'date' => 'required|date',
                'payment_mode' => 'nullable|string|max:50',
                'notes' => 'nullable|string',
            ]);

            DB::beginTransaction();

            $projName = '';
            if (!empty($validated['project_id'])) {
                $proj = Project::where('business_id', $business->id)->find($validated['project_id']);
                if ($proj) {
                    $projName = " - Project: {$proj->name}";
                }
            }

            $desc = "Labour Payment: {$validated['worker_name']}{$projName}. " .
                    "Payment Mode: " . ($validated['payment_mode'] ?? 'Cash') . ". " .
                    ($validated['notes'] ?? '');

            $expense = Expense::create([
                'business_id' => $business->id,
                'project_id' => $validated['project_id'] ?? null,
                'category' => 'Labour Charges',
                'amount' => $validated['amount'],
                'description' => trim($desc),
                'added_by' => auth()->id(),
                'expense_date' => $validated['date'],
            ]);

            DB::commit();

            $expense->load(['addedBy', 'project']);

            return response()->json([
                'status' => 'success',
                'message' => 'Labour payment recorded successfully as an expense',
                'data' => $expense
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error recording labour payment: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to record labour payment', 'error' => $e->getMessage()], 500);
        }
    }
}
