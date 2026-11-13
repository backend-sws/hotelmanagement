<?php

use Illuminate\Database\Migrations\Migration;
use App\Models\Attendance;
use App\Models\BusinessWorkSetting;
use Carbon\Carbon;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Find attendances recorded at anomalous midnight hours (00:xx to 04:xx) with positive late_mark_minutes
        $records = Attendance::whereNotNull('check_in_time')
            ->where('late_mark_minutes', '>', 0)
            ->where(function ($q) {
                $q->where('check_in_time', 'like', '00:%')
                  ->orWhere('check_in_time', 'like', '01:%')
                  ->orWhere('check_in_time', 'like', '02:%')
                  ->orWhere('check_in_time', 'like', '03:%')
                  ->orWhere('check_in_time', 'like', '04:%');
            })
            ->get();

        foreach ($records as $record) {
            $setting = BusinessWorkSetting::where('business_id', $record->business_id)->first();
            $shiftStartStr = $setting?->work_start_time ?? '09:00:00';
            $grace = $setting?->late_mark_grace_minutes ?? 15;
            $dateStr = $record->date instanceof \DateTimeInterface ? $record->date->format('Y-m-d') : substr((string)$record->date, 0, 10);

            $shiftStart = Carbon::parse($dateStr . ' ' . $shiftStartStr);
            $realArrival = $shiftStart->copy()->addMinutes($grace + (int)$record->late_mark_minutes);

            $record->check_in_time = $realArrival->toTimeString();
            $record->gross_presence_hours = $record->computeGrossPresenceHours();
            $record->actual_hours = $record->computeActualHours();
            $record->save();
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Data repair migration, no destructive rollback required
    }
};

