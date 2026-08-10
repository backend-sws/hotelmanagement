<?php

namespace App\Http\Controllers\Api\Business;

use App\Http\Controllers\BaseController;
use App\Services\Business\HotelPosService;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

class HotelPosController extends BaseController
{
    public function __construct(protected HotelPosService $posService) {}

    // ───────────────────── OUTLETS ─────────────────────────────────

    #[OA\Get(path: '/business/hotel/outlets', summary: 'List Hotel Outlets', tags: ['Hotel - POS'], security: [['sanctum' => []]], responses: [new OA\Response(response: 200, description: 'Outlets retrieved')])]
    public function indexOutlets(Request $request)
    {
        return $this->executeAction(function () use ($request) {
            $businessId = app('current_business_id') ?? $request->user()->business_id;
            return $this->posService->getOutlets($businessId);
        }, 'Outlets retrieved');
    }

    #[OA\Post(path: '/business/hotel/outlets', summary: 'Create Outlet', tags: ['Hotel - POS'], security: [['sanctum' => []]], responses: [new OA\Response(response: 201, description: 'Outlet created')])]
    public function storeOutlet(Request $request)
    {
        $validated = $request->validate([
            'name'        => 'required|string|max:255',
            'outlet_type' => 'required|in:restaurant,bar,spa,room_service,banquet,laundry,other',
            'description' => 'nullable|string',
            'is_active'   => 'nullable|boolean',
        ]);

        return $this->executeAction(function () use ($request, $validated) {
            $businessId = app('current_business_id') ?? $request->user()->business_id;
            return $this->posService->createOutlet($businessId, $validated);
        }, 'Outlet created', 201);
    }

    #[OA\Put(path: '/business/hotel/outlets/{id}', summary: 'Update Outlet', tags: ['Hotel - POS'], security: [['sanctum' => []]], responses: [new OA\Response(response: 200, description: 'Outlet updated')])]
    public function updateOutlet(Request $request, $id)
    {
        $validated = $request->validate([
            'name'        => 'sometimes|string|max:255',
            'outlet_type' => 'sometimes|in:restaurant,bar,spa,room_service,banquet,laundry,other',
            'description' => 'nullable|string',
            'is_active'   => 'nullable|boolean',
        ]);

        return $this->executeAction(function () use ($request, $id, $validated) {
            $businessId = app('current_business_id') ?? $request->user()->business_id;
            return $this->posService->updateOutlet((int)$id, $businessId, $validated);
        }, 'Outlet updated');
    }

    #[OA\Delete(path: '/business/hotel/outlets/{id}', summary: 'Delete Outlet', tags: ['Hotel - POS'], security: [['sanctum' => []]], responses: [new OA\Response(response: 200, description: 'Outlet deleted')])]
    public function destroyOutlet(Request $request, $id)
    {
        return $this->executeAction(function () use ($request, $id) {
            $businessId = app('current_business_id') ?? $request->user()->business_id;
            return $this->posService->deleteOutlet((int)$id, $businessId);
        }, 'Outlet deleted');
    }

    // ───────────────────── SERVICES / MENU ─────────────────────────

    #[OA\Get(path: '/business/hotel/services', summary: 'List Hotel Services/Menu', tags: ['Hotel - POS'], security: [['sanctum' => []]], responses: [new OA\Response(response: 200, description: 'Services retrieved')])]
    public function indexServices(Request $request)
    {
        return $this->executeAction(function () use ($request) {
            $businessId = app('current_business_id') ?? $request->user()->business_id;
            $filters = $request->only(['outlet_id', 'category', 'is_available']);
            return $this->posService->getServices($businessId, $filters);
        }, 'Services retrieved');
    }

    #[OA\Post(path: '/business/hotel/services', summary: 'Create Service/Menu Item', tags: ['Hotel - POS'], security: [['sanctum' => []]], responses: [new OA\Response(response: 201, description: 'Service created')])]
    public function storeService(Request $request)
    {
        $validated = $request->validate([
            'outlet_id'   => 'required|exists:hotel_outlets,id',
            'name'        => 'required|string|max:255',
            'category'    => 'required|in:food,beverage,laundry,transport,spa,minibar,misc',
            'description' => 'nullable|string',
            'price'       => 'required|numeric|min:0',
            'tax_type'    => 'required|in:inclusive,exclusive,nil',
            'tax_percent' => 'nullable|numeric|min:0|max:100',
            'is_available'=> 'nullable|boolean',
            'sort_order'  => 'nullable|integer',
        ]);

        return $this->executeAction(function () use ($request, $validated) {
            $businessId = app('current_business_id') ?? $request->user()->business_id;
            return $this->posService->createService($businessId, $validated);
        }, 'Service created', 201);
    }

    #[OA\Put(path: '/business/hotel/services/{id}', summary: 'Update Service', tags: ['Hotel - POS'], security: [['sanctum' => []]], responses: [new OA\Response(response: 200, description: 'Service updated')])]
    public function updateService(Request $request, $id)
    {
        $validated = $request->validate([
            'outlet_id'   => 'sometimes|exists:hotel_outlets,id',
            'name'        => 'sometimes|string|max:255',
            'category'    => 'sometimes|in:food,beverage,laundry,transport,spa,minibar,misc',
            'description' => 'nullable|string',
            'price'       => 'sometimes|numeric|min:0',
            'tax_type'    => 'sometimes|in:inclusive,exclusive,nil',
            'tax_percent' => 'nullable|numeric|min:0|max:100',
            'is_available'=> 'nullable|boolean',
            'sort_order'  => 'nullable|integer',
        ]);

        return $this->executeAction(function () use ($request, $id, $validated) {
            $businessId = app('current_business_id') ?? $request->user()->business_id;
            return $this->posService->updateService((int)$id, $businessId, $validated);
        }, 'Service updated');
    }

