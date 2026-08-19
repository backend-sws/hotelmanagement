<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\BelongsToBusiness;
use App\Traits\LogsActivity;

class HotelTaxConfig extends Model
{
    use HasFactory, BelongsToBusiness, LogsActivity;

    protected $guarded = [];

    protected $casts = [
        'luxury_tax_applicable' => 'boolean',
        'is_gst_registered' => 'boolean',
    ];
}
