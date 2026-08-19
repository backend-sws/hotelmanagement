<?php

namespace App\Models;

use App\Traits\LogsActivity;
use Illuminate\Database\Eloquent\Model;

class HotelCorporatePayment extends Model
{
    use LogsActivity;

    protected $guarded = ['id'];
    
    protected $casts = [
        'payment_date' => 'date',
    ];

    public function account()
    {
        return $this->belongsTo(HotelCorporateAccount::class, 'hotel_corporate_account_id');
    }
}
