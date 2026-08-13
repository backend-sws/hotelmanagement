<?php

namespace App\Http\Controllers\Api\Business;

use App\Http\Controllers\BaseController;
use App\Models\HotelBooking;
use App\Models\HotelFolioCharge;
use App\Models\HotelNightAuditLog;
use App\Models\HotelRoom;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class HotelNightAuditController extends BaseController
{
    public function previewTotals(Request $request)
    {
        return $this->executeAction(function () use ($request) {
            $businessId = app('current_business_id') ?? $request->user()->business_id;
            $today = now()->format('Y-m-d');

            $activeBookings = HotelBooking::where('business_id', $businessId)
                ->where('status', 'checked_in')
                ->get();

            $expectedCheckouts = $activeBookings->where('check_out_date', '<=', $today)->count();
            
            $noShowsQuery = HotelBooking::where('business_id', $businessId)
                ->whereIn('status', ['confirmed', 'reserved'])
                ->where('check_in_date', '<', $today);
            $noShowsCount = $noShowsQuery->count();

            $expectedRoomRevenue = $activeBookings->sum('room_rate_per_night');

            return [
                'audit_date' => $today,
                'rooms_occupied' => $activeBookings->count(),
                'expected_checkouts' => $expectedCheckouts,
                'no_shows' => $noShowsCount,
                'expected_room_revenue' => $expectedRoomRevenue,
            ];
        });
    }

    public function run(Request $request)
    {
        return $this->executeAction(function () use ($request) {
            $businessId = app('current_business_id') ?? $request->user()->business_id;
            $today = now()->format('Y-m-d');

            // Check if already run for today
            $existing = HotelNightAuditLog::where('business_id', $businessId)
                ->where('audit_date', $today)
                ->where('status', 'completed')
                ->first();

            if ($existing) {
                throw new \Exception('Night audit already completed for today.');
            }

            return DB::transaction(function () use ($businessId, $today, $request) {
                $log = HotelNightAuditLog::create([
                    'business_id' => $businessId,
                    'audit_date' => $today,
                    'status' => 'running',
                    'run_by' => $request->user()->id,
                    'run_at' => now(),
                ]);

                // 1. Mark No-Shows
                $noShows = HotelBooking::where('business_id', $businessId)
                    ->whereIn('status', ['confirmed', 'reserved'])
                    ->where('check_in_date', '<', $today)
                    ->get();
                
                foreach ($noShows as $booking) {
                    $booking->update(['status' => 'no_show']);
                    if ($booking->room_id) {
                        HotelRoom::where('id', $booking->room_id)->update(['status' => 'available']);
                    }
                }

                // 2. Post Room Charges for active bookings
                $activeBookings = HotelBooking::where('business_id', $businessId)
                    ->where('status', 'checked_in')
                    ->get();

                $totalRoomRevenue = 0;
                $totalTax = 0; // Simplified for now, real implementation would use TaxConfig

                foreach ($activeBookings as $booking) {
                    // Check if already posted today to prevent double posting
                    $alreadyPosted = HotelFolioCharge::where('booking_id', $booking->id)
                        ->where('charge_date', $today)
                        ->where('charge_type', 'room_rent')
                        ->exists();

                    if (!$alreadyPosted && $booking->room_rate_per_night > 0) {
                        HotelFolioCharge::create([
                            'booking_id' => $booking->id,
                            'charge_type' => 'room_rent',
                            'description' => 'Room Rent - ' . $today,
                            'charge_date' => $today,
                            'qty' => 1,
                            'unit_price' => $booking->room_rate_per_night,
                            'total_price' => $booking->room_rate_per_night,
                            'posted_by' => $request->user()->id,
                        ]);

                        $booking->total_room_charges += $booking->room_rate_per_night;
                        $booking->total_amount += $booking->room_rate_per_night;
                        $booking->balance_due += $booking->room_rate_per_night;
                        $booking->save();

                        $totalRoomRevenue += $booking->room_rate_per_night;
                    }
                }

                $totalRooms = HotelRoom::where('business_id', $businessId)->count();

                $log->update([
                    'rooms_occupied' => $activeBookings->count(),
                    'rooms_available' => $totalRooms - $activeBookings->count(),
                    'occupancy_percent' => $totalRooms > 0 ? ($activeBookings->count() / $totalRooms) * 100 : 0,
                    'total_revenue_room' => $totalRoomRevenue,
                    'total_revenue_gross' => $totalRoomRevenue + $totalTax,
                    'no_shows' => $noShows->count(),
                    'status' => 'completed',
                ]);

                return $log;
            });
        }, 'Night audit completed successfully');
    }

    public function history(Request $request)
    {
        return $this->executeAction(function () use ($request) {
            $businessId = app('current_business_id') ?? $request->user()->business_id;
            return HotelNightAuditLog::where('business_id', $businessId)
                ->with('runner:id,name')
                ->latest('audit_date')
                ->get();
        });
    }
}
