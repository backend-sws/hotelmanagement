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
        $businessId = app('current_business_id');
        $query = \App\Models\BusinessHoliday::where('business_id', $businessId);

        if ($request->boolean('all')) {
            // Return all holidays for this business
        } elseif ($request->filled('from_date') && $request->filled('to_date')) {
            $query->whereBetween('date', [$request->from_date, $request->to_date]);
        } elseif ($request->filled('year')) {
            $query->whereYear('date', $request->year);
        } elseif ($request->filled('month')) {
            $query->forMonth($request->month);
        } else {
            // Default fallback to all holidays in current and adjacent year
            $query->whereYear('date', now()->year);
        }

        $holidays = $query->orderBy('date')->get()->toArray();
        $existingDates = array_map(function ($h) {
            $d = is_array($h) ? ($h['date'] ?? '') : ($h->date ?? '');
            return substr((string) $d, 0, 10);
        }, $holidays);

        // Include any holiday marked directly on the attendance calendar
        $attQuery = \App\Models\Attendance::where('business_id', $businessId)
            ->where('status', 'holiday')
            ->whereNotNull('date');

        if ($request->filled('from_date') && $request->filled('to_date')) {
            $attQuery->whereBetween('date', [$request->from_date, $request->to_date]);
        } elseif ($request->filled('year')) {
            $attQuery->whereYear('date', $request->year);
        } elseif ($request->filled('month')) {
            $attQuery->whereYear('date', substr($request->month, 0, 4))->whereMonth('date', substr($request->month, 5, 2));
        }

        $attHolidays = $attQuery->distinct('date')->get(['date', 'notes']);
        foreach ($attHolidays as $attH) {
            $d = substr((string) $attH->date, 0, 10);
            if (!in_array($d, $existingDates)) {
                $holidays[] = [
                    'id'          => null,
                    'business_id' => $businessId,
                    'date'        => $d,
                    'name'        => $attH->notes ?: 'Company Holiday',
                    'type'        => 'custom',
                    'is_paid'     => true,
                    'description' => 'Marked from attendance sheet',
                ];
                $existingDates[] = $d;
            }
        }

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

