<?php

namespace App\Http\Controllers\Api\Business;

use App\Http\Controllers\BaseController;
use App\Services\Business\HotelGuestService;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

class HotelGuestController extends BaseController
{
    public function __construct(protected HotelGuestService $hotelGuestService) {}

    #[OA\Get(
        path: '/business/hotel/guests',
        summary: 'List Hotel Guests',
        description: 'Returns guest directory for active business',
        tags: ['Hotel - Guests'],
        security: [['sanctum' => []]],
        parameters: [
            new OA\Parameter(name: 'search', in: 'query', required: false, schema: new OA\Schema(type: 'string')),
            new OA\Parameter(name: 'page', in: 'query', required: false, schema: new OA\Schema(type: 'integer')),
        ],
        responses: [new OA\Response(response: 200, description: 'Guests retrieved')]
    )]
    public function index(Request $request)
    {
        return $this->executeAction(function () use ($request) {
            $businessId = app('current_business_id') ?? $request->user()->business_id;
            $filters = $request->only(['search']);
            return $this->hotelGuestService->getGuests($businessId, $filters, $request->per_page ?? 20);
        }, 'Guests retrieved');
    }

    #[OA\Post(
        path: '/business/hotel/guests',
        summary: 'Create Hotel Guest',
        tags: ['Hotel - Guests'],
        security: [['sanctum' => []]],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['name'],
                properties: [
                    new OA\Property(property: 'name', type: 'string'),
                    new OA\Property(property: 'phone', type: 'string'),
                    new OA\Property(property: 'email', type: 'string'),
                    new OA\Property(property: 'id_proof_type', type: 'string'),
                    new OA\Property(property: 'id_proof_number', type: 'string'),
                ]
            )
        ),
        responses: [
            new OA\Response(response: 201, description: 'Guest created'),
            new OA\Response(response: 422, description: 'Validation error'),
        ]
    )]
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'nationality' => 'nullable|string',
            'id_proof_type' => 'nullable|string',
            'id_proof_number' => 'nullable|string',
            'date_of_birth' => 'nullable|date',
            'gender' => 'nullable|string',
            'address' => 'nullable|string',
            'city' => 'nullable|string',
            'state' => 'nullable|string',
            'pincode' => 'nullable|string',
            'country' => 'nullable|string',
            'company_name' => 'nullable|string',
            'gst_number' => 'nullable|string',
            'notes' => 'nullable|string',
            'is_blacklisted' => 'nullable|boolean',
            'blacklist_reason' => 'nullable|string'
        ]);

        return $this->executeAction(function () use ($request, $validated) {
            $businessId = app('current_business_id') ?? $request->user()->business_id;
            return $this->hotelGuestService->createGuest($businessId, $validated);
        }, 'Guest created', 201);
    }

    #[OA\Get(
        path: '/business/hotel/guests/{id}',
        summary: 'Get Guest Details',
        tags: ['Hotel - Guests'],
        security: [['sanctum' => []]],
        responses: [new OA\Response(response: 200, description: 'Guest retrieved')]
    )]
    public function show(Request $request, $id)
    {
        return $this->executeAction(function () use ($request, $id) {
            $businessId = app('current_business_id') ?? $request->user()->business_id;
            return $this->hotelGuestService->getGuest((int)$id, $businessId);
        }, 'Guest retrieved');
    }

    #[OA\Put(
        path: '/business/hotel/guests/{id}',
        summary: 'Update Guest',
        tags: ['Hotel - Guests'],
        security: [['sanctum' => []]],
        responses: [new OA\Response(response: 200, description: 'Guest updated')]
    )]
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'nationality' => 'nullable|string',
            'id_proof_type' => 'nullable|string',
            'id_proof_number' => 'nullable|string',
            'date_of_birth' => 'nullable|date',
            'gender' => 'nullable|string',
            'address' => 'nullable|string',
            'city' => 'nullable|string',
            'state' => 'nullable|string',
            'pincode' => 'nullable|string',
            'country' => 'nullable|string',
            'company_name' => 'nullable|string',
            'gst_number' => 'nullable|string',
            'notes' => 'nullable|string',
            'is_blacklisted' => 'nullable|boolean',
            'blacklist_reason' => 'nullable|string'
        ]);

        return $this->executeAction(function () use ($request, $id, $validated) {
            $businessId = app('current_business_id') ?? $request->user()->business_id;
            return $this->hotelGuestService->updateGuest((int)$id, $businessId, $validated);
        }, 'Guest updated');
    }

    #[OA\Delete(
        path: '/business/hotel/guests/{id}',
        summary: 'Delete Guest',
        tags: ['Hotel - Guests'],
        security: [['sanctum' => []]],
        responses: [new OA\Response(response: 200, description: 'Guest deleted')]
    )]
    public function destroy(Request $request, $id)
    {
        return $this->executeAction(function () use ($request, $id) {
            $businessId = app('current_business_id') ?? $request->user()->business_id;
            return $this->hotelGuestService->deleteGuest((int)$id, $businessId);
        }, 'Guest deleted');
    }
}
