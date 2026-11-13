<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\BelongsToBusiness;
use App\Traits\LogsActivity;

class Attendance extends Model
{
    use HasFactory, BelongsToBusiness, LogsActivity;

    protected $fillable = [
        'business_id',
        'user_id',
        'date',
        'status',
        'check_in_time',
        'check_out_time',
        'check_in_photo',
        'check_out_photo',
        'check_in_latitude',
        'check_in_longitude',
        'check_out_latitude',
        'check_out_longitude',
        'is_within_geofence',
        'location_id',
        'notes',
        'approved_by',
        // WFH & Hours tracking
        'work_type',
        'actual_hours',
        'gross_presence_hours',
        'lunch_start_time',
        'lunch_end_time',
        'lunch_minutes',
        'late_mark_minutes',
        'forgot_checkout_applied',
        'is_auto_closed',
        // Overtime Tracking & Approval
        'overtime_hours',
        'overtime_approved',
        'overtime_approved_by',
        'overtime_approved_at',
        'overtime_notes',
        // Regularization (backdated correction)
        'regularization_requested_at',
        'regularization_requested_checkin',
        'regularization_requested_checkout',
        'regularization_reason',
        'regularization_status',
        'regularization_approved_by',
        'regularization_actioned_at',
    ];

    protected $casts = [
        'date' => 'date:Y-m-d',
        'is_within_geofence' => 'boolean',
        'check_in_latitude' => 'float',
        'check_in_longitude' => 'float',
        'check_out_latitude' => 'float',
        'check_out_longitude' => 'float',
        'actual_hours' => 'float',
        'gross_presence_hours' => 'float',
        'lunch_minutes' => 'integer',
        'overtime_hours' => 'float',
        'overtime_approved' => 'boolean',
        'overtime_approved_at' => 'datetime',
        'forgot_checkout_applied' => 'boolean',
        'is_auto_closed' => 'boolean',
        'regularization_requested_at' => 'datetime',
        'regularization_actioned_at' => 'datetime',
    ];

    protected $appends = [
        'exact_working_hours',
        'office_present_hours',
        'is_on_lunch',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function location()
    {
        return $this->belongsTo(BusinessLocation::class, 'location_id');
    }

    public function overtimeApprovedBy()
    {
        return $this->belongsTo(User::class, 'overtime_approved_by');
    }

    public function regularizationApprovedBy()
    {
        return $this->belongsTo(User::class, 'regularization_approved_by');
    }

    public function approvedBy()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function getCheckInPhotoAttribute($value)
    {
        if ($value) {
            if (str_starts_with($value, 'http')) {
                return $value;
            }
            return \Illuminate\Support\Facades\Storage::disk('s3')->url($value);
        }
        return null;
    }

    /**
     * Total office presence duration (check-out minus check-in).
     * Returns decimal hours (e.g. 9.0 for 9 hours in office).
     */
    public function computeGrossPresenceHours(): ?float
    {
        if ($this->status === 'half_day' && (!$this->check_in_time || !$this->check_out_time)) {
            return 4.5;
        }
        if (!$this->check_in_time || !$this->check_out_time) {
            return null;
        }
        $dateStr = $this->date instanceof \DateTimeInterface ? $this->date->format('Y-m-d') : substr((string)$this->date, 0, 10);
        $in  = \Carbon\Carbon::parse($dateStr . ' ' . $this->check_in_time);
        $out = \Carbon\Carbon::parse($dateStr . ' ' . $this->check_out_time);
        if ($out->lessThanOrEqualTo($in)) {
            // Check-out is next morning / overnight shift
            $out->addDay();
        }
        $diffMinutes = $in->diffInMinutes($out);
        if ($diffMinutes <= 0 || $diffMinutes > 24 * 60) {
            return null;
        }
        return round($diffMinutes / 60, 2);
    }

    /**
     * Calculate exact working hours: Total Office Presence - Lunch Break.
     * Returns decimal hours (e.g., 8.0 for 9h presence - 1h lunch).
     */
    public function computeActualHours(): ?float
    {
        if ($this->status === 'half_day' && (!$this->check_in_time || !$this->check_out_time)) {
            return 4.5;
        }

        $gross = $this->computeGrossPresenceHours();
        if ($gross === null) {
            return null;
        }

        $lunchMins = (int) ($this->lunch_minutes ?? 0);
        $dateStr = $this->date instanceof \DateTimeInterface ? $this->date->format('Y-m-d') : substr((string)$this->date, 0, 10);
        if ($lunchMins <= 0 && $this->lunch_start_time && $this->lunch_end_time) {
            $lIn  = \Carbon\Carbon::parse($dateStr . ' ' . $this->lunch_start_time);
            $lOut = \Carbon\Carbon::parse($dateStr . ' ' . $this->lunch_end_time);
            if ($lOut->gt($lIn)) {
                $lunchMins = $lIn->diffInMinutes($lOut);
            }
        }

        $netHours = max(0, round($gross - ($lunchMins / 60), 2));
        return $netHours;
    }

    public function getExactWorkingHoursAttribute(): ?float
    {
        return $this->actual_hours ?? $this->computeActualHours();
    }

    public function getOfficePresentHoursAttribute(): ?float
    {
        return $this->gross_presence_hours ?? $this->computeGrossPresenceHours();
    }

    public function getIsOnLunchAttribute(): bool
    {
        return !empty($this->lunch_start_time) && empty($this->lunch_end_time) && !empty($this->check_in_time) && empty($this->check_out_time);
    }


    /**
     * Efficiency percentage: actual_hours / standard_hours * 100.
     * Standard hours passed as parameter (from BusinessWorkSetting or staff override).
     */
    public function efficiencyPercentage(float $standardHours): float
    {
        if ($standardHours <= 0 || !$this->actual_hours) {
            return 0.0;
        }
        return round(($this->actual_hours / $standardHours) * 100, 1);
    }

    /**
     * Has a pending regularization request.
     */
    public function hasPendingRegularization(): bool
    {
        return $this->regularization_status === 'pending';
    }

    public function getCheckOutPhotoAttribute($value)
    {
        if ($value) {
            if (str_starts_with($value, 'http')) {
                return $value;
            }
            return \Illuminate\Support\Facades\Storage::disk('s3')->url($value);
        }
        return null;
    }
}
