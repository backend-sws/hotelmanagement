<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HotelBookingPayment extends Model
{
    use HasFactory;

    protected $guarded = [];

    public function booking()
    {
        return $this->belongsTo(HotelBooking::class, 'booking_id');
    }

    public function collector()
    {
        return $this->belongsTo(User::class, 'collected_by');
    }
}
