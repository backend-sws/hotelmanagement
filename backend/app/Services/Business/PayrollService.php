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

            // Fetch work settings for this business
            $workSetting = BusinessWorkSetting::withoutGlobalScopes()->where('business_id', $businessId)->first();
            $workDaysConfig = $workSetting ? $workSetting->getWorkDaysArray() : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

            // Effective end date: min(today, end_of_month) — prevents future days from being counted as absent
            $today = Carbon::today();
            $effectiveEndDate = ($today->lessThan($endOfMonth) && $today->greaterThanOrEqualTo($startOfMonth))
                ? $today
                : $endOfMonth;

            // ── 1. CALENDAR WEEK-OFFS & HOLIDAYS DERIVATION ─────────────────
            // Auto-calculate week-offs from the calendar matching configured non-working days (e.g. Sundays)
            $calendarWeekOffDates = [];
            $cur = $startOfMonth->copy();
            while ($cur->lessThanOrEqualTo($endOfMonth)) {
                $dayAbbr = $cur->format('D'); // Mon, Tue, etc.
                if (!in_array($dayAbbr, $workDaysConfig)) {
                    $calendarWeekOffDates[] = $cur->toDateString();
                }
                $cur->addDay();
            }
            $totalCalendarWeekOffs = count($calendarWeekOffDates);

            // Fetch attendance records for this month scoped to this business
            $attendances = Attendance::withoutGlobalScopes()
                ->where('business_id', $businessId)
                ->where('user_id', $userId)
                ->whereBetween('date', [$startOfMonth->toDateString(), $endOfMonth->toDateString()])
                ->get();

            // Week-offs: max of recorded attendance week_off or calendar week_offs
            $recordedWeekOffs = $attendances->where('status', 'week_off')->count();
            $weekOffs = max($recordedWeekOffs, $totalCalendarWeekOffs);

            // Holidays: combine records in attendance table + defined in BusinessHoliday table
            // Exclude holidays falling on already-accounted week-offs to prevent double counting
            $holidayRecords = BusinessHoliday::withoutGlobalScopes()
                ->where('business_id', $businessId)
                ->whereBetween('date', [$startOfMonth->toDateString(), $endOfMonth->toDateString()])
                ->get();

            $nonWeekOffHolidayCount = 0;
            foreach ($holidayRecords as $h) {
                $hDate = Carbon::parse($h->date)->toDateString();
                if (!in_array($hDate, $calendarWeekOffDates)) {
                    $nonWeekOffHolidayCount++;
                }
            }
            $recordedHolidays = $attendances->where('status', 'holiday')->count();
            $holidays = max($recordedHolidays, $nonWeekOffHolidayCount);

            // Standard Working Days in the Month
            $workingDays = max(1, $totalDaysInMonth - $weekOffs - $holidays);

            // ── 2. ATTENDANCE METRICS ───────────────────────────────────────
            // Critical: count 'late' as Present (staff arrived and worked, late penalty is applied via Rule 1)
            $presentDays = $attendances->whereIn('status', ['present', 'late'])->count();
            $absentDays = $attendances->where('status', 'absent')->count();
            $halfDays = $attendances->where('status', 'half_day')->count();
            $leaveDays = $attendances->where('status', 'leave')->count();

            // Total late punch entries this month
            $lateAttendances = $attendances->filter(function ($a) {
                return $a->status === 'late'
                    || ($a->late_mark_minutes && $a->late_mark_minutes > 0)
                    || ($a->notes && stripos($a->notes, 'late entry') !== false);
            });
            $lateCount = $lateAttendances->count();

            // Calculate paid leaves with admin override support
            $approvedLeaveRequests = LeaveRequest::withoutGlobalScopes()
                ->where('business_id', $businessId)
                ->where('user_id', $userId)
                ->where('request_type', 'leave')
                ->where('status', 'approved')
                ->where(function ($q) use ($startOfMonth, $endOfMonth) {
                    $q->whereBetween('from_date', [$startOfMonth->toDateString(), $endOfMonth->toDateString()])
                      ->orWhereBetween('to_date', [$startOfMonth->toDateString(), $endOfMonth->toDateString()]);
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

            // Commission for this month
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

            // ── 3. OVERTIME HOURS & CALCULATION ──────────────────────────────
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

            // ── 4. DAILY SALARY TYPE ─────────────────────────────────────────
            if ($salaryType === 'daily') {
                $dailyRate = (float) ($staffData->daily_salary ?? 0);

                // Daily staff gets paid only for present days (+ half_day as 0.5 + paid_leaves)
                $effectivePresent = $presentDays + ($halfDays * 0.5) + $paidLeaves;
                $baseSalary = round($effectivePresent * $dailyRate, 2);
                $perDaySalary = $dailyRate;

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

                // Late penalty for daily staff if rule enabled
                $lateCutDays = 0.0;
                $lateDeductionAmount = 0.0;
                if ($workSetting && ($workSetting->enable_late_deduction ?? true)) {
                    $freeWaiver = (int) ($workSetting->late_free_waiver_count ?? 2);
                    $triggerCount = max(1, (int) ($workSetting->late_deduction_trigger_count ?? 4));
                    $cutAmountDays = (float) ($workSetting->late_deduction_amount_type ?? 1.0);

                    if ($lateCount > $freeWaiver) {
                        $chargeableLates = $lateCount - $freeWaiver;
                        $cutCycles = (int) floor($chargeableLates / $triggerCount);
                        $lateCutDays = round($cutCycles * $cutAmountDays, 2);
                        $lateDeductionAmount = round($lateCutDays * $perDaySalary, 2);
                    }
                }

                $deduction = $lateDeductionAmount;
                $finalSalary = $baseSalary - $deduction + (float) $totalCommission + $totalOvertimeAmount - (float) $advanceDeduction;

                $payrollData = [
                    'business_id' => $businessId,
                    'user_id' => $userId,
                    'month' => $month,
                    'total_days' => $totalDaysInMonth,
                    'working_days' => $workingDays,
                    'present_days' => $presentDays,
                    'absent_days' => $absentDays,
                    'late_count' => $lateCount,
                    'late_cut_days' => $lateCutDays,
                    'half_days' => $halfDays,
                    'paid_leaves' => $paidLeaves,
                    'unpaid_leaves' => $unpaidLeaves,
                    'week_offs' => $weekOffs,
                    'holidays' => $holidays,
                    'base_salary' => $baseSalary,
                    'per_day_salary' => round($perDaySalary, 2),
                    'deduction' => round($deduction, 2),
                    'late_deductions' => round($lateDeductionAmount, 2),
                    'absence_deductions' => 0.0,
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

            // ── 5. MONTHLY SALARY TYPE ───────────────────────────────────────
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

            // Fallback to monthly_salary if components sum to 0 or empty
            if ($totalEarnings <= 0 && isset($staffData->monthly_salary) && (float) $staffData->monthly_salary > 0) {
                $totalEarnings = (float) $staffData->monthly_salary;
            }

            $baseSalary = $totalEarnings - $totalComponentDeductions;

            // Daily rate basis: (Basic Salary + Fixed Allowances) ÷ Total Month Days
            $perDaySalary = $totalDaysInMonth > 0 ? ($baseSalary / $totalDaysInMonth) : 0;

            // Effective attendance so far = present + (half_days × 0.5) + paid_leaves
            $effectivePresent = $presentDays + ($halfDays * 0.5) + $paidLeaves;

            // ── Mid-Month Elapsed Calendar Derivation ──
            // Only count working days that have actually elapsed (prevents future days from being penalized as unapproved absences)
            $elapsedDays = $effectiveEndDate->day;

            $elapsedWeekOffs = 0;
            $curElapsed = $startOfMonth->copy();
            while ($curElapsed->lessThanOrEqualTo($effectiveEndDate)) {
                $dayAbbr = $curElapsed->format('D');
                if (!in_array($dayAbbr, $workDaysConfig)) {
                    $elapsedWeekOffs++;
                }
                $curElapsed->addDay();
            }

            $elapsedHolidays = 0;
            foreach ($holidayRecords as $h) {
                $hDate = Carbon::parse($h->date);
                if ($hDate->lessThanOrEqualTo($effectiveEndDate)) {
                    $hDayAbbr = $hDate->format('D');
                    // Exclude holidays on week-offs already counted
                    if (in_array($hDayAbbr, $workDaysConfig)) {
                        $elapsedHolidays++;
                    }
                }
            }

            $elapsedWorkingDays = max(1, $elapsedDays - $elapsedWeekOffs - $elapsedHolidays);

            // Unpaid absences = elapsed working days - effective present
            $unpaidAbsences = max(0.0, (float) ($elapsedWorkingDays - $effectivePresent));

            // Isolate half-day absences from full unapproved no-shows:
            // Half-day attendance is penalized only at 1.0x normal day rate (0.5 day wage cut);
            // The 2.0x unapproved absence penalty strictly applies to full unauthorized no-shows only.
            $halfDayPortion = min($unpaidAbsences, (float) ($halfDays * 0.5));
            $fullAbsentDays = max(0.0, round($unpaidAbsences - $halfDayPortion, 2));

            $absencePenaltyMultiplier = 1.0;
            if ($workSetting && ($workSetting->enable_absence_penalty ?? true)) {
                $absencePenaltyMultiplier = (float) ($workSetting->absence_penalty_multiplier ?? 2.0);
            }

            $halfDayDeduction = round($halfDayPortion * $perDaySalary, 2);
            $fullAbsentDeduction = round($fullAbsentDays * ($perDaySalary * $absencePenaltyMultiplier), 2);
            $absenceDeduction = round($halfDayDeduction + $fullAbsentDeduction, 2);

            // Dynamic Late Arrivals Deduction Rule: Every N late days triggers a salary cut (after free grace passes)
            $lateCutDays = 0.0;
            $lateDeductionAmount = 0.0;
            if ($workSetting && ($workSetting->enable_late_deduction ?? true)) {
                $freeWaiver = (int) ($workSetting->late_free_waiver_count ?? 2);
                $triggerCount = max(1, (int) ($workSetting->late_deduction_trigger_count ?? 4));
                $cutAmountDays = (float) ($workSetting->late_deduction_amount_type ?? 1.0);

                if ($lateCount > $freeWaiver) {
                    $chargeableLates = $lateCount - $freeWaiver;
                    $cutCycles = (int) floor($chargeableLates / $triggerCount);
                    $lateCutDays = round($cutCycles * $cutAmountDays, 2);
                    $lateDeductionAmount = round($lateCutDays * $perDaySalary, 2);
                }
            }

            $deduction = round($absenceDeduction + $lateDeductionAmount, 2);

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
                'working_days' => $workingDays,
                'present_days' => $presentDays,
                'absent_days' => $absentDays,
                'late_count' => $lateCount,
                'late_cut_days' => $lateCutDays,
                'half_days' => $halfDays,
                'paid_leaves' => $paidLeaves,
                'unpaid_leaves' => $unpaidLeaves,
                'week_offs' => $weekOffs,
                'holidays' => $holidays,
                'base_salary' => round($baseSalary, 2),
                'per_day_salary' => round($perDaySalary, 2),
                'deduction' => round($deduction, 2),
                'late_deductions' => round($lateDeductionAmount, 2),
                'absence_deductions' => round($absenceDeduction, 2),
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
