<?php

namespace App\Models;

use App\Traits\BelongsToBusiness;
use App\Traits\LogsActivity;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HotelService extends Model
{
    use BelongsToBusiness, LogsActivity;

    protected $fillable = [
        'business_id',
        'outlet_id',
        'name',
        'category',
        'description',
        'price',
        'tax_type',
        'tax_percent',
        'is_available',
        'image_url',
        'sort_order',
    ];

    protected $casts = [
        'price'       => 'float',
        'tax_percent' => 'float',
        'is_available'=> 'boolean',
    ];

    public function outlet(): BelongsTo
    {
        return $this->belongsTo(HotelOutlet::class, 'outlet_id');
    }

    public function getTaxAmountAttribute(): float
    {
        if ($this->tax_type === 'nil') return 0;
        return round($this->price * ($this->tax_percent / 100), 2);
    }

    public function getFinalPriceAttribute(): float
    {
        if ($this->tax_type === 'exclusive') return $this->price + $this->getTaxAmountAttribute();
        return $this->price; // inclusive or nil
    }
}
