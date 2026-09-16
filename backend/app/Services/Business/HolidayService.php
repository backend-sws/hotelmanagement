<?php

namespace App\Services\Business;

use App\Models\BusinessHoliday;
use App\Models\Attendance;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class HolidayService
{
    /**
     * Get holidays for a specific month (Y-m format), scoped to business.
     */
    public function getForMonth(string $month): \Illuminate\Database\Eloquent\Collection
    {
        $businessId = app('current_business_id');
        return BusinessHoliday::where('business_id', $businessId)
            ->forMonth($month)
            ->orderBy('date')
            ->get();
    }

    /**
     * Create a single holiday and automatically apply to staff attendance.
     */
    public function define(array $data): BusinessHoliday
    {
        $businessId = app('current_business_id');
        $holiday = BusinessHoliday::updateOrCreate(
            ['business_id' => $businessId, 'date' => $data['date']],
            [
                'name'        => $data['name'],
                'type'        => $data['type'] ?? 'custom',
                'is_paid'     => $data['is_paid'] ?? true,
                'description' => $data['description'] ?? null,
                'created_by'  => auth()->id(),
            ]
        );

        $this->applyHolidayToStaff($holiday);

        return $holiday;
    }

    /**
     * Bulk define holidays (e.g., paste a list for a month).
     */
    public function bulkDefine(array $holidays): array
    {
        $results = [];
        foreach ($holidays as $h) {
            $results[] = $this->define($h);
        }
        return $results;
    }

    /**
     * Delete a holiday by ID and clean up auto-applied holiday attendance records.
     */
    public function delete(int $id): void
    {
        $businessId = app('current_business_id');
        $holiday = BusinessHoliday::where('business_id', $businessId)->findOrFail($id);
        $holidayDate = Carbon::parse($holiday->date)->format('Y-m-d');

        // Delete auto-applied holiday records that do not have clock-in/out times
        Attendance::where('business_id', $businessId)
            ->where('date', $holidayDate)
            ->where('status', 'holiday')
            ->whereNull('check_in_time')
            ->whereNull('check_out_time')
            ->delete();

        $holiday->delete();
    }

    /**
     * Apply a single holiday to all active staff attendance.
     */
    public function applyHolidayToStaff(BusinessHoliday $holiday): void
    {
        $businessId = $holiday->business_id;
        $holidayDate = Carbon::parse($holiday->date)->format('Y-m-d');

        $staffIds = DB::table('business_user')
            ->join('users', 'business_user.user_id', '=', 'users.id')
            ->where('business_user.business_id', $businessId)
            ->where('business_user.status', 'active')
            ->whereNull('users.deleted_at')
            ->pluck('users.id');

        $creatorId = auth()->id() ?? DB::table('businesses')->where('id', $businessId)->value('owner_id');

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
                    'approved_by' => $creatorId,
                ]);
            } elseif ($record->status === 'absent' || $record->status === 'holiday') {
                $record->update([
                    'status' => 'holiday',
                    'notes'  => $holiday->name,
                ]);
            }
        }
    }

    /**
     * Auto-apply holidays to all active staff attendance for a month.
     * For each holiday date, creates an attendance record with status='holiday'
     * for all active staff who don't already have an attendance record on that date.
     */
    public function autoApplyToAttendance(string $month): array
    {
        $businessId = app('current_business_id');

        $holidays = BusinessHoliday::where('business_id', $businessId)
            ->forMonth($month)
            ->get();

        if ($holidays->isEmpty()) {
            return ['applied' => 0, 'skipped' => 0, 'message' => 'No holidays defined for this month.'];
        }

        // Get all active staff
        $staffIds = DB::table('business_user')
            ->join('users', 'business_user.user_id', '=', 'users.id')
            ->where('business_user.business_id', $businessId)
            ->where('business_user.status', 'active')
            ->whereNull('users.deleted_at')
            ->pluck('users.id');

        $applied = 0;
        $skipped = 0;

        foreach ($holidays as $holiday) {
            foreach ($staffIds as $userId) {
                // Only create if no attendance record already exists for this date
                $exists = Attendance::where('business_id', $businessId)
                    ->where('user_id', $userId)
                    ->where('date', $holiday->date->format('Y-m-d'))
                    ->exists();

                if (!$exists) {
                    Attendance::create([
                        'business_id' => $businessId,
                        'user_id'     => $userId,
                        'date'        => $holiday->date->format('Y-m-d'),
                        'status'      => 'holiday',
                        'notes'       => $holiday->name,
                        'approved_by' => auth()->id(),
                    ]);
                    $applied++;
                } else {
                    $skipped++;
                }
            }
        }

        return [
            'applied'  => $applied,
            'skipped'  => $skipped,
            'holidays' => $holidays->count(),
            'staff'    => $staffIds->count(),
            'message'  => "Applied {$applied} holiday records. Skipped {$skipped} (already had attendance).",
        ];
    }

    /**
     * Get holiday dates for a date range as a simple array of date strings.
     * Used by PayrollService.
     */
    public function getHolidayDatesForRange(int $businessId, string $from, string $to): array
    {
        return BusinessHoliday::where('business_id', $businessId)
            ->whereBetween('date', [$from, $to])
            ->pluck('date')
            ->map(fn($d) => Carbon::parse($d)->format('Y-m-d'))
            ->toArray();
    }
}
