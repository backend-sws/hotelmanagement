<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WhatsAppRateCard extends Model
{
    use HasFactory;

    protected $table = 'whatsapp_rate_cards';

    protected $fillable = [
        'business_id',
        'category',
        'wholesale_cost',
        'retail_price',
        'is_active',
    ];

    protected $casts = [
        'wholesale_cost' => 'decimal:4',
        'retail_price'   => 'decimal:4',
        'is_active'      => 'boolean',
    ];

    public function business(): BelongsTo
    {
        return $this->belongsTo(Business::class);
    }
}
