<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WhatsAppSession extends Model
{
    use HasFactory;

    protected $table = 'whatsapp_sessions';

    protected $fillable = [
        'phone_number',
        'business_id',
        'staff_id',
        'current_state',
        'state_data',
        'expires_at',
    ];

    protected $casts = [
        'state_data' => 'array',
        'expires_at' => 'datetime',
    ];

    public function business(): BelongsTo
    {
        return $this->belongsTo(Business::class);
    }

    public function staff(): BelongsTo
    {
        return $this->belongsTo(User::class, 'staff_id');
    }

    /**
     * Check if the session is still active
     */
    public function isExpired(): bool
    {
        return $this->expires_at && $this->expires_at->isPast();
    }
}
