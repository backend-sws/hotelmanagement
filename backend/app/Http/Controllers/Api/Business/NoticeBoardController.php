<?php

namespace App\Http\Controllers\Api\Business;

use App\Http\Controllers\Controller;
use App\Services\Business\NoticeBoardService;
use Illuminate\Http\Request;

class NoticeBoardController extends Controller
{
    public function __construct(private NoticeBoardService $noticeBoardService) {}

    /**
     * GET /api/business/notices
     * Get notices visible to the logged-in user.
     */
    public function index(Request $request)
    {
        $notices = $this->noticeBoardService->getForUser(
            auth()->id(),
            $request->only(['visibility', 'per_page'])
        );
        return response()->json(['data' => $notices]);
    }

    /**
     * POST /api/business/notices
     * Create a public or private notice.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'          => 'required|string|max:255',
            'body'           => 'required|string',
            'visibility'     => 'required|in:public,private',
            'target_user_id' => 'required_if:visibility,private|nullable|exists:users,id',
            'is_pinned'      => 'nullable|boolean',
            'expires_at'     => 'nullable|date|after:now',
        ]);

        $notice = $this->noticeBoardService->create($validated);
        return response()->json(['data' => $notice->load('postedBy:id,name', 'targetUser:id,name')], 201);
    }

    /**
     * POST /api/business/notices/{id}/read
     * Mark a notice as read by the current user.
     */
    public function markRead(int $id)
    {
        $this->noticeBoardService->markRead($id, auth()->id());
        return response()->json(['message' => 'Marked as read.']);
    }

    /**
     * POST /api/business/notices/{id}/pin
     * Toggle pin status (admin only).
     */
    public function togglePin(int $id)
    {
        $notice = $this->noticeBoardService->togglePin($id);
        return response()->json(['data' => $notice]);
    }

    /**
     * DELETE /api/business/notices/{id}
     * Delete a notice (poster or admin).
     */
    public function destroy(int $id)
    {
        $this->noticeBoardService->delete($id);
        return response()->json(['message' => 'Notice deleted successfully.']);
    }

    /**
     * GET /api/business/notices/unread-count
     * Get unread notice count for current user.
     */
    public function unreadCount()
    {
        $count = $this->noticeBoardService->unreadCount(auth()->id());
        return response()->json(['unread_count' => $count]);
    }
}
