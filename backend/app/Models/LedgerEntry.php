<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\BelongsToBusiness;
use App\Traits\LogsActivity;

class LedgerEntry extends Model
{
    use HasFactory, BelongsToBusiness, LogsActivity;

    protected $fillable = [
        'business_id',
        'party_type',
        'party_id',
        'entry_type',
        'reference_type',
        'reference_id',
        'date',
        'debit',
        'credit',
        'balance',
        'narration',
    ];

    protected $casts = [
        'date' => 'date',
        'debit' => 'float',
        'credit' => 'float',
        'balance' => 'float',
    ];

    public function party()
    {
        if ($this->party_type === 'customer') {
            return $this->belongsTo(Customer::class, 'party_id');
        }
        return $this->belongsTo(Supplier::class, 'party_id');
    }
}
