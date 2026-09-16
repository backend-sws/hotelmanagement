<?php

namespace App\Http\Controllers\Api\Business;

use App\Http\Controllers\BaseController;
use App\Services\Business\PayrollService;
use App\Models\Payroll;
use App\Models\LeavePolicy;
use App\Models\LeaveRequest;
use App\Models\SalaryAdvance;
use Carbon\Carbon;
use Illuminate\Http\Request;

class PayrollController extends BaseController
{
    public function __construct(private PayrollService $payrollService) {}

    public function index(Request $request)
    {
        try {
            $user = $request->user();
            $filters = $request->all();
            
            // If user is not manager/admin, they can only view their own payroll records
            if (!$user->hasRole(['admin', 'manager', 'Business Admin']) && !$user->hasRole('Superadmin')) {
                $filters['user_id'] = $user->id;
            }

            $payrolls = $this->payrollService->getPayrolls($filters);
            return $this->success($payrolls, 'Payrolls retrieved successfully');
        } catch (\Throwable $e) {
            return $this->error($e->getMessage(), 500);
        }
    }

    public function generate(Request $request)
    {
        $user = $request->user();
        if (!$user->hasRole(['admin', 'manager', 'Business Admin']) && !$user->hasRole('Superadmin')) {
            return $this->forbidden('Unauthorized to generate payroll.');
        }

        $request->validate([
            'month' => 'required|date_format:Y-m',
            'user_id' => 'nullable|integer|exists:users,id',
        ]);

        try {
            if ($request->has('user_id')) {
                $payroll = $this->payrollService->generateForEmployee(
                    $request->input('user_id'),
                    $request->input('month')
                );
                return $this->success($payroll, 'Payroll generated successfully');
            }

            $results = $this->payrollService->generateForAllStaff($request->input('month'));
            return $this->success($results, 'Payrolls generated for all staff');
        } catch (\Throwable $e) {
            return $this->error($e->getMessage(), 422);
        }
    }

    public function show(Request $request, Payroll $payroll)
    {
        try {
            $user = $request->user();
            
            // If not manager/admin, user can only view their own payroll details
            if (!$user->hasRole(['admin', 'manager', 'Business Admin']) && !$user->hasRole('Superadmin')) {
                if ($payroll->user_id !== $user->id) {
                    return $this->forbidden('Unauthorized to view this payroll record.');
                }
            }

            $payroll->load(['user', 'business']);

            $staffPivot = \Illuminate\Support\Facades\DB::table('business_user')
                ->where('business_id', $payroll->business_id)
                ->where('user_id', $payroll->user_id)
                ->first();

            if ($staffPivot && $payroll->user) {
                $payroll->user->designation = $staffPivot->role ?? 'Staff Member';
                $payroll->user->department = $staffPivot->department ?? null;
                $payroll->user->join_date = $staffPivot->join_date ?? null;
            }

            return $this->success($payroll, 'Payroll detail retrieved successfully');
        } catch (\Throwable $e) {
            return $this->error($e->getMessage(), 500);
        }
    }

    public function update(Request $request, Payroll $payroll)
    {
        $user = $request->user();
        if (!$user->hasRole(['admin', 'manager', 'Business Admin']) && !$user->hasRole('Superadmin')) {
            return $this->forbidden('Unauthorized to update payroll.');
        }

        $request->validate([
            'bonus' => 'nullable|numeric|min:0',
            'advance_deduction' => 'nullable|numeric|min:0',
            'notes' => 'nullable|string',
        ]);

        try {
            if ($payroll->status !== 'draft') {
                throw new \Exception('Only draft payrolls can be edited.');
            }

            $bonus = $request->input('bonus', $payroll->bonus);
            $advanceDeduction = $request->input('advance_deduction', $payroll->advance_deduction);
            $finalSalary = $payroll->base_salary - $payroll->deduction + $payroll->total_commission + $bonus - $advanceDeduction;

            $payroll->update([
                'bonus' => $bonus,
                'advance_deduction' => $advanceDeduction,
                'final_salary' => round($finalSalary, 2),
                'notes' => $request->input('notes', $payroll->notes),
            ]);

            return $this->success($payroll->fresh(), 'Payroll updated successfully');
        } catch (\Throwable $e) {
            return $this->error($e->getMessage(), 422);
        }
    }

    public function confirm(Request $request, Payroll $payroll)
    {
        $user = $request->user();
        if (!$user->hasRole(['admin', 'manager', 'Business Admin']) && !$user->hasRole('Superadmin')) {
            return $this->forbidden('Unauthorized to confirm payroll.');
        }

        try {
            $result = $this->payrollService->confirmPayroll($payroll);
            return $this->success($result, 'Payroll confirmed successfully');
        } catch (\Throwable $e) {
            return $this->error($e->getMessage(), 422);
        }
    }

