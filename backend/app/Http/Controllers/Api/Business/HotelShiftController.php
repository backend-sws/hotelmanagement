<?php

namespace App\Http\Controllers\Api\Business;

use App\Http\Controllers\BaseController;
use App\Services\Business\HotelRosterService;
use Illuminate\Http\Request;

class HotelShiftController extends BaseController
{
    public function __construct(protected HotelRosterService $rosterService) {}

    public function index(Request $request)
    {
        return $this->executeAction(function () use ($request) {
            $businessId = app('current_business_id') ?? $request->user()->business_id;
            return $this->rosterService->getShifts($businessId);
        }, 'Shifts retrieved');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'         => 'required|string|max:255',
            'start_time'   => 'required|date_format:H:i',
            'end_time'     => 'required|date_format:H:i',
            'is_overnight' => 'nullable|boolean',
            'color'        => 'nullable|string|max:20',
            'is_active'    => 'nullable|boolean',
        ]);

        return $this->executeAction(function () use ($request, $validated) {
            $businessId = app('current_business_id') ?? $request->user()->business_id;
            return $this->rosterService->createShift($businessId, $validated);
        }, 'Shift created', 201);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'name'         => 'sometimes|string|max:255',
            'start_time'   => 'sometimes|date_format:H:i',
            'end_time'     => 'sometimes|date_format:H:i',
            'is_overnight' => 'nullable|boolean',
            'color'        => 'nullable|string|max:20',
            'is_active'    => 'nullable|boolean',
        ]);

        return $this->executeAction(function () use ($request, $id, $validated) {
            $businessId = app('current_business_id') ?? $request->user()->business_id;
            return $this->rosterService->updateShift((int)$id, $businessId, $validated);
        }, 'Shift updated');
    }

    public function destroy(Request $request, $id)
    {
        return $this->executeAction(function () use ($request, $id) {
            $businessId = app('current_business_id') ?? $request->user()->business_id;
            return $this->rosterService->deleteShift((int)$id, $businessId);
        }, 'Shift deleted');
    }
}