    #[OA\Delete(path: '/business/hotel/services/{id}', summary: 'Delete Service', tags: ['Hotel - POS'], security: [['sanctum' => []]], responses: [new OA\Response(response: 200, description: 'Service deleted')])]
    public function destroyService(Request $request, $id)
    {
        return $this->executeAction(function () use ($request, $id) {
            $businessId = app('current_business_id') ?? $request->user()->business_id;
            return $this->posService->deleteService((int)$id, $businessId);
        }, 'Service deleted');
    }

    // ───────────────────── POS ORDERS ──────────────────────────────

    #[OA\Get(path: '/business/hotel/pos-orders', summary: 'List POS Orders', tags: ['Hotel - POS'], security: [['sanctum' => []]], responses: [new OA\Response(response: 200, description: 'Orders retrieved')])]
    public function indexOrders(Request $request)
    {
        return $this->executeAction(function () use ($request) {
            $businessId = app('current_business_id') ?? $request->user()->business_id;
            $filters = $request->only(['outlet_id', 'status', 'date']);
            return $this->posService->getOrders($businessId, $filters);
        }, 'Orders retrieved');
    }

    #[OA\Get(path: '/business/hotel/pos-orders/{id}', summary: 'Get Order', tags: ['Hotel - POS'], security: [['sanctum' => []]], responses: [new OA\Response(response: 200, description: 'Order retrieved')])]
    public function showOrder(Request $request, $id)
    {
        return $this->executeAction(function () use ($request, $id) {
            $businessId = app('current_business_id') ?? $request->user()->business_id;
            return $this->posService->getOrder((int)$id, $businessId);
        }, 'Order retrieved');
    }

    #[OA\Post(path: '/business/hotel/pos-orders', summary: 'Create POS Order', tags: ['Hotel - POS'], security: [['sanctum' => []]], responses: [new OA\Response(response: 201, description: 'Order created')])]
    public function storeOrder(Request $request)
    {
        $validated = $request->validate([
            'outlet_id'       => 'required|exists:hotel_outlets,id',
            'booking_id'      => 'nullable|exists:hotel_bookings,id',
            'table_no'        => 'nullable|string|max:50',
            'order_type'      => 'required|in:dine_in,room_service,takeaway,post_to_room',
            'discount_amount' => 'nullable|numeric|min:0',
            'notes'           => 'nullable|string',
            'items'           => 'required|array|min:1',
            'items.*.service_id'  => 'nullable|exists:hotel_services,id',
            'items.*.name'        => 'required|string',
            'items.*.qty'         => 'required|numeric|min:0.01',
            'items.*.unit_price'  => 'required|numeric|min:0',
            'items.*.tax_percent' => 'nullable|numeric|min:0',
            'items.*.notes'       => 'nullable|string',
        ]);

        return $this->executeAction(function () use ($request, $validated) {
            $businessId = app('current_business_id') ?? $request->user()->business_id;
            return $this->posService->createOrder($businessId, $validated, $request->user()?->id);
        }, 'Order created', 201);
    }

    #[OA\Patch(path: '/business/hotel/pos-orders/{id}/status', summary: 'Update Order Status', tags: ['Hotel - POS'], security: [['sanctum' => []]], responses: [new OA\Response(response: 200, description: 'Status updated')])]
    public function updateStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,processing,served,billed,cancelled',
        ]);

        return $this->executeAction(function () use ($request, $id, $validated) {
            $businessId = app('current_business_id') ?? $request->user()->business_id;
            return $this->posService->updateOrderStatus((int)$id, $businessId, $validated['status']);
        }, 'Status updated');
    }

    #[OA\Post(path: '/business/hotel/pos-orders/{id}/bill', summary: 'Bill / Settle Order', tags: ['Hotel - POS'], security: [['sanctum' => []]], responses: [new OA\Response(response: 200, description: 'Order billed')])]
    public function bill(Request $request, $id)
    {
        $validated = $request->validate([
            'payment_mode' => 'required|in:cash,upi,card,post_to_room,complimentary',
        ]);

        return $this->executeAction(function () use ($request, $id, $validated) {
            $businessId = app('current_business_id') ?? $request->user()->business_id;
            return $this->posService->billOrder((int)$id, $businessId, $validated, $request->user()?->id);
        }, 'Order billed successfully');
    }

    #[OA\Post(path: '/business/hotel/pos-orders/{id}/post-to-room', summary: 'Post Order to Room Folio', tags: ['Hotel - POS'], security: [['sanctum' => []]], responses: [new OA\Response(response: 200, description: 'Posted to room')])]
    public function postToRoom(Request $request, $id)
    {
        $validated = $request->validate([
            'booking_id' => 'required|exists:hotel_bookings,id',
        ]);

        return $this->executeAction(function () use ($request, $id, $validated) {
            $businessId = app('current_business_id') ?? $request->user()->business_id;
            return $this->posService->postToRoom((int)$id, $businessId, $validated['booking_id'], $request->user()?->id);
        }, 'Charges posted to room folio');
    }

    #[OA\Post(path: '/business/hotel/pos-orders/{id}/kot', summary: 'Mark KOT as printed', tags: ['Hotel - POS'], security: [['sanctum' => []]], responses: [new OA\Response(response: 200, description: 'KOT printed')])]
    public function kot(Request $request, $id)
    {
        return $this->executeAction(function () use ($request, $id) {
            $businessId = app('current_business_id') ?? $request->user()->business_id;
            return $this->posService->markKotPrinted((int)$id, $businessId);
        }, 'KOT marked as printed');
    }
}
