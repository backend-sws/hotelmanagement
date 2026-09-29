<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WalletTransaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'business_id',
        'wallet_id',
        'type',
        'category',
        'amount',
        'balance_before',
        'balance_after',
        'reference_id',
        'description',
        'metadata',
    ];

    protected $casts = [
        'amount'         => 'decimal:4',
        'balance_before' => 'decimal:4',
        'balance_after'  => 'decimal:4',
        'metadata'       => 'array',
    ];

    public function business(): BelongsTo
    {
        return $this->belongsTo(Business::class);
    }

    public function wallet(): BelongsTo
    {
        return $this->belongsTo(BusinessWallet::class, 'wallet_id');
    }
}
