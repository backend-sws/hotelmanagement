<?php

namespace App\Services\Business;

use App\Models\NoticeBoard;
use App\Models\NoticeBoardRead;

class NoticeBoardService
{
    /**
     * Get notices visible to a user (public + private targeting them).
     */
    public function getForUser(int $userId, array $filters = [])
    {
        $businessId = app('current_business_id');

        $query = NoticeBoard::with(['postedBy:id,name', 'targetUser:id,name'])
            ->where('business_id', $businessId)
            ->active()
            ->visibleTo($userId)
            ->orderByDesc('is_pinned')
            ->orderByDesc('created_at');

        if (!empty($filters['visibility'])) {
            $query->where('visibility', $filters['visibility']);
        }

        $perPage = $filters['per_page'] ?? 20;
        $notices = $query->paginate($perPage);

        // Append read status for each notice
        $readNoticeIds = NoticeBoardRead::where('user_id', $userId)
            ->whereIn('notice_id', $notices->pluck('id'))
            ->pluck('notice_id')
            ->toArray();

        $notices->getCollection()->transform(function ($notice) use ($readNoticeIds, $userId) {
            $notice->is_read = in_array($notice->id, $readNoticeIds);
            return $notice;
        });

        return $notices;
    }

    /**
     * Create a notice (public or private).
     */
    public function create(array $data): NoticeBoard
    {
        $businessId = app('current_business_id');

        return NoticeBoard::create([
            'business_id'    => $businessId,
            'posted_by'      => auth()->id(),
            'title'          => $data['title'],
            'body'           => $data['body'],
            'visibility'     => $data['visibility'] ?? 'public',
            'target_user_id' => ($data['visibility'] === 'private') ? ($data['target_user_id'] ?? null) : null,
            'is_pinned'      => $data['is_pinned'] ?? false,
            'expires_at'     => $data['expires_at'] ?? null,
        ]);
    }

    /**
     * Mark a notice as read by a user.
     */
    public function markRead(int $noticeId, int $userId): void
    {
        NoticeBoardRead::firstOrCreate(
            ['notice_id' => $noticeId, 'user_id' => $userId],
            ['read_at' => now()]
        );
    }

    /**
     * Delete a notice. Only poster or admin (owner) can delete.
     */
    public function delete(int $id): void
    {
        $businessId = app('current_business_id');
        $notice = NoticeBoard::where('business_id', $businessId)->findOrFail($id);

        $user = auth()->user();
        $ownerId = \Illuminate\Support\Facades\DB::table('businesses')
            ->where('id', $businessId)->value('owner_id');

        if ($notice->posted_by !== $user->id && $user->id !== $ownerId && !$user->hasRole('Superadmin')) {
            throw new \Exception('You are not authorized to delete this notice.');
        }

        $notice->delete();
    }

    /**
     * Toggle pin status. Only admin/owner can pin.
     */
    public function togglePin(int $id): NoticeBoard
    {
        $businessId = app('current_business_id');
        $notice = NoticeBoard::where('business_id', $businessId)->findOrFail($id);
        $notice->update(['is_pinned' => !$notice->is_pinned]);
        return $notice->fresh();
    }

    /**
     * Count unread notices for a user.
     */
    public function unreadCount(int $userId): int
    {
        $businessId = app('current_business_id');

        $total = NoticeBoard::where('business_id', $businessId)
            ->active()
            ->visibleTo($userId)
            ->count();

        $read = NoticeBoardRead::whereIn(
            'notice_id',
            NoticeBoard::where('business_id', $businessId)->active()->visibleTo($userId)->select('id')
        )->where('user_id', $userId)->count();

        return max(0, $total - $read);
    }
}
