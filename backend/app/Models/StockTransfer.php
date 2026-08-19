<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Traits\BelongsToBusiness;
use App\Traits\LogsActivity;

class StockTransfer extends Model
{
    use HasFactory, BelongsToBusiness, LogsActivity;

    protected $fillable = [
        'business_id',
        'transfer_number',
        'from_location_id',
        'to_location_id',
        'transfer_date',
        'notes',
        'status',
        'transferred_by',
    ];

    protected $casts = [
        'transfer_date' => 'date',
    ];

    public function fromLocation(): BelongsTo
    {
        return $this->belongsTo(BusinessLocation::class, 'from_location_id');
    }

    public function toLocation(): BelongsTo
    {
        return $this->belongsTo(BusinessLocation::class, 'to_location_id');
    }

    public function transferredBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'transferred_by');
    }

    public function items(): HasMany
    {
        return $this->hasMany(StockTransferItem::class);
    }
}
