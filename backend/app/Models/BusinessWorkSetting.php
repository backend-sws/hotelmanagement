<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Traits\BelongsToBusiness;

class BusinessWorkSetting extends Model
{
    use HasFactory, BelongsToBusiness;

    protected $fillable = [
        'business_id',
        'work_start_time',
        'work_end_time',
        'standard_hours_per_day',
        'work_days',
        'late_mark_grace_minutes',
        'default_lunch_minutes',
        'auto_apply_holidays',
        'enable_auto_absent',
        'enable_overtime',
        'overtime_rate_type',
        'overtime_hourly_rate',
        'overtime_multiplier',
        'overtime_min_minutes',
        'overtime_require_approval',
        'punch_mode_office',
        'punch_mode_wfh',
        'punch_mode_quick_gps',
        'punch_mode_selfie_required',
        'punch_mode_on_duty',
        'forgot_checkout_policy',
        'forgot_checkout_alert_time',
        'enable_forgot_checkout_alert',
        'enable_late_deduction',
        'late_free_waiver_count',
        'late_deduction_trigger_count',
        'late_deduction_amount_type',
        'enable_absence_penalty',
        'absence_penalty_multiplier',
        'enable_leave_notice_rule',
        'leave_notice_days_required',
    ];

    protected $casts = [
        'work_days' => 'array',
        'standard_hours_per_day' => 'float',
        'default_lunch_minutes' => 'integer',
        'auto_apply_holidays' => 'boolean',
        'enable_auto_absent' => 'boolean',
        'enable_overtime' => 'boolean',
        'overtime_hourly_rate' => 'float',
        'overtime_multiplier' => 'float',
        'overtime_min_minutes' => 'integer',
        'overtime_require_approval' => 'boolean',
        'punch_mode_office' => 'boolean',
        'punch_mode_wfh' => 'boolean',
        'punch_mode_quick_gps' => 'boolean',
        'punch_mode_selfie_required' => 'boolean',
        'punch_mode_on_duty' => 'boolean',
        'enable_forgot_checkout_alert' => 'boolean',
        'enable_late_deduction' => 'boolean',
        'late_free_waiver_count' => 'integer',
        'late_deduction_trigger_count' => 'integer',
        'late_deduction_amount_type' => 'float',
        'enable_absence_penalty' => 'boolean',
        'absence_penalty_multiplier' => 'float',
        'enable_leave_notice_rule' => 'boolean',
        'leave_notice_days_required' => 'integer',
    ];

    public function business(): BelongsTo
    {
        return $this->belongsTo(Business::class);
    }

    /**
     * Get default work days if not configured.
     */
    public function getWorkDaysArray(): array
    {
        return $this->work_days ?? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    }

    /**
     * Check if a given date (Carbon) is a configured working day.
     */
    public function isWorkingDay(\Carbon\Carbon $date): bool
    {
        $dayAbbr = $date->format('D'); // Mon, Tue, etc.
        return in_array($dayAbbr, $this->getWorkDaysArray());
    }
}
