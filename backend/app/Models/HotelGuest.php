<?php

namespace App\Models;

use App\Traits\BelongsToBusiness;
use App\Traits\LogsActivity;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HotelGuest extends Model
{
    use HasFactory, BelongsToBusiness, LogsActivity;

    protected $guarded = [];

    protected $casts = [
        'date_of_birth' => 'date',
        'is_blacklisted' => 'boolean',
    ];

    public function bookings()
    {
        return $this->hasMany(HotelBooking::class, 'guest_id');
    }
}
