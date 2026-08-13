<?php

namespace App\Http\Controllers\Api\Business;

use App\Http\Controllers\Controller;
use App\Models\HotelOtaRateSync;
use App\Models\HotelOtaChannel;
use App\Models\HotelRoomType;
use Illuminate\Http\Request;
use Carbon\Carbon;

class HotelOtaSyncController extends Controller
{
    public function index(Request $request)
    {
        $syncs = HotelOtaRateSync::with(['channel', 'roomType'])
            ->orderBy('sync_date', 'asc')
            ->get();
            
        return response()->json($syncs);
    }

    public function syncAll(Request $request)
    {
        $validated = $request->validate([
            'channel_id' => 'required|exists:hotel_ota_channels,id',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ]);

        $channel = HotelOtaChannel::findOrFail($validated['channel_id']);
        $roomTypes = HotelRoomType::all();
        
        $startDate = Carbon::parse($validated['start_date']);
        $endDate = Carbon::parse($validated['end_date']);
        
        $records = [];
        
        // Dummy logic to generate sync records
        for ($date = $startDate->copy(); $date->lte($endDate); $date->addDay()) {
            foreach ($roomTypes as $rt) {
                // Determine rate based on day of week (dummy logic mimicking rate plans)
                $rate = $date->isWeekend() ? $rt->base_price_weekend : $rt->base_price_weekday;
                
                $sync = HotelOtaRateSync::updateOrCreate(
                    [
                        'business_id' => $request->user()->business_id,
                        'channel_id' => $channel->id,
                        'room_type_id' => $rt->id,
                        'sync_date' => $date->format('Y-m-d'),
                    ],
                    [
                        'available_rooms' => $rt->rooms()->count(),
                        'rate' => $rate,
                        'restrictions' => [],
                        'sync_status' => 'synced',
                        'synced_at' => now(),
                    ]
                );
                
                $records[] = $sync;
            }
        }
        
        $channel->update(['last_sync_at' => now(), 'sync_status' => 'connected']);

        return response()->json([
            'message' => 'Rates and Availability synced successfully.',
            'synced_count' => count($records)
        ]);
    }
}
