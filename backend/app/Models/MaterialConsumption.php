<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MaterialConsumption extends Model
{
    use HasFactory;

    protected $fillable = [
        'business_id',
        'project_id',
        'consumption_number',
        'date',
        'notes',
        'entered_by',
    ];

    protected $casts = [
        'date' => 'date',
    ];

    public function business(): BelongsTo
    {
        return $this->belongsTo(Business::class);
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function enteredBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'entered_by');
    }

    public function items(): HasMany
    {
        return $this->hasMany(MaterialConsumptionItem::class, 'consumption_id');
    }
}
