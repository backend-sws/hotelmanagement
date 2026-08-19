<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\BelongsToBusiness;
use App\Traits\LogsActivity;

class HotelOtaChannel extends Model
{
    use HasFactory, BelongsToBusiness, LogsActivity;

    protected $guarded = [];

    protected $casts = [
        'last_sync_at' => 'datetime',
    ];



    public function rateSyncs()
    {
        return $this->hasMany(HotelOtaRateSync::class, 'channel_id');
    }
}
