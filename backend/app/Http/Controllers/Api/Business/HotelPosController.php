<?php

namespace App\Http\Controllers\Api\Business;

use App\Http\Controllers\BaseController;
use App\Services\Business\HotelPosService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
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
            'image_url'   => 'nullable|string',
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
            'image_url'   => 'nullable|string',
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
            'table_id'        => 'nullable|exists:hotel_pos_tables,id',
            'reservation_id'  => 'nullable|exists:hotel_table_reservations,id',
            'guest_name'      => 'nullable|string|max:255',
            'guest_phone'     => 'nullable|string|max:50',
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

    #[OA\Post(path: '/business/hotel/pos-orders/{id}/kot-print', summary: 'Mark KOT Printed', tags: ['Hotel - POS'], security: [['sanctum' => []]], responses: [new OA\Response(response: 200, description: 'KOT printed')])]
    public function kotPrint(Request $request, $id)
    {
        return $this->executeAction(function () use ($request, $id) {
            $businessId = app('current_business_id') ?? $request->user()->business_id;
            return $this->posService->markKotPrinted((int)$id, $businessId);
        }, 'KOT marked as printed');
    }

    // ─── Tables ─────────────────────────────────────────────────────────────

    #[OA\Get(path: '/business/hotel/tables', summary: 'List POS Tables', tags: ['Hotel - POS'], security: [['sanctum' => []]], responses: [new OA\Response(response: 200, description: 'Tables retrieved')])]
    public function indexTables(Request $request)
    {
        return $this->executeAction(function () use ($request) {
            $businessId = app('current_business_id') ?? $request->user()->business_id;
            return $this->posService->getTables($businessId, $request->only(['outlet_id', 'status']));
        }, 'Tables retrieved');
    }

    #[OA\Post(path: '/business/hotel/tables', summary: 'Create POS Table', tags: ['Hotel - POS'], security: [['sanctum' => []]], responses: [new OA\Response(response: 201, description: 'Table created')])]
    public function storeTable(Request $request)
    {
        $validated = $request->validate([
            'outlet_id' => 'required|exists:hotel_outlets,id',
            'name'      => 'required|string|max:255',
            'capacity'  => 'integer|min:1',
            'status'    => 'in:available,occupied,reserved,out_of_service',
        ]);
        return $this->executeAction(function () use ($request, $validated) {
            $businessId = app('current_business_id') ?? $request->user()->business_id;
            return $this->posService->createTable($businessId, $validated);
        }, 'Table created', 201);
    }

    #[OA\Put(path: '/business/hotel/tables/{id}', summary: 'Update POS Table', tags: ['Hotel - POS'], security: [['sanctum' => []]], responses: [new OA\Response(response: 200, description: 'Table updated')])]
    public function updateTable(Request $request, $id)
    {
        $validated = $request->validate([
            'name'     => 'string|max:255',
            'capacity' => 'integer|min:1',
            'status'   => 'in:available,occupied,reserved,out_of_service',
        ]);
        return $this->executeAction(function () use ($request, $id, $validated) {
            $businessId = app('current_business_id') ?? $request->user()->business_id;
            return $this->posService->updateTable((int)$id, $businessId, $validated);
        }, 'Table updated');
    }

    #[OA\Delete(path: '/business/hotel/tables/{id}', summary: 'Delete POS Table', tags: ['Hotel - POS'], security: [['sanctum' => []]], responses: [new OA\Response(response: 200, description: 'Table deleted')])]
    public function destroyTable(Request $request, $id)
    {
        return $this->executeAction(function () use ($request, $id) {
            $businessId = app('current_business_id') ?? $request->user()->business_id;
            $this->posService->deleteTable((int)$id, $businessId);
            return null;
        }, 'Table deleted');
    }

    // ─── Reservations ───────────────────────────────────────────────────────

    #[OA\Get(path: '/business/hotel/table-reservations', summary: 'List Table Reservations', tags: ['Hotel - POS'], security: [['sanctum' => []]], responses: [new OA\Response(response: 200, description: 'Reservations retrieved')])]
    public function indexReservations(Request $request)
    {
        return $this->executeAction(function () use ($request) {
            $businessId = app('current_business_id') ?? $request->user()->business_id;
            return $this->posService->getReservations($businessId, $request->only(['outlet_id', 'status', 'date']));
        }, 'Reservations retrieved');
    }

    #[OA\Post(path: '/business/hotel/table-reservations', summary: 'Create Table Reservation', tags: ['Hotel - POS'], security: [['sanctum' => []]], responses: [new OA\Response(response: 201, description: 'Reservation created')])]
    public function storeReservation(Request $request)
    {
        $validated = $request->validate([
            'outlet_id'        => 'required|exists:hotel_outlets,id',
            'table_id'         => 'required|exists:hotel_pos_tables,id',
            'guest_name'       => 'required|string|max:255',
            'guest_phone'      => 'nullable|string|max:20',
            'guest_count'      => 'integer|min:1',
            'reservation_time' => 'required|date',
            'grace_period_minutes' => 'integer|min:0',
            'deposit_amount'   => 'numeric|min:0',
            'special_requests' => 'nullable|string',
            'status'           => 'in:pending,seated,cancelled,completed,no_show',
        ]);
        return $this->executeAction(function () use ($request, $validated) {
            $businessId = app('current_business_id') ?? $request->user()->business_id;
            return $this->posService->createReservation($businessId, $validated);
        }, 'Reservation created', 201);
    }

    #[OA\Put(path: '/business/hotel/table-reservations/{id}', summary: 'Update Table Reservation', tags: ['Hotel - POS'], security: [['sanctum' => []]], responses: [new OA\Response(response: 200, description: 'Reservation updated')])]
    public function updateReservation(Request $request, $id)
    {
        $validated = $request->validate([
            'table_id'         => 'exists:hotel_pos_tables,id',
            'guest_name'       => 'string|max:255',
            'guest_phone'      => 'nullable|string|max:20',
            'guest_count'      => 'integer|min:1',
            'reservation_time' => 'date',
            'grace_period_minutes' => 'integer|min:0',
            'deposit_amount'   => 'numeric|min:0',
            'special_requests' => 'nullable|string',
            'status'           => 'in:pending,seated,cancelled,completed,no_show',
        ]);
        return $this->executeAction(function () use ($request, $id, $validated) {
            $businessId = app('current_business_id') ?? $request->user()->business_id;
            return $this->posService->updateReservation((int)$id, $businessId, $validated);
        }, 'Reservation updated');
    }

    #[OA\Delete(path: '/business/hotel/table-reservations/{id}', summary: 'Delete Table Reservation', tags: ['Hotel - POS'], security: [['sanctum' => []]], responses: [new OA\Response(response: 200, description: 'Reservation deleted')])]
    public function destroyReservation(Request $request, $id)
    {
        return $this->executeAction(function () use ($request, $id) {
            $businessId = app('current_business_id') ?? $request->user()->business_id;
            $this->posService->deleteReservation((int)$id, $businessId);
            return null;
        }, 'Reservation deleted');
    }
}
