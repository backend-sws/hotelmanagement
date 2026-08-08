<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class HotelRoomType extends Model
{
    protected $fillable = [
        'business_id',
        'name',
        'short_code',
        'base_price_weekday',
        'base_price_weekend',
        'base_price_peak',
        'extra_person_charge',
        'max_occupancy',
        'amenities',
        'description',
        'display_image_url',
        'is_active',
    ];

    protected $casts = [
        'amenities'           => 'array',
        'is_active'           => 'boolean',
        'base_price_weekday'  => 'decimal:2',
        'base_price_weekend'  => 'decimal:2',
        'base_price_peak'     => 'decimal:2',
        'extra_person_charge' => 'decimal:2',
    ];

    public function business(): BelongsTo
    {
        return $this->belongsTo(Business::class);
    }

    public function rooms(): HasMany
    {
        return $this->hasMany(HotelRoom::class, 'room_type_id');
    }

    public function ratePlans(): HasMany
    {
        return $this->hasMany(HotelRatePlan::class, 'room_type_id');
    }
}
