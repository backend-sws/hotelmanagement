<?php

namespace App\Services\Business;

use App\Models\Attendance;
use App\Models\BusinessHoliday;
use App\Models\BusinessWorkSetting;
use App\Models\LeaveRequest;
use App\Models\Payroll;
use App\Models\SaleCommission;
use App\Models\SalaryAdvance;
use App\Models\LeavePolicy;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class PayrollService
{
    /**
     * Generate payroll for a specific employee and month.
     * Supports both 'monthly' and 'daily' salary types.
     */
    public function generateForEmployee(int $userId, string $month): Payroll
    {
        $businessId = app('current_business_id');

        // Normalize month format to YYYY-MM
        $month = Carbon::createFromFormat('Y-m', $month)->format('Y-m');

        return DB::transaction(function () use ($userId, $month, $businessId) {

            // Check if payroll already exists (lock row to prevent race condition)
            $existing = Payroll::where('user_id', $userId)
                ->where('month', $month)
                ->lockForUpdate()
                ->first();

            if ($existing && $existing->status !== 'draft') {
                throw new \Exception('Payroll for this month is already confirmed/paid.');
            }

            // Get staff details from pivot
            $staffData = DB::table('business_user')
                ->where('business_id', $businessId)
                ->where('user_id', $userId)
                ->first();

            if (!$staffData) {
                throw new \Exception('Staff member not found.');
            }

            $salaryType = $staffData->salary_type ?? 'monthly';

            // Parse month to get date range
            $startOfMonth = Carbon::createFromFormat('Y-m', $month)->startOfMonth();
            $endOfMonth = $startOfMonth->copy()->endOfMonth();
            $totalDaysInMonth = $endOfMonth->day;

            // Effective end date: min(today, end_of_month) — prevents future days from being counted as absent
            $today = Carbon::today();
            $effectiveEndDate = $today->lessThan($endOfMonth) && $today->greaterThanOrEqualTo($startOfMonth)
                ? $today
                : $endOfMonth;

            // Get attendance records for the month
            $attendances = Attendance::where('user_id', $userId)
                ->whereBetween('date', [$startOfMonth, $endOfMonth])
                ->get();

            $presentDays = $attendances->where('status', 'present')->count();
            $absentDays = $attendances->where('status', 'absent')->count();
            $halfDays = $attendances->where('status', 'half_day')->count();
            $leaveDays = $attendances->where('status', 'leave')->count();
            $weekOffs = $attendances->where('status', 'week_off')->count();
            
            // Holidays: combine records in attendance table + defined in BusinessHoliday table
            $definedHolidays = BusinessHoliday::where('business_id', $businessId)
                ->whereBetween('date', [$startOfMonth, $endOfMonth])
                ->count();
            $holidays = max($attendances->where('status', 'holiday')->count(), $definedHolidays);

            // Calculate paid leaves with admin override support
            $approvedLeaveRequests = LeaveRequest::where('business_id', $businessId)
                ->where('user_id', $userId)
                ->where('request_type', 'leave')
                ->where('status', 'approved')
                ->where(function ($q) use ($startOfMonth, $endOfMonth) {
                    $q->whereBetween('from_date', [$startOfMonth, $endOfMonth])
                      ->orWhereBetween('to_date', [$startOfMonth, $endOfMonth]);
                })
                ->get();

            $forcedPaid = 0;
            $forcedUnpaid = 0;
            foreach ($approvedLeaveRequests as $lr) {
                // Calculate working days strictly excluding Sundays & holidays within this month
                $days = method_exists($lr, 'calculateNetWorkingDays')
                    ? $lr->calculateNetWorkingDays($startOfMonth, $endOfMonth)
                    : (Carbon::parse($lr->from_date)->diffInDays(Carbon::parse($lr->to_date)) + 1);

                if ($lr->admin_override_category === 'paid') {
                    $forcedPaid += $days;
                } elseif ($lr->admin_override_category === 'unpaid') {
                    $forcedUnpaid += $days;
                }
            }

            // Calculate paid leaves quota — explicitly scoped to this business
            $paidLeaveQuota = LeavePolicy::withoutGlobalScopes()
                ->where('business_id', $businessId)
                ->where('is_paid', true)
                ->sum('monthly_quota');
            $remainingLeaveDays = max(0, $leaveDays - $forcedPaid - $forcedUnpaid);
            $quotaPaid = min($remainingLeaveDays, (int) $paidLeaveQuota);
            $paidLeaves = min($leaveDays, $forcedPaid + $quotaPaid);
            $unpaidLeaves = max(0, $leaveDays - $paidLeaves);

            // Commission for this month (use sale relationship date for accuracy)
            $totalCommission = SaleCommission::where('user_id', $userId)
                ->where(function ($q) use ($startOfMonth, $endOfMonth) {
                    $q->whereHas('sale', function ($sq) use ($startOfMonth, $endOfMonth) {
                        $sq->whereBetween('created_at', [$startOfMonth, $endOfMonth->endOfDay()]);
                    })->orWhereBetween('created_at', [$startOfMonth, $endOfMonth->endOfDay()]);
                })
                ->sum('commission_amount');

            // Advance deductions
            $advanceDeduction = SalaryAdvance::where('user_id', $userId)
                ->where('deduct_in_month', $month)
                ->where('is_deducted', false)
                ->where('status', 'approved')
                ->sum('amount');

            // ── OVERTIME HOURS & CALCULATION ─────────────────────────────────
            $workSetting = BusinessWorkSetting::where('business_id', $businessId)->first();
            $enableOvertime = (bool) ($workSetting->enable_overtime ?? false);
            $otRateType = $workSetting->overtime_rate_type ?? 'fixed_rate';
            $otHourlyRate = (float) ($workSetting->overtime_hourly_rate ?? 0);
            $otMultiplier = (float) ($workSetting->overtime_multiplier ?? 1.5);
            $otRequireApproval = (bool) ($workSetting->overtime_require_approval ?? true);

            $staffOtEligible = !isset($staffData->overtime_eligible) || (bool) $staffData->overtime_eligible;
            $customOtRate = (isset($staffData->custom_overtime_rate) && $staffData->custom_overtime_rate !== null) ? (float) $staffData->custom_overtime_rate : null;

            $totalOvertimeHours = 0.0;
            if ($enableOvertime && $staffOtEligible) {
                $otRecords = $attendances->filter(function ($att) use ($otRequireApproval) {
                    if (!$att->overtime_hours || $att->overtime_hours <= 0) return false;
                    return $otRequireApproval ? (bool) $att->overtime_approved : true;
                });
                $totalOvertimeHours = round($otRecords->sum('overtime_hours'), 2);
            }

            // ── DAILY SALARY TYPE ──────────────────────────────────────────
            if ($salaryType === 'daily') {
                $dailyRate = (float) ($staffData->daily_salary ?? 0);

                // Daily staff gets paid only for present days (+ half_day as 0.5 + paid_leaves)
                $effectivePresent = $presentDays + ($halfDays * 0.5) + $paidLeaves;
                $baseSalary = round($effectivePresent * $dailyRate, 2);
                $perDaySalary = $dailyRate;
                $deduction = 0; // No LOP deduction for daily — they simply don't get paid for absent days

                // Working days for reference (total days minus week_offs and holidays)
                $workingDays = $totalDaysInMonth - $weekOffs - $holidays;
                if ($workingDays <= 0)
                    $workingDays = $totalDaysInMonth;

                // Overtime pay calculation for daily staff
                $totalOvertimeAmount = 0.0;
                if ($totalOvertimeHours > 0) {
                    if ($customOtRate !== null && $customOtRate > 0) {
                        $dailyOtRate = $customOtRate;
                    } elseif ($otRateType === 'fixed_rate') {
                        $dailyOtRate = $otHourlyRate;
                    } else {
                        $stdHours = (float) ($staffData->custom_standard_hours ?? $workSetting->standard_hours_per_day ?? 9.0);
                        $baseHourly = $stdHours > 0 ? ($dailyRate / $stdHours) : ($dailyRate / 9.0);
                        $dailyOtRate = round($baseHourly * $otMultiplier, 2);
                    }
                    $totalOvertimeAmount = round($totalOvertimeHours * $dailyOtRate, 2);
                }

                $finalSalary = $baseSalary + (float) $totalCommission + $totalOvertimeAmount - (float) $advanceDeduction;

                $payrollData = [
                    'business_id' => $businessId,
                    'user_id' => $userId,
                    'month' => $month,
                    'total_days' => $totalDaysInMonth,
                    'present_days' => $presentDays,
                    'absent_days' => $absentDays,
                    'half_days' => $halfDays,
                    'paid_leaves' => $paidLeaves,
                    'unpaid_leaves' => $unpaidLeaves,
                    'week_offs' => $weekOffs,
                    'holidays' => $holidays,
                    'base_salary' => $baseSalary,
                    'per_day_salary' => round($perDaySalary, 2),
                    'deduction' => 0,
                    'total_commission' => (float) $totalCommission,
                    'total_overtime_hours' => $totalOvertimeHours,
                    'total_overtime_amount' => $totalOvertimeAmount,
                    'bonus' => $existing ? $existing->bonus : 0,
                    'advance_deduction' => (float) $advanceDeduction,
                    'salary_components' => json_encode([]),
                    'salary_type' => 'daily',
                    'final_salary' => round($finalSalary, 2),
                    'status' => 'draft',
                ];

                if ($existing) {
                    $payrollData['bonus'] = $existing->bonus;
                    $payrollData['final_salary'] = round($finalSalary + $existing->bonus, 2);
                    $existing->update($payrollData);
                    return $existing->fresh();
                }

                return Payroll::create($payrollData);
            }

            // ── MONTHLY SALARY TYPE ────────────────────────────────────────
            $components = $staffData->salary_components
                ? json_decode($staffData->salary_components, true)
                : [];

            $totalEarnings = 0;
            $totalComponentDeductions = 0;

            if (is_array($components)) {
                foreach ($components as $comp) {
                    if (is_array($comp) && isset($comp['type']) && isset($comp['amount'])) {
                        if ($comp['type'] === 'earning') {
                            $totalEarnings += (float) $comp['amount'];
                        } else if ($comp['type'] === 'deduction') {
                            $totalComponentDeductions += (float) $comp['amount'];
                        }
                    }
                }
            }

            // If no components array format found, fallback to monthly_salary
            if ($totalEarnings === 0 && $staffData->monthly_salary > 0) {
                $totalEarnings = (float) $staffData->monthly_salary;
            }

            $baseSalary = $totalEarnings - $totalComponentDeductions;

            // Working days = total days in month - week_offs - holidays
            $workingDays = $totalDaysInMonth - $weekOffs - $holidays;
            if ($workingDays <= 0)
                $workingDays = $totalDaysInMonth;

            $perDaySalary = $baseSalary / $workingDays;

            // Effective attendance = present + (half_days × 0.5) + paid_leaves
            $effectivePresent = $presentDays + ($halfDays * 0.5) + $paidLeaves;

            // ── Mid-month fix ──
            // Only count elapsed working days for deduction (don't count future days as absent)
            $elapsedDays = $effectiveEndDate->day;
            // Count week_offs and holidays that have actually passed (from attendance records up to effective end date)
            $elapsedAttendances = $attendances->filter(function ($a) use ($effectiveEndDate) {
                return Carbon::parse($a->date)->lessThanOrEqualTo($effectiveEndDate);
            });
            $elapsedWeekOffs = $elapsedAttendances->where('status', 'week_off')->count();
            $elapsedDefinedHolidays = BusinessHoliday::where('business_id', $businessId)
                ->whereBetween('date', [$startOfMonth, $effectiveEndDate])
                ->count();
            $elapsedHolidays = max($elapsedAttendances->where('status', 'holiday')->count(), $elapsedDefinedHolidays);
            $elapsedWorkingDays = $elapsedDays - $elapsedWeekOffs - $elapsedHolidays;
            if ($elapsedWorkingDays <= 0) $elapsedWorkingDays = $elapsedDays;

            // Deduction based only on elapsed working days (not full month)
            $unpaidAbsences = max(0, $elapsedWorkingDays - $effectivePresent);
            
            // Dynamic Absence Penalty Rule: Apply penalty multiplier for unapproved/voluntary absences
            $absencePenaltyMultiplier = 1.0;
            if ($workSetting && ($workSetting->enable_absence_penalty ?? true)) {
                $absencePenaltyMultiplier = (float) ($workSetting->absence_penalty_multiplier ?? 2.0);
            }
            $absenceDeduction = $unpaidAbsences * ($perDaySalary * $absencePenaltyMultiplier);

            // Dynamic Late Arrivals Deduction Rule: Every N late days triggers a salary cut (after free grace passes)
            $lateDeductionAmount = 0.0;
            if ($workSetting && ($workSetting->enable_late_deduction ?? true)) {
                $monthlyLates = $attendances->filter(function ($a) {
                    return $a->status === 'late' 
                        || ($a->late_mark_minutes && $a->late_mark_minutes > 0)
                        || ($a->notes && stripos($a->notes, 'late entry') !== false);
                })->count();

                $freeWaiver = (int) ($workSetting->late_free_waiver_count ?? 2);
                $triggerCount = max(1, (int) ($workSetting->late_deduction_trigger_count ?? 4));
                $cutAmountDays = (float) ($workSetting->late_deduction_amount_type ?? 1.0);

                if ($monthlyLates > $freeWaiver) {
                    $chargeableLates = $monthlyLates - $freeWaiver;
                    $cutCycles = (int) floor($chargeableLates / $triggerCount);
                    $lateCutDays = $cutCycles * $cutAmountDays;
                    $lateDeductionAmount = $lateCutDays * $perDaySalary;
                }
            }

            $deduction = $absenceDeduction + $lateDeductionAmount;

            // Overtime pay calculation for monthly staff
            $totalOvertimeAmount = 0.0;
            if ($totalOvertimeHours > 0) {
                if ($customOtRate !== null && $customOtRate > 0) {
                    $monthlyOtRate = $customOtRate;
                } elseif ($otRateType === 'fixed_rate') {
                    $monthlyOtRate = $otHourlyRate;
                } else {
                    $stdHours = (float) ($staffData->custom_standard_hours ?? $workSetting->standard_hours_per_day ?? 9.0);
                    $baseHourly = $stdHours > 0 ? ($perDaySalary / $stdHours) : ($perDaySalary / 9.0);
                    $monthlyOtRate = round($baseHourly * $otMultiplier, 2);
                }
                $totalOvertimeAmount = round($totalOvertimeHours * $monthlyOtRate, 2);
            }

            // Final salary
            $finalSalary = $baseSalary - $deduction + (float) $totalCommission + $totalOvertimeAmount - (float) $advanceDeduction;

            $payrollData = [
                'business_id' => $businessId,
                'user_id' => $userId,
                'month' => $month,
                'total_days' => $totalDaysInMonth,
                'present_days' => $presentDays,
                'absent_days' => $absentDays,
                'half_days' => $halfDays,
                'paid_leaves' => $paidLeaves,
                'unpaid_leaves' => $unpaidLeaves,
                'week_offs' => $weekOffs,
                'holidays' => $holidays,
                'base_salary' => $baseSalary,
                'per_day_salary' => round($perDaySalary, 2),
                'deduction' => round($deduction, 2),
                'total_commission' => (float) $totalCommission,
                'total_overtime_hours' => $totalOvertimeHours,
                'total_overtime_amount' => $totalOvertimeAmount,
                'bonus' => $existing ? $existing->bonus : 0,
                'advance_deduction' => (float) $advanceDeduction,
                'salary_components' => json_encode($components),
                'salary_type' => 'monthly',
                'final_salary' => round($finalSalary, 2),
                'status' => 'draft',
            ];

            if ($existing) {
                // Preserve manual bonus
                $payrollData['bonus'] = $existing->bonus;
                $payrollData['final_salary'] = round($finalSalary + $existing->bonus, 2);
                $existing->update($payrollData);
                return $existing->fresh();
            }

            return Payroll::create($payrollData);

        }); // end DB::transaction
    }

    /**
     * Generate payroll for all active staff for a month.
     */
    public function generateForAllStaff(string $month): array
    {
        $businessId = app('current_business_id');

        $staff = DB::table('business_user')
            ->where('business_id', $businessId)
            ->where('status', 'active')
            ->pluck('user_id');

        $results = [];
        foreach ($staff as $userId) {
            try {
                $results[] = $this->generateForEmployee($userId, $month);
            } catch (\Exception $e) {
                $results[] = ['user_id' => $userId, 'error' => $e->getMessage()];
            }
        }

        return $results;
    }

    /**
     * Confirm a payroll record.
     */
    public function confirmPayroll(Payroll $payroll): Payroll
    {
        if ($payroll->status !== 'draft') {
            throw new \Exception('Only draft payrolls can be confirmed.');
        }

        $payroll->update(['status' => 'confirmed']);

        // Mark salary advances as deducted
        SalaryAdvance::where('user_id', $payroll->user_id)
            ->where('deduct_in_month', $payroll->month)
            ->where('is_deducted', false)
            ->update(['is_deducted' => true]);

        return $payroll->fresh();
    }

    /**
     * Mark payroll as paid.
     */
    public function markPaid(Payroll $payroll, ?string $paidDate = null): Payroll
    {
        if ($payroll->status === 'paid') {
            throw new \Exception('This payroll is already marked as paid.');
        }

        $payroll->update([
            'status' => 'paid',
            'paid_date' => $paidDate ?? now()->toDateString(),
        ]);

        return $payroll->fresh();
    }

    /**
     * Get payrolls for listing.
     */
    public function getPayrolls(array $filters = [])
    {
        $query = Payroll::with('user')->orderByDesc('month');

        if (!empty($filters['month'])) {
            $query->where('month', $filters['month']);
        }

        if (!empty($filters['user_id'])) {
            $query->where('user_id', $filters['user_id']);
        }

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        return $query->paginate($filters['per_page'] ?? 15);
    }
}
