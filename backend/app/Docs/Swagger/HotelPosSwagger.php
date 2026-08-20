<?php

namespace App\Docs\Swagger;

use OpenApi\Attributes as OA;

class HotelPosSwagger
{
    #[OA\Get(
        path: "/business/hotel/outlets",
        summary: "List F&B Outlets (Restaurants, Bars, Room Service, Spa)",
        description: "Returns all dining and commercial outlets configured under the hotel.",
        tags: ["5. Hotel - Point of Sale (POS) & Restaurant"],
        security: [["sanctum" => []]],
        parameters: [
            new OA\Parameter(name: "X-Tenant-ID", in: "header", required: true, schema: new OA\Schema(type: "integer", example: 1))
        ],
        responses: [
            new OA\Response(response: 200, description: "Outlets list", content: new OA\JsonContent(ref: "#/components/schemas/SuccessResponse"))
        ]
    )]
    public function listOutlets() {}

    #[OA\Get(
        path: "/business/hotel/services",
        summary: "List POS Services & Food Menu Items",
        description: "Fetch restaurant dishes, beverages, room service catalog, and spa packages with GST rates and outlet mapping.",
        tags: ["5. Hotel - Point of Sale (POS) & Restaurant"],
        security: [["sanctum" => []]],
        parameters: [
            new OA\Parameter(name: "X-Tenant-ID", in: "header", required: true, schema: new OA\Schema(type: "integer", example: 1)),
            new OA\Parameter(name: "outlet_id", in: "query", schema: new OA\Schema(type: "integer", example: 1)),
            new OA\Parameter(name: "category", in: "query", schema: new OA\Schema(type: "string", example: "Main Course"))
        ],
        responses: [
            new OA\Response(response: 200, description: "Menu items list", content: new OA\JsonContent(ref: "#/components/schemas/SuccessResponse"))
        ]
    )]
    public function listServices() {}

    #[OA\Get(
        path: "/business/hotel/tables",
        summary: "List Restaurant Tables & Live Status",
        description: "Returns all dining tables with current occupancy status (`available`, `occupied`, `reserved`, `billing`).",
        tags: ["5. Hotel - Point of Sale (POS) & Restaurant"],
        security: [["sanctum" => []]],
        parameters: [
            new OA\Parameter(name: "X-Tenant-ID", in: "header", required: true, schema: new OA\Schema(type: "integer", example: 1)),
            new OA\Parameter(name: "outlet_id", in: "query", schema: new OA\Schema(type: "integer", example: 1))
        ],
        responses: [
            new OA\Response(response: 200, description: "Tables list", content: new OA\JsonContent(ref: "#/components/schemas/SuccessResponse"))
        ]
    )]
    public function listTables() {}

    #[OA\Post(
        path: "/business/hotel/pos-orders",
        summary: "Create POS Order / Kitchen Order (KOT)",
        description: "Creates an F&B order for dine-in, room service, or takeaway. Generates a Kitchen Order Ticket (KOT).",
        tags: ["5. Hotel - Point of Sale (POS) & Restaurant"],
        security: [["sanctum" => []]],
        parameters: [
            new OA\Parameter(name: "X-Tenant-ID", in: "header", required: true, schema: new OA\Schema(type: "integer", example: 1))
        ],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ["outlet_id", "items"],
                properties: [
                    new OA\Property(property: "outlet_id", type: "integer", example: 1),
                    new OA\Property(property: "order_type", type: "string", enum: ["dine_in", "room_service", "takeaway"], example: "dine_in"),
                    new OA\Property(property: "table_id", type: "integer", nullable: true, example: 4),
                    new OA\Property(property: "booking_id", type: "integer", nullable: true, example: 101, description: "Hotel booking ID if room service"),
                    new OA\Property(
                        property: "items",
                        type: "array",
                        items: new OA\Items(
                            properties: [
                                new OA\Property(property: "service_id", type: "integer", example: 15),
                                new OA\Property(property: "quantity", type: "integer", example: 2),
                                new OA\Property(property: "price", type: "number", format: "float", example: 350.00),
                                new OA\Property(property: "notes", type: "string", example: "Less spicy / extra butter")
                            ]
                        )
                    )
                ]
            )
        ),
        responses: [
            new OA\Response(response: 201, description: "Order placed and KOT generated", content: new OA\JsonContent(ref: "#/components/schemas/HotelPosOrderSchema")),
            new OA\Response(response: 422, ref: "#/components/schemas/ValidationErrorResponse")
        ]
    )]
    public function createPosOrder() {}

    #[OA\Post(
        path: "/business/hotel/pos-orders/{id}/bill",
        summary: "Bill & Settle POS Order (Direct Payment)",
        description: "Finalize POS order and collect payment via Cash, UPI, Card, or Split payment.",
        tags: ["5. Hotel - Point of Sale (POS) & Restaurant"],
        security: [["sanctum" => []]],
        parameters: [
            new OA\Parameter(name: "X-Tenant-ID", in: "header", required: true, schema: new OA\Schema(type: "integer", example: 1)),
            new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer", example: 55))
        ],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ["payment_mode", "paid_amount"],
                properties: [
                    new OA\Property(property: "payment_mode", type: "string", enum: ["cash", "upi", "card", "bank_transfer"], example: "upi"),
                    new OA\Property(property: "paid_amount", type: "number", format: "float", example: 1260.00),
                    new OA\Property(property: "discount_amount", type: "number", format: "float", example: 0.00)
                ]
            )
        ),
        responses: [
            new OA\Response(response: 200, description: "Bill settled", content: new OA\JsonContent(ref: "#/components/schemas/SuccessResponse"))
        ]
    )]
    public function billPosOrder() {}

    #[OA\Post(
        path: "/business/hotel/pos-orders/{id}/post-to-room",
        summary: "Post POS Order to Room Folio (Room Service Bill)",
        description: "Transfers the entire restaurant/room service bill directly to the in-house guest's active room folio.",
        tags: ["5. Hotel - Point of Sale (POS) & Restaurant"],
        security: [["sanctum" => []]],
        parameters: [
            new OA\Parameter(name: "X-Tenant-ID", in: "header", required: true, schema: new OA\Schema(type: "integer", example: 1)),
            new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer", example: 55))
        ],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ["booking_id"],
                properties: [
                    new OA\Property(property: "booking_id", type: "integer", example: 101, description: "Active booking ID of the checked-in guest")
                ]
            )
        ),
        responses: [
            new OA\Response(response: 200, description: "Posted to room folio", content: new OA\JsonContent(ref: "#/components/schemas/SuccessResponse"))
        ]
    )]
    public function postToRoom() {}

    #[OA\Post(
        path: "/business/hotel/pos-orders/{id}/kot",
        summary: "Print / Reprint Kitchen Order Ticket (KOT)",
        description: "Fetch formatted KOT thermal print payload for kitchen printers.",
        tags: ["5. Hotel - Point of Sale (POS) & Restaurant"],
        security: [["sanctum" => []]],
        parameters: [
            new OA\Parameter(name: "X-Tenant-ID", in: "header", required: true, schema: new OA\Schema(type: "integer", example: 1)),
            new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer", example: 55))
        ],
        responses: [
            new OA\Response(response: 200, description: "KOT print payload", content: new OA\JsonContent(ref: "#/components/schemas/SuccessResponse"))
        ]
    )]
    public function printKot() {}
}
