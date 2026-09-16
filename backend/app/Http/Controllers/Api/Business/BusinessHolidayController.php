<?php

namespace App\Http\Controllers\Api\Business;

use App\Http\Controllers\Controller;
use App\Services\Business\HolidayService;
use Illuminate\Http\Request;

class BusinessHolidayController extends Controller
{
    public function __construct(private HolidayService $holidayService) {}

    /**
     * GET /api/business/holidays?month=2026-09
     * List holidays for a month.
     */
    public function index(Request $request)
    {
        $month = $request->input('month', now()->format('Y-m'));
        $holidays = $this->holidayService->getForMonth($month);
        return response()->json(['data' => $holidays]);
    }

    /**
     * POST /api/business/holidays
     * Define a single holiday.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'date'        => 'required|date',
            'name'        => 'required|string|max:150',
            'type'        => 'nullable|in:national,optional,custom',
            'is_paid'     => 'nullable|boolean',
            'description' => 'nullable|string',
        ]);

        $holiday = $this->holidayService->define($validated);
        return response()->json(['data' => $holiday], 201);
    }

    /**
     * POST /api/business/holidays/bulk
     * Define multiple holidays at once.
     */
    public function bulkStore(Request $request)
    {
        $request->validate([
            'holidays'              => 'required|array|min:1',
            'holidays.*.date'       => 'required|date',
            'holidays.*.name'       => 'required|string|max:150',
            'holidays.*.type'       => 'nullable|in:national,optional,custom',
            'holidays.*.is_paid'    => 'nullable|boolean',
        ]);

        $results = $this->holidayService->bulkDefine($request->holidays);
        return response()->json(['data' => $results, 'count' => count($results)], 201);
    }

    /**
     * DELETE /api/business/holidays/{id}
     * Remove a holiday.
     */
    public function destroy(int $id)
    {
        $this->holidayService->delete($id);
        return response()->json(['message' => 'Holiday removed successfully.']);
    }

    /**
     * POST /api/business/holidays/auto-apply
     * Auto-apply all holidays for a month to all active staff attendance.
     */
    public function autoApply(Request $request)
    {
        $request->validate(['month' => 'required|date_format:Y-m']);
        $result = $this->holidayService->autoApplyToAttendance($request->month);
        return response()->json($result);
    }
}
