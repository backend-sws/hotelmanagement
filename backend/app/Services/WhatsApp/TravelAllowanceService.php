<?php

namespace App\Services\WhatsApp;

use App\Models\StaffLocationLog;
use App\Models\TravelAllowance;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class TravelAllowanceService
{
    protected GeofenceService $geofence;

    // Standard Tenant Vehicle Rates (INR per KM)
    protected array $vehicleRates = [
        'bike'           => 3.50,
        'car'            => 8.00,
        'public_transit' => 2.50,
    ];

    public function __construct(GeofenceService $geofence)
    {
        $this->geofence = $geofence;
    }

    /**
     * Record a GPS waypoint for employee travel tracking
     */
    public function recordLocation(
        int $businessId,
        int $staffId,
        float $lat,
        float $lng,
        string $source,
        ?int $referenceId = null,
        array $metadata = []
    ): StaffLocationLog {
        return StaffLocationLog::create([
            'business_id'     => $businessId,
            'staff_id'        => $staffId,
            'lat'             => $lat,
            'lng'             => $lng,
            'location_source' => $source,
            'reference_id'    => $referenceId,
            'metadata'        => $metadata,
            'recorded_at'     => now(),
        ]);
    }

    /**
     * Calculate daily distance traveled and update/generate TravelAllowance claim
     */
    public function calculateDailyTravel(
        int $businessId,
        int $staffId,
        ?string $date = null,
        string $vehicleType = 'bike'
    ): TravelAllowance {
        $targetDate = $date ? Carbon::parse($date)->toDateString() : today()->toDateString();

        // 1. Fetch chronological location logs for this date
        $waypoints = StaffLocationLog::where('business_id', $businessId)
            ->where('staff_id', $staffId)
            ->whereDate('recorded_at', $targetDate)
            ->orderBy('recorded_at', 'asc')
            ->get();

        $totalMeters = 0.0;
        $count = $waypoints->count();

        // 2. Compute Haversine distance between consecutive waypoints
        for ($i = 0; $i < $count - 1; $i++) {
            $p1 = $waypoints[$i];
            $p2 = $waypoints[$i + 1];

            $distMeters = $this->geofence->calculateDistance(
                (float)$p1->lat, (float)$p1->lng,
                (float)$p2->lat, (float)$p2->lng
            );

            // Filter out noise/jitter (< 25 meters) and impossible teleportation (> 100 km)
            if ($distMeters >= 25.0 && $distMeters <= 100000.0) {
                $totalMeters += $distMeters;
            }
        }

        $totalKm = round($totalMeters / 1000.0, 2);
        $ratePerKm = $this->vehicleRates[$vehicleType] ?? 3.50;
        $totalAmount = round($totalKm * $ratePerKm, 2);

        $startLoc = $waypoints->first()?->metadata['site_name'] ?? 'Base Location';
        $endLoc   = $waypoints->last()?->metadata['site_name'] ?? 'Final Site';

        // 3. Upsert daily allowance record
        return TravelAllowance::updateOrCreate(
            [
                'business_id' => $businessId,
                'staff_id'    => $staffId,
                'date'        => $targetDate,
            ],
            [
                'vehicle_type'   => $vehicleType,
                'start_location' => $startLoc,
                'end_location'   => $endLoc,
                'total_km'       => $totalKm,
                'rate_per_km'    => $ratePerKm,
                'total_amount'   => $totalAmount,
                'notes'          => "Automated calculation based on {$count} verified GPS waypoints.",
            ]
        );
    }

    /**
     * Approve a travel allowance claim
     */
    public function approveClaim(int $claimId, int $approverId): TravelAllowance
    {
        $claim = TravelAllowance::findOrFail($claimId);
        $claim->status = 'approved';
        $claim->approved_by = $approverId;
        $claim->save();

        return $claim;
    }

    /**
     * Reject a travel allowance claim
     */
    public function rejectClaim(int $claimId, string $notes): TravelAllowance
    {
        $claim = TravelAllowance::findOrFail($claimId);
        $claim->status = 'rejected';
        $claim->notes = $notes;
        $claim->save();

        return $claim;
    }

    /**
     * Sync approved claims with payroll summary for the month
     */
    public function syncWithPayroll(int $businessId, string $month): array
    {
        $startDate = Carbon::parse($month . '-01')->startOfMonth()->toDateString();
        $endDate   = Carbon::parse($month . '-01')->endOfMonth()->toDateString();

        $approvedClaims = TravelAllowance::where('business_id', $businessId)
            ->where('status', 'approved')
            ->whereBetween('date', [$startDate, $endDate])
            ->get();

        $summaryByStaff = [];
        foreach ($approvedClaims as $claim) {
            $staffId = $claim->staff_id;
            if (!isset($summaryByStaff[$staffId])) {
                $summaryByStaff[$staffId] = [
                    'staff_id'       => $staffId,
                    'staff_name'     => $claim->staff?->name ?? 'Staff #' . $staffId,
                    'total_km'       => 0.0,
                    'total_amount'   => 0.0,
                    'claims_count'   => 0,
                ];
            }

            $summaryByStaff[$staffId]['total_km'] += (float)$claim->total_km;
            $summaryByStaff[$staffId]['total_amount'] += (float)$claim->total_amount;
            $summaryByStaff[$staffId]['claims_count']++;

            // Mark claim as paid/synced
            $claim->status = 'paid';
            $claim->save();
        }

        return array_values($summaryByStaff);
    }
}
