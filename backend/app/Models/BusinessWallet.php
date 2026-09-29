<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class BusinessWallet extends Model
{
    use HasFactory;

    protected $fillable = [
        'business_id',
        'balance',
        'currency',
        'low_balance_threshold',
        'auto_recharge_enabled',
        'auto_recharge_amount',
        'total_recharged',
        'total_consumed',
        'status',
    ];

    protected $casts = [
        'balance'               => 'decimal:4',
        'low_balance_threshold' => 'decimal:2',
        'auto_recharge_amount'  => 'decimal:2',
        'total_recharged'       => 'decimal:4',
        'total_consumed'        => 'decimal:4',
        'auto_recharge_enabled' => 'boolean',
    ];

    public function business(): BelongsTo
    {
        return $this->belongsTo(Business::class);
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(WalletTransaction::class, 'wallet_id');
    }
}
