<?php

namespace App\Models;

use App\Traits\LogsActivity;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HotelPropertySetting extends Model
{
    use LogsActivity;

    protected $fillable = [
        'business_id',
        'property_type',
        'total_rooms',
        'check_in_time',
        'check_out_time',
        'late_checkout_charge',
        'early_checkin_charge',
        'default_gst_category',
        'city_ledger_enabled',
        'footer_for_bills',
        'gstin',
        'is_gst_registered',
    ];

    protected $casts = [
        'city_ledger_enabled' => 'boolean',
        'is_gst_registered'   => 'boolean',
        'late_checkout_charge'  => 'decimal:2',
        'early_checkin_charge'  => 'decimal:2',
    ];

    public function business(): BelongsTo
    {
        return $this->belongsTo(Business::class);
    }
}
