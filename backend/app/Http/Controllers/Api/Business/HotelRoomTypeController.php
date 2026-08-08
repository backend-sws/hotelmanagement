<?php

namespace App\Http\Controllers\Api\Business;

use App\Http\Controllers\BaseController;
use App\Models\HotelRoomType;
use App\Services\Business\HotelRoomService;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

class HotelRoomTypeController extends BaseController
{
    public function __construct(protected HotelRoomService $hotelRoomService) {}

    #[OA\Get(
        path: '/business/hotel/room-types',
        summary: 'List Hotel Room Types',
        description: 'Returns all room categories (e.g. Deluxe AC, Suite) for the active business.',
        tags: ['Hotel - Room Types'],
        security: [['sanctum' => []]],
        responses: [new OA\Response(response: 200, description: 'Room types retrieved')]
    )]
    public function index(Request $request)
    {
        return $this->executeAction(function () use ($request) {
            $businessId = app('current_business_id') ?? $request->user()->business_id;
            return $this->hotelRoomService->getRoomTypes($businessId);
        }, 'Room types retrieved');
    }

    #[OA\Post(
        path: '/business/hotel/room-types',
        summary: 'Create Room Type',
        description: 'Creates a new room category with pricing and amenities.',
        tags: ['Hotel - Room Types'],
        security: [['sanctum' => []]],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['name', 'base_price_weekday', 'max_occupancy'],
                properties: [
                    new OA\Property(property: 'name', type: 'string', example: 'Deluxe AC'),
                    new OA\Property(property: 'short_code', type: 'string', example: 'DLX'),
                    new OA\Property(property: 'base_price_weekday', type: 'number', example: 2000),
                    new OA\Property(property: 'base_price_weekend', type: 'number', example: 2500),
                    new OA\Property(property: 'base_price_peak', type: 'number', example: 3500),
                    new OA\Property(property: 'max_occupancy', type: 'integer', example: 2),
                    new OA\Property(property: 'amenities', type: 'array', items: new OA\Items(type: 'string')),
                ]
            )
        ),
        responses: [
            new OA\Response(response: 201, description: 'Room type created'),
            new OA\Response(response: 422, description: 'Validation error'),
        ]
    )]
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'                => 'required|string|max:100',
            'short_code'          => 'nullable|string|max:10',
            'base_price_weekday'  => 'required|numeric|min:0',
            'base_price_weekend'  => 'nullable|numeric|min:0',
            'base_price_peak'     => 'nullable|numeric|min:0',
            'extra_person_charge' => 'nullable|numeric|min:0',
            'max_occupancy'       => 'required|integer|min:1',
            'amenities'           => 'nullable|array',
            'amenities.*'         => 'string',
            'description'         => 'nullable|string',
            'display_image_url'   => 'nullable|string',
            'is_active'           => 'nullable|boolean',
        ]);

        return $this->executeAction(function () use ($request, $validated) {
            $businessId = app('current_business_id') ?? $request->user()->business_id;
            $type = $this->hotelRoomService->createRoomType($businessId, $validated);
            return $type->loadCount('rooms');
        }, 'Room type created');
    }

    #[OA\Get(
        path: '/business/hotel/room-types/{id}',
        summary: 'Get Room Type',
        tags: ['Hotel - Room Types'],
        security: [['sanctum' => []]],
        parameters: [new OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))],
        responses: [new OA\Response(response: 200, description: 'Room type retrieved')]
    )]
    public function show(Request $request, int $id)
    {
        return $this->executeAction(function () use ($request, $id) {
            $businessId = app('current_business_id') ?? $request->user()->business_id;
            return HotelRoomType::where('business_id', $businessId)
                ->withCount('rooms')->with('rooms')->findOrFail($id);
        }, 'Room type retrieved');
    }

    #[OA\Put(
        path: '/business/hotel/room-types/{id}',
        summary: 'Update Room Type',
        tags: ['Hotel - Room Types'],
        security: [['sanctum' => []]],
        parameters: [new OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))],
        responses: [new OA\Response(response: 200, description: 'Room type updated')]
    )]
    public function update(Request $request, int $id)
    {
        $validated = $request->validate([
            'name'                => 'sometimes|string|max:100',
            'short_code'          => 'nullable|string|max:10',
            'base_price_weekday'  => 'sometimes|numeric|min:0',
            'base_price_weekend'  => 'nullable|numeric|min:0',
            'base_price_peak'     => 'nullable|numeric|min:0',
            'extra_person_charge' => 'nullable|numeric|min:0',
            'max_occupancy'       => 'sometimes|integer|min:1',
            'amenities'           => 'nullable|array',
            'amenities.*'         => 'string',
            'description'         => 'nullable|string',
            'display_image_url'   => 'nullable|string',
            'is_active'           => 'nullable|boolean',
        ]);

        return $this->executeAction(function () use ($request, $validated, $id) {
            $businessId = app('current_business_id') ?? $request->user()->business_id;
            $roomType = HotelRoomType::where('business_id', $businessId)->findOrFail($id);
            return $this->hotelRoomService->updateRoomType($roomType, $validated);
        }, 'Room type updated');
    }

    #[OA\Delete(
        path: '/business/hotel/room-types/{id}',
        summary: 'Delete Room Type',
        tags: ['Hotel - Room Types'],
        security: [['sanctum' => []]],
        parameters: [new OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))],
        responses: [
            new OA\Response(response: 200, description: 'Deleted'),
            new OA\Response(response: 422, description: 'Cannot delete — rooms exist'),
        ]
    )]
    public function destroy(Request $request, int $id)
    {
        return $this->executeAction(function () use ($request, $id) {
            $businessId = app('current_business_id') ?? $request->user()->business_id;
            $roomType = HotelRoomType::where('business_id', $businessId)->findOrFail($id);
            $this->hotelRoomService->deleteRoomType($roomType);
            return null;
        }, 'Room type deleted');
    }
}
