<?php

namespace App\Http\Controllers\Api\Business;

use App\Http\Controllers\Controller;
use App\Models\HotelOtaChannel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class HotelOtaChannelController extends Controller
{
    public function index(Request $request)
    {
        $channels = HotelOtaChannel::latest()->get();
        return response()->json($channels);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'channel_name' => 'required|string|max:255',
            'channel_type' => 'required|in:ota_direct,channel_manager',
            'api_key' => 'nullable|string',
            'api_secret' => 'nullable|string',
            'property_code' => 'nullable|string',
        ]);

        $validated['business_id'] = $request->user()->business_id;
        $validated['webhook_secret'] = \Str::random(32);
        
        $channel = HotelOtaChannel::create($validated);

        return response()->json([
            'message' => 'OTA Channel connected successfully.',
            'channel' => $channel
        ], 201);
    }

    public function show($id)
    {
        $channel = HotelOtaChannel::findOrFail($id);
        return response()->json($channel);
    }

    public function update(Request $request, $id)
    {
        $channel = HotelOtaChannel::findOrFail($id);

        $validated = $request->validate([
            'channel_name' => 'sometimes|required|string|max:255',
            'channel_type' => 'sometimes|required|in:ota_direct,channel_manager',
            'api_key' => 'nullable|string',
            'api_secret' => 'nullable|string',
            'property_code' => 'nullable|string',
            'sync_status' => 'nullable|in:connected,disconnected,error,pending_setup'
        ]);

        $channel->update($validated);

        return response()->json([
            'message' => 'OTA Channel updated successfully.',
            'channel' => $channel
        ]);
    }

    public function destroy($id)
    {
        $channel = HotelOtaChannel::findOrFail($id);
        $channel->delete();

        return response()->json(['message' => 'OTA Channel removed successfully.']);
    }
}
