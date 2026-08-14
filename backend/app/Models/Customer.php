<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\BelongsToBusiness;
use App\Traits\LogsActivity;

class Customer extends Model
{
    use HasFactory, BelongsToBusiness, LogsActivity;

    protected $fillable = [
        'business_id',
        'name',
        'phone',
        'address',
        'gstin',
        'state_code',
        'state_name',
        'email',
        'credit_period',
        'credit_limit',
        'opening_balance',
        'balance_type',
        'price_list_id',
    ];

    protected $attributes = [
        'credit_limit' => 0.00,
        'opening_balance' => 0.00,
        'credit_period' => '0',
        'balance_type' => 'debit',
    ];

    protected $casts = [
        'credit_limit' => 'decimal:2',
        'opening_balance' => 'decimal:2',
    ];

    public function setCreditLimitAttribute($value): void
    {
        $this->attributes['credit_limit'] = ($value === null || $value === '') ? 0.00 : (float) $value;
    }

    public function setOpeningBalanceAttribute($value): void
    {
        $this->attributes['opening_balance'] = ($value === null || $value === '') ? 0.00 : (float) $value;
    }

    public function setCreditPeriodAttribute($value): void
    {
        $this->attributes['credit_period'] = ($value === null || $value === '') ? '0' : (string) $value;
    }

    public function setBalanceTypeAttribute($value): void
    {
        $this->attributes['balance_type'] = ($value === null || $value === '') ? 'debit' : $value;
    }

    public function business()
    {
        return $this->belongsTo(Business::class);
    }

    public function sales()
    {
        return $this->hasMany(Sale::class);
    }

    public function priceList()
    {
        return $this->belongsTo(PriceList::class);
    }
}
