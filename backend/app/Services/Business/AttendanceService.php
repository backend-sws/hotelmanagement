<?php

namespace App\Services\Business;

use App\Models\Attendance;
use App\Models\BusinessHoliday;
use App\Models\BusinessLocation;
use App\Models\BusinessWorkSetting;
use App\Models\LeaveRequest;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class AttendanceService
{
    /**
     * Check in an employee.
     * WFH-approved staff bypass geofence — auto-marked by admin approval, not self-mark.
     */
    public function checkIn(array $data): Attendance
    {
        $businessId = app('current_business_id');
        $userId = auth()->id();
        $today = now()->toDateString();

        // Check if already checked in today
        $existing = Attendance::where('user_id', $userId)
            ->where('date', $today)
            ->first();

        if ($existing && $existing->check_in_time) {
            throw new \Exception('You have already checked in today.');
        }

        // Validate geo-fence
        $isWithinFence = false;
        $locationId = null;

        if (isset($data['latitude']) && isset($data['longitude'])) {
            $location = BusinessLocation::where('is_default', true)->first();
            if ($location) {
                $isWithinFence = $location->isWithinFence($data['latitude'], $data['longitude']);
                $locationId = $location->id;
            } else {
                throw new \Exception('Business location is not configured. Please ask the administrator to configure shop location first.');
            }
        }

        if (!$isWithinFence) {
            throw new \Exception('You are outside the shop\'s allowed geofence radius. Please mark attendance from the shop.');
        }

        // Calculate late mark minutes using work settings
        $lateMarkMinutes = $this->calculateLateMarkMinutes($businessId, $userId, now());

        $photoPath = $data['photo'] ?? null;

        $ownerId = \Illuminate\Support\Facades\DB::table('businesses')->where('id', $businessId)->value('owner_id');

        if ($existing) {
            $existing->update([
                'status'             => 'present',
                'check_in_time'      => now()->toTimeString(),
                'check_in_photo'     => $photoPath,
                'check_in_latitude'  => $data['latitude'] ?? null,
                'check_in_longitude' => $data['longitude'] ?? null,
                'is_within_geofence' => $isWithinFence,
                'location_id'        => $locationId,
                'approved_by'        => $isWithinFence ? $ownerId : null,
                'work_type'          => $data['work_type'] ?? 'office',
                'late_mark_minutes'  => $lateMarkMinutes,
            ]);
            return $existing->fresh();
        }

        return Attendance::create([
            'business_id'        => $businessId,
            'user_id'            => $userId,
            'date'               => $today,
            'status'             => 'present',
            'check_in_time'      => now()->toTimeString(),
            'check_in_photo'     => $photoPath,
            'check_in_latitude'  => $data['latitude'] ?? null,
            'check_in_longitude' => $data['longitude'] ?? null,
            'is_within_geofence' => $isWithinFence,
            'location_id'        => $locationId,
            'approved_by'        => $isWithinFence ? $ownerId : null,
            'work_type'          => $data['work_type'] ?? 'office',
            'late_mark_minutes'  => $lateMarkMinutes,
        ]);
    }

    /**
     * Check out an employee.
     */
    public function checkOut(array $data): Attendance
    {
        $userId = auth()->id();
        $today = now()->toDateString();

        $attendance = Attendance::where('user_id', $userId)
            ->where('date', $today)
            ->first();

        if (!$attendance || !$attendance->check_in_time) {
            throw new \Exception('You need to check in first.');
        }

        if ($attendance->check_out_time) {
            throw new \Exception('You have already checked out today.');
        }

        // Validate geo-fence
        $isWithinFence = false;
        if (isset($data['latitude']) && isset($data['longitude'])) {
            $location = BusinessLocation::where('is_default', true)->first();
            if ($location) {
                $isWithinFence = $location->isWithinFence($data['latitude'], $data['longitude']);
            } else {
                throw new \Exception('Business location is not configured. Please ask the administrator to configure shop location first.');
            }
        }

        if (!$isWithinFence) {
            throw new \Exception('You are outside the shop\'s allowed geofence radius. Please mark attendance from the shop.');
        }

        $photoPath = $data['photo'] ?? null;

        $attendance->update([
            'check_out_time'      => now()->toTimeString(),
            'check_out_photo'     => $photoPath,
            'check_out_latitude'  => $data['latitude'] ?? null,
            'check_out_longitude' => $data['longitude'] ?? null,
        ]);

        // Compute and save actual hours worked
        $freshAttendance = $attendance->fresh();
        $actualHours = $freshAttendance->computeActualHours();
        if ($actualHours !== null) {
            $freshAttendance->update(['actual_hours' => $actualHours]);
        }

        return $freshAttendance->fresh();
    }

    /**
     * Manually mark attendance (by owner).
     */
    public function markAttendance(array $data): Attendance
    {
        $businessId = app('current_business_id');

        return Attendance::updateOrCreate(
            [
                'business_id' => $businessId,
                'user_id' => $data['user_id'],
                'date' => $data['date'],
            ],
            [
                'status' => $data['status'],
                'notes' => $data['notes'] ?? null,
                'approved_by' => auth()->id(),
            ]
        );
    }

    /**
     * Import attendance records in bulk.
     */
    public function importAttendance(array $records): void
    {
        $businessId = app('current_business_id');
        $approvedBy = auth()->id();

        foreach ($records as $record) {
            if ($record['status'] === 'clear') {
                Attendance::where([
                    'business_id' => $businessId,
                    'user_id' => $record['user_id'],
                    'date' => $record['date'],
                ])->delete();
            } else {
                Attendance::updateOrCreate(
                    [
                        'business_id' => $businessId,
                        'user_id' => $record['user_id'],
                        'date' => $record['date'],
                    ],
                    [
                        'status' => $record['status'],
                        'check_in_time' => $record['check_in_time'] ?? null,
                        'check_out_time' => $record['check_out_time'] ?? null,
                        'notes' => $record['notes'] ?? null,
                        'approved_by' => $approvedBy,
                    ]
                );
            }
        }
    }

    /**
     * Get attendance list with filters.
     */
    public function getAttendance(array $filters = [])
    {
        $businessId = app('current_business_id');

        if (!empty($filters['month'])) {
            $this->syncHolidaysForMonth($businessId, $filters['month']);
        } elseif (!empty($filters['from_date']) && !empty($filters['to_date'])) {
            $this->syncHolidaysBetweenDates($businessId, $filters['from_date'], $filters['to_date']);
        }

        $query = Attendance::with(['user', 'location'])
            ->orderByDesc('date');

        if (!empty($filters['user_id'])) {
            $query->where('user_id', $filters['user_id']);
        }

        if (!empty($filters['date'])) {
            $query->where('date', $filters['date']);
        }

        if (!empty($filters['from_date']) && !empty($filters['to_date'])) {
            $query->whereBetween('date', [$filters['from_date'], $filters['to_date']]);
        }

        if (!empty($filters['month'])) {
            // "2026-07" format
            $parts = explode('-', $filters['month']);
            if (count($parts) === 2) {
                $query->whereYear('date', $parts[0])
                      ->whereMonth('date', $parts[1]);
            }
        }

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        $perPage = $filters['per_page'] ?? 31;
        return $query->paginate($perPage);
    }

    /**
     * Sync business holidays for a given month into active staff attendance records.
     */
    public function syncHolidaysForMonth(int $businessId, string $month): void
    {
        $holidays = BusinessHoliday::where('business_id', $businessId)
            ->forMonth($month)
            ->get();

        $this->applyHolidaysListToStaff($businessId, $holidays);
    }

    /**
     * Sync business holidays for a given date range into active staff attendance records.
     */
    public function syncHolidaysBetweenDates(int $businessId, string $fromDate, string $toDate): void
    {
        $holidays = BusinessHoliday::where('business_id', $businessId)
            ->betweenDates($fromDate, $toDate)
            ->get();

        $this->applyHolidaysListToStaff($businessId, $holidays);
    }

    /**
     * Helper to apply a collection of BusinessHoliday models to active staff members.
     */
    private function applyHolidaysListToStaff(int $businessId, $holidays): void
    {
        if ($holidays->isEmpty()) {
            return;
        }

        $staffIds = DB::table('business_user')
            ->join('users', 'business_user.user_id', '=', 'users.id')
            ->where('business_user.business_id', $businessId)
            ->where('business_user.status', 'active')
            ->whereNull('users.deleted_at')
            ->pluck('users.id');

        if ($staffIds->isEmpty()) {
            return;
        }

        $ownerId = DB::table('businesses')->where('id', $businessId)->value('owner_id') ?? auth()->id();

        foreach ($holidays as $holiday) {
            $holidayDate = Carbon::parse($holiday->date)->format('Y-m-d');
            foreach ($staffIds as $userId) {
                $record = Attendance::where('business_id', $businessId)
                    ->where('user_id', $userId)
                    ->where('date', $holidayDate)
                    ->first();

                if (!$record) {
                    Attendance::create([
                        'business_id' => $businessId,
                        'user_id'     => $userId,
                        'date'        => $holidayDate,
                        'status'      => 'holiday',
                        'notes'       => $holiday->name,
                        'approved_by' => $ownerId,
                    ]);
                } elseif ($record->status === 'absent' || ($record->status === 'holiday' && empty($record->notes))) {
                    $record->update([
                        'status' => 'holiday',
                        'notes'  => $holiday->name,
                    ]);
                }
            }
        }
    }

    /**
     * Get monthly attendance summary for staff.
     */
    public function getMonthlyReport(string $month, ?int $userId = null): array
    {
        $businessId = app('current_business_id');

        $staffQuery = DB::table('business_user')
            ->join('users', 'business_user.user_id', '=', 'users.id')
            ->where('business_user.business_id', $businessId)
            ->where('business_user.status', 'active')
            ->whereNull('users.deleted_at')
            ->select('users.id', 'users.name');

        if ($userId !== null) {
            $staffQuery->where('users.id', $userId);
        }

        $staff = $staffQuery->get();

        $parts = explode('-', $month);
        $holidayDates = [];
        if (count($parts) === 2) {
            $holidayDates = BusinessHoliday::where('business_id', $businessId)
                ->whereYear('date', $parts[0])
                ->whereMonth('date', $parts[1])
                ->pluck('date')
                ->map(fn($d) => Carbon::parse($d)->format('Y-m-d'))
                ->toArray();
        }

        $report = [];

        foreach ($staff as $member) {
            $attendanceQuery = Attendance::where('business_id', $businessId)
                ->where('user_id', $member->id);
            if (count($parts) === 2) {
                $attendanceQuery->whereYear('date', $parts[0])
                                 ->whereMonth('date', $parts[1]);
            }
            $attendances = $attendanceQuery->get();

            $hoursSummary = $this->getWorkingHoursSummary($businessId, $member->id, $month, $holidayDates);

            $report[] = array_merge([
                'user_id' => $member->id,
                'name' => $member->name,
                'present' => $attendances->where('status', 'present')->count(),
                'absent' => $attendances->where('status', 'absent')->count(),
                'half_day' => $attendances->where('status', 'half_day')->count(),
                'leave' => $attendances->where('status', 'leave')->count(),
                'week_off' => $attendances->where('status', 'week_off')->count(),
                'holiday' => max($attendances->where('status', 'holiday')->count(), count($holidayDates)),
                'total_records' => $attendances->count(),
            ], $hoursSummary);
        }

        return $report;
    }

    /**
     * Get today's attendance status for the logged-in user.
     */
    public function getTodayStatus(): ?Attendance
    {
        return Attendance::where('user_id', auth()->id())
            ->where('date', now()->toDateString())
            ->first();
    }

    /**
     * Approve an attendance record.
     */
    public function approveAttendance(int $id): Attendance
    {
        $attendance = Attendance::findOrFail($id);
        
        $attendance->update([
            'approved_by' => auth()->id(),
        ]);

        return $attendance->fresh();
    }

    /**
     * Unapprove an attendance record.
     */
    public function unapproveAttendance(int $id): Attendance
    {
        $attendance = Attendance::findOrFail($id);
        
        $attendance->update([
            'approved_by' => null,
        ]);

        return $attendance->fresh();
    }

    // ─────────────────────────────────────────────────────────────────────────
    // REGULARIZATION (Backdated Time Correction)
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Staff submits a regularization request (backdated time correction).
     */
    public function requestRegularization(array $data): Attendance
    {
        $businessId = app('current_business_id');
        $userId = auth()->id();

        if (!empty($data['user_id'])) {
            $currentUser = auth()->user();
            if ($currentUser && ($currentUser->hasRole(['Business Admin', 'admin', 'manager']) || $currentUser->hasRole('Superadmin'))) {
                $userId = (int) $data['user_id'];
            }
        }

        $attendance = Attendance::firstOrCreate(
            [
                'business_id' => $businessId,
                'user_id'     => $userId,
                'date'        => $data['date'],
            ],
            [
                'status'      => 'absent',
            ]
        );

        if ($attendance->regularization_status === 'pending') {
            throw new \Exception('A regularization request is already pending for this date.');
        }

        $attendance->update([
            'regularization_requested_at'       => now(),
            'regularization_requested_checkin'  => $data['requested_checkin'] ?? null,
            'regularization_requested_checkout' => $data['requested_checkout'] ?? null,
            'regularization_reason'             => $data['reason'],
            'regularization_status'             => 'pending',
            'regularization_approved_by'        => null,
            'regularization_actioned_at'        => null,
        ]);

        return $attendance->fresh();
    }

    /**
     * Admin approves a regularization request → updates actual check-in/out times.
     */
    public function approveRegularization(int $attendanceId): Attendance
    {
        $attendance = Attendance::findOrFail($attendanceId);

        if ($attendance->regularization_status !== 'pending') {
            throw new \Exception('No pending regularization request found.');
        }

        $updates = [
            'status'                     => 'present',
            'regularization_status'      => 'approved',
            'regularization_approved_by' => auth()->id(),
            'regularization_actioned_at' => now(),
        ];

        if ($attendance->regularization_requested_checkin) {
            $updates['check_in_time'] = $attendance->regularization_requested_checkin;
        }
        if ($attendance->regularization_requested_checkout) {
            $updates['check_out_time'] = $attendance->regularization_requested_checkout;
        }

        $attendance->update($updates);

        // Recompute actual hours after time correction
        $freshAttendance = $attendance->fresh();
        $actualHours = $freshAttendance->computeActualHours();
        if ($actualHours !== null) {
            $freshAttendance->update(['actual_hours' => $actualHours]);
        }

        return $freshAttendance->fresh();
    }

    /**
     * Admin rejects a regularization request.
     */
    public function rejectRegularization(int $attendanceId): Attendance
    {
        $attendance = Attendance::findOrFail($attendanceId);

        if ($attendance->regularization_status !== 'pending') {
            throw new \Exception('No pending regularization request found.');
        }

        $attendance->update([
            'regularization_status'      => 'rejected',
            'regularization_approved_by' => auth()->id(),
            'regularization_actioned_at' => now(),
        ]);

        return $attendance->fresh();
    }

    /**
     * Admin directly edits check-in/check-out time (no request needed).
     */
    public function adminEditTime(int $attendanceId, array $data): Attendance
    {
        $attendance = Attendance::findOrFail($attendanceId);

        $updates = [];
        if (!empty($data['check_in_time'])) {
            $updates['check_in_time'] = $data['check_in_time'];
        }
        if (!empty($data['check_out_time'])) {
            $updates['check_out_time'] = $data['check_out_time'];
        }
        if (!empty($data['notes'])) {
            $updates['notes'] = $data['notes'];
        }

        $attendance->update($updates);

        // Recompute actual hours
        $freshAttendance = $attendance->fresh();
        $actualHours = $freshAttendance->computeActualHours();
        if ($actualHours !== null) {
            $freshAttendance->update(['actual_hours' => $actualHours]);
        }

        return $freshAttendance->fresh();
    }

    /**
     * Admin marks WFH attendance after approving a WFH leave request.
     */
    public function markWfhAttendance(int $leaveRequestId): Attendance
    {
        $businessId = app('current_business_id');

        $leaveRequest = LeaveRequest::where('business_id', $businessId)
            ->where('request_type', 'wfh')
            ->where('status', 'approved')
            ->findOrFail($leaveRequestId);

        if ($leaveRequest->wfh_attendance_marked) {
            throw new \Exception('WFH attendance is already marked for this request.');
        }

        // Mark attendance for each day in the WFH date range
        $dates = [];
        $current = $leaveRequest->from_date->copy();
        while ($current->lte($leaveRequest->to_date)) {
            $date = $current->format('Y-m-d');

            Attendance::updateOrCreate(
                [
                    'business_id' => $businessId,
                    'user_id'     => $leaveRequest->user_id,
                    'date'        => $date,
                ],
                [
                    'status'      => 'present',
                    'work_type'   => 'wfh',
                    'notes'       => 'WFH approved – auto-marked',
                    'approved_by' => auth()->id(),
                ]
            );

            $dates[] = $date;
            $current->addDay();
        }

        $leaveRequest->update(['wfh_attendance_marked' => true]);

        // Return the first attendance record
        return Attendance::where('business_id', $businessId)
            ->where('user_id', $leaveRequest->user_id)
            ->where('date', $leaveRequest->from_date->format('Y-m-d'))
            ->first();
    }

    /**
     * Get all pending regularization requests for a business (admin view).
     */
    public function getPendingRegularizations()
    {
        return Attendance::with(['user:id,name', 'regularizationApprovedBy:id,name'])
            ->where('regularization_status', 'pending')
            ->orderByDesc('regularization_requested_at')
            ->paginate(30);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // WORKING HOURS HELPERS
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Get the effective standard hours for a staff member:
     * Uses per-staff override if set, else falls back to business work setting.
     */
    public function getStandardHoursForStaff(int $businessId, int $userId): float
    {
        $staffData = DB::table('business_user')
            ->where('business_id', $businessId)
            ->where('user_id', $userId)
            ->first();

        if ($staffData && !empty($staffData->custom_standard_hours)) {
            return (float) $staffData->custom_standard_hours;
        }

        $workSetting = BusinessWorkSetting::where('business_id', $businessId)->first();
        return $workSetting ? (float) $workSetting->standard_hours_per_day : 8.0;
    }

    /**
     * Calculate late mark minutes for a check-in.
     * Uses per-staff override if set, else business work setting.
     * Returns 0 if within grace period.
     */
    public function calculateLateMarkMinutes(int $businessId, int $userId, Carbon $checkInTime): int
    {
        $staffData = DB::table('business_user')
            ->where('business_id', $businessId)
            ->where('user_id', $userId)
            ->first();

        $workSetting = BusinessWorkSetting::where('business_id', $businessId)->first();

        // Determine start time (per-staff override > business setting > default 09:00)
        $startTimeStr = $staffData?->custom_work_start_time
            ?? $workSetting?->work_start_time
            ?? '09:00:00';

        $graceMinutes = $workSetting?->late_mark_grace_minutes ?? 15;

        $workStart = Carbon::parse($checkInTime->format('Y-m-d') . ' ' . $startTimeStr);
        $lateBy = $workStart->addMinutes($graceMinutes)->diffInMinutes($checkInTime, false);

        return $lateBy > 0 ? (int) $lateBy : 0;
    }

    /**
     * Get working hours summary for monthly report.
     * Returns total_standard_hours (excl. Sundays & holidays), total_actual_hours, efficiency_pct.
     */
    public function getWorkingHoursSummary(int $businessId, int $userId, string $month, array $holidayDates = []): array
    {
        [$year, $mon] = explode('-', $month);
        $startOfMonth = Carbon::createFromDate($year, $mon, 1)->startOfMonth();
        $endOfMonth   = $startOfMonth->copy()->endOfMonth();

        $standardHours = $this->getStandardHoursForStaff($businessId, $userId);

        // Count working days (exclude Sundays and holidays)
        $totalWorkingDays = 0;
        $current = $startOfMonth->copy();
        while ($current->lte($endOfMonth)) {
            if ($current->dayOfWeek !== Carbon::SUNDAY
                && !in_array($current->format('Y-m-d'), $holidayDates)) {
                $totalWorkingDays++;
            }
            $current->addDay();
        }

        $totalStandardHours = round($totalWorkingDays * $standardHours, 2);

        // Sum actual hours from attendance records
        $totalActualHours = (float) Attendance::where('business_id', $businessId)
            ->where('user_id', $userId)
            ->whereYear('date', $year)
            ->whereMonth('date', $mon)
            ->whereNotNull('actual_hours')
            ->sum('actual_hours');

        $efficiencyPct = $totalStandardHours > 0
            ? round(($totalActualHours / $totalStandardHours) * 100, 1)
            : 0.0;

        return [
            'total_working_days'    => $totalWorkingDays,
            'standard_hours_per_day' => $standardHours,
            'total_standard_hours'  => $totalStandardHours,
            'total_actual_hours'    => round($totalActualHours, 2),
            'efficiency_pct'        => $efficiencyPct,
        ];
    }
}
