<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class FieldTask extends Model
{
    use HasFactory;

    protected $table = 'field_tasks';

    protected $fillable = [
        'business_id',
        'staff_id',
        'title',
        'description',
        'site_name',
        'site_lat',
        'site_lng',
        'site_address',
        'client_name',
        'client_phone',
        'client_otp',
        'otp_verified_at',
        'status',
        'priority',
        'due_at',
        'completed_at',
    ];

    protected $casts = [
        'site_lat'        => 'float',
        'site_lng'        => 'float',
        'otp_verified_at' => 'datetime',
        'due_at'          => 'datetime',
        'completed_at'    => 'datetime',
    ];

    public function business(): BelongsTo
    {
        return $this->belongsTo(Business::class);
    }

    public function staff(): BelongsTo
    {
        return $this->belongsTo(User::class, 'staff_id');
    }

    public function proofs(): HasMany
    {
        return $this->hasMany(TaskProof::class, 'task_id');
    }
}
