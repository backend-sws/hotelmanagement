<?php

namespace App\Http\Controllers\Api\Business;

use App\Http\Controllers\BaseController;
use App\Services\Business\HotelRoomService;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

class HotelPropertyController extends BaseController
{
    public function __construct(protected HotelRoomService $hotelRoomService) {}

    #[OA\Get(
        path: '/business/hotel/property-settings',
        summary: 'Get Hotel Property Settings',
        description: 'Returns the property configuration for the active hotel business.',
        tags: ['Hotel - Property'],
        security: [['sanctum' => []]],
        responses: [new OA\Response(response: 200, description: 'Property settings retrieved')]
    )]
    public function show(Request $request)
    {
        return $this->executeAction(function () use ($request) {
            $businessId = app('current_business_id') ?? $request->user()->business_id;
            return $this->hotelRoomService->getPropertySettings($businessId);
        }, 'Property settings retrieved');
    }

    #[OA\Post(
        path: '/business/hotel/property-settings',
        summary: 'Update Hotel Property Settings',
        description: 'Create or update the hotel property configuration (check-in/out times, GST, etc.).',
        tags: ['Hotel - Property'],
        security: [['sanctum' => []]],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(properties: [
                new OA\Property(property: 'property_type', type: 'string'),
                new OA\Property(property: 'check_in_time', type: 'string', example: '14:00'),
                new OA\Property(property: 'check_out_time', type: 'string', example: '11:00'),
                new OA\Property(property: 'gstin', type: 'string'),
            ])
        ),
        responses: [new OA\Response(response: 200, description: 'Property settings updated')]
    )]
    public function update(Request $request)
    {
        $validated = $request->validate([
            'property_type'        => 'nullable|in:boutique,budget,resort,3star,4star,5star,luxury',
            'total_rooms'          => 'nullable|integer|min:0',
            'check_in_time'        => 'nullable|date_format:H:i',
            'check_out_time'       => 'nullable|date_format:H:i',
            'late_checkout_charge' => 'nullable|numeric|min:0',
            'early_checkin_charge' => 'nullable|numeric|min:0',
            'default_gst_category' => 'nullable|in:ac_room,non_ac_room,luxury',
            'city_ledger_enabled'  => 'nullable|boolean',
            'footer_for_bills'     => 'nullable|string|max:1000',
            'gstin'                => 'nullable|string|max:15',
            'is_gst_registered'    => 'nullable|boolean',
        ]);

        return $this->executeAction(function () use ($request, $validated) {
            $businessId = app('current_business_id') ?? $request->user()->business_id;
            return $this->hotelRoomService->updatePropertySettings($businessId, $validated);
        }, 'Property settings updated');
    }
}
