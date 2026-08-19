<?php

namespace App\Models;

use App\Traits\LogsActivity;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HotelBookingPayment extends Model
{
    use HasFactory, LogsActivity;

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
