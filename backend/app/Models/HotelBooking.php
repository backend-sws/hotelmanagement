<?php

namespace App\Models;

use App\Traits\BelongsToBusiness;
use App\Traits\LogsActivity;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HotelBooking extends Model
{
    use HasFactory, BelongsToBusiness, LogsActivity;

    protected $guarded = [];

    protected $casts = [
        'check_in_date' => 'date',
        'check_out_date' => 'date',
        'actual_check_in_at' => 'datetime',
        'actual_check_out_at' => 'datetime',
    ];

    public function guest()
    {
        return $this->belongsTo(HotelGuest::class, 'guest_id');
    }

    public function room()
    {
        return $this->belongsTo(HotelRoom::class, 'room_id');
    }

    public function payments()
    {
        return $this->hasMany(HotelBookingPayment::class, 'booking_id');
    }

    public function folioCharges()
    {
        return $this->hasMany(HotelFolioCharge::class, 'booking_id');
    }
}
