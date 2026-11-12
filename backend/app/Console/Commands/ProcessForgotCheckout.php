<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Business;
use App\Services\Business\AttendanceService;
use Carbon\Carbon;

class ProcessForgotCheckout extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'attendance:process-forgot-checkout {--business= : Specific business ID to process} {--date= : Target date (Y-m-d, defaults to today)}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Apply forgot check-out fallback policy (e.g. Cap at Half-Day) for staff who checked in but failed to checkout.';

    public function handle(AttendanceService $attendanceService): int
    {
        $businessId = $this->option('business');
        $date = $this->option('date') ?: Carbon::today()->toDateString();

        $this->info("Running forgot check-out evaluation for date: {$date}...");

        $businessesQuery = Business::query();
        if ($businessId) {
            $businessesQuery->where('id', $businessId);
        }

        $businesses = $businessesQuery->get();
        $totalProcessed = 0;

        foreach ($businesses as $business) {
            try {
                $processed = $attendanceService->processForgotCheckout($business->id, $date);
                if ($processed > 0) {
                    $this->line("Business #{$business->id} ({$business->name}): processed {$processed} forgot-checkout attendances.");
                    $totalProcessed += $processed;
                }
            } catch (\Throwable $e) {
                $this->error("Error processing business #{$business->id}: " . $e->getMessage());
            }
        }

        $this->info("Completed. Total attendances processed: {$totalProcessed}.");
        return Command::SUCCESS;
    }
}

