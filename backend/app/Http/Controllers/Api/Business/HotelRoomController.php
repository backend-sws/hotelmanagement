<?php

namespace App\Http\Controllers\Api\Business;

use App\Http\Controllers\BaseController;
use App\Models\HotelRoom;
use App\Services\Business\HotelRoomService;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

class HotelRoomController extends BaseController
{
    public function __construct(protected HotelRoomService $hotelRoomService) {}

    #[OA\Get(
        path: '/business/hotel/rooms',
        summary: 'List Hotel Rooms',
        description: 'Returns all rooms for the active business, optionally filtered.',
        tags: ['Hotel - Rooms'],
        security: [['sanctum' => []]],
        parameters: [
            new OA\Parameter(name: 'status', in: 'query', required: false, schema: new OA\Schema(type: 'string')),
            new OA\Parameter(name: 'room_type_id', in: 'query', required: false, schema: new OA\Schema(type: 'integer')),
            new OA\Parameter(name: 'floor', in: 'query', required: false, schema: new OA\Schema(type: 'string')),
            new OA\Parameter(name: 'search', in: 'query', required: false, schema: new OA\Schema(type: 'string')),
        ],
        responses: [new OA\Response(response: 200, description: 'Rooms retrieved')]
    )]
    public function index(Request $request)
    {
        return $this->executeAction(function () use ($request) {
            $businessId = app('current_business_id') ?? $request->user()->business_id;
            $filters = $request->only(['status', 'room_type_id', 'floor', 'search']);
            return $this->hotelRoomService->getRooms($businessId, $filters);
        }, 'Rooms retrieved');
    }

    #[OA\Post(
        path: '/business/hotel/rooms',
        summary: 'Create Room',
        tags: ['Hotel - Rooms'],
        security: [['sanctum' => []]],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['room_number', 'room_type_id'],
                properties: [
                    new OA\Property(property: 'room_number', type: 'string'),
                    new OA\Property(property: 'room_type_id', type: 'integer'),
                    new OA\Property(property: 'floor', type: 'string'),
                    new OA\Property(property: 'is_ac', type: 'boolean'),
                    new OA\Property(property: 'current_tariff', type: 'number'),
                    new OA\Property(property: 'status', type: 'string'),
                ]
            )
        ),
        responses: [
            new OA\Response(response: 201, description: 'Room created'),
            new OA\Response(response: 422, description: 'Validation error'),
        ]
    )]
    public function store(Request $request)
    {
        $validated = $request->validate([
            'room_number'    => 'required|string|max:20',
            'floor'          => 'nullable|string|max:50',
            'room_type_id'   => 'required|integer',
            'is_ac'          => 'boolean',
            'current_tariff' => 'numeric|min:0',
            'status'         => 'string|in:available,occupied,reserved,dirty,maintenance,blocked',
            'view_type'      => 'nullable|string',
            'bed_type'       => 'nullable|string',
            'max_occupancy'  => 'nullable|integer|min:1',
            'notes'          => 'nullable|string',
        ]);

        return $this->executeAction(function () use ($request, $validated) {
            $businessId = app('current_business_id') ?? $request->user()->business_id;
            return $this->hotelRoomService->createRoom($businessId, $validated);
        }, 'Room created', 201);
    }

    #[OA\Get(
        path: '/business/hotel/rooms/{id}',
        summary: 'Get Room Details',
        tags: ['Hotel - Rooms'],
        security: [['sanctum' => []]],
        parameters: [new OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))],
        responses: [new OA\Response(response: 200, description: 'Room retrieved')]
    )]
    public function show(Request $request, int $id)
    {
        return $this->executeAction(function () use ($request, $id) {
            $businessId = app('current_business_id') ?? $request->user()->business_id;
            return HotelRoom::where('business_id', $businessId)->with('roomType')->findOrFail($id);
        }, 'Room retrieved');
    }

    #[OA\Put(
        path: '/business/hotel/rooms/{id}',
        summary: 'Update Room',
        tags: ['Hotel - Rooms'],
        security: [['sanctum' => []]],
        parameters: [new OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))],
        responses: [new OA\Response(response: 200, description: 'Room updated')]
    )]
    public function update(Request $request, int $id)
    {
        $validated = $request->validate([
            'room_number'    => 'sometimes|string|max:20',
            'floor'          => 'nullable|string|max:50',
            'room_type_id'   => 'sometimes|integer',
            'is_ac'          => 'boolean',
            'current_tariff' => 'numeric|min:0',
            'status'         => 'string|in:available,occupied,reserved,dirty,maintenance,blocked',
            'view_type'      => 'nullable|string',
            'bed_type'       => 'nullable|string',
            'max_occupancy'  => 'nullable|integer|min:1',
            'notes'          => 'nullable|string',
        ]);

        return $this->executeAction(function () use ($request, $validated, $id) {
            $businessId = app('current_business_id') ?? $request->user()->business_id;
            $room = HotelRoom::where('business_id', $businessId)->findOrFail($id);
            return $this->hotelRoomService->updateRoom($room, $validated);
        }, 'Room updated');
    }

    #[OA\Patch(
        path: '/business/hotel/rooms/{id}/status',
        summary: 'Update Room Status',
        tags: ['Hotel - Rooms'],
        security: [['sanctum' => []]],
        parameters: [new OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['status'],
                properties: [
                    new OA\Property(property: 'status', type: 'string'),
                    new OA\Property(property: 'notes', type: 'string', nullable: true),
                ]
            )
        ),
        responses: [new OA\Response(response: 200, description: 'Status updated')]
    )]
    public function updateStatus(Request $request, int $id)
    {
        $validated = $request->validate([
            'status' => 'required|string|in:available,occupied,reserved,dirty,maintenance,blocked',
            'notes'  => 'nullable|string'
        ]);

        return $this->executeAction(function () use ($request, $validated, $id) {
            $businessId = app('current_business_id') ?? $request->user()->business_id;
            $room = HotelRoom::where('business_id', $businessId)->findOrFail($id);
            return $this->hotelRoomService->updateRoomStatus($room, $validated['status'], $validated['notes'] ?? null);
        }, 'Room status updated');
    }

    #[OA\Delete(
        path: '/business/hotel/rooms/{id}',
        summary: 'Delete Room',
        tags: ['Hotel - Rooms'],
        security: [['sanctum' => []]],
        parameters: [new OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))],
        responses: [new OA\Response(response: 200, description: 'Room deleted')]
    )]
    public function destroy(Request $request, int $id)
    {
        return $this->executeAction(function () use ($request, $id) {
            $businessId = app('current_business_id') ?? $request->user()->business_id;
            $room = HotelRoom::where('business_id', $businessId)->findOrFail($id);
            $this->hotelRoomService->deleteRoom($room);
            return null;
        }, 'Room deleted');
    }
}
