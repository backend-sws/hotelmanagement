<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\BelongsToBusiness;
use App\Traits\LogsActivity;

class SaleCommission extends Model
{
    use HasFactory, BelongsToBusiness, LogsActivity;

    protected $fillable = [
        'business_id',
        'user_id',
        'sale_id',
        'sale_amount',
        'commission_rate',
        'commission_amount',
    ];

    protected $casts = [
        'sale_amount' => 'float',
        'commission_rate' => 'float',
        'commission_amount' => 'float',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function sale()
    {
        return $this->belongsTo(Sale::class);
    }
}
