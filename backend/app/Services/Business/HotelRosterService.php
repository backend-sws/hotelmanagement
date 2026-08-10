<?php

namespace App\Services\Business;

use App\Models\HotelDepartment;
use App\Models\HotelShift;
use App\Models\HotelShiftRoster;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class HotelRosterService
{
    // --- Departments ---------------------------------------------------------

    public function getDepartments(int $businessId)
    {
        return HotelDepartment::with('head')
            ->where('business_id', $businessId)
            ->withCount('rosterEntries')
            ->orderBy('name')
            ->get();
    }

    public function createDepartment(int $businessId, array $data): HotelDepartment
    {
        return HotelDepartment::create(array_merge($data, ['business_id' => $businessId]));
    }

    public function updateDepartment(int $id, int $businessId, array $data): HotelDepartment
    {
        $dept = HotelDepartment::where('business_id', $businessId)->findOrFail($id);
        $dept->update($data);
        return $dept->fresh('head');
    }

    public function deleteDepartment(int $id, int $businessId): bool
    {
        return HotelDepartment::where('business_id', $businessId)->findOrFail($id)->delete();
    }

    // --- Shifts --------------------------------------------------------------

    public function getShifts(int $businessId)
    {
        return HotelShift::where('business_id', $businessId)
            ->orderBy('start_time')
            ->get();
    }

    public function createShift(int $businessId, array $data): HotelShift
    {
        return HotelShift::create(array_merge($data, ['business_id' => $businessId]));
    }

    public function updateShift(int $id, int $businessId, array $data): HotelShift
    {
        $shift = HotelShift::where('business_id', $businessId)->findOrFail($id);
        $shift->update($data);
        return $shift->fresh();
    }

    public function deleteShift(int $id, int $businessId): bool
    {
        return HotelShift::where('business_id', $businessId)->findOrFail($id)->delete();
    }

    // --- Roster --------------------------------------------------------------

    /**
     * Get weekly roster as a structured grid.
     * Returns: { staff[], dates[], cells: { "userId_date" => RosterEntry } }
     */
    public function getWeeklyRoster(int $businessId, string $weekStart, ?int $departmentId = null): array
    {
        $start = Carbon::parse($weekStart)->startOfWeek(Carbon::MONDAY);
        $end   = $start->copy()->endOfWeek(Carbon::SUNDAY);

        $dates = [];
        $cur = $start->copy();
        while ($cur->lte($end)) {
            $dates[] = $cur->format('Y-m-d');
            $cur->addDay();
        }

        // Get all staff for this business
        $staffQuery = DB::table('business_user')
            ->join('users', 'users.id', '=', 'business_user.user_id')
            ->where('business_user.business_id', $businessId)
            ->whereNull('users.deleted_at')
            ->where('users.status', 'active')
            ->select('users.id', 'users.name', 'users.avatar');

        $staff = $staffQuery->get()->map(fn($u) => [
            'id'     => $u->id,
            'name'   => $u->name,
            'avatar' => $u->avatar,
        ])->toArray();

        // Get all roster entries for this week
        $rosterQuery = HotelShiftRoster::with(['shift', 'department', 'swapUser'])
            ->where('business_id', $businessId)
            ->whereBetween('roster_date', [$start->format('Y-m-d'), $end->format('Y-m-d')]);

        if ($departmentId) {
            $rosterQuery->where('department_id', $departmentId);
        }

        $entries = $rosterQuery->get();

        // Build cells map: "userId_date" => entry
        $cells = [];
        foreach ($entries as $entry) {
            $key = $entry->user_id . '_' . $entry->roster_date->format('Y-m-d');
            $cells[$key] = $entry;
        }

        return [
            'week_start' => $start->format('Y-m-d'),
            'week_end'   => $end->format('Y-m-d'),
            'dates'      => $dates,
            'staff'      => $staff,
            'cells'      => $cells,
        ];
    }

    /**
     * Assign a single shift to one staff on one date.
     * If entry exists for that user+date ? update it.
     */
    public function assignShift(int $businessId, array $data): HotelShiftRoster
    {
        $entry = HotelShiftRoster::updateOrCreate(
            [
                'business_id' => $businessId,
                'user_id'     => $data['user_id'],
                'roster_date' => $data['roster_date'],
            ],
            [
                'department_id' => $data['department_id'] ?? null,
                'shift_id'      => $data['shift_id'] ?? null,
                'status'        => $data['status'] ?? 'scheduled',
                'notes'         => $data['notes'] ?? null,
            ]
        );

        return $entry->load(['shift', 'department', 'user']);
    }

    /**
     * Bulk assign one shift to multiple staff across multiple dates.
     * Returns: { created: N, skipped: N, conflicts: [] }
     */
    public function bulkAssign(int $businessId, array $data): array
    {
        $userIds   = $data['user_ids'];
        $shiftId   = $data['shift_id'];
        $deptId    = $data['department_id'] ?? null;
        $dates     = $data['dates']; // array of date strings
        $override  = $data['override_existing'] ?? false;

        $created   = 0;
        $skipped   = 0;
        $conflicts = [];

        foreach ($userIds as $userId) {
            foreach ($dates as $date) {
                $existing = HotelShiftRoster::where('business_id', $businessId)
                    ->where('user_id', $userId)
                    ->where('roster_date', $date)
                    ->first();

                if ($existing && !$override) {
                    $skipped++;
                    $conflicts[] = ['user_id' => $userId, 'date' => $date, 'existing_shift_id' => $existing->shift_id];
                    continue;
                }

                HotelShiftRoster::updateOrCreate(
                    ['business_id' => $businessId, 'user_id' => $userId, 'roster_date' => $date],
                    ['shift_id' => $shiftId, 'department_id' => $deptId, 'status' => 'scheduled']
                );
                $created++;
            }
        }

        return ['created' => $created, 'skipped' => $skipped, 'conflicts' => $conflicts];
    }

    /**
     * Update the status of a roster entry (attended, absent, on_leave, etc.)
     */
    public function updateStatus(int $id, int $businessId, string $status): HotelShiftRoster
    {
        $entry = HotelShiftRoster::where('business_id', $businessId)->findOrFail($id);
        $entry->status = $status;
        $entry->save();
        return $entry->load(['shift', 'department', 'user']);
    }

    /**
     * Staff requests a shift swap with another staff member.
     */
    public function requestSwap(int $id, int $businessId, array $data): HotelShiftRoster
    {
        $entry = HotelShiftRoster::where('business_id', $businessId)->findOrFail($id);
        $entry->swap_with_user_id = $data['swap_with_user_id'];
        $entry->swap_reason       = $data['swap_reason'] ?? null;
        $entry->swap_status       = 'pending';
        $entry->save();
        return $entry->load(['shift', 'department', 'user', 'swapUser']);
    }

    /**
     * Manager approves or rejects a swap request.
     * If approved: swap the shift_id between the two roster entries.
     */
    public function approveSwap(int $id, int $businessId, bool $approved, int $approverId): HotelShiftRoster
    {
        $entry = HotelShiftRoster::where('business_id', $businessId)->findOrFail($id);

        if ($approved) {
            // Find the other user's roster entry for the same date
            $otherEntry = HotelShiftRoster::where('business_id', $businessId)
                ->where('user_id', $entry->swap_with_user_id)
                ->where('roster_date', $entry->roster_date)
                ->first();

            DB::transaction(function () use ($entry, $otherEntry) {
                $originalShiftId = $entry->shift_id;

                $entry->shift_id = $otherEntry?->shift_id;
                $entry->status   = 'swapped';
                $entry->save();

                if ($otherEntry) {
                    $otherEntry->shift_id = $originalShiftId;
                    $otherEntry->status   = 'swapped';
                    $otherEntry->save();
                }
            });

            $entry->swap_status  = 'approved';
            $entry->approved_by  = $approverId;
        } else {
            $entry->swap_status = 'rejected';
            $entry->approved_by = $approverId;
        }

        $entry->save();
        return $entry->load(['shift', 'department', 'user', 'swapUser']);
    }

    /**
     * Delete a roster entry.
     */
    public function deleteEntry(int $id, int $businessId): bool
    {
        return HotelShiftRoster::where('business_id', $businessId)->findOrFail($id)->delete();
    }

    /**
     * Get list of staff with their latest department assignment.
     */
    public function getStaffList(int $businessId): array
    {
        $staff = DB::table('business_user')
            ->join('users', 'users.id', '=', 'business_user.user_id')
            ->where('business_user.business_id', $businessId)
            ->whereNull('users.deleted_at')
            ->where('users.status', 'active')
            ->select('users.id', 'users.name', 'users.avatar', 'users.phone')
            ->get();

        return $staff->toArray();
    }
}
