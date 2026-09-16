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

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function approvedBy()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }
}
