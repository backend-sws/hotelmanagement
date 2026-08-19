<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\BelongsToBusiness;
use App\Traits\LogsActivity;

class PriceList extends Model
{
    use HasFactory, BelongsToBusiness, LogsActivity;

    protected $fillable = [
        'business_id',
        'name',
        'description',
        'is_default',
        'is_active',
    ];

    public function items()
    {
        return $this->hasMany(PriceListItem::class);
    }
}
