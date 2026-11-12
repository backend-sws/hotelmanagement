<?php

namespace App\Http\Controllers\Api\Business;

use App\Http\Controllers\BaseController;
use App\Services\Business\AttendanceService;
use Illuminate\Http\Request;

class AttendanceController extends BaseController
{
    public function __construct(private AttendanceService $attendanceService) {}

    public function index(Request $request)
    {
        try {
            $user = $request->user();
            $filters = $request->all();
            
            // If user is not manager/admin, they can only see their own attendance
            if (!$user->hasRole(['Business Admin', 'admin', 'manager']) && !$user->hasRole('Superadmin')) {
                $filters['user_id'] = $user->id;
            }

            $attendances = $this->attendanceService->getAttendance($filters);
            return $this->success($attendances, 'Attendance retrieved successfully');
        } catch (\Throwable $e) {
            return $this->error($e->getMessage(), 500);
        }
    }

    public function import(Request $request)
    {
        $user = $request->user();
        if (!$user->hasRole(['Business Admin', 'admin', 'manager'])) {
            return $this->error('Unauthorized to import attendance', 403);
        }

        $request->validate([
            'records' => 'required|array',
            'records.*.user_id' => 'required|integer|exists:users,id',
            'records.*.date' => 'required|date',
            'records.*.status' => 'required|in:present,absent,half_day,leave,week_off,holiday,late,clear',
            'records.*.late_mark_minutes' => 'nullable|integer|min:0',
            'records.*.check_in_time' => 'nullable|date_format:H:i:s,H:i',
            'records.*.check_out_time' => 'nullable|date_format:H:i:s,H:i',
            'records.*.notes' => 'nullable|string',
        ]);

        try {
            $this->attendanceService->importAttendance($request->input('records'));
            return $this->success(null, 'Attendance imported successfully');
        } catch (\Throwable $e) {
            return $this->error($e->getMessage(), 422);
        }
    }

    public function checkIn(Request $request)
    {
        $businessId = app('current_business_id');
        $hasApprovedWfh = \App\Models\LeaveRequest::where('business_id', $businessId)
            ->where('user_id', $request->user()->id)
            ->where('request_type', 'wfh')
            ->where('status', 'approved')
            ->whereDate('from_date', '<=', now()->toDateString())
            ->whereDate('to_date', '>=', now()->toDateString())
            ->exists();

        $request->validate([
            'latitude'  => $hasApprovedWfh ? 'nullable|numeric' : 'required|numeric',
            'longitude' => $hasApprovedWfh ? 'nullable|numeric' : 'required|numeric',
            'photo'     => 'required|string',
        ]);

        try {
            $attendance = $this->attendanceService->checkIn($request->all());
            return $this->success($attendance, 'Checked in successfully', 201);
        } catch (\Throwable $e) {
            return $this->error($e->getMessage(), 422);
        }
    }

    public function checkOut(Request $request)
    {
        $businessId = app('current_business_id');
        $hasApprovedWfh = \App\Models\LeaveRequest::where('business_id', $businessId)
            ->where('user_id', $request->user()->id)
            ->where('request_type', 'wfh')
            ->where('status', 'approved')
            ->whereDate('from_date', '<=', now()->toDateString())
            ->whereDate('to_date', '>=', now()->toDateString())
            ->exists();

        $request->validate([
            'latitude'  => $hasApprovedWfh ? 'nullable|numeric' : 'required|numeric',
            'longitude' => $hasApprovedWfh ? 'nullable|numeric' : 'required|numeric',
            'photo'     => 'nullable|string',
        ]);

        try {
            $attendance = $this->attendanceService->checkOut($request->all());
            return $this->success($attendance, 'Checked out successfully');
        } catch (\Throwable $e) {
            return $this->error($e->getMessage(), 422);
        }
    }

    /**
     * POST /api/business/attendance/lunch-start
     * Staff member marks start of lunch break.
     */
    public function startLunch(Request $request)
    {
        try {
            $attendance = $this->attendanceService->startLunch();
            return $this->success($attendance, 'Lunch break started. Enjoy your meal!');
        } catch (\Throwable $e) {
            return $this->error($e->getMessage(), 422);
        }
    }

    /**
     * POST /api/business/attendance/lunch-end
     * Staff member marks end of lunch break and resumes work.
     */
    public function endLunch(Request $request)
    {
        try {
            $attendance = $this->attendanceService->endLunch();
            return $this->success($attendance, 'Lunch break ended. Welcome back to work!');
        } catch (\Throwable $e) {
            return $this->error($e->getMessage(), 422);
        }
    }

