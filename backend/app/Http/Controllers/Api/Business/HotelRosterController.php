<?php

namespace App\Http\Controllers\Api\Business;

use App\Http\Controllers\BaseController;
use App\Services\Business\HotelRosterService;
use Illuminate\Http\Request;

class HotelRosterController extends BaseController
{
    public function __construct(protected HotelRosterService $rosterService) {}

    public function index(Request $request)
    {
        return $this->executeAction(function () use ($request) {
            $businessId = app('current_business_id') ?? $request->user()->business_id;
            $weekStart  = $request->input('week_start', now()->startOfWeek()->format('Y-m-d'));
            $deptId     = $request->input('department_id');
            
            return $this->rosterService->getWeeklyRoster($businessId, $weekStart, $deptId ? (int)$deptId : null);
        }, 'Roster retrieved');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id'       => 'required|exists:users,id',
            'roster_date'   => 'required|date',
            'department_id' => 'nullable|exists:hotel_departments,id',
            'shift_id'      => 'nullable|exists:hotel_shifts,id',
            'status'        => 'nullable|in:scheduled,attended,absent,on_leave,week_off,holiday',
            'notes'         => 'nullable|string',
        ]);

        return $this->executeAction(function () use ($request, $validated) {
            $businessId = app('current_business_id') ?? $request->user()->business_id;
            return $this->rosterService->assignShift($businessId, $validated);
        }, 'Shift assigned');
    }

    public function bulkAssign(Request $request)
    {
        $validated = $request->validate([
            'user_ids'          => 'required|array|min:1',
            'user_ids.*'        => 'exists:users,id',
            'shift_id'          => 'required|exists:hotel_shifts,id',
            'department_id'     => 'nullable|exists:hotel_departments,id',
            'dates'             => 'required|array|min:1',
            'dates.*'           => 'date',
            'override_existing' => 'nullable|boolean',
        ]);

        return $this->executeAction(function () use ($request, $validated) {
            $businessId = app('current_business_id') ?? $request->user()->business_id;
            return $this->rosterService->bulkAssign($businessId, $validated);
        }, 'Bulk assignment completed');
    }

    public function updateStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|in:scheduled,attended,absent,on_leave,week_off,holiday',
        ]);

        return $this->executeAction(function () use ($request, $id, $validated) {
            $businessId = app('current_business_id') ?? $request->user()->business_id;
            return $this->rosterService->updateStatus((int)$id, $businessId, $validated['status']);
        }, 'Roster status updated');
    }

    public function requestSwap(Request $request, $id)
    {
        $validated = $request->validate([
            'swap_with_user_id' => 'required|exists:users,id',
            'swap_reason'       => 'nullable|string',
        ]);

        return $this->executeAction(function () use ($request, $id, $validated) {
            $businessId = app('current_business_id') ?? $request->user()->business_id;
            return $this->rosterService->requestSwap((int)$id, $businessId, $validated);
        }, 'Swap requested');
    }

    public function approveSwap(Request $request, $id)
    {
        $validated = $request->validate([
            'approved' => 'required|boolean',
        ]);

        return $this->executeAction(function () use ($request, $id, $validated) {
            $businessId = app('current_business_id') ?? $request->user()->business_id;
            $approverId = $request->user()->id;
            return $this->rosterService->approveSwap((int)$id, $businessId, $validated['approved'], $approverId);
        }, 'Swap request processed');
    }

    public function destroy(Request $request, $id)
    {
        return $this->executeAction(function () use ($request, $id) {
            $businessId = app('current_business_id') ?? $request->user()->business_id;
            return $this->rosterService->deleteEntry((int)$id, $businessId);
        }, 'Roster entry deleted');
    }

    public function staffList(Request $request)
    {
        return $this->executeAction(function () use ($request) {
            $businessId = app('current_business_id') ?? $request->user()->business_id;
            return $this->rosterService->getStaffList($businessId);
        }, 'Staff list retrieved');
    }
}

