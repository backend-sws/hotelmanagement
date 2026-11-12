<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Business;
use App\Services\Business\AttendanceService;
use Carbon\Carbon;

class AutoMarkAbsentHalfTime extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'attendance:auto-absent {--business= : Specific business ID to process} {--date= : Target date (Y-m-d, defaults to today)}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Automatically mark staff as Absent if they have not checked in by half of their shift on scheduled working days.';

    public function handle(AttendanceService $attendanceService): int
    {
        $businessId = $this->option('business');
        $date = $this->option('date') ?: Carbon::today()->toDateString();

        $this->info("Running auto-absent evaluation for date: {$date}...");

        $businessesQuery = Business::query();
        if ($businessId) {
            $businessesQuery->where('id', $businessId);
        }

        $businesses = $businessesQuery->get();
        $totalMarked = 0;

        foreach ($businesses as $business) {
            try {
                $marked = $attendanceService->autoMarkAbsentForHalfTimeNoShow($business->id, $date);
                if ($marked > 0) {
                    $this->line("Business #{$business->id} ({$business->name}): marked {$marked} staff as absent.");
                    $totalMarked += $marked;
                }
            } catch (\Throwable $e) {
                $this->error("Error processing business #{$business->id}: " . $e->getMessage());
            }
        }

        $this->info("Completed. Total staff marked absent: {$totalMarked}.");
        return Command::SUCCESS;
    }
}

