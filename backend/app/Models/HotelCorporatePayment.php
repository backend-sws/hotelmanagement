<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HotelCorporatePayment extends Model
{
    protected $guarded = ['id'];
    
    protected $casts = [
        'payment_date' => 'date',
    ];

    public function account()
    {
        return $this->belongsTo(HotelCorporateAccount::class, 'hotel_corporate_account_id');
    }
}
