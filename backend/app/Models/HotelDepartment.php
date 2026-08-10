<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HotelDepartment extends Model
{
    protected $fillable = [
        'business_id', 'name', 'description', 'color', 'head_user_id', 'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function head()
    {
        return $this->belongsTo(User::class, 'head_user_id');
    }

    public function rosterEntries()
    {
        return $this->hasMany(HotelShiftRoster::class, 'department_id');
    }
}
