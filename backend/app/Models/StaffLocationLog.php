<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StaffLocationLog extends Model
{
    use HasFactory;

    protected $table = 'staff_location_logs';

    protected $fillable = [
        'business_id',
        'staff_id',
        'lat',
        'lng',
        'location_source',
        'reference_id',
        'metadata',
        'recorded_at',
    ];

    protected $casts = [
        'lat'         => 'float',
        'lng'         => 'float',
        'metadata'    => 'array',
        'recorded_at' => 'datetime',
    ];

    public function business(): BelongsTo
    {
        return $this->belongsTo(Business::class);
    }

    public function staff(): BelongsTo
    {
        return $this->belongsTo(User::class, 'staff_id');
    }
}
