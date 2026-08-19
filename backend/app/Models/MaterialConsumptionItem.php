<?php

namespace App\Models;

use App\Traits\LogsActivity;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MaterialConsumptionItem extends Model
{
    use HasFactory, LogsActivity;

    protected $fillable = [
        'consumption_id',
        'product_id',
        'quantity',
        'unit',
        'rate',
        'amount',
        'notes',
    ];

    protected $casts = [
        'quantity' => 'decimal:3',
        'rate' => 'decimal:2',
        'amount' => 'decimal:2',
    ];

    public function consumption(): BelongsTo
    {
        return $this->belongsTo(MaterialConsumption::class, 'consumption_id');
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
