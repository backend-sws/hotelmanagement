<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Traits\BelongsToBusiness;

class BusinessWorkSetting extends Model
{
    use HasFactory, BelongsToBusiness;

    protected $fillable = [
        'business_id',
        'work_start_time',
        'work_end_time',
        'standard_hours_per_day',
        'work_days',
        'late_mark_grace_minutes',
        'auto_apply_holidays',
    ];

    protected $casts = [
        'work_days' => 'array',
        'standard_hours_per_day' => 'float',
        'auto_apply_holidays' => 'boolean',
    ];

    public function business(): BelongsTo
    {
        return $this->belongsTo(Business::class);
    }

    /**
     * Get default work days if not configured.
     */
    public function getWorkDaysArray(): array
    {
        return $this->work_days ?? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    }

    /**
     * Check if a given date (Carbon) is a configured working day.
     */
    public function isWorkingDay(\Carbon\Carbon $date): bool
    {
        $dayAbbr = $date->format('D'); // Mon, Tue, etc.
        return in_array($dayAbbr, $this->getWorkDaysArray());
    }
}
