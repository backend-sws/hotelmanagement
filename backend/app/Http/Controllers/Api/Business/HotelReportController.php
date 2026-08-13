<?php

namespace App\Http\Controllers\Api\Business;

use App\Http\Controllers\BaseController;
use App\Models\HotelBooking;
use App\Models\HotelNightAuditLog;
use Illuminate\Http\Request;
use Carbon\Carbon;

class HotelReportController extends BaseController
{
    public function occupancy(Request $request)
    {
        return $this->executeAction(function () use ($request) {
            $businessId = app('current_business_id') ?? $request->user()->business_id;
            
            // Last 30 days of night audits
            $startDate = now()->subDays(30)->format('Y-m-d');
            
            $logs = HotelNightAuditLog::where('business_id', $businessId)
                ->where('audit_date', '>=', $startDate)
                ->where('status', 'completed')
                ->orderBy('audit_date')
                ->get(['audit_date', 'occupancy_percent']);

            return $logs;
        });
    }

    public function revenue(Request $request)
    {
        return $this->executeAction(function () use ($request) {
            $businessId = app('current_business_id') ?? $request->user()->business_id;
            
            // Last 30 days of revenue
            $startDate = now()->subDays(30)->format('Y-m-d');
            
            $logs = HotelNightAuditLog::where('business_id', $businessId)
                ->where('audit_date', '>=', $startDate)
                ->where('status', 'completed')
                ->orderBy('audit_date')
                ->get(['audit_date', 'total_revenue_room', 'total_revenue_pos', 'total_revenue_gross']);

            return $logs;
        });
    }

    public function channelWise(Request $request)
    {
        return $this->executeAction(function () use ($request) {
            $businessId = app('current_business_id') ?? $request->user()->business_id;
            
            // Bookings in the last 30 days
            $startDate = now()->subDays(30)->format('Y-m-d');
            
            $bookings = HotelBooking::where('business_id', $businessId)
                ->where('created_at', '>=', $startDate)
                ->selectRaw('booking_source, COUNT(*) as total_bookings, SUM(total_amount) as total_revenue')
                ->groupBy('booking_source')
                ->get();

            return $bookings;
        });
    }

    public function misSummary(Request $request)
    {
        return $this->executeAction(function () use ($request) {
            $businessId = app('current_business_id') ?? $request->user()->business_id;
            
            // Get the most recent completed night audit
            $latestAudit = HotelNightAuditLog::where('business_id', $businessId)
                ->where('status', 'completed')
                ->latest('audit_date')
                ->first();

            if (!$latestAudit) {
                return [
                    'occupancy_percent' => 0,
                    'adr' => 0,
                    'revpar' => 0,
                    'total_revenue' => 0,
                ];
            }

            // Calculate ADR (Average Daily Rate): Total Room Revenue / Rooms Occupied
            $adr = $latestAudit->rooms_occupied > 0 
                ? $latestAudit->total_revenue_room / $latestAudit->rooms_occupied 
                : 0;

            // Calculate RevPAR (Revenue Per Available Room): Total Room Revenue / Total Available Rooms
            // Total Rooms = rooms_occupied + rooms_available
            $totalRooms = $latestAudit->rooms_occupied + $latestAudit->rooms_available;
            $revpar = $totalRooms > 0 
                ? $latestAudit->total_revenue_room / $totalRooms 
                : 0;

            return [
                'audit_date' => $latestAudit->audit_date,
                'occupancy_percent' => $latestAudit->occupancy_percent,
                'adr' => round($adr, 2),
                'revpar' => round($revpar, 2),
                'total_revenue' => $latestAudit->total_revenue_gross,
            ];
        });
    }
}
