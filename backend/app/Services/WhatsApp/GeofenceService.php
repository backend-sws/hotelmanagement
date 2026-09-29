<?php

namespace App\Services\WhatsApp;

class GeofenceService
{
    /**
     * Calculate great-circle distance between two GPS points in meters (Haversine formula).
     */
    public function calculateDistance(float $lat1, float $lng1, float $lat2, float $lng2): float
    {
        $earthRadius = 6371000; // meters

        $latFrom = deg2rad($lat1);
        $lngFrom = deg2rad($lng1);
        $latTo   = deg2rad($lat2);
        $lngTo   = deg2rad($lng2);

        $latDelta = $latTo - $latFrom;
        $lngDelta = $lngTo - $lngFrom;

        $a = sin($latDelta / 2) ** 2 +
             cos($latFrom) * cos($latTo) * sin($lngDelta / 2) ** 2;

        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));

        return round($earthRadius * $c, 2);
    }

    /**
     * Verify if employee's location is within allowed radius of target site
     */
    public function isWithinGeofence(float $empLat, float $empLng, float $siteLat, float $siteLng, float $radiusMeters = 100.0): array
    {
        $distance = $this->calculateDistance($empLat, $empLng, $siteLat, $siteLng);

        return [
            'is_within'       => $distance <= $radiusMeters,
            'distance_meters' => $distance,
            'allowed_radius'  => $radiusMeters,
        ];
    }
}
