<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\BelongsToBusiness;
use App\Traits\LogsActivity;

class Sale extends Model
{
    use HasFactory, BelongsToBusiness, LogsActivity;

    protected $fillable = [
        'business_id',
        'customer_id',
        'user_id',
        'invoice_number',
        'invoice_type',
        'tax_type',
        'total_amount',
        'discount',
        'round_off',
        'cgst_amount',
        'sgst_amount',
        'igst_amount',
        'total_tax_amount',
        'taxable_amount',
        'place_of_supply',
        'final_amount',
        'paid_amount',
        'payment_mode',
        'status',
        'notes',
        'date',
        'due_date',
        'vehicle_number',
        'driver_name',
        'project_id',
        'location_id',
        'is_recurring',
        'recurring_freq',
        'recurring_end_date',
        'parent_id',
        'converted_at',
        'reference_number',
        'terms_conditions',
        'validity_date',
        'narration',
        'draft_data',
    ];

    protected $casts = [
        'date'             => 'date',
        'due_date'         => 'date',
        'draft_data'       => 'array',
        'total_amount'     => 'float',
        'taxable_amount'   => 'float',
        'total_tax_amount' => 'float',
        'cgst_amount'      => 'float',
        'sgst_amount'      => 'float',
        'igst_amount'      => 'float',
        'discount'         => 'float',
        'round_off'        => 'float',
        'final_amount'     => 'float',
        'paid_amount'      => 'float',
    ];

    protected $appends = ['public_url'];

    public function getPublicUrlAttribute()
    {
        return \Illuminate\Support\Facades\URL::signedRoute('invoice.verify', ['sale' => $this->id]);
    }

    public function business()
    {
        return $this->belongsTo(Business::class);
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function items()
    {
        return $this->hasMany(SaleItem::class);
    }

    public function payments()
    {
        return $this->hasMany(SalePayment::class);
    }

    public function emiDetail()
    {
        return $this->hasOne(EmiDetail::class);
    }
}
