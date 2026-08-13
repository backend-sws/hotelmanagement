<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\BelongsToBusiness;

class HotelCorporateAccount extends Model
{
    use BelongsToBusiness;

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
