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
        'late_mark_minutes',
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
        'regularization_requested_at' => 'datetime',
        'regularization_actioned_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function location()
    {
        return $this->belongsTo(BusinessLocation::class, 'location_id');
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
     * Calculate actual working hours from check_in and check_out.
     * Returns decimal hours (e.g., 8.5 for 8h 30m).
     * Handles overnight shifts (check-out on the next calendar day).
     */
    public function computeActualHours(): ?float
    {
        if (!$this->check_in_time || !$this->check_out_time) {
            return null;
        }
        $in  = \Carbon\Carbon::parse($this->date->format('Y-m-d') . ' ' . $this->check_in_time);
        $out = \Carbon\Carbon::parse($this->date->format('Y-m-d') . ' ' . $this->check_out_time);
        if ($out->lessThanOrEqualTo($in)) {
            // Check-out is next morning / overnight shift
            $out->addDay();
        }
        $diffMinutes = $in->diffInMinutes($out);
        // Guard against impossible durations (> 24 hours)
        if ($diffMinutes <= 0 || $diffMinutes > 24 * 60) {
            return null;
        }
        return round($diffMinutes / 60, 2);
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
