<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Traits\BelongsToBusiness;

class CashBankEntry extends Model
{
    use HasFactory, BelongsToBusiness;

    protected $fillable = [
        'business_id',
        'bank_account_id',
        'entry_type',
        'account_type',
        'account_name',
        'party_type',
        'party_id',
        'amount',
        'payment_mode',
        'reference_no',
        'narration',
        'date',
        'entered_by',
        'reference_type',
        'reference_id',
    ];

    protected $casts = [
        'amount' => 'float',
        'date' => 'date',
    ];

    public function bankAccount(): BelongsTo
    {
        return $this->belongsTo(BankAccount::class, 'bank_account_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'entered_by');
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
     * FIX EDGE-05: party_name was previously in $appends, causing one DB query
     * per serialized record. Now it's an on-demand method, not auto-appended.
     * Call ->getPartyName() explicitly when needed, or eager-load via relationship.
     */
    public function getPartyName(): ?string
    {
        $party = $this->party;
        return $party ? $party->name : null;
    }
}
