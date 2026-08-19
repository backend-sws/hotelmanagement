<?php

namespace App\Models;

use App\Traits\LogsActivity;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HotelRatePlan extends Model
{
    use LogsActivity;

    protected $fillable = [
        'business_id',
        'name',
        'start_date',
        'end_date',
        'room_type_id',
        'modifier_type',
        'modifier_value',
        'min_stay_nights',
        'is_active',
        'description',
    ];

    protected $casts = [
        'start_date'      => 'date',
        'end_date'        => 'date',
        'modifier_value'  => 'decimal:2',
        'is_active'       => 'boolean',
        'min_stay_nights' => 'integer',
    ];

    public function business(): BelongsTo
    {
        return $this->belongsTo(Business::class);
    }

    public function roomType(): BelongsTo
    {
        return $this->belongsTo(HotelRoomType::class, 'room_type_id');
    }

    /**
     * Apply this rate plan modifier to a base price.
     */
    public function applyTo(float $basePrice): float
    {
        if ($this->modifier_type === 'percentage') {
            return $basePrice + ($basePrice * $this->modifier_value / 100);
        }
        return max(0, $basePrice + $this->modifier_value);
    }
}