    public function markPaid(Request $request, Payroll $payroll)
    {
        $user = $request->user();
        if (!$user->hasRole(['admin', 'manager', 'Business Admin']) && !$user->hasRole('Superadmin')) {
            return $this->forbidden('Unauthorized to mark payroll as paid.');
        }

        try {
            $result = $this->payrollService->markPaid($payroll, $request->input('paid_date'));
            return $this->success($result, 'Payroll marked as paid');
        } catch (\Throwable $e) {
            return $this->error($e->getMessage(), 422);
        }
    }

    // ── Leave Policies ──

    public function leavePolicies()
    {
        try {
            $policies = LeavePolicy::orderBy('leave_type')->get();
            return $this->success($policies, 'Leave policies retrieved');
        } catch (\Throwable $e) {
            return $this->error($e->getMessage(), 500);
        }
    }

    public function leaveBalances(Request $request)
    {
        try {
            $user = $request->user();
            $targetUserId = $request->input('user_id', $user->id);

            // Non-managers can only view their own balances
            $isManager = $user->hasRole(['admin', 'manager', 'Business Admin', 'Superadmin']);
            if (!$isManager && (int) $targetUserId !== $user->id) {
                $targetUserId = $user->id;
            }

            $year = $request->input('year', date('Y'));
            $startOfYear = Carbon::createFromDate((int) $year, 1, 1)->startOfDay();
            $endOfYear = Carbon::createFromDate((int) $year, 12, 31)->endOfDay();

            $businessId = app('current_business_id');
            $policies = LeavePolicy::where('business_id', $businessId)->get();

            // If no policies defined yet, auto-seed standard enterprise defaults
            if ($policies->isEmpty()) {
                $defaultPolicies = [
                    ['leave_type' => 'Casual Leave (CL)', 'monthly_quota' => 1.0, 'is_paid' => true],
                    ['leave_type' => 'Sick Leave (SL)', 'monthly_quota' => 0.5, 'is_paid' => true],
                    ['leave_type' => 'Paid / Earned Leave (PL)', 'monthly_quota' => 1.5, 'is_paid' => true],
                    ['leave_type' => 'Unpaid Leave (LWP)', 'monthly_quota' => 0.0, 'is_paid' => false],
                ];
                foreach ($defaultPolicies as $dp) {
                    LeavePolicy::create(array_merge($dp, ['business_id' => $businessId]));
                }
                $policies = LeavePolicy::where('business_id', $businessId)->get();
            }

            // Get approved leaves for this user in this year
            $approvedLeaves = LeaveRequest::where('business_id', $businessId)
                ->where('user_id', $targetUserId)
                ->where('request_type', 'leave')
                ->where('status', 'approved')
                ->where(function ($q) use ($startOfYear, $endOfYear) {
                    $q->whereBetween('from_date', [$startOfYear, $endOfYear])
                      ->orWhereBetween('to_date', [$startOfYear, $endOfYear]);
                })
                ->get();

            $pendingCount = LeaveRequest::where('business_id', $businessId)
                ->where('user_id', $targetUserId)
                ->where('status', 'pending')
                ->count();

            $balances = [];
            $totalAllocatedPaid = 0;
            $totalUsedPaid = 0;

            foreach ($policies as $policy) {
                $annualQuota = round((float) $policy->monthly_quota * 12, 1);
                if ($policy->is_paid) {
                    $totalAllocatedPaid += $annualQuota;
                }

                $usedDays = 0;
                foreach ($approvedLeaves as $lr) {
                    $matchesType = (
                        strcasecmp($lr->leave_type, $policy->leave_type) === 0 ||
                        str_contains(strtolower($policy->leave_type), strtolower($lr->leave_type)) ||
                        str_contains(strtolower($lr->leave_type), strtolower($policy->leave_type)) ||
                        (strtolower($lr->leave_category ?? '') === 'sick' && str_contains(strtolower($policy->leave_type), 'sick')) ||
                        (strtolower($lr->leave_category ?? '') === 'casual' && str_contains(strtolower($policy->leave_type), 'casual')) ||
                        (strtolower($lr->leave_category ?? '') === 'earned' && str_contains(strtolower($policy->leave_type), 'earned'))
                    );

                    if ($matchesType) {
                        $from = Carbon::parse($lr->from_date);
                        $to = Carbon::parse($lr->to_date);
                        $usedDays += ($from->diffInDays($to) + 1);
                    }
                }

                if ($policy->is_paid) {
                    $totalUsedPaid += $usedDays;
                }

                $remaining = max(0, $annualQuota - $usedDays);

                $balances[] = [
                    'id' => $policy->id,
                    'leave_type' => $policy->leave_type,
                    'is_paid' => (bool) $policy->is_paid,
                    'monthly_quota' => (float) $policy->monthly_quota,
                    'annual_quota' => $annualQuota,
                    'used_days' => $usedDays,
                    'remaining_days' => $remaining,
                ];
            }

            return $this->success([
                'user_id' => (int) $targetUserId,
                'year' => (int) $year,
                'balances' => $balances,
                'total_allocated_paid' => $totalAllocatedPaid,
                'total_used_paid' => $totalUsedPaid,
                'total_remaining_paid' => max(0, $totalAllocatedPaid - $totalUsedPaid),
                'pending_requests_count' => $pendingCount,
            ], 'Leave balances retrieved successfully');
        } catch (\Throwable $e) {
            return $this->error($e->getMessage(), 500);
        }
    }

