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
                'default_lunch_minutes' => 60,
                'auto_apply_holidays'   => true,
                'enable_auto_absent'    => true,
                'enable_overtime'       => false,
                'overtime_rate_type'    => 'fixed_rate',
                'overtime_hourly_rate'  => 0.0,
                'overtime_multiplier'   => 1.5,
                'overtime_min_minutes'  => 30,
                'overtime_require_approval' => true,
                'punch_mode_office'     => true,
                'punch_mode_wfh'        => true,
                'punch_mode_quick_gps'  => false,
                'punch_mode_selfie_required' => true,
                'punch_mode_on_duty'    => false,
                'forgot_checkout_policy' => 'half_day',
                'forgot_checkout_alert_time' => '19:00:00',
                'enable_forgot_checkout_alert' => true,
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
            'default_lunch_minutes'  => 'nullable|integer|min:0|max:180',
            'auto_apply_holidays'    => 'nullable|boolean',
            'enable_auto_absent'     => 'nullable|boolean',
            'enable_overtime'        => 'nullable|boolean',
            'overtime_rate_type'     => 'nullable|string|in:fixed_rate,multiplier',
            'overtime_hourly_rate'   => 'nullable|numeric|min:0',
            'overtime_multiplier'    => 'nullable|numeric|min:0.1|max:10',
            'overtime_min_minutes'   => 'nullable|integer|min:0|max:300',
            'overtime_require_approval' => 'nullable|boolean',
            'punch_mode_office'      => 'nullable|boolean',
            'punch_mode_wfh'         => 'nullable|boolean',
            'punch_mode_quick_gps'   => 'nullable|boolean',
            'punch_mode_selfie_required' => 'nullable|boolean',
            'punch_mode_on_duty'     => 'nullable|boolean',
            'forgot_checkout_policy' => 'nullable|string|in:half_day,auto_full,incomplete',
            'forgot_checkout_alert_time' => 'nullable|string',
            'enable_forgot_checkout_alert' => 'nullable|boolean',
        ]);

        $setting = BusinessWorkSetting::updateOrCreate(
            ['business_id' => $businessId],
            $validated
        );

        return response()->json(['data' => $setting]);
    }
}
