<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\BelongsToBusiness;

class HotelNightAuditLog extends Model
{
    use HasFactory, BelongsToBusiness;

    protected $guarded = [];

    protected $casts = [
        'audit_date' => 'date',
        'run_at' => 'datetime',
    ];

    public function runner()
    {
        return $this->belongsTo(User::class, 'run_by');
    }
}
