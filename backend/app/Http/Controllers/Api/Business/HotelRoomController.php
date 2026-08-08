<?php

namespace App\Http\Controllers\Api\Business;

use App\Http\Controllers\BaseController;
use App\Models\HotelRoom;
use App\Models\HotelRoomType;
use Illuminate\Http\Request;

class HotelRoomController extends BaseController
{
    /**
     * GET /api/v1/business/hotel/rooms
     * Supports filters: ?status=available&room_type_id=1&floor=1st&search=101
     */
    public function index(Request $request)
    {
        return $this->executeAction(function () use ($request) {
            $businessId = $request->attributes->get('business')->id;

            $query = HotelRoom::where('business_id', $businessId)
                ->with('roomType');

            if ($request->filled('status')) {
                $query->where('status', $request->status);
            }
            if ($request->filled('room_type_id')) {
                $query->where('room_type_id', $request->room_type_id);
            }
            if ($request->filled('floor')) {
                $query->where('floor', $request->floor);
            }
            if ($request->filled('search')) {
                $query->where('room_number', 'like', '%' . $request->search . '%');
            }

            return $query->orderByRaw("CAST(room_number AS UNSIGNED), room_number")->get();
        }, 'Rooms retrieved');
    }

    /**
     * POST /api/v1/business/hotel/rooms
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'room_number'   => 'required|string|max:20',
            'floor'         => 'nullable|string|max:20',
            'room_type_id'  => 'required|integer',
            'is_ac'         => 'nullable|boolean',
            'current_tariff' => 'nullable|numeric|min:0',
            'status'        => 'nullable|in:available,occupied,reserved,dirty,maintenance,blocked',
            'view_type'     => 'nullable|in:city,garden,pool,sea,mountain,courtyard,none',
            'bed_type'      => 'nullable|in:single,double,twin,king,queen',
            'max_occupancy' => 'nullable|integer|min:1',
            'notes'         => 'nullable|string',
        ]);

        return $this->executeAction(function () use ($request, $validated) {
            $businessId = $request->attributes->get('business')->id;

            // Verify room_type belongs to this business
            HotelRoomType::where('business_id', $businessId)->findOrFail($validated['room_type_id']);

            // Check duplicate room number
            if (HotelRoom::where('business_id', $businessId)->where('room_number', $validated['room_number'])->exists()) {
                abort(422, "Room number '{$validated['room_number']}' already exists.");
            }

            $room = HotelRoom::create(array_merge($validated, ['business_id' => $businessId]));
            return $room->load('roomType');
        }, 'Room created');
    }

    /**
     * GET /api/v1/business/hotel/rooms/{id}
     */
    public function show(Request $request, $id)
    {
        return $this->executeAction(function () use ($request, $id) {
            $businessId = $request->attributes->get('business')->id;
            return HotelRoom::where('business_id', $businessId)->with('roomType')->findOrFail($id);
        }, 'Room retrieved');
    }

    /**
     * PUT /api/v1/business/hotel/rooms/{id}
     */
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'room_number'    => 'sometimes|string|max:20',
            'floor'          => 'nullable|string|max:20',
            'room_type_id'   => 'sometimes|integer',
            'is_ac'          => 'nullable|boolean',
            'current_tariff' => 'nullable|numeric|min:0',
            'status'         => 'nullable|in:available,occupied,reserved,dirty,maintenance,blocked',
            'view_type'      => 'nullable|in:city,garden,pool,sea,mountain,courtyard,none',
            'bed_type'       => 'nullable|in:single,double,twin,king,queen',
            'max_occupancy'  => 'nullable|integer|min:1',
            'notes'          => 'nullable|string',
        ]);

        return $this->executeAction(function () use ($request, $validated, $id) {
            $businessId = $request->attributes->get('business')->id;
            $room = HotelRoom::where('business_id', $businessId)->findOrFail($id);

            // Check duplicate room number (excluding self)
            if (isset($validated['room_number'])) {
                $dup = HotelRoom::where('business_id', $businessId)
                    ->where('room_number', $validated['room_number'])
                    ->where('id', '!=', $id)
                    ->exists();
                if ($dup) {
                    abort(422, "Room number '{$validated['room_number']}' already exists.");
                }
            }

            $room->update($validated);
            return $room->load('roomType');
        }, 'Room updated');
    }

    /**
     * PATCH /api/v1/business/hotel/rooms/{id}/status
     */
    public function updateStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|in:available,occupied,reserved,dirty,maintenance,blocked',
            'notes'  => 'nullable|string',
        ]);

        return $this->executeAction(function () use ($request, $validated, $id) {
            $businessId = $request->attributes->get('business')->id;
            $room = HotelRoom::where('business_id', $businessId)->findOrFail($id);
            $room->update($validated);
            return $room->load('roomType');
        }, 'Room status updated');
    }

    /**
     * DELETE /api/v1/business/hotel/rooms/{id}
     */
    public function destroy(Request $request, $id)
    {
        return $this->executeAction(function () use ($request, $id) {
            $businessId = $request->attributes->get('business')->id;
            $room = HotelRoom::where('business_id', $businessId)->findOrFail($id);

            if (in_array($room->status, ['occupied', 'reserved'])) {
                abort(422, 'Cannot delete an occupied or reserved room. Please check out the guest first.');
            }

            $room->delete();
            return null;
        }, 'Room deleted');
    }
}
