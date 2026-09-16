<?php

namespace App\Http\Controllers\Api\Business;

use App\Http\Controllers\Controller;
use App\Models\BusinessWorkSetting;
use Illuminate\Http\Request;

class WorkSettingController extends Controller
{
    /**
     * GET /api/business/work-settings
     * Get current work settings for the business.
     */
    public function show(Request $request)
    {
        $businessId = app('current_business_id');
        $setting = BusinessWorkSetting::firstOrCreate(
            ['business_id' => $businessId],
            [
                'work_start_time'       => '09:00:00',
                'work_end_time'         => '18:00:00',
                'standard_hours_per_day' => 9.0,
                'work_days'             => ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
                'late_mark_grace_minutes' => 15,
                'auto_apply_holidays'   => true,
            ]
        );

        return response()->json(['data' => $setting]);
    }

    /**
     * POST /api/business/work-settings
     * Create or update work settings.
     */
    public function upsert(Request $request)
    {
        $businessId = app('current_business_id');

        $validated = $request->validate([
            'work_start_time'        => 'required|date_format:H:i',
            'work_end_time'          => 'required|date_format:H:i|after:work_start_time',
            'standard_hours_per_day' => 'required|numeric|min:1|max:24',
            'work_days'              => 'required|array|min:1',
            'work_days.*'            => 'in:Mon,Tue,Wed,Thu,Fri,Sat,Sun',
            'late_mark_grace_minutes' => 'nullable|integer|min:0|max:120',
            'auto_apply_holidays'    => 'nullable|boolean',
        ]);

        $setting = BusinessWorkSetting::updateOrCreate(
            ['business_id' => $businessId],
            $validated
        );

        return response()->json(['data' => $setting]);
    }
}
