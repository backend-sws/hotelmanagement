<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Traits\BelongsToBusiness;

class BusinessHoliday extends Model
{
    use HasFactory, BelongsToBusiness;

    protected $fillable = [
        'business_id',
        'date',
        'name',
        'type',
        'is_paid',
        'description',
        'created_by',
    ];

    protected $casts = [
        'date' => 'date:Y-m-d',
        'is_paid' => 'boolean',
    ];

    public function business(): BelongsTo
    {
        return $this->belongsTo(Business::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Scope: get holidays for a given month (Y-m format).
     */
    public function scopeForMonth($query, string $month)
    {
        [$year, $mon] = explode('-', $month);
        return $query->whereYear('date', $year)->whereMonth('date', $mon);
    }

    /**
     * Scope: get holidays between two dates.
     */
    public function scopeBetweenDates($query, string $from, string $to)
    {
        return $query->whereBetween('date', [$from, $to]);
    }
}
