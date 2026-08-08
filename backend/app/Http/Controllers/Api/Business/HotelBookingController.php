<?php

namespace App\Http\Controllers\Api\Business;

use App\Http\Controllers\BaseController;
use App\Services\Business\HotelBookingService;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

class HotelBookingController extends BaseController
{
    public function __construct(protected HotelBookingService $hotelBookingService) {}

    #[OA\Get(
        path: '/business/hotel/bookings',
        summary: 'List Hotel Bookings',
        description: 'Returns active or filtered bookings for the business',
        tags: ['Hotel - Bookings'],
        security: [['sanctum' => []]],
        parameters: [
            new OA\Parameter(name: 'status', in: 'query', required: false, schema: new OA\Schema(type: 'string')),
            new OA\Parameter(name: 'date', in: 'query', required: false, schema: new OA\Schema(type: 'string')),
            new OA\Parameter(name: 'page', in: 'query', required: false, schema: new OA\Schema(type: 'integer')),
        ],
        responses: [new OA\Response(response: 200, description: 'Bookings retrieved')]
    )]
    public function index(Request $request)
    {
        return $this->executeAction(function () use ($request) {
            $businessId = app('current_business_id') ?? $request->user()->business_id;
            $filters = $request->only(['status', 'date']);
            return $this->hotelBookingService->getBookings($businessId, $filters, $request->per_page ?? 50);
        }, 'Bookings retrieved');
    }

    #[OA\Post(
        path: '/business/hotel/bookings',
        summary: 'Create Booking',
        tags: ['Hotel - Bookings'],
        security: [['sanctum' => []]],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['room_id', 'check_in_date', 'check_out_date', 'room_rate_per_night'],
                properties: [
                    new OA\Property(property: 'room_id', type: 'integer'),
                    new OA\Property(property: 'check_in_date', type: 'string', format: 'date'),
                    new OA\Property(property: 'check_out_date', type: 'string', format: 'date'),
                    new OA\Property(property: 'room_rate_per_night', type: 'number'),
                    new OA\Property(property: 'advance_payment', type: 'number'),
                    new OA\Property(property: 'payment_mode', type: 'string'),
                ]
            )
        ),
        responses: [
            new OA\Response(response: 201, description: 'Booking created'),
            new OA\Response(response: 422, description: 'Validation error'),
        ]
    )]
    public function store(Request $request)
    {
        $validated = $request->validate([
            'guest_id' => 'nullable|exists:hotel_guests,id',
            'guest' => 'required_without:guest_id|array',
            'room_id' => 'required|exists:hotel_rooms,id',
            'check_in_date' => 'required|date',
            'check_out_date' => 'required|date|after:check_in_date',
            'adults' => 'required|integer|min:1',
            'children' => 'nullable|integer|min:0',
            'room_rate_per_night' => 'required|numeric|min:0',
            'booking_source' => 'nullable|string',
            'notes' => 'nullable|string',
            'special_requests' => 'nullable|string',
            'status' => 'required|in:confirmed,checked_in',
            'advance_payment' => 'nullable|numeric|min:0',
            'payment_mode' => 'nullable|string',
            'split_payments' => 'nullable|array'
        ]);

        return $this->executeAction(function () use ($request, $validated) {
            $businessId = app('current_business_id') ?? $request->user()->business_id;
            return $this->hotelBookingService->createBooking($businessId, $validated, $request->user()?->id);
        }, 'Booking created', 201);
    }

    #[OA\Get(
        path: '/business/hotel/bookings/{id}',
        summary: 'Get Booking Details',
        tags: ['Hotel - Bookings'],
        security: [['sanctum' => []]],
        responses: [new OA\Response(response: 200, description: 'Booking retrieved')]
    )]
    public function show(Request $request, $id)
    {
        return $this->executeAction(function () use ($request, $id) {
            $businessId = app('current_business_id') ?? $request->user()->business_id;
            return $this->hotelBookingService->getBooking((int)$id, $businessId);
        }, 'Booking retrieved');
    }

    #[OA\Put(
        path: '/business/hotel/bookings/{id}',
        summary: 'Update Booking',
        tags: ['Hotel - Bookings'],
        security: [['sanctum' => []]],
        responses: [new OA\Response(response: 200, description: 'Booking updated')]
    )]
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'room_id' => 'nullable|exists:hotel_rooms,id',
            'check_in_date' => 'nullable|date',
            'check_out_date' => 'nullable|date',
            'adults' => 'nullable|integer|min:1',
            'children' => 'nullable|integer|min:0',
            'room_rate_per_night' => 'nullable|numeric|min:0',
            'booking_source' => 'nullable|string',
            'status' => 'nullable|in:confirmed,checked_in,checked_out,cancelled,no_show',
            'notes' => 'nullable|string',
            'special_requests' => 'nullable|string',
        ]);

        return $this->executeAction(function () use ($request, $id, $validated) {
            $businessId = app('current_business_id') ?? $request->user()->business_id;
            return $this->hotelBookingService->updateBooking((int)$id, $businessId, $validated);
        }, 'Booking updated');
    }

    #[OA\Post(
        path: '/business/hotel/bookings/{id}/payments',
        summary: 'Record Payment for Booking',
        tags: ['Hotel - Bookings'],
        security: [['sanctum' => []]],
        responses: [new OA\Response(response: 200, description: 'Payment recorded')]
    )]
    public function addPayment(Request $request, $id)
    {
        $validated = $request->validate([
            'amount' => 'nullable|numeric|min:0',
            'payment_mode' => 'nullable|string',
            'split_payments' => 'nullable|array',
            'notes' => 'nullable|string'
        ]);

        return $this->executeAction(function () use ($request, $id, $validated) {
            $businessId = app('current_business_id') ?? $request->user()->business_id;
            return $this->hotelBookingService->addPayment((int)$id, $businessId, $validated, $request->user()?->id);
        }, 'Payment recorded');
    }

    #[OA\Post(
        path: '/business/hotel/bookings/{id}/check-in',
        summary: 'Check In Booking',
        tags: ['Hotel - Bookings'],
        security: [['sanctum' => []]],
        responses: [new OA\Response(response: 200, description: 'Checked in successfully')]
    )]
    public function checkIn(Request $request, $id)
    {
        return $this->executeAction(function () use ($request, $id) {
            $businessId = app('current_business_id') ?? $request->user()->business_id;
            return $this->hotelBookingService->checkIn((int)$id, $businessId);
        }, 'Checked in successfully');
    }

    #[OA\Post(
        path: '/business/hotel/bookings/{id}/check-out',
        summary: 'Check Out Booking',
        tags: ['Hotel - Bookings'],
        security: [['sanctum' => []]],
        responses: [new OA\Response(response: 200, description: 'Checked out successfully')]
    )]
    public function checkOut(Request $request, $id)
    {
        $validated = $request->validate([
            'payment_mode' => 'nullable|string',
            'amount_paid' => 'nullable|numeric|min:0'
        ]);

        return $this->executeAction(function () use ($request, $id, $validated) {
            $businessId = app('current_business_id') ?? $request->user()->business_id;
            return $this->hotelBookingService->checkOut((int)$id, $businessId, $validated, $request->user()?->id);
        }, 'Checked out successfully');
    }

    #[OA\Delete(
        path: '/business/hotel/bookings/{id}',
        summary: 'Cancel Booking',
        tags: ['Hotel - Bookings'],
        security: [['sanctum' => []]],
        responses: [new OA\Response(response: 200, description: 'Booking cancelled')]
    )]
    public function destroy(Request $request, $id)
    {
        return $this->executeAction(function () use ($request, $id) {
            $businessId = app('current_business_id') ?? $request->user()->business_id;
            return $this->hotelBookingService->cancelBooking((int)$id, $businessId);
        }, 'Booking cancelled');
    }
}
