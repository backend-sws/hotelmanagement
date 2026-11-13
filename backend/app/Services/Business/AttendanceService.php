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

        // Check if user is active in this business
        $businessUser = DB::table('business_user')
            ->where('business_id', $businessId)
            ->where('user_id', $userId)
            ->first();

        if ($businessUser && $businessUser->status === 'inactive') {
            throw new \Exception('Your staff account is inactive/deactivated. You cannot check in.');
        }

        // Check if already checked in today
        $existing = Attendance::where('user_id', $userId)
            ->where('date', $today)
            ->first();

        if ($existing && $existing->check_in_time) {
            throw new \Exception('You have already checked in today.');
        }

        // Check if staff has an approved WFH request for today
        $hasApprovedWfh = LeaveRequest::where('business_id', $businessId)
            ->where('user_id', $userId)
            ->where('request_type', 'wfh')
            ->where('status', 'approved')
            ->whereDate('from_date', '<=', $today)
            ->whereDate('to_date', '>=', $today)
            ->exists();

        $isWfhRequested = ($data['work_type'] ?? '') === 'wfh';
        $workSetting = BusinessWorkSetting::where('business_id', $businessId)->first();
        $isWfhAllowed = $hasApprovedWfh || ($isWfhRequested && ($workSetting->punch_mode_wfh ?? true));

        $photoPath = $data['photo'] ?? null;
        if ($isWfhAllowed && empty($photoPath)) {
            throw new \Exception('Photo verification (selfie / workstation image) is required for WFH attendance.');
        }

        // Validate geo-fence: If staff has approved WFH or WFH punch is enabled, geo-fence is bypassed!
        $isWithinFence = false;
        $locationId = null;

        if ($isWfhAllowed) {
            $isWithinFence = true;
        } else {
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
        }

        // Calculate late mark minutes using work settings
        $lateMarkMinutes = $this->calculateLateMarkMinutes($businessId, $userId, now());

        $ownerId = \Illuminate\Support\Facades\DB::table('businesses')->where('id', $businessId)->value('owner_id');
        $effectiveWorkType = $isWfhAllowed ? 'wfh' : ($data['work_type'] ?? 'office');
        $notes = $isWfhAllowed ? 'WFH attendance verified via photo capture' : ($data['notes'] ?? null);

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
                'work_type'          => $effectiveWorkType,
                'notes'              => $notes ?? $existing->notes,
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
            'work_type'          => $effectiveWorkType,
            'notes'              => $notes,
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

        // Validate geo-fence: If staff has approved WFH, geo-fence is bypassed!
        $hasApprovedWfh = LeaveRequest::where('business_id', $attendance->business_id)
            ->where('user_id', $userId)
            ->where('request_type', 'wfh')
            ->where('status', 'approved')
            ->whereDate('from_date', '<=', $today)
            ->whereDate('to_date', '>=', $today)
            ->exists() || $attendance->work_type === 'wfh';

        $isWithinFence = false;
        if ($hasApprovedWfh) {
            $isWithinFence = true;
        } else {
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
        }

        $photoPath = $data['photo'] ?? null;
        $nowTime = now()->toTimeString();

        // If staff is currently on lunch when checking out, auto-close lunch
        $lunchUpdates = [];
        if (!empty($attendance->lunch_start_time) && empty($attendance->lunch_end_time)) {
            $lunchUpdates['lunch_end_time'] = $nowTime;
            $lIn = Carbon::parse($today . ' ' . $attendance->lunch_start_time);
            $lOut = Carbon::parse($today . ' ' . $nowTime);
            if ($lOut->lt($lIn)) $lOut->addDay();
            $lunchUpdates['lunch_minutes'] = ($attendance->lunch_minutes ?? 0) + max(0, (int) $lIn->diffInMinutes($lOut));
        }

        $attendance->update(array_merge([
            'check_out_time'      => $nowTime,
            'check_out_photo'     => $photoPath,
            'check_out_latitude'  => $data['latitude'] ?? null,
            'check_out_longitude' => $data['longitude'] ?? null,
        ], $lunchUpdates));

        // Compute and save Office Present Time (gross) and Exact Working Hours (net = gross - lunch)
        $freshAttendance = $attendance->fresh();
        $grossPresence = $freshAttendance->computeGrossPresenceHours();
        $actualHours = $freshAttendance->computeActualHours();

        $freshAttendance->update([
            'gross_presence_hours' => $grossPresence,
            'actual_hours'         => $actualHours,
        ]);

        if ($actualHours !== null) {
            $this->evaluateAndSaveOvertime($freshAttendance);
        }

        return $freshAttendance->fresh();
    }

    /**
     * Start lunch break for the logged-in user.
     */
    public function startLunch(): Attendance
    {
        $userId = auth()->id();
        $today = now()->toDateString();

        $attendance = Attendance::where('user_id', $userId)
            ->where('date', $today)
            ->first();

        if (!$attendance || !$attendance->check_in_time) {
            throw new \Exception('You must check in before taking a lunch break.');
        }

        if ($attendance->check_out_time) {
            throw new \Exception('You have already checked out for today.');
        }

        if (!empty($attendance->lunch_start_time) && empty($attendance->lunch_end_time)) {
            throw new \Exception('You are already on an active lunch break.');
        }

        $attendance->update([
            'lunch_start_time' => now()->toTimeString(),
            'lunch_end_time'   => null,
        ]);

        return $attendance->fresh();
    }

    /**
     * End lunch break for the logged-in user and resume work.
     */
    public function endLunch(): Attendance
    {
        $userId = auth()->id();
        $today = now()->toDateString();

        $attendance = Attendance::where('user_id', $userId)
            ->where('date', $today)
            ->first();

        if (!$attendance || !$attendance->check_in_time) {
            throw new \Exception('No active check-in record found for today.');
        }

        if (empty($attendance->lunch_start_time) || !empty($attendance->lunch_end_time)) {
            throw new \Exception('You are not currently on an active lunch break.');
        }

        $nowTime = now()->toTimeString();
        $start = Carbon::parse($today . ' ' . $attendance->lunch_start_time);
        $end   = Carbon::parse($today . ' ' . $nowTime);
        if ($end->lt($start)) {
            $end->addDay();
        }

        $sessionMins = max(0, (int) $start->diffInMinutes($end));
        $totalLunchMinutes = ($attendance->lunch_minutes ?? 0) + $sessionMins;

        $attendance->update([
            'lunch_end_time' => $nowTime,
            'lunch_minutes'  => $totalLunchMinutes,
        ]);

        $fresh = $attendance->fresh();
        if ($fresh->check_out_time) {
            $gross = $fresh->computeGrossPresenceHours();
            $net = $fresh->computeActualHours();
            $fresh->update([
                'gross_presence_hours' => $gross,
                'actual_hours'         => $net,
            ]);
            $this->evaluateAndSaveOvertime($fresh);
        }

        return $fresh->fresh();
    }

    /**
     * Manually mark attendance (by owner).
     */
    public function markAttendance(array $data): Attendance
    {
        $businessId = app('current_business_id');

        if (($data['status'] ?? null) === 'clear') {
            Attendance::where([
                'business_id' => $businessId,
                'user_id' => $data['user_id'],
                'date' => $data['date'],
            ])->delete();
            return new Attendance();
        }

        $status = $data['status'];
        $lateMarkMinutes = $data['late_mark_minutes'] ?? null;

        if ($status === 'late') {
            $status = 'present';
            $lateMarkMinutes = $lateMarkMinutes ?? 30;
            if (empty($data['notes'])) {
                $data['notes'] = "Late Entry ({$lateMarkMinutes}m)";
            }
        }

        $payload = [
            'status' => $status,
            'notes' => $data['notes'] ?? null,
            'approved_by' => auth()->id(),
        ];

        if ($lateMarkMinutes !== null) {
            $payload['late_mark_minutes'] = $lateMarkMinutes;
        }

        if (!empty($data['check_in_time'])) {
            $payload['check_in_time'] = $data['check_in_time'];
            if ($lateMarkMinutes === null && in_array($status, ['present', 'late'])) {
                $checkInCarbon = \Carbon\Carbon::parse($data['date'] . ' ' . $data['check_in_time']);
                $payload['late_mark_minutes'] = $this->calculateLateMarkMinutes($businessId, $data['user_id'], $checkInCarbon);
            }
        }
        if (!empty($data['check_out_time'])) {
            $payload['check_out_time'] = $data['check_out_time'];
        }
        if (array_key_exists('lunch_minutes', $data)) {
            $payload['lunch_minutes'] = (int) $data['lunch_minutes'];
        }
        if (array_key_exists('lunch_start_time', $data)) {
            $payload['lunch_start_time'] = $data['lunch_start_time'];
        }
        if (array_key_exists('lunch_end_time', $data)) {
            $payload['lunch_end_time'] = $data['lunch_end_time'];
        }

        if (array_key_exists('overtime_hours', $data)) {
            $payload['overtime_hours'] = (float) $data['overtime_hours'];
            $payload['overtime_approved'] = isset($data['overtime_approved']) ? (bool) $data['overtime_approved'] : true;
            if ($payload['overtime_approved']) {
                $payload['overtime_approved_by'] = auth()->id();
                $payload['overtime_approved_at'] = now();
            }
        }

        $record = Attendance::updateOrCreate(
            [
                'business_id' => $businessId,
                'user_id' => $data['user_id'],
                'date' => $data['date'],
            ],
            $payload
        );

        // Recompute Office Present Time (gross) & Exact Working Hours (net = gross - lunch)
        if ($record->check_in_time && $record->check_out_time) {
            $gross = $record->computeGrossPresenceHours();
            $net = $record->computeActualHours();
            $record->update([
                'gross_presence_hours' => $gross,
                'actual_hours'         => $net,
            ]);
            if ($net !== null) {
                $this->evaluateAndSaveOvertime($record);
            }
        } elseif ($record->status === 'half_day') {
            $dateStr = is_string($record->date) ? $record->date : $record->date->format('Y-m-d');
            $shift = $this->getStaffShiftInfo($businessId, $record->user_id, $dateStr);
            $stdHours = (float) ($shift['standard_hours'] ?? 9.0);
            $halfHours = round($stdHours / 2, 2);
            $record->update([
                'gross_presence_hours' => $halfHours,
                'actual_hours'         => $halfHours,
            ]);
        }

        return $record->fresh();
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
                $status = $record['status'];
                $lateMarkMinutes = $record['late_mark_minutes'] ?? null;

                if ($status === 'late') {
                    $status = 'present';
                    $lateMarkMinutes = $lateMarkMinutes ?? 30;
                    if (empty($record['notes'])) {
                        $record['notes'] = "Late Entry ({$lateMarkMinutes}m)";
                    }
                }

                $payload = [
                    'status' => $status,
                    'check_in_time' => $record['check_in_time'] ?? null,
                    'check_out_time' => $record['check_out_time'] ?? null,
                    'notes' => $record['notes'] ?? null,
                    'approved_by' => $approvedBy,
                ];

                if ($lateMarkMinutes !== null) {
                    $payload['late_mark_minutes'] = $lateMarkMinutes;
                }

                Attendance::updateOrCreate(
                    [
                        'business_id' => $businessId,
                        'user_id' => $record['user_id'],
                        'date' => $record['date'],
                    ],
                    $payload
                );
            }
        }

        // If records were cleared for any date, also clean up BusinessHoliday records for those dates
        $clearedDates = collect($records)->where('status', 'clear')->pluck('date')->unique()->filter()->values();
        if ($clearedDates->isNotEmpty()) {
            BusinessHoliday::where('business_id', $businessId)
                ->whereIn('date', $clearedDates)
                ->delete();
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

        // Auto mark absent for staff who have not checked in by half-shift cutoff
        $this->autoMarkAbsentForHalfTimeNoShow($businessId);

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

        $holidays = BusinessHoliday::withoutGlobalScopes()
            ->where('business_id', $businessId)
            ->whereBetween('date', [$startDate->toDateString(), $endDate->toDateString()])
            ->get();
        $holidayMap = [];
        foreach ($holidays as $h) {
            $hDate = Carbon::parse($h->date)->format('Y-m-d');
            $holidayMap[$hDate] = $h->name;
        }

        $workSetting = BusinessWorkSetting::withoutGlobalScopes()->where('business_id', $businessId)->first();
        $workDays = $workSetting && is_array($workSetting->work_days)
            ? $workSetting->work_days
            : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        $dayMap = [
            Carbon::SUNDAY    => 'Sun',
            Carbon::MONDAY    => 'Mon',
            Carbon::TUESDAY   => 'Tue',
            Carbon::WEDNESDAY => 'Wed',
            Carbon::THURSDAY  => 'Thu',
            Carbon::FRIDAY    => 'Fri',
            Carbon::SATURDAY  => 'Sat',
        ];

        $leaveTypeName = ucfirst(str_replace('_', ' ', $leaveRequest->leave_type ?? 'Leave'));
        $categoryName  = ucfirst($leaveRequest->effectiveCategory());
        $noteText      = "Approved {$leaveTypeName} ({$categoryName})";

        $current = $startDate->copy();
        while ($current->lte($endDate)) {
            $dateStr = $current->format('Y-m-d');
            $dayName = $dayMap[$current->dayOfWeek] ?? 'Sun';

            // 1. If this date is an official company holiday: ensure marked as 'holiday'
            if (isset($holidayMap[$dateStr])) {
                $hRecord = Attendance::where('business_id', $businessId)
                    ->where('user_id', $userId)
                    ->where('date', $dateStr)
                    ->first();
                if (!$hRecord) {
                    Attendance::create([
                        'business_id' => $businessId,
                        'user_id'     => $userId,
                        'date'        => $dateStr,
                        'status'      => 'holiday',
                        'notes'       => $holidayMap[$dateStr],
                        'approved_by' => $approverId,
                    ]);
                } elseif (in_array($hRecord->status, ['absent', 'leave']) || empty($hRecord->check_in_time)) {
                    $hRecord->update([
                        'status' => 'holiday',
                        'notes'  => $holidayMap[$dateStr],
                    ]);
                }
                $current->addDay();
                continue;
            }

            // 2. If this date is Sunday or official off-day: ensure marked as 'week_off'
            $isOffDay = ($current->dayOfWeek === Carbon::SUNDAY || !in_array($dayName, $workDays));
            if ($isOffDay) {
                $wRecord = Attendance::where('business_id', $businessId)
                    ->where('user_id', $userId)
                    ->where('date', $dateStr)
                    ->first();
                if (!$wRecord) {
                    Attendance::create([
                        'business_id' => $businessId,
                        'user_id'     => $userId,
                        'date'        => $dateStr,
                        'status'      => 'week_off',
                        'notes'       => 'Weekly Off',
                        'approved_by' => $approverId,
                    ]);
                } elseif (in_array($wRecord->status, ['absent', 'leave']) && empty($wRecord->check_in_time)) {
                    $wRecord->update([
                        'status' => 'week_off',
                        'notes'  => 'Weekly Off',
                    ]);
                }
                $current->addDay();
                continue;
            }

            // 3. Otherwise, this is a working day: mark as 'leave'
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

        if ($leaveRequest->request_type === 'wfh') {
            Attendance::where('business_id', $businessId)
                ->where('user_id', $userId)
                ->whereBetween('date', [$startDate->toDateString(), $endDate->toDateString()])
                ->where('work_type', 'wfh')
                ->whereNull('check_in_photo')
                ->delete();
            $leaveRequest->update(['wfh_attendance_marked' => false]);
            return;
        }

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
        $this->autoMarkAbsentForHalfTimeNoShow($businessId);

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
        $userId = auth()->id();
        $businessId = app('current_business_id');

        if ($businessId) {
            $businessUser = DB::table('business_user')
                ->where('business_id', $businessId)
                ->where('user_id', $userId)
                ->first();

            if ($businessUser && $businessUser->status === 'inactive') {
                return null;
            }

            $this->autoMarkAbsentForHalfTimeNoShow($businessId);
        }

        return Attendance::where('user_id', $userId)
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
            'regularization_requested_checkin'  => $data['requested_checkin'] ?? $attendance->check_in_time,
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
            'forgot_checkout_applied'    => false,
            'is_auto_closed'             => false,
        ];

        if ($attendance->regularization_requested_checkin) {
            $updates['check_in_time'] = $attendance->regularization_requested_checkin;
            $dateStr = $attendance->date instanceof \DateTimeInterface ? $attendance->date->format('Y-m-d') : substr((string)$attendance->date, 0, 10);
            $checkInCarbon = \Carbon\Carbon::parse($dateStr . ' ' . $attendance->regularization_requested_checkin);
            $updates['late_mark_minutes'] = $this->calculateLateMarkMinutes($attendance->business_id, $attendance->user_id, $checkInCarbon);
        }
        if ($attendance->regularization_requested_checkout) {
            $updates['check_out_time'] = $attendance->regularization_requested_checkout;
        }

        $attendance->update($updates);

        // Recompute actual hours after time correction
        $freshAttendance = $attendance->fresh();
        $gross = $freshAttendance->computeGrossPresenceHours();
        $actualHours = $freshAttendance->computeActualHours();
        $freshAttendance->update([
            'gross_presence_hours' => $gross,
            'actual_hours'         => $actualHours,
        ]);
        if ($actualHours !== null) {
            $this->evaluateAndSaveOvertime($freshAttendance);
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
            $dateStr = $attendance->date instanceof \DateTimeInterface ? $attendance->date->format('Y-m-d') : substr((string)$attendance->date, 0, 10);
            $checkInCarbon = \Carbon\Carbon::parse($dateStr . ' ' . $data['check_in_time']);
            $updates['late_mark_minutes'] = $this->calculateLateMarkMinutes($attendance->business_id, $attendance->user_id, $checkInCarbon);
        }
        if (!empty($data['check_out_time'])) {
            $updates['check_out_time'] = $data['check_out_time'];
        }
        if (array_key_exists('lunch_minutes', $data)) {
            $updates['lunch_minutes'] = (int) $data['lunch_minutes'];
        }
        if (array_key_exists('lunch_start_time', $data)) {
            $updates['lunch_start_time'] = $data['lunch_start_time'];
        }
        if (array_key_exists('lunch_end_time', $data)) {
            $updates['lunch_end_time'] = $data['lunch_end_time'];
        }
        if (!empty($data['notes'])) {
            $updates['notes'] = $data['notes'];
        }

        $attendance->update($updates);

        // Recompute Office Present Time (gross) and Exact Working Hours (net = gross - lunch)
        $freshAttendance = $attendance->fresh();
        $grossPresence = $freshAttendance->computeGrossPresenceHours();
        $actualHours = $freshAttendance->computeActualHours();

        $freshAttendance->update([
            'gross_presence_hours' => $grossPresence,
            'actual_hours'         => $actualHours,
        ]);

        if ($actualHours !== null) {
            $this->evaluateAndSaveOvertime($freshAttendance);
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
        $today        = Carbon::today();

        // Effective end date: for the active month, calculate per elapsed working days up to today
        $effectiveEndDate = ($today->lessThan($endOfMonth) && $today->greaterThanOrEqualTo($startOfMonth))
            ? $today
            : $endOfMonth;

        // Check if staff has roster entries for this month (if shift roster is enabled)
        $rosterEntries = collect();
        if (Schema::hasTable('hotel_shift_roster') && Schema::hasTable('hotel_shifts')) {
            $rosterEntries = DB::table('hotel_shift_roster')
                ->join('hotel_shifts', 'hotel_shifts.id', '=', 'hotel_shift_roster.shift_id')
                ->where('hotel_shift_roster.business_id', $businessId)
                ->where('hotel_shift_roster.user_id', $userId)
                ->whereBetween('hotel_shift_roster.roster_date', [$startOfMonth->toDateString(), $effectiveEndDate->toDateString()])
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
            // Count elapsed working days up to effectiveEndDate (exclude Sundays and holidays)
            $totalWorkingDays = 0;
            $current = $startOfMonth->copy();
            while ($current->lte($effectiveEndDate)) {
                if ($current->dayOfWeek !== Carbon::SUNDAY
                    && !in_array($current->format('Y-m-d'), $holidayDates)) {
                    $totalWorkingDays++;
                }
                $current->addDay();
            }

            $totalStandardHours = round($totalWorkingDays * $standardHoursPerDay, 2);
        }

        // Sum actual hours from attendance records (and credit standard_hours/2 for half-day if actual_hours is null)
        $monthAttendances = Attendance::where('business_id', $businessId)
            ->where('user_id', $userId)
            ->whereYear('date', $year)
            ->whereMonth('date', $mon)
            ->get();

        $totalActualHours = 0.0;
        foreach ($monthAttendances as $att) {
            if ($att->actual_hours !== null && (float)$att->actual_hours > 0) {
                $totalActualHours += (float) $att->actual_hours;
            } elseif ($att->status === 'half_day') {
                $totalActualHours += round($standardHoursPerDay / 2, 2);
            }
        }

        $efficiencyPct = $totalStandardHours > 0
            ? round(($totalActualHours / $totalStandardHours) * 100, 1)
            : 0.0;

        $attendancesCount = $monthAttendances->where('date', '<=', $effectiveEndDate->toDateString());
        $presentCount = $attendancesCount->whereIn('status', ['present', 'late'])->count();
        $halfCount = $attendancesCount->where('status', 'half_day')->count();
        $effectivePresent = $presentCount + ($halfCount * 0.5);
        $avgDailyAttendancePct = $totalWorkingDays > 0 ? round(($effectivePresent / $totalWorkingDays) * 100, 1) : 0.0;

        return [
            'total_working_days'       => $totalWorkingDays,
            'standard_hours_per_day'   => $standardHoursPerDay,
            'total_standard_hours'     => round($totalStandardHours, 2),
            'total_actual_hours'       => round($totalActualHours, 2),
            'efficiency_pct'           => $efficiencyPct,
            'avg_daily_attendance_pct' => $avgDailyAttendancePct,
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

    /**
     * Automatically compute and record overtime.
     */
    public function evaluateAndSaveOvertime(Attendance $attendance): void
    {
        if (!$attendance->actual_hours) {
            return;
        }

        $businessId = $attendance->business_id;
        $setting = BusinessWorkSetting::where('business_id', $businessId)->first();
        if (!$setting || !$setting->enable_overtime) {
            return;
        }

        // Check staff eligibility and standard hours
        $staffData = DB::table('business_user')
            ->where('business_id', $businessId)
            ->where('user_id', $attendance->user_id)
            ->first();

        if ($staffData && isset($staffData->overtime_eligible) && !$staffData->overtime_eligible) {
            return;
        }

        $standardHours = (float) ($staffData->custom_standard_hours ?? $setting->standard_hours_per_day ?? 9.0);
        $minMinutes = (int) ($setting->overtime_min_minutes ?? 30);
        $requireApproval = (bool) ($setting->overtime_require_approval ?? true);

        $extraHours = $attendance->actual_hours - $standardHours;
        $extraMinutes = $extraHours * 60;

        if ($extraMinutes >= $minMinutes) {
            $otHours = round($extraHours, 2);
            $attendance->update([
                'overtime_hours' => $otHours,
                'overtime_approved' => !$requireApproval,
                'overtime_approved_by' => !$requireApproval ? auth()->id() : null,
                'overtime_approved_at' => !$requireApproval ? now() : null,
            ]);
        }
    }

    /**
     * Manager approves overtime for an attendance record.
     */
    public function approveOvertime(int $attendanceId): Attendance
    {
        $attendance = Attendance::findOrFail($attendanceId);
        $attendance->update([
            'overtime_approved' => true,
            'overtime_approved_by' => auth()->id(),
            'overtime_approved_at' => now(),
        ]);

        return $attendance->fresh();
    }

    /**
     * Manager rejects or clears overtime for an attendance record.
     */
    public function rejectOvertime(int $attendanceId): Attendance
    {
        $attendance = Attendance::findOrFail($attendanceId);
        $attendance->update([
            'overtime_hours' => 0,
            'overtime_approved' => false,
            'overtime_notes' => 'Overtime rejected by manager',
        ]);

        return $attendance->fresh();
    }

    /**
     * Manager edits overtime hours and notes directly.
     */
    public function editOvertime(int $attendanceId, array $data): Attendance
    {
        $attendance = Attendance::findOrFail($attendanceId);
        $updates = [];
        if (array_key_exists('overtime_hours', $data)) {
            $updates['overtime_hours'] = (float) $data['overtime_hours'];
        }
        if (array_key_exists('overtime_approved', $data)) {
            $updates['overtime_approved'] = (bool) $data['overtime_approved'];
            if ($updates['overtime_approved']) {
                $updates['overtime_approved_by'] = auth()->id();
                $updates['overtime_approved_at'] = now();
            }
        }
        if (array_key_exists('overtime_notes', $data)) {
            $updates['overtime_notes'] = $data['overtime_notes'];
        }

        $attendance->update($updates);
        return $attendance->fresh();
    }

    /**
     * Automatically mark staff members as Absent if they have not checked in
     * by half of their shift duration on a scheduled working day.
     *
     * @param int $businessId
     * @param string|null $date (defaults to today's date)
     * @return int Count of staff members auto-marked absent
     */
    public function autoMarkAbsentForHalfTimeNoShow(int $businessId, ?string $date = null): int
    {
        $targetDate = $date ? Carbon::parse($date)->startOfDay() : Carbon::today();
        $targetDateStr = $targetDate->toDateString();
        $now = Carbon::now();

        // If target date is strictly in the future, do not auto-mark
        if ($targetDate->isFuture() && !$targetDate->isToday()) {
            return 0;
        }

        // Check if business has auto absent enabled
        $workSetting = BusinessWorkSetting::where('business_id', $businessId)->first();
        if ($workSetting && $workSetting->enable_auto_absent === false) {
            return 0;
        }

        $workDays = $workSetting && is_array($workSetting->work_days) 
            ? $workSetting->work_days 
            : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        $dayMap = [
            Carbon::SUNDAY    => 'Sun',
            Carbon::MONDAY    => 'Mon',
            Carbon::TUESDAY   => 'Tue',
            Carbon::WEDNESDAY => 'Wed',
            Carbon::THURSDAY  => 'Thu',
            Carbon::FRIDAY    => 'Fri',
            Carbon::SATURDAY  => 'Sat',
        ];
        $currentDayName = $dayMap[$targetDate->dayOfWeek] ?? 'Sun';

        // Check if target date is defined as a company holiday
        $isHoliday = BusinessHoliday::where('business_id', $businessId)
            ->whereDate('date', $targetDateStr)
            ->exists();

        if ($isHoliday) {
            return 0;
        }

        // Active staff members for this business
        $staffMembers = DB::table('business_user')
            ->join('users', 'business_user.user_id', '=', 'users.id')
            ->where('business_user.business_id', $businessId)
            ->where(function ($q) {
                $q->whereNull('business_user.status')->orWhere('business_user.status', 'active');
            })
            ->where('business_user.status', '!=', 'inactive')
            ->whereNull('users.deleted_at')
            ->select('business_user.*')
            ->get();

        if ($staffMembers->isEmpty()) {
            return 0;
        }

        // Preload any existing attendance records for target date
        $existingAttendances = Attendance::where('business_id', $businessId)
            ->whereDate('date', $targetDateStr)
            ->get()
            ->keyBy('user_id');

        // Preload approved leave/wfh requests covering target date
        $approvedLeaves = LeaveRequest::where('business_id', $businessId)
            ->where('status', 'approved')
            ->whereDate('from_date', '<=', $targetDateStr)
            ->whereDate('to_date', '>=', $targetDateStr)
            ->pluck('user_id')
            ->toArray();

        $markedCount = 0;

        foreach ($staffMembers as $staff) {
            $userId = (int) $staff->user_id;

            // If staff has approved leave or WFH, skip
            if (in_array($userId, $approvedLeaves)) {
                continue;
            }

            // Check if staff has an attendance record
            $existing = $existingAttendances->get($userId);
            if ($existing) {
                // If staff already has a check-in, or is marked present, half_day, leave, wfh, or holiday, skip
                if (!empty($existing->check_in_time) || in_array($existing->status, ['present', 'half_day', 'leave', 'holiday', 'wfh'])) {
                    continue;
                }
                // If already marked absent, skip
                if ($existing->status === 'absent') {
                    continue;
                }
            }

            // Check shift info for this staff member
            $shiftInfo = $this->getStaffShiftInfo($businessId, $userId, $targetDateStr);

            // Check if roster assigned an explicit off/leave day
            if (Schema::hasTable('hotel_shift_roster')) {
                $isRosterOff = DB::table('hotel_shift_roster')
                    ->where('business_id', $businessId)
                    ->where('user_id', $userId)
                    ->where('roster_date', $targetDateStr)
                    ->whereIn('status', ['off', 'cancelled', 'on_leave', 'week_off'])
                    ->exists();
                if ($isRosterOff) {
                    continue;
                }
            }

            // If not on a shift roster and day is not in company work days (e.g. Sunday), skip
            if ($shiftInfo['source'] !== 'roster_shift' && !in_array($currentDayName, $workDays)) {
                continue;
            }

            $startTimeStr = $shiftInfo['start_time'] ?? '09:00';
            $endTimeStr   = $shiftInfo['end_time'] ?? '18:00';

            $shiftStart = Carbon::parse($targetDateStr . ' ' . $startTimeStr);
            $shiftEnd   = Carbon::parse($targetDateStr . ' ' . $endTimeStr);

            if (!empty($shiftInfo['is_overnight']) || $shiftEnd->lte($shiftStart)) {
                $shiftEnd->addDay();
            }

            $totalShiftMinutes = $shiftStart->diffInMinutes($shiftEnd);
            if ($totalShiftMinutes <= 0) {
                $durationHours = !empty($shiftInfo['duration_hours']) ? (float) $shiftInfo['duration_hours'] : 8.0;
                $totalShiftMinutes = (int) ($durationHours * 60);
            }

            // Half-time cutoff timestamp
            $halfTimeCutoff = $shiftStart->copy()->addMinutes((int) ($totalShiftMinutes / 2));

            $shouldMarkAbsent = false;
            if ($targetDate->isToday()) {
                if ($now->greaterThanOrEqualTo($halfTimeCutoff)) {
                    $shouldMarkAbsent = true;
                }
            } elseif ($targetDate->isPast()) {
                $shouldMarkAbsent = true;
            }

            if ($shouldMarkAbsent) {
                Attendance::updateOrCreate(
                    [
                        'business_id' => $businessId,
                        'user_id'     => $userId,
                        'date'        => $targetDateStr,
                    ],
                    [
                        'status'            => 'absent',
                        'check_in_time'     => null,
                        'check_out_time'    => null,
                        'actual_hours'      => 0,
                        'late_mark_minutes' => 0,
                        'notes'             => 'Auto-marked absent: Did not punch in before half-shift cutoff (' . $halfTimeCutoff->format('h:i A') . ')',
                    ]
                );
                $markedCount++;
            }
        }

        return $markedCount;
    }

    /**
     * Process attendances where staff checked in but forgot to checkout.
     * Applies fallback policy (e.g. Cap at Half-Day) after shift end / alert time.
     */
    public function processForgotCheckout(int $businessId, ?string $date = null): int
    {
        $targetDate = $date ? Carbon::parse($date) : Carbon::today();
        $targetDateStr = $targetDate->toDateString();
        $now = Carbon::now();

        $workSetting = BusinessWorkSetting::where('business_id', $businessId)->first();
        $policy = $workSetting->forgot_checkout_policy ?? 'half_day';
        $alertTimeStr = $workSetting->forgot_checkout_alert_time ?? '19:00:00';
        $standardHours = (float)($workSetting->standard_hours_per_day ?? 8.0);
        $shiftEndTime = $workSetting->work_end_time ?? '18:00:00';

        // Only process if today has passed alert time or if processing a past date
        if ($targetDate->isToday()) {
            $alertTime = Carbon::parse($targetDateStr . ' ' . $alertTimeStr);
            if ($now->lessThan($alertTime)) {
                return 0; // Not yet time to process forgot checkout
            }
        }

        // Find all attendances for this business and date where check_in_time is present but check_out_time is null
        $attendances = Attendance::where('business_id', $businessId)
            ->where('date', $targetDateStr)
            ->whereNotNull('check_in_time')
            ->whereNull('check_out_time')
            ->where('forgot_checkout_applied', false)
            ->get();

        $processedCount = 0;

        foreach ($attendances as $attendance) {
            // If staff has a pending regularization request awaiting admin action, do not penalize yet
            if ($attendance->regularization_status === 'pending') {
                continue;
            }

            if ($policy === 'half_day') {
                $halfHours = round($standardHours / 2, 2);
                $attendance->status = 'half_day';
                $attendance->actual_hours = $halfHours;
                $attendance->gross_presence_hours = $halfHours;
                $attendance->notes = trim(($attendance->notes ? $attendance->notes . ' | ' : '') . 'Auto-capped at Half Day: Forgot check-out');
                $attendance->forgot_checkout_applied = true;
                $attendance->is_auto_closed = true;
                $attendance->save();
                $processedCount++;
            } elseif ($policy === 'auto_full') {
                $attendance->check_out_time = $shiftEndTime;
                $attendance->status = 'present';
                $attendance->gross_presence_hours = $attendance->computeGrossPresenceHours();
                $attendance->actual_hours = $attendance->computeActualHours();
                $attendance->notes = trim(($attendance->notes ? $attendance->notes . ' | ' : '') . 'Auto-closed shift: Full credit');
                $attendance->forgot_checkout_applied = true;
                $attendance->is_auto_closed = true;
                $attendance->save();
                $processedCount++;
            } elseif ($policy === 'incomplete') {
                $attendance->status = 'absent';
                $attendance->actual_hours = 0.0;
                $attendance->gross_presence_hours = 0.0;
                $attendance->notes = trim(($attendance->notes ? $attendance->notes . ' | ' : '') . 'Flagged incomplete (0h): Forgot check-out');
                $attendance->forgot_checkout_applied = true;
                $attendance->is_auto_closed = true;
                $attendance->save();
                $processedCount++;
            }
        }

        return $processedCount;
    }
}
