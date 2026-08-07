<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SaleItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'sale_id',
        'product_id',
        'product_batch_id',
        'quantity',
        'hsn_code',
        'unit',
        'gst_rate',
        'rate',
        'taxable_amount',
        'cgst_amount',
        'sgst_amount',
        'igst_amount',
        'cess_rate',
        'cess_amount',
        'amount',
        'imei_1',
        'imei_2',
        'serial_no',
        'unit_price',
        'subtotal',
    ];

    protected $appends = ['unit_price', 'subtotal'];

    public function getUnitPriceAttribute()
    {
        return $this->rate ?? $this->attributes['rate'] ?? 0;
    }

    public function setUnitPriceAttribute($value)
    {
        $this->attributes['rate'] = $value;
    }

    public function getSubtotalAttribute()
    {
        return $this->amount ?? $this->attributes['amount'] ?? 0;
    }

    public function setSubtotalAttribute($value)
    {
        $this->attributes['amount'] = $value;
    }

    public function sale()
    {
        return $this->belongsTo(Sale::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function batch()
    {
        return $this->belongsTo(ProductBatch::class, 'product_batch_id');
    }
}