    public function markManual(Request $request)
    {
        $user = $request->user();
        if (!$user->hasRole(['Business Admin', 'admin', 'manager'])) {
            return $this->error('Unauthorized to manually mark attendance', 403);
        }

        $request->validate([
            'user_id' => 'required|integer|exists:users,id',
            'date' => 'required|date',
            'status' => 'required|in:present,absent,half_day,leave,week_off,holiday,late,clear',
            'late_mark_minutes' => 'nullable|integer|min:0',
            'check_in_time'     => 'nullable|string',
            'check_out_time'    => 'nullable|string',
            'lunch_minutes'     => 'nullable|integer|min:0|max:300',
            'lunch_start_time'  => 'nullable|string',
            'lunch_end_time'    => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        try {
            $attendance = $this->attendanceService->markAttendance($request->all());
            return $this->success($attendance, 'Attendance marked successfully');
        } catch (\Throwable $e) {
            return $this->error($e->getMessage(), 422);
        }
    }

    public function monthlyReport(Request $request)
    {
        $request->validate([
            'month' => 'required|date_format:Y-m',
        ]);

        try {
            $user = $request->user();
            $isManager = $user->hasRole(['Business Admin', 'admin', 'manager']) || $user->hasRole('Superadmin');
            
            $report = $this->attendanceService->getMonthlyReport(
                $request->input('month'), 
                $isManager ? null : $user->id
            );
            return $this->success($report, 'Monthly report retrieved successfully');
        } catch (\Throwable $e) {
            return $this->error($e->getMessage(), 500);
        }
    }

    public function todayStatus(Request $request)
    {
        try {
            $user = $request->user();
            $businessId = app('current_business_id');
            $today = now()->toDateString();

            $status = $this->attendanceService->getTodayStatus();

            $approvedWfh = \App\Models\LeaveRequest::where('business_id', $businessId)
                ->where('user_id', $user->id)
                ->where('request_type', 'wfh')
                ->where('status', 'approved')
                ->whereDate('from_date', '<=', $today)
                ->whereDate('to_date', '>=', $today)
                ->first();

            $data = $status ? $status->toArray() : [];
            $data['has_approved_wfh'] = !empty($approvedWfh);
            if ($approvedWfh) {
                $data['approved_wfh_request'] = $approvedWfh;
            }

            // Forgot checkout alert evaluation (e.g. alert after 7 PM)
            $workSetting = \App\Models\BusinessWorkSetting::where('business_id', $businessId)->first();
            $alertTime = $workSetting->forgot_checkout_alert_time ?? '19:00:00';
            $enableAlert = $workSetting->enable_forgot_checkout_alert ?? true;
            $nowTime = now()->format('H:i:s');
            $isPastAlertTime = $nowTime >= $alertTime;

            $isCheckedIn = !empty($status) && !empty($status->check_in_time) && empty($status->check_out_time);
            $shouldAlertCheckout = $enableAlert && $isCheckedIn && $isPastAlertTime;

            $data['should_alert_checkout'] = $shouldAlertCheckout;
            $data['is_past_alert_time'] = $isPastAlertTime;
            $data['forgot_checkout_alert_time'] = substr($alertTime, 0, 5);
            $data['forgot_checkout_policy'] = $workSetting->forgot_checkout_policy ?? 'half_day';
            $data['has_pending_regularization'] = !empty($status) && $status->regularization_status === 'pending';
            if ($shouldAlertCheckout) {
                $data['alert_message'] = "You checked in at {$status->check_in_time} but have not checked out yet. If you have already left the office premises, please submit an Out-of-Geofence Punch-Out Request to your manager to avoid half-day capping.";
            }

            // Calculate staff member's current month late punches and remaining free passes
            $startOfMonth = now()->startOfMonth()->toDateString();
            $endOfMonth = now()->endOfMonth()->toDateString();
            $monthlyLateCount = \App\Models\Attendance::where('business_id', $businessId)
                ->where('user_id', $user->id)
                ->whereBetween('date', [$startOfMonth, $endOfMonth])
                ->where(function ($q) {
                    $q->where('status', 'late')
                      ->orWhere('late_mark_minutes', '>', 0)
                      ->orWhere('notes', 'LIKE', '%late entry%');
                })
                ->count();

            $freeWaiver = (int) ($workSetting->late_free_waiver_count ?? 2);
            $enableLateDeduction = $workSetting->enable_late_deduction ?? true;
            $freeLatesRemaining = max(0, $freeWaiver - $monthlyLateCount);

            $data['monthly_late_count'] = $monthlyLateCount;
            $data['late_free_waiver_count'] = $freeWaiver;
            $data['free_lates_remaining'] = $freeLatesRemaining;
            $data['enable_late_deduction'] = $enableLateDeduction;
            $data['late_deduction_trigger_count'] = (int) ($workSetting->late_deduction_trigger_count ?? 4);
            $data['late_deduction_amount_type'] = (float) ($workSetting->late_deduction_amount_type ?? 1.0);
            $data['enable_absence_penalty'] = $workSetting->enable_absence_penalty ?? true;
            $data['absence_penalty_multiplier'] = (float) ($workSetting->absence_penalty_multiplier ?? 2.0);
            $data['enable_leave_notice_rule'] = $workSetting->enable_leave_notice_rule ?? true;
            $data['leave_notice_days_required'] = (int) ($workSetting->leave_notice_days_required ?? 2);

            return $this->success($data, 'Today status retrieved successfully');
        } catch (\Throwable $e) {
            return $this->error($e->getMessage(), 500);
        }
    }

    public function approve(Request $request, int $id)
    {
        $user = $request->user();
        if (!$user->hasRole(['Business Admin', 'admin', 'manager']) && !$user->hasRole('Superadmin')) {
            return $this->forbidden('Unauthorized to approve attendance');
        }

        try {
            $attendance = $this->attendanceService->approveAttendance($id);
            return $this->success($attendance, 'Attendance approved successfully');
        } catch (\Throwable $e) {
            return $this->error($e->getMessage(), 500);
        }
    }

    public function unapprove(Request $request, int $id)
    {
        $user = $request->user();
        if (!$user->hasRole(['Business Admin', 'admin', 'manager']) && !$user->hasRole('Superadmin')) {
            return $this->forbidden('Unauthorized to unapprove attendance');
        }

        try {
            $attendance = $this->attendanceService->unapproveAttendance($id);
            return $this->success($attendance, 'Attendance unapproved successfully');
        } catch (\Throwable $e) {
            return $this->error($e->getMessage(), 500);
        }
    }

    // ── REGULARIZATION ────────────────────────────────────────────────────────

    /**
     * POST /api/business/attendance/regularize
     * Staff submits a backdated time-correction request.
     */
    public function requestRegularization(Request $request)
    {
        $request->validate([
            'date'               => 'required|date',
            'user_id'            => 'nullable|integer',
            'requested_checkin'  => 'nullable|date_format:H:i,H:i:s',
            'requested_checkout' => 'nullable|date_format:H:i,H:i:s',
            'reason'             => 'required|string|max:500',
        ]);

        try {
            $attendance = $this->attendanceService->requestRegularization($request->all());
            return $this->success($attendance, 'Regularization request submitted successfully.');
        } catch (\Throwable $e) {
            return $this->error($e->getMessage(), 422);
        }
    }

    /**
     * GET /api/business/attendance/regularization-requests
     * Admin sees all pending regularization requests.
     */
    public function regularizationRequests(Request $request)
    {
        $user = $request->user();
        if (!$user->hasRole(['Business Admin', 'admin', 'manager']) && !$user->hasRole('Superadmin')) {
            return $this->forbidden('Unauthorized');
        }

        try {
            $requests = $this->attendanceService->getPendingRegularizations();
            return $this->success($requests, 'Regularization requests retrieved.');
        } catch (\Throwable $e) {
            return $this->error($e->getMessage(), 500);
        }
    }

    /**
     * POST /api/business/attendance/{id}/regularize/approve
     * Admin approves a regularization request → updates actual times.
     */
    public function approveRegularization(Request $request, int $id)
    {
        $user = $request->user();
        if (!$user->hasRole(['Business Admin', 'admin', 'manager']) && !$user->hasRole('Superadmin')) {
            return $this->forbidden('Unauthorized');
        }

        try {
            $attendance = $this->attendanceService->approveRegularization($id);
            return $this->success($attendance, 'Regularization approved. Times updated.');
        } catch (\Throwable $e) {
            return $this->error($e->getMessage(), 422);
        }
    }

    /**
     * POST /api/business/attendance/{id}/regularize/reject
     * Admin rejects a regularization request.
     */
    public function rejectRegularization(Request $request, int $id)
    {
        $user = $request->user();
        if (!$user->hasRole(['Business Admin', 'admin', 'manager']) && !$user->hasRole('Superadmin')) {
            return $this->forbidden('Unauthorized');
        }

        try {
            $attendance = $this->attendanceService->rejectRegularization($id);
            return $this->success($attendance, 'Regularization request rejected.');
        } catch (\Throwable $e) {
            return $this->error($e->getMessage(), 422);
        }
    }

    /**
     * PATCH /api/business/attendance/{id}/edit-time
     * Admin directly edits check-in/out time without a request.
     */
    public function adminEditTime(Request $request, int $id)
    {
        $user = $request->user();
        if (!$user->hasRole(['Business Admin', 'admin', 'manager']) && !$user->hasRole('Superadmin')) {
            return $this->forbidden('Unauthorized to edit attendance time');
        }

        $request->validate([
            'check_in_time'    => 'nullable|date_format:H:i,H:i:s',
            'check_out_time'   => 'nullable|date_format:H:i,H:i:s',
            'lunch_minutes'    => 'nullable|integer|min:0|max:300',
            'lunch_start_time' => 'nullable|date_format:H:i,H:i:s',
            'lunch_end_time'   => 'nullable|date_format:H:i,H:i:s',
            'notes'            => 'nullable|string|max:500',
        ]);

        try {
            $attendance = $this->attendanceService->adminEditTime($id, $request->all());
            return $this->success($attendance, 'Attendance time updated successfully.');
        } catch (\Throwable $e) {
            return $this->error($e->getMessage(), 422);
        }
    }

    /**
     * POST /api/business/attendance/wfh-mark/{leaveRequestId}
     * Admin marks WFH attendance after approving a WFH leave request.
     */
    public function markWfhAttendance(Request $request, int $leaveRequestId)
    {
        $user = $request->user();
        if (!$user->hasRole(['Business Admin', 'admin', 'manager']) && !$user->hasRole('Superadmin')) {
            return $this->forbidden('Unauthorized');
        }

        try {
            $attendance = $this->attendanceService->markWfhAttendance($leaveRequestId);
            return $this->success($attendance, 'WFH attendance marked successfully.');
        } catch (\Throwable $e) {
            return $this->error($e->getMessage(), 422);
        }
    }

    /**
     * PUT /api/business/attendance/{id}/approve-overtime
     */
    public function approveOvertime(Request $request, int $id)
    {
        $user = $request->user();
        if (!$user->hasRole(['Business Admin', 'admin', 'manager']) && !$user->hasRole('Superadmin')) {
            return $this->forbidden('Unauthorized to approve overtime');
        }

        try {
            $attendance = $this->attendanceService->approveOvertime($id);
            return $this->success($attendance, 'Overtime approved successfully.');
        } catch (\Throwable $e) {
            return $this->error($e->getMessage(), 422);
        }
    }

    /**
     * PUT /api/business/attendance/{id}/reject-overtime
     */
    public function rejectOvertime(Request $request, int $id)
    {
        $user = $request->user();
        if (!$user->hasRole(['Business Admin', 'admin', 'manager']) && !$user->hasRole('Superadmin')) {
            return $this->forbidden('Unauthorized to reject overtime');
        }

        try {
            $attendance = $this->attendanceService->rejectOvertime($id);
            return $this->success($attendance, 'Overtime rejected.');
        } catch (\Throwable $e) {
            return $this->error($e->getMessage(), 422);
        }
    }

    /**
     * PATCH /api/business/attendance/{id}/edit-overtime
     */
    public function editOvertime(Request $request, int $id)
    {
        $user = $request->user();
        if (!$user->hasRole(['Business Admin', 'admin', 'manager']) && !$user->hasRole('Superadmin')) {
            return $this->forbidden('Unauthorized to edit overtime');
        }

        $request->validate([
            'overtime_hours'    => 'nullable|numeric|min:0|max:24',
            'overtime_approved' => 'nullable|boolean',
            'overtime_notes'    => 'nullable|string|max:255',
        ]);

        try {
            $attendance = $this->attendanceService->editOvertime($id, $request->all());
            return $this->success($attendance, 'Overtime updated successfully.');
        } catch (\Throwable $e) {
            return $this->error($e->getMessage(), 422);
        }
    }

    /**
     * POST /api/business/attendance/auto-absent
     * Evaluates staff shift half-time cutoffs and marks absent for no-shows.
     */
    public function triggerAutoAbsent(Request $request)
    {
        $user = $request->user();
        if (!$user->hasRole(['Business Admin', 'admin', 'manager']) && !$user->hasRole('Superadmin')) {
            return $this->forbidden('Unauthorized');
        }

        $businessId = app('current_business_id');
        $date = $request->input('date');

        try {
            $count = $this->attendanceService->autoMarkAbsentForHalfTimeNoShow($businessId, $date);
            return $this->success(['marked_absent_count' => $count], "Evaluated auto-absent: {$count} staff member(s) marked absent.");
        } catch (\Throwable $e) {
            return $this->error($e->getMessage(), 500);
        }
    }
}

