<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\BelongsToBusiness;
use App\Traits\LogsActivity;

class PayrollComponent extends Model
{
    use BelongsToBusiness, LogsActivity;
    protected $fillable = [
        'business_id',
        'name',
        'type',
        'is_default'
    ];

    protected $casts = [
        'is_default' => 'boolean',
    ];

    public function business()
    {
        return $this->belongsTo(Business::class);
    }
}
