<?php

namespace App\Models;

use App\Traits\LogsActivity;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HotelRoom extends Model
{
    use LogsActivity;

    protected $fillable = [
        'business_id',
        'room_number',
        'floor',
        'room_type_id',
        'is_ac',
        'current_tariff',
        'status',
        'view_type',
        'bed_type',
        'max_occupancy',
        'notes',
    ];

    protected $casts = [
        'is_ac'          => 'boolean',
        'current_tariff' => 'decimal:2',
    ];

    /**
     * Effective max occupancy: use room-level override, otherwise fall back to room type.
     */
    public function getEffectiveMaxOccupancyAttribute(): int
    {
        return $this->max_occupancy ?? $this->roomType?->max_occupancy ?? 2;
    }

    /**
     * Effective tariff: use room-level override, otherwise fall back to room type weekday price.
     */
    public function getEffectiveTariffAttribute(): float
    {
        if ($this->current_tariff > 0) {
            return (float) $this->current_tariff;
        }
        return (float) ($this->roomType?->base_price_weekday ?? 0);
    }

    public function business(): BelongsTo
    {
        return $this->belongsTo(Business::class);
    }

    public function roomType(): BelongsTo
    {
        return $this->belongsTo(HotelRoomType::class, 'room_type_id');
    }
}
