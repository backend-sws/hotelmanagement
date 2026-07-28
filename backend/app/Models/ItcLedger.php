<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Traits\BelongsToBusiness;

class ItcLedger extends Model
{
    use HasFactory, BelongsToBusiness;

    protected $fillable = [
        'business_id',
        'supplier_purchase_id',
        'month',
        'cgst_amount',
        'sgst_amount',
        'igst_amount',
        'total_itc',
        'is_claimed',
        'claimed_at',
    ];

    protected $casts = [
        'cgst_amount' => 'float',
        'sgst_amount' => 'float',
        'igst_amount' => 'float',
        'total_itc' => 'float',
        'is_claimed' => 'boolean',
        'claimed_at' => 'datetime',
    ];

    public function supplierPurchase(): BelongsTo
    {
        return $this->belongsTo(SupplierPurchase::class, 'supplier_purchase_id');
    }
}
