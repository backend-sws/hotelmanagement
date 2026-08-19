<?php

namespace App\Models;

use App\Traits\LogsActivity;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BusinessPayment extends Model
{
    use HasFactory, LogsActivity;

    protected $fillable = [
        'business_id',
        'plan_id',
        'amount',
        'billing_cycle',
        'razorpay_order_id',
        'razorpay_payment_id',
        'razorpay_signature',
        'status',
        'plan_start_date',
        'plan_end_date',
    ];

    protected $casts = [
        'plan_start_date' => 'datetime',
        'plan_end_date' => 'datetime',
        'amount' => 'decimal:2',
    ];

    public function business()
    {
        return $this->belongsTo(Business::class);
    }

    public function plan()
    {
        return $this->belongsTo(Plan::class);
    }
}
