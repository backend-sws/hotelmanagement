<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Traits\BelongsToBusiness;
use App\Traits\LogsActivity;

class SupplierPurchase extends Model
{
    use HasFactory, BelongsToBusiness, LogsActivity;

    protected $fillable = [
        'business_id',
        'purchase_number',
        'invoice_type',
        'supplier_id',
        'bill_number',
        'bill_date',
        'bill_amount',
        'taxable_amount',
        'cgst_amount',
        'sgst_amount',
        'igst_amount',
        'total_tax_amount',
        'paid_amount',
        'balance_amount',
        'purchase_date',
        'due_date',
        'location_id',
        'notes',
        'status',
        'is_itc_eligible',
        'invoice_file',
    ];

    protected $casts = [
        'purchase_date' => 'date',
        'bill_date' => 'date',
        'due_date' => 'date',
        'is_itc_eligible' => 'boolean',
        'bill_amount' => 'float',
        'taxable_amount' => 'float',
        'cgst_amount' => 'float',
        'sgst_amount' => 'float',
        'igst_amount' => 'float',
        'total_tax_amount' => 'float',
        'paid_amount' => 'float',
        'balance_amount' => 'float',
    ];

    public function supplier(): BelongsTo
    {
        return $this->belongsTo(Supplier::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(SupplierPurchaseItem::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(SupplierPayment::class);
    }

    public function location(): BelongsTo
    {
        return $this->belongsTo(BusinessLocation::class, 'location_id');
    }

    public function itc(): \Illuminate\Database\Eloquent\Relations\HasOne
    {
        return $this->hasOne(ItcLedger::class, 'supplier_purchase_id');
    }

    public function getInvoiceFileAttribute($value)
    {
        if ($value) {
            if (str_starts_with($value, 'http')) {
                return $value;
            }
            return \Illuminate\Support\Facades\Storage::disk('s3')->url($value);
        }
        return null;
    }
}
