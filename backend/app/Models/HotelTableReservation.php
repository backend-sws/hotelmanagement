<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HotelTableReservation extends Model
{
    use HasFactory;

    protected $fillable = [
        'business_id',
        'outlet_id',
        'table_id',
        'guest_name',
        'guest_phone',
        'guest_count',
        'reservation_time',
        'grace_period_minutes',
        'deposit_amount',
        'special_requests',
        'status', // pending, seated, cancelled, completed, no_show
    ];

    protected $casts = [
        'reservation_time' => 'datetime',
        'guest_count' => 'integer',
        'grace_period_minutes' => 'integer',
        'deposit_amount' => 'decimal:2',
    ];

    public function business(): BelongsTo
    {
        return $this->belongsTo(Business::class);
    }

    public function outlet(): BelongsTo
    {
        return $this->belongsTo(HotelOutlet::class);
    }

    public function table(): BelongsTo
    {
        return $this->belongsTo(HotelPosTable::class, 'table_id');
    }
}
