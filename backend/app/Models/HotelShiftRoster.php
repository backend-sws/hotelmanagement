<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HotelShiftRoster extends Model
{
    protected $table = 'hotel_shift_roster';

    protected $fillable = [
        'business_id', 'user_id', 'department_id', 'shift_id', 'roster_date',
        'status', 'swap_with_user_id', 'swap_reason', 'swap_status', 'approved_by', 'notes',
    ];

    protected $casts = [
        'roster_date' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function department()
    {
        return $this->belongsTo(HotelDepartment::class);
    }

    public function shift()
    {
        return $this->belongsTo(HotelShift::class);
    }

    public function swapUser()
    {
        return $this->belongsTo(User::class, 'swap_with_user_id');
    }

    public function approver()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }
}
