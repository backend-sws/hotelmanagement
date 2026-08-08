<?php

namespace App\Http\Controllers\Api\Business;

use App\Http\Controllers\BaseController;
use App\Models\HotelRatePlan;
use App\Services\Business\HotelRoomService;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

class HotelRatePlanController extends BaseController
{
    public function __construct(protected HotelRoomService $hotelRoomService) {}

    #[OA\Get(
        path: '/business/hotel/rate-plans',
        summary: 'List Rate Plans',
        tags: ['Hotel - Rate Plans'],
        security: [['sanctum' => []]],
        responses: [new OA\Response(response: 200, description: 'Rate plans retrieved')]
    )]
    public function index(Request $request)
    {
        return $this->executeAction(function () use ($request) {
            $businessId = app('current_business_id') ?? $request->user()->business_id;
            return $this->hotelRoomService->getRatePlans($businessId);
        }, 'Rate plans retrieved');
    }

    #[OA\Post(
        path: '/business/hotel/rate-plans',
        summary: 'Create Rate Plan',
        tags: ['Hotel - Rate Plans'],
        security: [['sanctum' => []]],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['name', 'start_date', 'end_date', 'modifier_type', 'modifier_value'],
                properties: [
                    new OA\Property(property: 'name', type: 'string'),
                    new OA\Property(property: 'start_date', type: 'string', format: 'date'),
                    new OA\Property(property: 'end_date', type: 'string', format: 'date'),
                    new OA\Property(property: 'modifier_type', type: 'string', enum: ['fixed', 'percentage']),
                    new OA\Property(property: 'modifier_value', type: 'number'),
                ]
            )
        ),
        responses: [new OA\Response(response: 201, description: 'Rate plan created')]
    )]
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'            => 'required|string|max:100',
            'start_date'      => 'required|date',
            'end_date'        => 'required|date|after_or_equal:start_date',
            'room_type_id'    => 'nullable|integer',
            'modifier_type'   => 'required|in:fixed,percentage',
            'modifier_value'  => 'required|numeric',
            'min_stay_nights' => 'integer|min:1',
            'is_active'       => 'boolean',
            'description'     => 'nullable|string',
        ]);

        return $this->executeAction(function () use ($request, $validated) {
            $businessId = app('current_business_id') ?? $request->user()->business_id;
            return $this->hotelRoomService->createRatePlan($businessId, $validated);
        }, 'Rate plan created', 201);
    }

    #[OA\Get(
        path: '/business/hotel/rate-plans/{id}',
        summary: 'Get Rate Plan',
        tags: ['Hotel - Rate Plans'],
        security: [['sanctum' => []]],
        parameters: [new OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))],
        responses: [new OA\Response(response: 200, description: 'Rate plan retrieved')]
    )]
    public function show(Request $request, int $id)
    {
        return $this->executeAction(function () use ($request, $id) {
            $businessId = app('current_business_id') ?? $request->user()->business_id;
            return HotelRatePlan::where('business_id', $businessId)->with('roomType')->findOrFail($id);
        }, 'Rate plan retrieved');
    }

    #[OA\Put(
        path: '/business/hotel/rate-plans/{id}',
        summary: 'Update Rate Plan',
        tags: ['Hotel - Rate Plans'],
        security: [['sanctum' => []]],
        parameters: [new OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))],
        responses: [new OA\Response(response: 200, description: 'Rate plan updated')]
    )]
    public function update(Request $request, int $id)
    {
        $validated = $request->validate([
            'name'            => 'sometimes|string|max:100',
            'start_date'      => 'sometimes|date',
            'end_date'        => 'sometimes|date|after_or_equal:start_date',
            'room_type_id'    => 'nullable|integer',
            'modifier_type'   => 'sometimes|in:fixed,percentage',
            'modifier_value'  => 'sometimes|numeric',
            'min_stay_nights' => 'integer|min:1',
            'is_active'       => 'boolean',
            'description'     => 'nullable|string',
        ]);

        return $this->executeAction(function () use ($request, $validated, $id) {
            $businessId = app('current_business_id') ?? $request->user()->business_id;
            $plan = HotelRatePlan::where('business_id', $businessId)->findOrFail($id);
            return $this->hotelRoomService->updateRatePlan($plan, $validated);
        }, 'Rate plan updated');
    }

    #[OA\Delete(
        path: '/business/hotel/rate-plans/{id}',
        summary: 'Delete Rate Plan',
        tags: ['Hotel - Rate Plans'],
        security: [['sanctum' => []]],
        parameters: [new OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))],
        responses: [new OA\Response(response: 200, description: 'Rate plan deleted')]
    )]
    public function destroy(Request $request, int $id)
    {
        return $this->executeAction(function () use ($request, $id) {
            $businessId = app('current_business_id') ?? $request->user()->business_id;
            $plan = HotelRatePlan::where('business_id', $businessId)->findOrFail($id);
            $this->hotelRoomService->deleteRatePlan($plan);
            return null;
        }, 'Rate plan deleted');
    }
}
