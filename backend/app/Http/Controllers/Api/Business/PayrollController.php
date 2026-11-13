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
            'base_salary' => 'nullable|numeric|min:0',
            'bonus' => 'nullable|numeric|min:0',
            'advance_deduction' => 'nullable|numeric|min:0',
            'total_overtime_amount' => 'nullable|numeric|min:0',
            'total_overtime_hours' => 'nullable|numeric|min:0',
            'notes' => 'nullable|string',
        ]);

        try {
            if ($payroll->status !== 'draft') {
                throw new \Exception('Only draft payrolls can be edited.');
            }

            $baseSalary = $request->has('base_salary') ? (float) $request->input('base_salary') : (float) $payroll->base_salary;
            $bonus = (float) $request->input('bonus', $payroll->bonus);
            $advanceDeduction = (float) $request->input('advance_deduction', $payroll->advance_deduction);
            $otAmount = (float) $request->input('total_overtime_amount', $payroll->total_overtime_amount ?? 0);
            $otHours = (float) $request->input('total_overtime_hours', $payroll->total_overtime_hours ?? 0);

            $perDaySalary = (float) $payroll->per_day_salary;
            $deduction = (float) $payroll->deduction;
            $absenceDeductions = (float) ($payroll->absence_deductions ?? 0);
            $lateDeductions = (float) ($payroll->late_deductions ?? 0);

            if ($request->has('base_salary')) {
                $totalDays = $payroll->total_days > 0 ? $payroll->total_days : 30;
                $perDaySalary = round($baseSalary / $totalDays, 2);

                if ($payroll->salary_type !== 'daily') {
                    $lateCutDays = (float) ($payroll->late_cut_days ?? 0);
                    $lateDeductions = round($lateCutDays * $perDaySalary, 2);

                    $effectivePresent = (float) $payroll->present_days + ((float) $payroll->half_days * 0.5) + (float) $payroll->paid_leaves;
                    $workingDays = max(1, (int) ($payroll->working_days ?: ($payroll->total_days - ($payroll->week_offs ?? 0) - ($payroll->holidays ?? 0))));
                    $unpaidAbsences = max(0.0, (float) ($workingDays - $effectivePresent));
                    $halfDayPortion = min($unpaidAbsences, (float) ($payroll->half_days * 0.5));
                    $fullAbsentDays = max(0.0, round($unpaidAbsences - $halfDayPortion, 2));

                    $setting = \App\Models\BusinessWorkSetting::withoutGlobalScopes()->where('business_id', $payroll->business_id)->first();
                    $absencePenaltyMultiplier = ($setting && ($setting->enable_absence_penalty ?? true))
                        ? (float) ($setting->absence_penalty_multiplier ?? 2.0)
                        : 1.0;

                    $halfDayDeduction = round($halfDayPortion * $perDaySalary, 2);
                    $fullAbsentDeduction = round($fullAbsentDays * ($perDaySalary * $absencePenaltyMultiplier), 2);
                    $absenceDeductions = round($halfDayDeduction + $fullAbsentDeduction, 2);
                    $deduction = round($absenceDeductions + $lateDeductions, 2);
                }
            }

            $finalSalary = $baseSalary - $deduction + (float) $payroll->total_commission + $otAmount + $bonus - $advanceDeduction;

            $updatedBreakdown = [];
            $components = is_array($payroll->salary_components) ? $payroll->salary_components : json_decode($payroll->salary_components ?? '[]', true);
            if (is_array($components)) {
                foreach ($components as $comp) {
                    if (is_array($comp) && ($comp['type'] ?? '') === 'deduction' && (float)($comp['amount'] ?? 0) > 0) {
                        $updatedBreakdown[] = [
                            'type'   => 'component',
                            'name'   => $comp['name'] ?? 'Salary Component',
                            'reason' => ($comp['name'] ?? 'Component') . ' deduction as per salary structure',
                            'amount' => round((float) $comp['amount'], 2),
                        ];
                    }
                }
            }

            if ($absenceDeductions > 0) {
                if (isset($fullAbsentDays) && $fullAbsentDays > 0) {
                    $multiplierText = ($absencePenaltyMultiplier ?? 1.0) > 1.0 ? " (" . ($absencePenaltyMultiplier ?? 2.0) . "x voluntary absence penalty)" : "";
                    $updatedBreakdown[] = [
                        'type'   => 'unapproved_absence',
                        'name'   => 'Unapproved Absence Penalty',
                        'reason' => "{$fullAbsentDays} unauthorized absent " . ($fullAbsentDays > 1 ? 'days' : 'day') . $multiplierText,
                        'days'   => $fullAbsentDays,
                        'rate'   => round($perDaySalary * ($absencePenaltyMultiplier ?? 1.0), 2),
                        'amount' => $fullAbsentDeduction ?? round($fullAbsentDays * $perDaySalary, 2),
                    ];
                }
                if (isset($halfDayPortion) && $halfDayPortion > 0) {
                    $updatedBreakdown[] = [
                        'type'   => 'half_day',
                        'name'   => 'Half Day Absence',
                        'reason' => ($payroll->half_days ?? 0) . " half " . (($payroll->half_days ?? 0) > 1 ? 'days' : 'day') . " worked (0.5 day wage cut)",
                        'days'   => $halfDayPortion,
                        'rate'   => round($perDaySalary, 2),
                        'amount' => $halfDayDeduction ?? round($halfDayPortion * $perDaySalary, 2),
                    ];
                }
                if (empty($updatedBreakdown) || (!isset($fullAbsentDays) && !isset($halfDayPortion))) {
                    $updatedBreakdown[] = [
                        'type'   => 'unapproved_absence',
                        'name'   => 'Absence Deductions (Loss of Pay)',
                        'reason' => 'Unapproved voluntary absences & unpaid leaves',
                        'amount' => round($absenceDeductions, 2),
                    ];
                }
            }

            if ($lateDeductions > 0) {
                $lateCutDays = (float) ($payroll->late_cut_days ?? 0);
                $lateCount = (int) ($payroll->late_count ?? 0);
                $updatedBreakdown[] = [
                    'type'   => 'late_arrival',
                    'name'   => 'Late Arrival Penalty',
                    'reason' => "{$lateCount} late arrivals recorded ({$lateCutDays}d salary cut)",
                    'days'   => $lateCutDays,
                    'rate'   => round($perDaySalary, 2),
                    'amount' => round($lateDeductions, 2),
                ];
            }

            if ($advanceDeduction > 0) {
                $updatedBreakdown[] = [
                    'type'   => 'advance',
                    'name'   => 'Salary Advance Recovered',
                    'reason' => 'Advance salary installment recovered for ' . \Carbon\Carbon::parse($payroll->month . '-01')->format('M Y'),
                    'amount' => round((float) $advanceDeduction, 2),
                ];
            }

            $payroll->update([
                'base_salary' => $baseSalary,
                'per_day_salary' => $perDaySalary,
                'deduction' => $deduction,
                'absence_deductions' => $absenceDeductions,
                'late_deductions' => $lateDeductions,
                'bonus' => $bonus,
                'advance_deduction' => $advanceDeduction,
                'total_overtime_amount' => $otAmount,
                'total_overtime_hours' => $otHours,
                'deductions_breakdown' => $updatedBreakdown,
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
