<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Traits\BelongsToBusiness;

class ChequeRegister extends Model
{
    use HasFactory, BelongsToBusiness;

    protected $fillable = [
        'business_id',
        'bank_account_id',
        'cheque_number',
        'bank_name',
        'branch',
        'cheque_date',
        'amount',
        'type',
        'party_type',
        'party_id',
        'in_favour_of',
        'deposit_date',
        'clearance_date',
        'bounce_date',
        'bounce_reason',
        'status',
        'reference_invoice_id',
        'notes',
    ];

    protected $casts = [
        'amount' => 'float',
        'cheque_date' => 'date',
        'deposit_date' => 'date',
        'clearance_date' => 'date',
        'bounce_date' => 'date',
    ];

    public function bankAccount(): BelongsTo
    {
        return $this->belongsTo(BankAccount::class, 'bank_account_id');
    }

    public function getPartyAttribute()
    {
        if (!$this->party_id) return null;
        if ($this->party_type === 'customer') {
            return Customer::find($this->party_id);
        }
        if ($this->party_type === 'supplier') {
            return Supplier::find($this->party_id);
        }
        return null;
    }

    /**
     * FIX EDGE-05: party_name removed from $appends to prevent N+1 queries.
     * Use getPartyName() explicitly or eager-load relationships when needed.
     */
    public function getPartyName(): ?string
    {
        $party = $this->party;
        return $party ? $party->name : null;
    }
}
