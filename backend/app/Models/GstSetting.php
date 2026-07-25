<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\BelongsToBusiness;

class GstSetting extends Model
{
    use HasFactory, BelongsToBusiness;

    protected $fillable = [
        'business_id',
        'gstin',
        'legal_name',
        'trade_name',
        'composition_scheme',
        'default_hsn',
        'default_gst_rate',
        'enable_e_invoicing',
        'e_invoice_username',
        'e_invoice_password',
    ];
}
