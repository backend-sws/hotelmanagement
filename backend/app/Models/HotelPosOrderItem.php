<?php

namespace App\Models;

use App\Traits\LogsActivity;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HotelPosOrderItem extends Model
{
    use LogsActivity;

    protected $fillable = [
        'order_id',
        'service_id',
        'name',
        'category',
        'qty',
        'unit_price',
        'tax_percent',
        'tax_amount',
        'total_price',
        'notes',
    ];

    protected $casts = [
        'qty'         => 'float',
        'unit_price'  => 'float',
        'tax_percent' => 'float',
        'tax_amount'  => 'float',
        'total_price' => 'float',
    ];

    public function order(): BelongsTo
    {
        return $this->belongsTo(HotelPosOrder::class, 'order_id');
    }

    public function service(): BelongsTo
    {
        return $this->belongsTo(HotelService::class, 'service_id');
    }
}
