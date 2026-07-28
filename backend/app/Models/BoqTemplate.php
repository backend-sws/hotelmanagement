<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class BoqTemplate extends Model
{
    use HasFactory;

    protected $fillable = [
        'business_id',
        'project_id',
        'name',
        'client_name',
        'project_name',
        'status',
        'validity_date',
        'notes',
        'total_amount',
    ];

    protected $casts = [
        'validity_date' => 'date',
        'total_amount' => 'decimal:2',
    ];

    public function business(): BelongsTo
    {
        return $this->belongsTo(Business::class);
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function sections(): HasMany
    {
        return $this->hasMany(BoqSection::class, 'boq_id')->orderBy('sort_order');
    }

    public function items(): HasMany
    {
        return $this->hasMany(BoqItem::class, 'boq_id')->orderBy('sort_order');
    }
}
