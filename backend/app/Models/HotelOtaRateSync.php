<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\BelongsToBusiness;
use App\Traits\LogsActivity;

class HotelOtaRateSync extends Model
{
    use HasFactory, BelongsToBusiness, LogsActivity;

    protected $guarded = [];

    protected $casts = [
        'sync_date' => 'date',
        'restrictions' => 'array',
        'synced_at' => 'datetime',
    ];



    public function channel()
    {
        return $this->belongsTo(HotelOtaChannel::class, 'channel_id');
    }

    public function roomType()
    {
        return $this->belongsTo(HotelRoomType::class, 'room_type_id');
    }
}
