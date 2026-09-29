<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TravelAllowance extends Model
{
    use HasFactory;

    protected $table = 'travel_allowances';

    protected $fillable = [
        'business_id',
        'staff_id',
        'date',
        'vehicle_type',
        'start_location',
        'end_location',
        'total_km',
        'rate_per_km',
        'total_amount',
        'status',
        'approved_by',
        'payroll_id',
        'notes',
    ];

    protected $casts = [
        'date'         => 'date',
        'total_km'     => 'float',
        'rate_per_km'  => 'float',
        'total_amount' => 'float',
    ];

    public function business(): BelongsTo
    {
        return $this->belongsTo(Business::class);
    }

    public function staff(): BelongsTo
    {
        return $this->belongsTo(User::class, 'staff_id');
    }

    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }
}
