<?php

namespace App\Http\Controllers\Api\Business;

use App\Http\Controllers\BaseController;
use App\Services\Business\HotelRosterService;
use Illuminate\Http\Request;

class HotelDepartmentController extends BaseController
{
    public function __construct(protected HotelRosterService $rosterService) {}

    public function index(Request $request)
    {
        return $this->executeAction(function () use ($request) {
            $businessId = app('current_business_id') ?? $request->user()->business_id;
            return $this->rosterService->getDepartments($businessId);
        }, 'Departments retrieved');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'         => 'required|string|max:255',
            'description'  => 'nullable|string',
            'color'        => 'nullable|string|max:20',
            'head_user_id' => 'nullable|exists:users,id',
            'is_active'    => 'nullable|boolean',
        ]);

        return $this->executeAction(function () use ($request, $validated) {
            $businessId = app('current_business_id') ?? $request->user()->business_id;
            return $this->rosterService->createDepartment($businessId, $validated);
        }, 'Department created', 201);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'name'         => 'sometimes|string|max:255',
            'description'  => 'nullable|string',
            'color'        => 'nullable|string|max:20',
            'head_user_id' => 'nullable|exists:users,id',
            'is_active'    => 'nullable|boolean',
        ]);

        return $this->executeAction(function () use ($request, $id, $validated) {
            $businessId = app('current_business_id') ?? $request->user()->business_id;
            return $this->rosterService->updateDepartment((int)$id, $businessId, $validated);
        }, 'Department updated');
    }

    public function destroy(Request $request, $id)
    {
        return $this->executeAction(function () use ($request, $id) {
            $businessId = app('current_business_id') ?? $request->user()->business_id;
            return $this->rosterService->deleteDepartment((int)$id, $businessId);
        }, 'Department deleted');
    }
}

