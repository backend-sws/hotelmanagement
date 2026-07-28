<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SupplierPurchaseItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'supplier_purchase_id',
        'product_id',
        'hsn_code',
        'unit',
        'quantity',
        'purchase_price',
        'gst_rate',
        'total_price',
        'taxable_amount',
        'cgst_amount',
        'sgst_amount',
        'igst_amount',
    ];

    protected $casts = [
        'quantity' => 'integer',
        'purchase_price' => 'float',
        'gst_rate' => 'float',
        'total_price' => 'float',
        'taxable_amount' => 'float',
        'cgst_amount' => 'float',
        'sgst_amount' => 'float',
        'igst_amount' => 'float',
    ];

    public function purchase(): BelongsTo
    {
        return $this->belongsTo(SupplierPurchase::class, 'supplier_purchase_id');
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
