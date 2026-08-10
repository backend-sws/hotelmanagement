<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HotelShift extends Model
{
    protected $fillable = [
        'business_id', 'name', 'start_time', 'end_time', 'is_overnight', 'color', 'is_active',
    ];

    protected $casts = [
        'is_overnight' => 'boolean',
        'is_active'    => 'boolean',
    ];

    public function rosterEntries()
    {
        return $this->hasMany(HotelShiftRoster::class, 'shift_id');
    }

    // Computed: hours duration
    public function getDurationHoursAttribute(): float
    {
        $start = \Carbon\Carbon::parse($this->start_time);
        $end   = \Carbon\Carbon::parse($this->end_time);
        if ($this->is_overnight && $end->lt($start)) {
            $end->addDay();
        }
        return round($start->diffInMinutes($end) / 60, 1);
    }
}
