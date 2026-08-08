<?php

namespace App\Http\Controllers\Api\Business;

use App\Http\Controllers\BaseController;
use App\Models\HotelPropertySetting;
use Illuminate\Http\Request;

class HotelPropertyController extends BaseController
{
    /**
     * GET /api/v1/business/hotel/property-settings
     */
    public function show(Request $request)
    {
        return $this->executeAction(function () use ($request) {
            $businessId = $request->attributes->get('business')->id;
            $settings = HotelPropertySetting::firstOrCreate(
                ['business_id' => $businessId],
                [
                    'property_type'       => '3star',
                    'total_rooms'         => 0,
                    'check_in_time'       => '14:00:00',
                    'check_out_time'      => '11:00:00',
                    'default_gst_category' => 'ac_room',
                ]
            );
            return $settings;
        }, 'Property settings retrieved');
    }

    /**
     * POST /api/v1/business/hotel/property-settings
     */
    public function update(Request $request)
    {
        $validated = $request->validate([
            'property_type'         => 'nullable|in:boutique,budget,resort,3star,4star,5star,luxury',
            'total_rooms'           => 'nullable|integer|min:0',
            'check_in_time'         => 'nullable|date_format:H:i',
            'check_out_time'        => 'nullable|date_format:H:i',
            'late_checkout_charge'  => 'nullable|numeric|min:0',
            'early_checkin_charge'  => 'nullable|numeric|min:0',
            'default_gst_category'  => 'nullable|in:ac_room,non_ac_room,luxury',
            'city_ledger_enabled'   => 'nullable|boolean',
            'footer_for_bills'      => 'nullable|string|max:1000',
            'gstin'                 => 'nullable|string|max:15',
            'is_gst_registered'     => 'nullable|boolean',
        ]);

        return $this->executeAction(function () use ($request, $validated) {
            $businessId = $request->attributes->get('business')->id;
            $settings = HotelPropertySetting::updateOrCreate(
                ['business_id' => $businessId],
                $validated
            );
            return $settings;
        }, 'Property settings updated');
    }
}
