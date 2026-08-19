<?php

namespace App\Models;

use App\Traits\LogsActivity;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SalePayment extends Model
{
    use HasFactory, LogsActivity;

    protected $fillable = [
        'sale_id',
        'payment_mode',
        'amount',
        'notes',
    ];

    public function sale()
    {
        return $this->belongsTo(Sale::class);
    }
}
