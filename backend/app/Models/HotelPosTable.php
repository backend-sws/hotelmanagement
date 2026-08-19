<?php

namespace App\Models;

use App\Traits\LogsActivity;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class HotelPosTable extends Model
{
    use HasFactory, LogsActivity;

    protected $fillable = [
        'business_id',
        'outlet_id',
        'name',
        'capacity',
        'status',
    ];

    public function business(): BelongsTo
    {
        return $this->belongsTo(Business::class);
    }

    public function outlet(): BelongsTo
    {
        return $this->belongsTo(HotelOutlet::class);
    }

    public function reservations(): HasMany
    {
        return $this->hasMany(HotelTableReservation::class, 'table_id');
    }

    public function orders(): HasMany
    {
        return $this->hasMany(HotelPosOrder::class, 'table_id');
    }
}
