<?php

namespace App\Http\Controllers\Api\Business;

use App\Http\Controllers\BaseController;
use App\Models\HotelRatePlan;
use App\Models\HotelRoomType;
use Illuminate\Http\Request;

class HotelRatePlanController extends BaseController
{
    /**
     * GET /api/v1/business/hotel/rate-plans
     */
    public function index(Request $request)
    {
        return $this->executeAction(function () use ($request) {
            $businessId = $request->attributes->get('business')->id;
            return HotelRatePlan::where('business_id', $businessId)
                ->with('roomType:id,name,short_code')
                ->orderBy('start_date')
                ->get();
        }, 'Rate plans retrieved');
    }

    /**
     * POST /api/v1/business/hotel/rate-plans
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'             => 'required|string|max:100',
            'start_date'       => 'required|date',
            'end_date'         => 'required|date|after_or_equal:start_date',
            'room_type_id'     => 'nullable|integer',
            'modifier_type'    => 'required|in:fixed,percentage',
            'modifier_value'   => 'required|numeric',
            'min_stay_nights'  => 'nullable|integer|min:1',
            'is_active'        => 'nullable|boolean',
            'description'      => 'nullable|string',
        ]);

        return $this->executeAction(function () use ($request, $validated) {
            $businessId = $request->attributes->get('business')->id;

            // Verify room_type belongs to this business if provided
            if (!empty($validated['room_type_id'])) {
                HotelRoomType::where('business_id', $businessId)->findOrFail($validated['room_type_id']);
            }

            $plan = HotelRatePlan::create(array_merge($validated, ['business_id' => $businessId]));
            return $plan->load('roomType:id,name,short_code');
        }, 'Rate plan created');
    }

    /**
     * GET /api/v1/business/hotel/rate-plans/{id}
     */
    public function show(Request $request, $id)
    {
        return $this->executeAction(function () use ($request, $id) {
            $businessId = $request->attributes->get('business')->id;
            return HotelRatePlan::where('business_id', $businessId)
                ->with('roomType:id,name,short_code')
                ->findOrFail($id);
        }, 'Rate plan retrieved');
    }

    /**
     * PUT /api/v1/business/hotel/rate-plans/{id}
     */
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'name'             => 'sometimes|string|max:100',
            'start_date'       => 'sometimes|date',
            'end_date'         => 'sometimes|date',
            'room_type_id'     => 'nullable|integer',
            'modifier_type'    => 'sometimes|in:fixed,percentage',
            'modifier_value'   => 'sometimes|numeric',
            'min_stay_nights'  => 'nullable|integer|min:1',
            'is_active'        => 'nullable|boolean',
            'description'      => 'nullable|string',
        ]);

        return $this->executeAction(function () use ($request, $validated, $id) {
            $businessId = $request->attributes->get('business')->id;
            $plan = HotelRatePlan::where('business_id', $businessId)->findOrFail($id);
            $plan->update($validated);
            return $plan->load('roomType:id,name,short_code');
        }, 'Rate plan updated');
    }

    /**
     * DELETE /api/v1/business/hotel/rate-plans/{id}
     */
    public function destroy(Request $request, $id)
    {
        return $this->executeAction(function () use ($request, $id) {
            $businessId = $request->attributes->get('business')->id;
            $plan = HotelRatePlan::where('business_id', $businessId)->findOrFail($id);
            $plan->delete();
            return null;
        }, 'Rate plan deleted');
    }
}
