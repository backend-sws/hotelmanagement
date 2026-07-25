<?php

namespace App\Http\Controllers\Api\Business;

use App\Http\Controllers\BaseController;
use Illuminate\Http\Request;
use App\Models\GstSetting;

class GstSettingController extends BaseController
{
    public function show()
    {
        $gstSetting = GstSetting::firstOrCreate(
            ['business_id' => app('current_business_id')],
            []
        );
        return $this->success($gstSetting, 'GST settings retrieved successfully');
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'gstin' => 'nullable|string|max:15',
            'legal_name' => 'nullable|string|max:150',
            'trade_name' => 'nullable|string|max:150',
            'composition_scheme' => 'nullable|boolean',
            'default_hsn' => 'nullable|string|max:20',
            'default_gst_rate' => 'nullable|numeric|min:0',
            'enable_e_invoicing' => 'nullable|boolean',
            'e_invoice_username' => 'nullable|string',
            'e_invoice_password' => 'nullable|string',
            'business_type' => 'nullable|string|in:dealer,contractor,interior,mixed'
        ]);

        $gstSetting = GstSetting::firstOrCreate(
            ['business_id' => app('current_business_id')]
        );
        
        $gstSetting->update($request->except('business_type'));

        if (isset($validated['business_type'])) {
            $business = app('tenant');
            if ($business) {
                $settings = $business->settings ?? [];
                $settings['business_type'] = $validated['business_type'];
                $business->settings = $settings;
                $business->save();
            }
        }

        return $this->success($gstSetting, 'GST settings updated successfully');
    }
}
