<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\BelongsToBusiness;

class HotelTaxConfig extends Model
{
    use HasFactory, BelongsToBusiness;

    protected $guarded = [];

    protected $casts = [
        'luxury_tax_applicable' => 'boolean',
        'is_gst_registered' => 'boolean',
    ];
}
