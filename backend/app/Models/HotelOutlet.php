<?php

namespace App\Models;

use App\Traits\BelongsToBusiness;
use App\Traits\LogsActivity;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class HotelOutlet extends Model
{
    use BelongsToBusiness, LogsActivity;

    protected $fillable = [
        'business_id',
        'name',
        'outlet_type',
        'is_active',
        'description',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function services(): HasMany
    {
        return $this->hasMany(HotelService::class, 'outlet_id');
    }

    public function orders(): HasMany
    {
        return $this->hasMany(HotelPosOrder::class, 'outlet_id');
    }
}
