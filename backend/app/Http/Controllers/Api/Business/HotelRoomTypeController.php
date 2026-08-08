<?php

namespace App\Http\Controllers\Api\Business;

use App\Http\Controllers\BaseController;
use App\Models\HotelRoomType;
use Illuminate\Http\Request;

class HotelRoomTypeController extends BaseController
{
    /**
     * GET /api/v1/business/hotel/room-types
     */
    public function index(Request $request)
    {
        return $this->executeAction(function () use ($request) {
            $businessId = $request->attributes->get('business')->id;
            $types = HotelRoomType::where('business_id', $businessId)
                ->withCount('rooms')
                ->orderBy('name')
                ->get();
            return $types;
        }, 'Room types retrieved');
    }

    /**
     * POST /api/v1/business/hotel/room-types
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'                 => 'required|string|max:100',
            'short_code'           => 'nullable|string|max:10',
            'base_price_weekday'   => 'required|numeric|min:0',
            'base_price_weekend'   => 'nullable|numeric|min:0',
            'base_price_peak'      => 'nullable|numeric|min:0',
            'extra_person_charge'  => 'nullable|numeric|min:0',
            'max_occupancy'        => 'required|integer|min:1',
            'amenities'            => 'nullable|array',
            'amenities.*'          => 'string',
            'description'          => 'nullable|string',
            'display_image_url'    => 'nullable|string',
            'is_active'            => 'nullable|boolean',
        ]);

        return $this->executeAction(function () use ($request, $validated) {
            $businessId = $request->attributes->get('business')->id;
            $type = HotelRoomType::create(array_merge($validated, ['business_id' => $businessId]));
            return $type->loadCount('rooms');
        }, 'Room type created');
    }

    /**
     * GET /api/v1/business/hotel/room-types/{id}
     */
    public function show(Request $request, $id)
    {
        return $this->executeAction(function () use ($request, $id) {
            $businessId = $request->attributes->get('business')->id;
            return HotelRoomType::where('business_id', $businessId)
                ->withCount('rooms')
                ->with('rooms')
                ->findOrFail($id);
        }, 'Room type retrieved');
    }

    /**
     * PUT /api/v1/business/hotel/room-types/{id}
     */
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'name'                 => 'sometimes|string|max:100',
            'short_code'           => 'nullable|string|max:10',
            'base_price_weekday'   => 'sometimes|numeric|min:0',
            'base_price_weekend'   => 'nullable|numeric|min:0',
            'base_price_peak'      => 'nullable|numeric|min:0',
            'extra_person_charge'  => 'nullable|numeric|min:0',
            'max_occupancy'        => 'sometimes|integer|min:1',
            'amenities'            => 'nullable|array',
            'amenities.*'          => 'string',
            'description'          => 'nullable|string',
            'display_image_url'    => 'nullable|string',
            'is_active'            => 'nullable|boolean',
        ]);

        return $this->executeAction(function () use ($request, $validated, $id) {
            $businessId = $request->attributes->get('business')->id;
            $type = HotelRoomType::where('business_id', $businessId)->findOrFail($id);
            $type->update($validated);
            return $type->loadCount('rooms');
        }, 'Room type updated');
    }

    /**
     * DELETE /api/v1/business/hotel/room-types/{id}
     */
    public function destroy(Request $request, $id)
    {
        return $this->executeAction(function () use ($request, $id) {
            $businessId = $request->attributes->get('business')->id;
            $type = HotelRoomType::where('business_id', $businessId)->findOrFail($id);

            if ($type->rooms()->exists()) {
                abort(422, 'Cannot delete room type with existing rooms. Please reassign or delete rooms first.');
            }

            $type->delete();
            return null;
        }, 'Room type deleted');
    }
}
