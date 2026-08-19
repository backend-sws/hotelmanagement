<?php

namespace App\Models;

use App\Traits\LogsActivity;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HotelHousekeepingTask extends Model
{
    use HasFactory, LogsActivity;

    protected $fillable = [
        'business_id',
        'room_id',
        'booking_id',
        'task_type',
        'assigned_user_id',
        'priority',
        'status',
        'started_at',
        'completed_at',
        'notes',
        'issue_description',
        'images',
    ];

    protected $casts = [
        'started_at' => 'datetime',
        'completed_at' => 'datetime',
        'images' => 'array',
    ];

    public function business(): BelongsTo
    {
        return $this->belongsTo(Business::class);
    }

    public function room(): BelongsTo
    {
        return $this->belongsTo(HotelRoom::class, 'room_id');
    }

    public function booking(): BelongsTo
    {
        return $this->belongsTo(HotelBooking::class, 'booking_id');
    }

    public function assignee(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_user_id');
    }
}
