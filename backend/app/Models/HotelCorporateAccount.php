<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\BelongsToBusiness;
use App\Traits\LogsActivity;

class HotelCorporateAccount extends Model
{
    use BelongsToBusiness, LogsActivity;

    protected $guarded = ['id'];
    
    protected $casts = [
        'contract_start_date' => 'date',
        'contract_end_date' => 'date',
    ];

    public function payments()
    {
        return $this->hasMany(HotelCorporatePayment::class);
    }
}
