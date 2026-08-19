<?php

namespace App\Models;

use App\Traits\LogsActivity;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class BoqSection extends Model
{
    use HasFactory, LogsActivity;

    protected $fillable = [
        'boq_id',
        'section_name',
        'sort_order',
    ];

    public function boq(): BelongsTo
    {
        return $this->belongsTo(BoqTemplate::class, 'boq_id');
    }

    public function items(): HasMany
    {
        return $this->hasMany(BoqItem::class, 'boq_section_id')->orderBy('sort_order');
    }
}
