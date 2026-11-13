<?php

namespace App\Http\Controllers\Api\Business;

use App\Http\Controllers\Controller;
use App\Models\LeaveRequest;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;

class LeaveRequestController extends Controller
{
    private function canManageLeaves($user): bool
    {
        if ($user->hasRole(['Business Admin', 'admin', 'manager', 'Superadmin'])) {
            return true;
        }
        if ($user->can('manage_leaves') || $user->can('manage_attendance')) {
            return true;
        }
        $businessId = app('current_business_id');
        $bu = \Illuminate\Support\Facades\DB::table('business_user')
            ->where('business_id', $businessId)
            ->where('user_id', $user->id)
            ->first();
        if ($bu && in_array(strtolower($bu->role ?? ''), ['manager', 'hr', 'admin'])) {
            return true;
        }
        return false;
    }

    public function index(Request $request)
    {
        $query = LeaveRequest::with(['user', 'approvedBy'])->orderBy('created_at', 'desc');

        $user = $request->user();
        $isManager = $this->canManageLeaves($user);
        
        if (!$isManager) {
            $query->where('user_id', $user->id);
        } else if ($request->has('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Filter by request_type: leave or wfh
        if ($request->has('request_type')) {
            $query->where('request_type', $request->request_type);
        }

        // Filter for WFH not yet attendance-marked
        if ($request->boolean('wfh_pending_attendance')) {
            $query->where('request_type', 'wfh')
                  ->where('status', 'approved')
                  ->where('wfh_attendance_marked', false);
        }

        return response()->json([
            'success' => true,
            'data' => $query->get()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'request_type'  => 'nullable|in:leave,wfh',
            'leave_type'    => 'required|string',
            'leave_category' => 'nullable|in:paid,unpaid,sick,casual,earned,comp_off',
            'from_date'     => 'required|date',
            'to_date'       => 'required|date|after_or_equal:from_date',
            'reason'        => 'required|string',
        ]);

        $businessId = app('current_business_id');
        $workSetting = \App\Models\BusinessWorkSetting::where('business_id', $businessId)->first();
        $isShortNotice = false;

        if ($workSetting && ($workSetting->enable_leave_notice_rule ?? true)) {
            $requiredNoticeDays = (int) ($workSetting->leave_notice_days_required ?? 2);
            $fromDate = \Carbon\Carbon::parse($validated['from_date'])->startOfDay();
            $today = \Carbon\Carbon::today();
            $advanceDays = $today->diffInDays($fromDate, false);

            if ($advanceDays < $requiredNoticeDays) {
                $isShortNotice = true;
            }
        }

        $leave = LeaveRequest::create([
            'business_id'    => $businessId,
            'user_id'        => $request->user()->id,
            'request_type'   => $validated['request_type'] ?? 'leave',
            'leave_type'     => $validated['leave_type'],
            'leave_category' => $validated['leave_category'] ?? 'paid',
            'from_date'      => $validated['from_date'],
            'to_date'        => $validated['to_date'],
            'reason'         => $validated['reason'],
            'is_short_notice'=> $isShortNotice,
            'status'         => 'pending',
        ]);

        return response()->json([
            'success' => true,
            'message' => $leave->isWfh() ? 'WFH request submitted successfully.' : 'Leave request submitted successfully.',
            'data'    => $leave->load('user')
        ]);
    }

    public function show(LeaveRequest $leaveRequest)
    {
        return response()->json([
            'success' => true,
            'data' => $leaveRequest->load(['user', 'approvedBy'])
        ]);
    }

    public function update(Request $request, LeaveRequest $leaveRequest)
    {
        // Only allow updating if status is pending
        if ($leaveRequest->status !== 'pending') {
            return response()->json(['message' => 'Cannot update a processed request.'], 403);
        }

        // Users can only update their own requests
        if ($request->user()->id !== $leaveRequest->user_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'leave_type' => 'sometimes|string',
            'from_date' => 'sometimes|date',
            'to_date' => 'sometimes|date|after_or_equal:from_date',
            'reason' => 'sometimes|string',
        ]);

        $leaveRequest->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Leave request updated.',
            'data' => $leaveRequest
        ]);
    }

    public function destroy(Request $request, LeaveRequest $leaveRequest)
    {
        $user = $request->user();
        $isManager = $this->canManageLeaves($user);

        // Staff can only delete their own request if pending
        if (!$isManager && ($leaveRequest->status !== 'pending' || $user->id !== $leaveRequest->user_id)) {
            return response()->json(['message' => 'Cannot delete this request.'], 403);
        }

        if ($leaveRequest->status === 'approved') {
            app(\App\Services\Business\AttendanceService::class)->removeLeaveFromAttendance($leaveRequest);
        }

        $leaveRequest->delete();

        return response()->json([
            'success' => true,
            'message' => 'Leave request removed successfully.'
        ]);
    }

    /**
     * POST /api/business/leave-requests/{id}/cancel
     * Allows staff (their own requests) and managers/admins/HR to cancel pending or approved leaves.
     * When an approved leave is cancelled, reverts attendance records and restores leave quota.
     */
    public function cancel(Request $request, $id)
    {
        $user = $request->user();
        $isManager = $this->canManageLeaves($user);

        $leaveRequest = LeaveRequest::findOrFail($id);

        // Staff can only cancel their own request
        if (!$isManager && $leaveRequest->user_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized to cancel this leave request.'], 403);
        }

        // Cannot cancel already rejected or already cancelled request
        if (in_array($leaveRequest->status, ['rejected', 'cancelled'])) {
            return response()->json(['message' => 'Leave request is already ' . $leaveRequest->status . '.'], 400);
        }

        $prevStatus = $leaveRequest->status;

        $cancelNote = $request->input('remark') ?: 'Cancelled by ' . ($isManager ? 'Manager/Admin' : 'Staff');
        $newRemark = $leaveRequest->admin_remark 
            ? $leaveRequest->admin_remark . ' | ' . $cancelNote 
            : $cancelNote;

        $leaveRequest->update([
            'status'       => 'cancelled',
            'admin_remark' => $newRemark,
        ]);

        // If previously approved, remove the leave from attendance records
        if ($prevStatus === 'approved') {
            app(\App\Services\Business\AttendanceService::class)->removeLeaveFromAttendance($leaveRequest);
        }

        return response()->json([
            'success' => true,
            'message' => 'Leave request has been successfully cancelled.',
            'data'    => $leaveRequest->fresh(['user', 'approvedBy'])
        ]);
    }

    public function updateStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'status'       => 'required|in:approved,rejected,cancelled',
            'admin_remark' => 'nullable|string|max:500',
        ]);

        $user = $request->user();
        $isManager = $this->canManageLeaves($user);

        if (!$isManager) {
            return response()->json(['message' => 'Unauthorized. Only managers can approve or reject leaves.'], 403);
        }

        $leaveRequest = LeaveRequest::findOrFail($id);
        $prevStatus = $leaveRequest->status;
        
        $leaveRequest->update([
            'status'       => $validated['status'],
            'approved_by'  => $user->id,
            'admin_remark' => $validated['admin_remark'] ?? null,
        ]);

        // Auto-reflect in attendance
        $attendanceService = app(\App\Services\Business\AttendanceService::class);
        if ($validated['status'] === 'approved') {
            $attendanceService->applyApprovedLeaveToAttendance($leaveRequest, $user->id);
        } elseif (in_array($validated['status'], ['rejected', 'cancelled']) && $prevStatus === 'approved') {
            $attendanceService->removeLeaveFromAttendance($leaveRequest);
        }

        return response()->json([
            'success' => true,
            'message' => 'Leave status updated successfully.',
            'data'    => $leaveRequest->load(['user', 'approvedBy'])
        ]);
    }

    /**
     * PATCH /api/business/leave-requests/{id}/override-category
     * Admin overrides the leave category: paid → unpaid or vice versa.
     * This override is respected by PayrollService when calculating salary.
     */
    public function overrideCategory(Request $request, $id)
    {
        $user = $request->user();
        $isManager = $this->canManageLeaves($user);

        if (!$isManager) {
            return response()->json(['message' => 'Unauthorized. Only managers can override leave category.'], 403);
        }

        $request->validate([
            'admin_override_category' => 'required|in:paid,unpaid',
            'admin_remark'            => 'nullable|string|max:500',
        ]);

        $leaveRequest = LeaveRequest::findOrFail($id);

        $leaveRequest->update([
            'admin_override_category' => $request->admin_override_category,
            'admin_remark'            => $request->admin_remark ?? $leaveRequest->admin_remark,
        ]);

        if ($leaveRequest->status === 'approved' && $leaveRequest->request_type === 'leave') {
            app(\App\Services\Business\AttendanceService::class)->applyApprovedLeaveToAttendance($leaveRequest, $user->id);
        }

        return response()->json([
            'success' => true,
            'message' => 'Leave category overridden to ' . $request->admin_override_category . '.',
            'data'    => $leaveRequest->load(['user', 'approvedBy'])
        ]);
    }
}