    public function storeLeavePolicy(Request $request)
    {
        $user = $request->user();
        if (!$user->hasRole(['admin', 'manager', 'Business Admin']) && !$user->hasRole('Superadmin')) {
            return $this->forbidden('Unauthorized to create leave policies.');
        }

        $request->validate([
            'leave_type' => 'required|string|max:50',
            'monthly_quota' => 'required|numeric|min:0',
            'is_paid' => 'required|boolean',
        ]);

        try {
            $policy = LeavePolicy::create($request->only(['leave_type', 'monthly_quota', 'is_paid']));
            return $this->success($policy, 'Leave policy created', 201);
        } catch (\Throwable $e) {
            return $this->error($e->getMessage(), 422);
        }
    }

    public function updateLeavePolicy(Request $request, LeavePolicy $leavePolicy)
    {
        $user = $request->user();
        if (!$user->hasRole(['admin', 'manager', 'Business Admin']) && !$user->hasRole('Superadmin')) {
            return $this->forbidden('Unauthorized to update leave policies.');
        }

        $request->validate([
            'leave_type' => 'nullable|string|max:50',
            'monthly_quota' => 'nullable|numeric|min:0',
            'is_paid' => 'nullable|boolean',
        ]);

        try {
            $leavePolicy->update($request->only(['leave_type', 'monthly_quota', 'is_paid']));
            return $this->success($leavePolicy->fresh(), 'Leave policy updated');
        } catch (\Throwable $e) {
            return $this->error($e->getMessage(), 422);
        }
    }

    public function deleteLeavePolicy(Request $request, LeavePolicy $leavePolicy)
    {
        $user = $request->user();
        if (!$user->hasRole(['admin', 'manager', 'Business Admin']) && !$user->hasRole('Superadmin')) {
            return $this->forbidden('Unauthorized to delete leave policies.');
        }

        try {
            $leavePolicy->delete();
            return $this->success(null, 'Leave policy deleted');
        } catch (\Throwable $e) {
            return $this->error($e->getMessage(), 500);
        }
    }

    // ── Salary Advances ──

    public function salaryAdvances(Request $request)
    {
        try {
            $query = SalaryAdvance::with('user')->orderByDesc('given_date');

            $user = $request->user();
            $isManager = $user->hasRole(['admin', 'manager', 'Business Admin', 'Superadmin']);
            
            if (!$isManager) {
                $query->where('user_id', $user->id);
            } else if ($request->has('user_id')) {
                $query->where('user_id', $request->input('user_id'));
            }

            if ($request->has('status')) {
                $query->where('status', $request->input('status'));
            }

            return $this->success($query->get(), 'Salary advances retrieved');
        } catch (\Throwable $e) {
            return $this->error($e->getMessage(), 500);
        }
    }

    public function storeSalaryAdvance(Request $request)
    {
        $user = $request->user();
        $isManager = $user->hasRole(['admin', 'manager', 'Business Admin']) || $user->hasRole('Superadmin');

        $request->validate([
            'user_id' => 'required|integer|exists:users,id',
            'amount' => 'required|numeric|min:1',
            'given_date' => 'required|date',
            'deduct_in_month' => 'nullable|date_format:Y-m',
            'notes' => 'nullable|string',
        ]);

        // If not manager, user can only request salary advance for themselves
        if (!$isManager && (int) $request->input('user_id') !== $user->id) {
            return $this->forbidden('Unauthorized to request salary advance for another user.');
        }

        try {
            $data = $request->only([
                'user_id', 'amount', 'given_date', 'deduct_in_month', 'notes'
            ]);
            $data['status'] = 'pending';
            $data['business_id'] = app('current_business_id'); // explicit safety

            if (empty($data['deduct_in_month']) && !empty($data['given_date'])) {
                $data['deduct_in_month'] = date('Y-m', strtotime($data['given_date']));
            }

            $advance = SalaryAdvance::create($data);
            return $this->success($advance, 'Salary advance recorded', 201);
        } catch (\Throwable $e) {
            return $this->error($e->getMessage(), 422);
        }
    }

    public function updateSalaryAdvanceStatus(Request $request, SalaryAdvance $salaryAdvance)
    {
        $user = $request->user();
        if (!$user->hasRole(['admin', 'manager', 'Business Admin']) && !$user->hasRole('Superadmin')) {
            return $this->forbidden('Unauthorized to update salary advance status.');
        }

        $request->validate([
            'status' => 'required|in:approved,rejected'
        ]);

        try {
            $salaryAdvance->update([
                'status' => $request->status,
            ]);
            return $this->success($salaryAdvance->fresh(), 'Salary advance status updated');
        } catch (\Throwable $e) {
            return $this->error($e->getMessage(), 422);
        }
    }
}
