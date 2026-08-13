<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\HotelOtaChannel;
use App\Models\HotelBooking;
use App\Models\HotelGuest;
use App\Models\HotelRoom;
use App\Models\HotelRoomType;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class HotelOtaWebhookController extends Controller
{
    public function handle(Request $request, $channelName)
    {
        // 1. Authenticate webhook using the channelName or header signature
        // In reality, we verify HMAC signature. For dummy, we find by channel_name
        $channel = HotelOtaChannel::where('channel_name', $channelName)->first();
        
        if (!$channel) {
            return response()->json(['error' => 'Unknown OTA Channel'], 404);
        }

        $payload = $request->all();
        
        Log::info("OTA Webhook Received from {$channelName}", $payload);

        // Dummy payload structure parsing
        $otaRef = $payload['booking_ref'] ?? 'OTA-' . rand(1000, 9999);
        $guestName = $payload['guest']['name'] ?? 'OTA Guest';
        $guestPhone = $payload['guest']['phone'] ?? rand(9000000000, 9999999999);
        $checkIn = $payload['check_in'] ?? now()->addDays(1)->format('Y-m-d');
        $checkOut = $payload['check_out'] ?? now()->addDays(2)->format('Y-m-d');
        $totalAmount = $payload['total_amount'] ?? 5000;
        
        // Disable global scope to insert without auth user context, or set business_id from channel
        $businessId = $channel->business_id;

        // Auto create guest if not exists (using withoutGlobalScopes)
        $guest = HotelGuest::withoutGlobalScopes()->firstOrCreate(
            ['business_id' => $businessId, 'phone' => $guestPhone],
            [
                'name' => $guestName,
                'email' => $payload['guest']['email'] ?? null,
            ]
        );

        // Find available room (dummy assignment)
        $roomTypeCode = $payload['room_type_code'] ?? null;
        
        $roomQuery = HotelRoom::withoutGlobalScopes()
            ->where('business_id', $businessId)
            ->where('status', 'available');
            
        if ($roomTypeCode) {
            $rt = HotelRoomType::withoutGlobalScopes()->where('business_id', $businessId)->where('short_code', $roomTypeCode)->first();
            if ($rt) {
                $roomQuery->where('room_type_id', $rt->id);
            }
        }
        
        $room = $roomQuery->first();

        if (!$room) {
            Log::warning("OTA Webhook: No available rooms for booking ref {$otaRef}");
            // Create a tentative booking without room assigned
        }

        // Create booking
        $booking = HotelBooking::withoutGlobalScopes()->create([
            'business_id' => $businessId,
            'booking_number' => 'BK-' . now()->format('Ymd') . '-' . rand(100, 999),
            'booking_source' => 'ota', // or channel_name
            'ota_booking_ref' => $otaRef,
            'ota_channel_id' => $channel->id,
            'guest_id' => $guest->id,
            'room_id' => $room ? $room->id : null,
            'check_in_date' => $checkIn,
            'check_out_date' => $checkOut,
            'total_nights' => Carbon::parse($checkIn)->diffInDays(Carbon::parse($checkOut)),
            'adults' => $payload['adults'] ?? 2,
            'children' => $payload['children'] ?? 0,
            'room_rate_per_night' => $totalAmount / (Carbon::parse($checkIn)->diffInDays(Carbon::parse($checkOut)) ?: 1),
            'total_room_charges' => $totalAmount,
            'tax_percent' => 12, // Dummy tax
            'tax_amount' => $totalAmount * 0.12,
            'total_amount' => $totalAmount * 1.12,
            'paid_amount' => $payload['paid'] ?? 0,
            'balance_due' => ($totalAmount * 1.12) - ($payload['paid'] ?? 0),
            'payment_status' => ($payload['paid'] ?? 0) > 0 ? 'paid' : 'pending',
            'payment_mode' => 'ota_collect',
            'status' => 'confirmed',
            'internal_notes' => 'Received via OTA Webhook',
        ]);

        if ($room) {
            $room->update(['status' => 'reserved']);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Booking processed',
            'booking_id' => $booking->id
        ]);
    }
}
