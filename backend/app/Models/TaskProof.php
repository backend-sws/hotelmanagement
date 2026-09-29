<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TaskProof extends Model
{
    use HasFactory;

    protected $table = 'task_proofs';

    protected $fillable = [
        'task_id',
        'staff_id',
        'raw_photo_url',
        'watermarked_photo_url',
        'lat',
        'lng',
        'distance_from_site',
        'is_gallery_photo',
        'ai_confidence',
        'is_ai_approved',
        'ai_analysis',
        'notes',
    ];

    protected $casts = [
        'lat'                => 'float',
        'lng'                => 'float',
        'distance_from_site' => 'float',
        'is_gallery_photo'   => 'boolean',
        'ai_confidence'      => 'float',
        'is_ai_approved'     => 'boolean',
        'ai_analysis'        => 'array',
    ];

    public function task(): BelongsTo
    {
        return $this->belongsTo(FieldTask::class, 'task_id');
    }

    public function staff(): BelongsTo
    {
        return $this->belongsTo(User::class, 'staff_id');
    }
}
