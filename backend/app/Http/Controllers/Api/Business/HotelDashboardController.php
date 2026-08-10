<?php

namespace App\Http\Controllers\Api\Business;

use App\Http\Controllers\BaseController;
use App\Models\HotelBooking;
use App\Models\HotelRoom;
use Illuminate\Http\Request;
use Carbon\Carbon;
use OpenApi\Attributes as OA;

class HotelDashboardController extends BaseController
{
    #[OA\Get(
        path: '/business/hotel/dashboard',
        summary: 'Hotel Dashboard Overview',
        description: 'Returns KPI stats: occupancy %, total rooms, occupied, available, reserved, dirty, today revenue.',
        tags: ['Hotel - Dashboard'],
        security: [['sanctum' => []]],
        responses: [new OA\Response(response: 200, description: 'Dashboard stats retrieved')]
    )]
    public function index(Request $request)
    {
        return $this->executeAction(function () use ($request) {
            $businessId = app('current_business_id') ?? $request->user()->business_id;
            $today = Carbon::today();

            // Room stats
            $rooms = HotelRoom::where('business_id', $businessId)->get();
            $totalRooms = $rooms->count();
            $statusCounts = $rooms->groupBy('status')->map->count();

            $occupied   = $statusCounts['occupied']    ?? 0;
            $available  = $statusCounts['available']   ?? 0;
            $reserved   = $statusCounts['reserved']    ?? 0;
            $dirty      = $statusCounts['dirty']       ?? 0;
            $maintenance = $statusCounts['maintenance'] ?? 0;
            $blocked    = $statusCounts['blocked']     ?? 0;

            $occupancyPercent = $totalRooms > 0
                ? round(($occupied / $totalRooms) * 100, 1)
                : 0;

            // Revenue today (from bookings created or checked in today)
            $revenueToday = HotelBooking::where('business_id', $businessId)
                ->whereIn('status', ['checked_in', 'checked_out'])
                ->whereDate('updated_at', $today)
                ->sum('amount_paid');

            // Today's arrivals (check_in_date = today & status = confirmed/reserved)
            $arrivalsCount = HotelBooking::where('business_id', $businessId)
                ->whereDate('check_in_date', $today)
                ->whereIn('status', ['confirmed', 'reserved'])
                ->count();

            // Today's departures (check_out_date = today & status = checked_in)
            $departuresCount = HotelBooking::where('business_id', $businessId)
                ->whereDate('check_out_date', $today)
                ->where('status', 'checked_in')
                ->count();

            return [
                'total_rooms'       => $totalRooms,
                'occupied'          => $occupied,
                'available'         => $available,
                'reserved'          => $reserved,
                'dirty'             => $dirty,
                'maintenance'       => $maintenance,
                'blocked'           => $blocked,
                'occupancy_percent' => $occupancyPercent,
                'arrivals_today'    => $arrivalsCount,
                'departures_today'  => $departuresCount,
                'revenue_today'     => (float) $revenueToday,
            ];
        }, 'Dashboard stats retrieved');
    }

    #[OA\Get(
        path: '/business/hotel/dashboard/room-grid',
        summary: 'Live Room Status Grid',
        description: 'Returns all rooms with live status, current guest name, and booking ID.',
        tags: ['Hotel - Dashboard'],
        security: [['sanctum' => []]],
        responses: [new OA\Response(response: 200, description: 'Room grid retrieved')]
    )]
    public function roomGrid(Request $request)
    {
        return $this->executeAction(function () use ($request) {
            $businessId = app('current_business_id') ?? $request->user()->business_id;

            $rooms = HotelRoom::with(['roomType'])
                ->where('business_id', $businessId)
                ->orderBy('floor')
                ->orderBy('room_number')
                ->get();

            // Get active bookings for occupied/reserved rooms
            $activeBookings = HotelBooking::with('guest')
                ->where('business_id', $businessId)
                ->whereIn('status', ['checked_in', 'confirmed', 'reserved'])
                ->get()
                ->keyBy('room_id');

            return $rooms->map(function ($room) use ($activeBookings) {
                $booking = $activeBookings->get($room->id);
                return [
                    'id'            => $room->id,
                    'room_number'   => $room->room_number,
                    'floor'         => $room->floor,
                    'status'        => $room->status,
                    'room_type'     => $room->roomType?->name,
                    'bed_type'      => $room->bed_type,
                    'is_ac'         => $room->is_ac,
                    'booking_id'    => $booking?->id,
                    'booking_number'=> $booking?->booking_number,
                    'guest_name'    => $booking?->guest?->name,
                    'guest_phone'   => $booking?->guest?->phone,
                    'check_in_date' => $booking?->check_in_date,
                    'check_out_date'=> $booking?->check_out_date,
                    'nights'        => $booking?->total_nights,
                    'balance_due'   => $booking?->balance_due,
                ];
            });
        }, 'Room grid retrieved');
    }

    #[OA\Get(
        path: '/business/hotel/dashboard/today-arrivals',
        summary: 'Today\'s Expected Arrivals',
        description: 'Returns bookings with check_in_date = today and status confirmed/reserved.',
        tags: ['Hotel - Dashboard'],
        security: [['sanctum' => []]],
        responses: [new OA\Response(response: 200, description: 'Today arrivals retrieved')]
    )]
    public function todayArrivals(Request $request)
    {
        return $this->executeAction(function () use ($request) {
            $businessId = app('current_business_id') ?? $request->user()->business_id;

            return HotelBooking::with(['guest', 'room.roomType'])
                ->where('business_id', $businessId)
                ->whereDate('check_in_date', Carbon::today())
                ->whereIn('status', ['confirmed', 'reserved'])
                ->orderBy('check_in_date')
                ->get();
        }, 'Today arrivals retrieved');
    }

    #[OA\Get(
        path: '/business/hotel/dashboard/today-departures',
        summary: 'Today\'s Expected Departures',
        description: 'Returns checked-in bookings with check_out_date = today.',
        tags: ['Hotel - Dashboard'],
        security: [['sanctum' => []]],
        responses: [new OA\Response(response: 200, description: 'Today departures retrieved')]
    )]
    public function todayDepartures(Request $request)
    {
        return $this->executeAction(function () use ($request) {
            $businessId = app('current_business_id') ?? $request->user()->business_id;

            return HotelBooking::with(['guest', 'room.roomType'])
                ->where('business_id', $businessId)
                ->whereDate('check_out_date', Carbon::today())
                ->where('status', 'checked_in')
                ->orderBy('check_out_date')
                ->get();
        }, 'Today departures retrieved');
    }
}
