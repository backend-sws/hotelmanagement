<?php

namespace App\Services\Business;

use App\Models\Attendance;
use App\Models\BusinessHoliday;
use App\Models\BusinessLocation;
use App\Models\BusinessWorkSetting;
use App\Models\LeaveRequest;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
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
            $this->syncApprovedLeavesForMonth($businessId, $filters['month']);
        } elseif (!empty($filters['from_date']) && !empty($filters['to_date'])) {
            $this->syncHolidaysBetweenDates($businessId, $filters['from_date'], $filters['to_date']);
            $this->syncApprovedLeavesBetweenDates($businessId, $filters['from_date'], $filters['to_date']);
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
     * Mark attendance as 'leave' (or 'present' with wfh) for all dates in an approved LeaveRequest.
     */
    public function applyApprovedLeaveToAttendance(LeaveRequest $leaveRequest, ?int $approverId = null): void
    {
        $businessId = $leaveRequest->business_id;
        $userId     = $leaveRequest->user_id;
        $approverId = $approverId ?? $leaveRequest->approved_by ?? auth()->id();

        // Handle WFH request
        if ($leaveRequest->request_type === 'wfh') {
            $this->markWfhAttendance($leaveRequest->id);
            return;
        }

        $startDate = Carbon::parse($leaveRequest->from_date)->startOfDay();
        $endDate   = Carbon::parse($leaveRequest->to_date)->startOfDay();

        $leaveTypeName = ucfirst(str_replace('_', ' ', $leaveRequest->leave_type ?? 'Leave'));
        $categoryName  = ucfirst($leaveRequest->effectiveCategory());
        $noteText      = "Approved {$leaveTypeName} ({$categoryName})";

        $current = $startDate->copy();
        while ($current->lte($endDate)) {
            $dateStr = $current->format('Y-m-d');

            $record = Attendance::where('business_id', $businessId)
                ->where('user_id', $userId)
                ->where('date', $dateStr)
                ->first();

            if (!$record) {
                Attendance::create([
                    'business_id' => $businessId,
                    'user_id'     => $userId,
                    'date'        => $dateStr,
                    'status'      => 'leave',
                    'notes'       => $noteText,
                    'approved_by' => $approverId,
                ]);
            } else {
                // If the employee didn't physically check in, update status to 'leave'
                if (empty($record->check_in_time) || in_array($record->status, ['absent', 'leave'])) {
                    $record->update([
                        'status'      => 'leave',
                        'notes'       => $noteText,
                        'approved_by' => $approverId,
                    ]);
                }
            }

            $current->addDay();
        }
    }

    /**
     * Remove or revert attendance when an approved leave request is rejected or deleted.
     */
    public function removeLeaveFromAttendance(LeaveRequest $leaveRequest): void
    {
        $businessId = $leaveRequest->business_id;
        $userId     = $leaveRequest->user_id;

        $startDate = Carbon::parse($leaveRequest->from_date)->startOfDay();
        $endDate   = Carbon::parse($leaveRequest->to_date)->startOfDay();

        $current = $startDate->copy();
        while ($current->lte($endDate)) {
            $dateStr = $current->format('Y-m-d');

            $record = Attendance::where('business_id', $businessId)
                ->where('user_id', $userId)
                ->where('date', $dateStr)
                ->where('status', 'leave')
                ->first();

            if ($record) {
                if (empty($record->check_in_time)) {
                    $record->delete();
                } else {
                    $record->update([
                        'status' => 'present',
                        'notes'  => null,
                    ]);
                }
            }

            $current->addDay();
        }
    }

    /**
     * Sync all approved leaves for a given month into the attendances table.
     */
    public function syncApprovedLeavesForMonth(int $businessId, string $month): void
    {
        $parts = explode('-', $month);
        if (count($parts) !== 2) return;

        $startOfMonth = Carbon::createFromDate($parts[0], $parts[1], 1)->startOfMonth()->toDateString();
        $endOfMonth   = Carbon::createFromDate($parts[0], $parts[1], 1)->endOfMonth()->toDateString();

        $approvedLeaves = LeaveRequest::where('business_id', $businessId)
            ->where('status', 'approved')
            ->where('request_type', 'leave')
            ->where(function ($q) use ($startOfMonth, $endOfMonth) {
                $q->whereBetween('from_date', [$startOfMonth, $endOfMonth])
                  ->orWhereBetween('to_date', [$startOfMonth, $endOfMonth])
                  ->orWhere(function ($sub) use ($startOfMonth, $endOfMonth) {
                      $sub->where('from_date', '<=', $startOfMonth)
                          ->where('to_date', '>=', $endOfMonth);
                  });
            })
            ->get();

        foreach ($approvedLeaves as $leave) {
            $this->applyApprovedLeaveToAttendance($leave);
        }
    }

    /**
     * Sync all approved leaves for a given date range into the attendances table.
     */
    public function syncApprovedLeavesBetweenDates(int $businessId, string $fromDate, string $toDate): void
    {
        $approvedLeaves = LeaveRequest::where('business_id', $businessId)
            ->where('status', 'approved')
            ->where('request_type', 'leave')
            ->where(function ($q) use ($fromDate, $toDate) {
                $q->whereBetween('from_date', [$fromDate, $toDate])
                  ->orWhereBetween('to_date', [$fromDate, $toDate])
                  ->orWhere(function ($sub) use ($fromDate, $toDate) {
                      $sub->where('from_date', '<=', $fromDate)
                          ->where('to_date', '>=', $toDate);
                  });
            })
            ->get();

        foreach ($approvedLeaves as $leave) {
            $this->applyApprovedLeaveToAttendance($leave);
        }
    }

    /**
     * Get monthly attendance summary for staff.
     */
    public function getMonthlyReport(string $month, ?int $userId = null): array
    {
        $businessId = app('current_business_id');

        $this->syncHolidaysForMonth($businessId, $month);
        $this->syncApprovedLeavesForMonth($businessId, $month);

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
     * 1. If date specified, check assigned shift in hotel_shift_roster
     * 2. Per-staff override in business_user
     * 3. Falls back to business work setting (standard_hours_per_day, default 8.0)
     */
    public function getStandardHoursForStaff(int $businessId, int $userId, ?string $date = null): float
    {
        if ($date && Schema::hasTable('hotel_shift_roster') && Schema::hasTable('hotel_shifts')) {
            $rosterShift = DB::table('hotel_shift_roster')
                ->join('hotel_shifts', 'hotel_shifts.id', '=', 'hotel_shift_roster.shift_id')
                ->where('hotel_shift_roster.business_id', $businessId)
                ->where('hotel_shift_roster.user_id', $userId)
                ->where('hotel_shift_roster.roster_date', $date)
                ->whereNotIn('hotel_shift_roster.status', ['off', 'cancelled', 'week_off'])
                ->select('hotel_shifts.start_time', 'hotel_shifts.end_time', 'hotel_shifts.is_overnight')
                ->first();

            if ($rosterShift) {
                $start = Carbon::parse($rosterShift->start_time);
                $end   = Carbon::parse($rosterShift->end_time);
                if ($rosterShift->is_overnight && $end->lt($start)) {
                    $end->addDay();
                }
                return round($start->diffInMinutes($end) / 60, 1);
            }
        }

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
     * Priority:
     * 1. Assigned shift in hotel_shift_roster for that day (if roster enabled)
     * 2. Per-staff override (custom_work_start_time)
     * 3. Business work setting start time
     * Returns 0 if within grace period.
     */
    public function calculateLateMarkMinutes(int $businessId, int $userId, Carbon $checkInTime): int
    {
        // 1. Check assigned shift on the roster for today (if table exists)
        $rosterShift = null;
        if (Schema::hasTable('hotel_shift_roster') && Schema::hasTable('hotel_shifts')) {
            $rosterShift = DB::table('hotel_shift_roster')
                ->join('hotel_shifts', 'hotel_shifts.id', '=', 'hotel_shift_roster.shift_id')
                ->where('hotel_shift_roster.business_id', $businessId)
                ->where('hotel_shift_roster.user_id', $userId)
                ->where('hotel_shift_roster.roster_date', $checkInTime->toDateString())
                ->whereNotIn('hotel_shift_roster.status', ['off', 'cancelled', 'on_leave', 'week_off'])
                ->select('hotel_shifts.start_time', 'hotel_shifts.end_time')
                ->first();
        }

        $staffData = DB::table('business_user')
            ->where('business_id', $businessId)
            ->where('user_id', $userId)
            ->first();

        $workSetting = BusinessWorkSetting::where('business_id', $businessId)->first();

        // Determine start time: Roster Shift > Per-Staff Custom > Business Setting > Default 09:00
        $startTimeStr = $rosterShift?->start_time
            ?? $staffData?->custom_work_start_time
            ?? $workSetting?->work_start_time
            ?? '09:00:00';

        $graceMinutes = $workSetting?->late_mark_grace_minutes ?? 15;

        $workStart = Carbon::parse($checkInTime->format('Y-m-d') . ' ' . $startTimeStr);
        $lateBy = $workStart->addMinutes($graceMinutes)->diffInMinutes($checkInTime, false);

        return $lateBy > 0 ? (int) $lateBy : 0;
    }

    /**
     * Get working hours summary for monthly report.
     * Takes into account shift roster assignments if present,
     * else falls back to standard working days and hours.
     * Returns total_standard_hours, total_actual_hours, efficiency_pct.
     */
    public function getWorkingHoursSummary(int $businessId, int $userId, string $month, array $holidayDates = []): array
    {
        [$year, $mon] = explode('-', $month);
        $startOfMonth = Carbon::createFromDate($year, $mon, 1)->startOfMonth();
        $endOfMonth   = $startOfMonth->copy()->endOfMonth();

        // Check if staff has roster entries for this month (if shift roster is enabled)
        $rosterEntries = collect();
        if (Schema::hasTable('hotel_shift_roster') && Schema::hasTable('hotel_shifts')) {
            $rosterEntries = DB::table('hotel_shift_roster')
                ->join('hotel_shifts', 'hotel_shifts.id', '=', 'hotel_shift_roster.shift_id')
                ->where('hotel_shift_roster.business_id', $businessId)
                ->where('hotel_shift_roster.user_id', $userId)
                ->whereBetween('hotel_shift_roster.roster_date', [$startOfMonth->toDateString(), $endOfMonth->toDateString()])
                ->whereNotIn('hotel_shift_roster.status', ['off', 'cancelled', 'week_off'])
                ->select('hotel_shift_roster.roster_date', 'hotel_shifts.start_time', 'hotel_shifts.end_time', 'hotel_shifts.is_overnight')
                ->get();
        }

        $standardHoursPerDay = $this->getStandardHoursForStaff($businessId, $userId);

        if ($rosterEntries->isNotEmpty()) {
            $totalWorkingDays = 0;
            $totalStandardHours = 0.0;

            foreach ($rosterEntries as $entry) {
                // If this day is an official company holiday, skip from required hours
                if (in_array($entry->roster_date, $holidayDates)) {
                    continue;
                }
                $start = Carbon::parse($entry->start_time);
                $end   = Carbon::parse($entry->end_time);
                if ($entry->is_overnight && $end->lt($start)) {
                    $end->addDay();
                }
                $shiftDuration = round($start->diffInMinutes($end) / 60, 2);
                $totalStandardHours += $shiftDuration;
                $totalWorkingDays++;
            }
        } else {
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

            $totalStandardHours = round($totalWorkingDays * $standardHoursPerDay, 2);
        }

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
            'total_working_days'     => $totalWorkingDays,
            'standard_hours_per_day' => $standardHoursPerDay,
            'total_standard_hours'   => round($totalStandardHours, 2),
            'total_actual_hours'     => round($totalActualHours, 2),
            'efficiency_pct'         => $efficiencyPct,
        ];
    }

    /**
     * Get the active shift and working hours info for a staff member on a given date.
     * Priority:
     * 1. hotel_shift_roster for that date
     * 2. Per-staff custom work timings (custom_work_start_time, custom_work_end_time, custom_standard_hours)
     * 3. Business work settings (fallback)
     */
    public function getStaffShiftInfo(int $businessId, int $userId, ?string $date = null): array
    {
        $date = $date ?? now()->toDateString();
        $workSetting = BusinessWorkSetting::where('business_id', $businessId)->first();
        $graceMinutes = $workSetting?->late_mark_grace_minutes ?? 15;

        // 1. Check if assigned on shift roster for this date
        if (Schema::hasTable('hotel_shift_roster') && Schema::hasTable('hotel_shifts')) {
            $rosterEntry = DB::table('hotel_shift_roster')
                ->join('hotel_shifts', 'hotel_shifts.id', '=', 'hotel_shift_roster.shift_id')
                ->where('hotel_shift_roster.business_id', $businessId)
                ->where('hotel_shift_roster.user_id', $userId)
                ->where('hotel_shift_roster.roster_date', $date)
                ->whereNotIn('hotel_shift_roster.status', ['off', 'cancelled', 'week_off'])
                ->select(
                    'hotel_shifts.name',
                    'hotel_shifts.start_time',
                    'hotel_shifts.end_time',
                    'hotel_shifts.is_overnight',
                    'hotel_shifts.color'
                )
                ->first();

            if ($rosterEntry) {
                $start = Carbon::parse($rosterEntry->start_time);
                $end   = Carbon::parse($rosterEntry->end_time);
                if ($rosterEntry->is_overnight && $end->lt($start)) {
                    $end->addDay();
                }
                $duration = round($start->diffInMinutes($end) / 60, 1);
                $lateAfter = $start->copy()->addMinutes($graceMinutes)->format('h:i A');

                return [
                    'name'           => $rosterEntry->name,
                    'start_time'     => substr($rosterEntry->start_time, 0, 5),
                    'end_time'       => substr($rosterEntry->end_time, 0, 5),
                    'start_time_fmt' => Carbon::parse($rosterEntry->start_time)->format('h:i A'),
                    'end_time_fmt'   => Carbon::parse($rosterEntry->end_time)->format('h:i A'),
                    'timing_label'   => Carbon::parse($rosterEntry->start_time)->format('h:i A') . ' - ' . Carbon::parse($rosterEntry->end_time)->format('h:i A'),
                    'duration_hours' => $duration,
                    'is_overnight'   => (bool) $rosterEntry->is_overnight,
                    'color'          => $rosterEntry->color ?? '#3b82f6',
                    'late_after'     => $lateAfter,
                    'grace_minutes'  => $graceMinutes,
                    'source'         => 'roster_shift',
                ];
            }
        }

        // 2. Check per-staff custom work timings
        $staffData = DB::table('business_user')
            ->where('business_id', $businessId)
            ->where('user_id', $userId)
            ->first();

        if ($staffData && (!empty($staffData->custom_work_start_time) || !empty($staffData->custom_standard_hours))) {
            $startTime = $staffData->custom_work_start_time ?? '09:00:00';
            $endTime   = $staffData->custom_work_end_time ?? '18:00:00';
            $duration  = $staffData->custom_standard_hours ? (float) $staffData->custom_standard_hours : 8.0;

            $start = Carbon::parse($startTime);
            $lateAfter = $start->copy()->addMinutes($graceMinutes)->format('h:i A');

            return [
                'name'           => 'Custom Staff Shift',
                'start_time'     => substr($startTime, 0, 5),
                'end_time'       => substr($endTime, 0, 5),
                'start_time_fmt' => Carbon::parse($startTime)->format('h:i A'),
                'end_time_fmt'   => Carbon::parse($endTime)->format('h:i A'),
                'timing_label'   => Carbon::parse($startTime)->format('h:i A') . ' - ' . Carbon::parse($endTime)->format('h:i A'),
                'duration_hours' => $duration,
                'is_overnight'   => false,
                'color'          => '#6366f1',
                'late_after'     => $lateAfter,
                'grace_minutes'  => $graceMinutes,
                'source'         => 'custom_profile',
            ];
        }

        // 3. Fallback to general company work settings
        $startTime = $workSetting?->work_start_time ?? '09:00:00';
        $endTime   = $workSetting?->work_end_time ?? '18:00:00';
        $duration  = $workSetting ? (float) $workSetting->standard_hours_per_day : 8.0;

        $start = Carbon::parse($startTime);
        $lateAfter = $start->copy()->addMinutes($graceMinutes)->format('h:i A');

        return [
            'name'           => 'General Company Shift',
            'start_time'     => substr($startTime, 0, 5),
            'end_time'       => substr($endTime, 0, 5),
            'start_time_fmt' => Carbon::parse($startTime)->format('h:i A'),
            'end_time_fmt'   => Carbon::parse($endTime)->format('h:i A'),
            'timing_label'   => Carbon::parse($startTime)->format('h:i A') . ' - ' . Carbon::parse($endTime)->format('h:i A'),
            'duration_hours' => $duration,
            'is_overnight'   => false,
            'color'          => '#10b981',
            'late_after'     => $lateAfter,
            'grace_minutes'  => $graceMinutes,
            'source'         => 'company_default',
        ];
    }

}
