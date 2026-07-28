<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Traits\BelongsToBusiness;

class BankAccount extends Model
{
    use HasFactory, BelongsToBusiness;

    protected $fillable = [
        'business_id',
        'account_name',
        'account_number',
        'ifsc_code',
        'bank_name',
        'branch',
        'opening_balance',
        'current_balance',
        'is_default',
    ];

    protected $casts = [
        'opening_balance' => 'float',
        'current_balance' => 'float',
        'is_default' => 'boolean',
    ];

    public function entries(): HasMany
    {
        return $this->hasMany(CashBankEntry::class, 'bank_account_id');
    }

    public function cheques(): HasMany
    {
        return $this->hasMany(ChequeRegister::class, 'bank_account_id');
    }
}
