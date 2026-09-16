<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Traits\BelongsToBusiness;

class NoticeBoard extends Model
{
    use HasFactory, BelongsToBusiness;

    protected $table = 'notice_board';

    protected $fillable = [
        'business_id',
        'posted_by',
        'title',
        'body',
        'visibility',
        'target_user_id',
        'is_pinned',
        'expires_at',
    ];

    protected $casts = [
        'is_pinned' => 'boolean',
        'expires_at' => 'datetime',
    ];

    public function postedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'posted_by');
    }

    public function targetUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'target_user_id');
    }

    public function reads(): HasMany
    {
        return $this->hasMany(NoticeBoardRead::class, 'notice_id');
    }

    /**
     * Check if a given user has read this notice.
     */
    public function isReadBy(int $userId): bool
    {
        return $this->reads()->where('user_id', $userId)->exists();
    }

    /**
     * Scope: active notices (not expired).
     */
    public function scopeActive($query)
    {
        return $query->where(function ($q) {
            $q->whereNull('expires_at')->orWhere('expires_at', '>=', now());
        });
    }

    /**
     * Scope: visible to a given user (public OR private targeting them OR posted by them).
     */
    public function scopeVisibleTo($query, int $userId)
    {
        return $query->where(function ($q) use ($userId) {
            $q->where('visibility', 'public')
              ->orWhere('target_user_id', $userId)
              ->orWhere('posted_by', $userId);
        });
    }
}
