<?php

namespace App\Models;

use App\Traits\BelongsToBusiness;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class HotelPosOrder extends Model
{
    use BelongsToBusiness;

    protected $fillable = [
        'business_id',
        'order_number',
        'outlet_id',
        'booking_id',
        'table_no',
        'table_id',
        'reservation_id',
        'guest_name',
        'guest_phone',
        'order_type',
        'status',
        'subtotal',
        'tax_amount',
        'discount_amount',
        'deposit_applied',
        'total',
        'payment_mode',
        'notes',
        'billed_by',
        'billed_at',
        'kot_printed_at',
    ];

    protected $casts = [
        'subtotal'        => 'float',
        'tax_amount'      => 'float',
        'discount_amount' => 'float',
        'deposit_applied' => 'float',
        'total'           => 'float',
        'billed_at'       => 'datetime',
        'kot_printed_at'  => 'datetime',
    ];

    public function outlet(): BelongsTo
    {
        return $this->belongsTo(HotelOutlet::class, 'outlet_id');
    }

    public function booking(): BelongsTo
    {
        return $this->belongsTo(HotelBooking::class, 'booking_id');
    }

    public function items(): HasMany
    {
        return $this->hasMany(HotelPosOrderItem::class, 'order_id');
    }

    public function billedBy(): BelongsTo
    {
        return $this->belongsTo(\App\Models\User::class, 'billed_by');
    }

    public function table(): BelongsTo
    {
        return $this->belongsTo(HotelPosTable::class, 'table_id');
    }

    public function reservation(): BelongsTo
    {
        return $this->belongsTo(HotelTableReservation::class, 'reservation_id');
    }
}
