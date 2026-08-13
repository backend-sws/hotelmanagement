<?php

namespace App\Http\Controllers\Api\Business;

use App\Http\Controllers\BaseController;
use App\Models\HotelTaxConfig;
use Illuminate\Http\Request;

class HotelGstController extends BaseController
{
    public function show(Request $request)
    {
        return $this->executeAction(function () use ($request) {
            $businessId = app('current_business_id') ?? $request->user()->business_id;
            
            return HotelTaxConfig::firstOrCreate(
                ['business_id' => $businessId],
                [
                    'room_slab_1_upto' => 1000,
                    'room_slab_2_upto' => 7500,
                    'room_slab_3_rate' => 18,
                    'restaurant_non_ac_rate' => 5,
                    'restaurant_ac_rate' => 18,
                    'luxury_tax_applicable' => false,
                    'luxury_tax_rate' => 0,
                    'is_gst_registered' => true,
                ]
            );
        });
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'room_slab_1_upto' => 'required|integer',
            'room_slab_2_upto' => 'required|integer',
            'room_slab_3_rate' => 'required|numeric',
            'restaurant_non_ac_rate' => 'required|numeric',
            'restaurant_ac_rate' => 'required|numeric',
            'luxury_tax_applicable' => 'required|boolean',
            'luxury_tax_rate' => 'required|numeric',
            'is_gst_registered' => 'required|boolean',
            'gstin' => 'nullable|string',
        ]);

        return $this->executeAction(function () use ($request, $validated) {
            $businessId = app('current_business_id') ?? $request->user()->business_id;
            
            $config = HotelTaxConfig::firstOrCreate(
                ['business_id' => $businessId]
            );

            $config->update($validated);

            return $config;
        }, 'GST Configuration updated successfully');
    }
}
