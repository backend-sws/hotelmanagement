<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\BelongsToBusiness;
use App\Traits\LogsActivity;

class LeaveRequest extends Model
{
    use HasFactory, BelongsToBusiness, LogsActivity;

    protected $fillable = [
        'business_id',
        'user_id',
        'request_type',       // 'leave' or 'wfh'
        'leave_type',         // sick, casual, earned, etc.
        'leave_category',     // paid, unpaid, sick, casual, earned, comp_off
        'admin_override_category', // admin override: paid/unpaid
        'from_date',
        'to_date',
        'reason',
        'status',
        'approved_by',
        'wfh_attendance_marked',
        'custom_work_hours',
        'admin_remark',
    ];

    protected $casts = [
        'from_date' => 'date',
        'to_date' => 'date',
        'wfh_attendance_marked' => 'boolean',
        'custom_work_hours' => 'float',
    ];

    protected $appends = ['net_working_days'];

    public function getNetWorkingDaysAttribute(): int
    {
        return $this->calculateNetWorkingDays();
    }

    /**
     * Is this a WFH request (not a leave request)?
     */
    public function isWfh(): bool
    {
        return $this->request_type === 'wfh';
    }

    /**
     * Effective leave category for payroll:
     * Admin override takes precedence, else leave_category.
     */
    public function effectiveCategory(): string
    {
        return $this->admin_override_category ?? $this->leave_category ?? 'paid';
    }

    /**
     * Calculate net working days for this leave request,
     * strictly excluding Sundays and official company holidays.
     * Optionally bounded to a date range (e.g. current payroll month).
     */
    public function calculateNetWorkingDays($boundStart = null, $boundEnd = null): int
    {
        if (!$this->from_date || !$this->to_date) {
            return 0;
        }

        $startDate = \Carbon\Carbon::parse($this->from_date)->startOfDay();
        $endDate   = \Carbon\Carbon::parse($this->to_date)->startOfDay();

        if ($boundStart) {
            $bStart = \Carbon\Carbon::parse($boundStart)->startOfDay();
            if ($startDate->lt($bStart)) {
                $startDate = $bStart;
            }
        }
        if ($boundEnd) {
            $bEnd = \Carbon\Carbon::parse($boundEnd)->startOfDay();
            if ($endDate->gt($bEnd)) {
                $endDate = $bEnd;
            }
        }

        if ($startDate->gt($endDate)) {
            return 0;
        }

        $holidayDates = BusinessHoliday::where('business_id', $this->business_id)
            ->whereBetween('date', [$startDate->toDateString(), $endDate->toDateString()])
            ->pluck('date')
            ->map(fn($d) => \Carbon\Carbon::parse($d)->format('Y-m-d'))
            ->toArray();

        $workSetting = BusinessWorkSetting::where('business_id', $this->business_id)->first();
        $workDays = $workSetting && is_array($workSetting->work_days) 
            ? $workSetting->work_days 
            : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        $dayMap = [
            \Carbon\Carbon::SUNDAY    => 'Sun',
            \Carbon\Carbon::MONDAY    => 'Mon',
            \Carbon\Carbon::TUESDAY   => 'Tue',
            \Carbon\Carbon::WEDNESDAY => 'Wed',
            \Carbon\Carbon::THURSDAY  => 'Thu',
            \Carbon\Carbon::FRIDAY    => 'Fri',
            \Carbon\Carbon::SATURDAY  => 'Sat',
        ];

        $netDays = 0;
        $curr = $startDate->copy();
        while ($curr->lte($endDate)) {
            $dateStr = $curr->format('Y-m-d');
            $dayName = $dayMap[$curr->dayOfWeek] ?? 'Sun';

            // Check if day is an official off-day (or Sunday)
            $isOffDay = !in_array($dayName, $workDays) || $curr->dayOfWeek === \Carbon\Carbon::SUNDAY;
            $isHoliday = in_array($dateStr, $holidayDates);

            if (!$isOffDay && !$isHoliday) {
                $netDays++;
            }

            $curr->addDay();
        }

        return $netDays;
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function approvedBy()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }
}
