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
        'leave_type',
        'from_date',
        'to_date',
        'reason',
        'status',
        'approved_by',
    ];

    protected $casts = [
        'from_date' => 'date',
        'to_date' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function approvedBy()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }
}
