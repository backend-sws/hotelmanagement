<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\BelongsToBusiness;
use App\Traits\LogsActivity;

class LeavePolicy extends Model
{
    use HasFactory, BelongsToBusiness, LogsActivity;

    protected $fillable = [
        'business_id',
        'leave_type',
        'monthly_quota',
        'is_paid',
    ];

    protected $casts = [
        'monthly_quota' => 'float',
        'is_paid' => 'boolean',
    ];
}
