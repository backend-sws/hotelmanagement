<?php

namespace App\Models;

use App\Traits\LogsActivity;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HotelFolioCharge extends Model
{
    use HasFactory, LogsActivity;

    protected $guarded = [];

    protected $casts = [
        'charge_date' => 'date',
    ];

    public function booking()
    {
        return $this->belongsTo(HotelBooking::class, 'booking_id');
    }

    public function postedBy()
    {
        return $this->belongsTo(User::class, 'posted_by');
    }
}
