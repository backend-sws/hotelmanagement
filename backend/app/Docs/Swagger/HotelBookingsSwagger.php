<?php

namespace App\Docs\Swagger;

use OpenApi\Attributes as OA;

class HotelBookingsSwagger
{
    #[OA\Get(
        path: "/business/hotel/dashboard",
        summary: "Hotel Live KPI Dashboard",
        description: "Returns real-time hotel metrics: Occupancy %, Total Rooms, Occupied Rooms, Dirty Rooms, Today's Expected Arrivals, Today's Departures, and Today's Revenue.",
        tags: ["3. Hotel - Front Desk & Bookings"],
        security: [["sanctum" => []]],
        parameters: [
            new OA\Parameter(name: "X-Tenant-ID", in: "header", required: true, schema: new OA\Schema(type: "integer", example: 1), description: "Active Business/Hotel ID")
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: "Live dashboard stats",
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: "status", type: "string", example: "success"),
                        new OA\Property(
                            property: "data",
                            type: "object",
                            properties: [
                                new OA\Property(property: "total_rooms", type: "integer", example: 40),
                                new OA\Property(property: "occupied_rooms", type: "integer", example: 28),
                                new OA\Property(property: "available_rooms", type: "integer", example: 9),
                                new OA\Property(property: "dirty_rooms", type: "integer", example: 3),
                                new OA\Property(property: "occupancy_percentage", type: "number", format: "float", example: 70.0),
                                new OA\Property(property: "today_arrivals", type: "integer", example: 6),
                                new OA\Property(property: "today_departures", type: "integer", example: 4),
                                new OA\Property(property: "today_revenue", type: "number", format: "float", example: 48500.00),
                                new OA\Property(property: "month_revenue", type: "number", format: "float", example: 924000.00),
                                new OA\Property(property: "revpar", type: "number", format: "float", example: 1212.50),
                                new OA\Property(property: "adr", type: "number", format: "float", example: 1732.14)
                            ]
                        )
                    ]
                )
            )
        ]
    )]
    public function dashboard() {}

    #[OA\Get(
        path: "/business/hotel/dashboard/room-grid",
        summary: "Live Room Grid / Tape Chart",
        description: "Returns all rooms with current live status (`available`, `occupied`, `dirty`, `maintenance`), guest details, and active booking numbers.",
        tags: ["3. Hotel - Front Desk & Bookings"],
        security: [["sanctum" => []]],
        parameters: [
            new OA\Parameter(name: "X-Tenant-ID", in: "header", required: true, schema: new OA\Schema(type: "integer", example: 1))
        ],
        responses: [
            new OA\Response(response: 200, description: "Room grid list", content: new OA\JsonContent(ref: "#/components/schemas/SuccessResponse"))
        ]
    )]
    public function roomGrid() {}

    #[OA\Get(
        path: "/business/hotel/bookings",
        summary: "List Bookings (with Filters)",
        description: "Fetch paginated hotel bookings with filtering by status (`confirmed`, `checked_in`, `checked_out`, `cancelled`), date range, guest search, or room.",
        tags: ["3. Hotel - Front Desk & Bookings"],
        security: [["sanctum" => []]],
        parameters: [
            new OA\Parameter(name: "X-Tenant-ID", in: "header", required: true, schema: new OA\Schema(type: "integer", example: 1)),
            new OA\Parameter(name: "status", in: "query", schema: new OA\Schema(type: "string", enum: ["confirmed", "checked_in", "checked_out", "cancelled", "no_show"])),
            new OA\Parameter(name: "search", in: "query", schema: new OA\Schema(type: "string", example: "BK-2026"), description: "Search by booking ID or guest name"),
            new OA\Parameter(name: "check_in_from", in: "query", schema: new OA\Schema(type: "string", format: "date")),
            new OA\Parameter(name: "check_in_to", in: "query", schema: new OA\Schema(type: "string", format: "date")),
            new OA\Parameter(name: "page", in: "query", schema: new OA\Schema(type: "integer", default: 1))
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: "Paginated bookings",
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: "status", type: "string", example: "success"),
                        new OA\Property(property: "data", type: "array", items: new OA\Items(ref: "#/components/schemas/HotelBookingSchema"))
                    ]
                )
            )
        ]
    )]
    public function listBookings() {}

    #[OA\Post(
        path: "/business/hotel/bookings",
        summary: "Create New Booking / Reservation",
        description: "Creates a new front-desk reservation. Automatically checks room availability for the requested date range.",
        tags: ["3. Hotel - Front Desk & Bookings"],
        security: [["sanctum" => []]],
        parameters: [
            new OA\Parameter(name: "X-Tenant-ID", in: "header", required: true, schema: new OA\Schema(type: "integer", example: 1))
        ],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ["guest_id", "room_id", "check_in_date", "check_out_date", "total_amount"],
                properties: [
                    new OA\Property(property: "guest_id", type: "integer", example: 45),
                    new OA\Property(property: "room_id", type: "integer", example: 12),
                    new OA\Property(property: "room_type_id", type: "integer", example: 3),
                    new OA\Property(property: "rate_plan_id", type: "integer", nullable: true, example: 1),
                    new OA\Property(property: "check_in_date", type: "string", format: "date", example: "2026-08-20"),
                    new OA\Property(property: "check_out_date", type: "string", format: "date", example: "2026-08-23"),
                    new OA\Property(property: "adults", type: "integer", example: 2),
                    new OA\Property(property: "children", type: "integer", example: 1),
                    new OA\Property(property: "total_amount", type: "number", format: "float", example: 10500.00),
                    new OA\Property(property: "advance_paid", type: "number", format: "float", example: 2000.00),
                    new OA\Property(property: "payment_mode", type: "string", enum: ["cash", "bank_transfer", "upi", "card", "cheque"], example: "upi"),
                    new OA\Property(property: "special_requests", type: "string", example: "Late check-in requested")
                ]
            )
        ),
        responses: [
            new OA\Response(response: 201, description: "Booking created successfully", content: new OA\JsonContent(ref: "#/components/schemas/HotelBookingSchema")),
            new OA\Response(response: 422, ref: "#/components/schemas/ValidationErrorResponse")
        ]
    )]
    public function createBooking() {}

    #[OA\Get(
        path: "/business/hotel/bookings/{id}",
        summary: "Get Booking Details with Folio & Invoices",
        description: "Returns full booking details including room, guest info, payment history, posted room charges, and restaurant POS bills.",
        tags: ["3. Hotel - Front Desk & Bookings"],
        security: [["sanctum" => []]],
        parameters: [
            new OA\Parameter(name: "X-Tenant-ID", in: "header", required: true, schema: new OA\Schema(type: "integer", example: 1)),
            new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer", example: 101))
        ],
        responses: [
            new OA\Response(response: 200, description: "Booking details", content: new OA\JsonContent(ref: "#/components/schemas/SuccessResponse")),
            new OA\Response(response: 404, ref: "#/components/schemas/ErrorResponse")
        ]
    )]
    public function showBooking() {}

    #[OA\Post(
        path: "/business/hotel/bookings/{id}/check-in",
        summary: "Guest Check-In",
        description: "Performs guest check-in: transitions booking status to `checked_in`, marks the room status as `occupied`, and logs the operation in the audit trail.",
        tags: ["3. Hotel - Front Desk & Bookings"],
        security: [["sanctum" => []]],
        parameters: [
            new OA\Parameter(name: "X-Tenant-ID", in: "header", required: true, schema: new OA\Schema(type: "integer", example: 1)),
            new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer", example: 101))
        ],
        requestBody: new OA\RequestBody(
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: "id_proof_type", type: "string", example: "Aadhaar / Passport"),
                    new OA\Property(property: "id_proof_number", type: "string", example: "XXXX-XXXX-1234"),
                    new OA\Property(property: "key_card_number", type: "string", example: "KC-201")
                ]
            )
        ),
        responses: [
            new OA\Response(response: 200, description: "Check-in successful", content: new OA\JsonContent(ref: "#/components/schemas/SuccessResponse"))
        ]
    )]
    public function checkIn() {}

    #[OA\Post(
        path: "/business/hotel/bookings/{id}/check-out",
        summary: "Guest Check-Out & Folio Settlement",
        description: "Completes check-out: settles remaining folio balance, changes booking status to `checked_out`, marks room as `dirty` for housekeeping, and generates final invoice.",
        tags: ["3. Hotel - Front Desk & Bookings"],
        security: [["sanctum" => []]],
        parameters: [
            new OA\Parameter(name: "X-Tenant-ID", in: "header", required: true, schema: new OA\Schema(type: "integer", example: 1)),
            new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer", example: 101))
        ],
        requestBody: new OA\RequestBody(
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: "payment_mode", type: "string", enum: ["cash", "card", "upi", "bank_transfer", "corporate_account"], example: "upi"),
                    new OA\Property(property: "settled_amount", type: "number", format: "float", example: 5500.00),
                    new OA\Property(property: "corporate_account_id", type: "integer", nullable: true, example: null)
                ]
            )
        ),
        responses: [
            new OA\Response(response: 200, description: "Check-out completed", content: new OA\JsonContent(ref: "#/components/schemas/SuccessResponse"))
        ]
    )]
    public function checkOut() {}

    #[OA\Post(
        path: "/business/hotel/bookings/{id}/payments",
        summary: "Record Payment on Booking",
        description: "Add an advance payment, partial settlement, or deposit for a booking.",
        tags: ["3. Hotel - Front Desk & Bookings"],
        security: [["sanctum" => []]],
        parameters: [
            new OA\Parameter(name: "X-Tenant-ID", in: "header", required: true, schema: new OA\Schema(type: "integer", example: 1)),
            new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer", example: 101))
        ],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ["amount", "payment_mode"],
                properties: [
                    new OA\Property(property: "amount", type: "number", format: "float", example: 3000.00),
                    new OA\Property(property: "payment_mode", type: "string", enum: ["cash", "upi", "card", "bank_transfer", "cheque"], example: "cash"),
                    new OA\Property(property: "reference_number", type: "string", example: "UPI/2349871239"),
                    new OA\Property(property: "notes", type: "string", example: "Room upgrade settlement")
                ]
            )
        ),
        responses: [
            new OA\Response(response: 200, description: "Payment recorded", content: new OA\JsonContent(ref: "#/components/schemas/SuccessResponse"))
        ]
    )]
    public function addPayment() {}

    #[OA\Post(
        path: "/business/hotel/bookings/{booking}/folio",
        summary: "Post Charge to Room Folio",
        description: "Posts extra room charges (e.g. Laundry, Extra Bed, Airport Taxi, Minibar) to the guest's open folio.",
        tags: ["3. Hotel - Front Desk & Bookings"],
        security: [["sanctum" => []]],
        parameters: [
            new OA\Parameter(name: "X-Tenant-ID", in: "header", required: true, schema: new OA\Schema(type: "integer", example: 1)),
            new OA\Parameter(name: "booking", in: "path", required: true, schema: new OA\Schema(type: "integer", example: 101))
        ],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ["description", "amount"],
                properties: [
                    new OA\Property(property: "charge_type", type: "string", enum: ["service", "laundry", "minibar", "extra_bed", "penalty", "other"], example: "laundry"),
                    new OA\Property(property: "description", type: "string", example: "Dry Cleaning 2 Shirts"),
                    new OA\Property(property: "amount", type: "number", format: "float", example: 450.00),
                    new OA\Property(property: "quantity", type: "integer", example: 1)
                ]
            )
        ),
        responses: [
            new OA\Response(response: 201, description: "Folio charge added", content: new OA\JsonContent(ref: "#/components/schemas/SuccessResponse"))
        ]
    )]
    public function addFolioCharge() {}
}
