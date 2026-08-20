<?php

namespace App\Docs\Swagger;

use OpenApi\Attributes as OA;

class HotelRoomsSwagger
{
    #[OA\Get(
        path: "/business/hotel/property-settings",
        summary: "Get Hotel Property Profile & Policies",
        description: "Returns property settings: Standard Check-In Time, Check-Out Time, Hotel Star Rating, Default Taxes, Policy terms, and amenities.",
        tags: ["4. Hotel - Rooms & Pricing Plans"],
        security: [["sanctum" => []]],
        parameters: [
            new OA\Parameter(name: "X-Tenant-ID", in: "header", required: true, schema: new OA\Schema(type: "integer", example: 1))
        ],
        responses: [
            new OA\Response(response: 200, description: "Property settings", content: new OA\JsonContent(ref: "#/components/schemas/SuccessResponse"))
        ]
    )]
    public function getPropertySettings() {}

    #[OA\Get(
        path: "/business/hotel/room-types",
        summary: "List Room Types (Categories)",
        description: "Fetch all room types (e.g. Deluxe, Executive Suite, Presidential Suite, Standard) with default base rate, max occupancy, and amenities.",
        tags: ["4. Hotel - Rooms & Pricing Plans"],
        security: [["sanctum" => []]],
        parameters: [
            new OA\Parameter(name: "X-Tenant-ID", in: "header", required: true, schema: new OA\Schema(type: "integer", example: 1))
        ],
        responses: [
            new OA\Response(response: 200, description: "Room types list", content: new OA\JsonContent(ref: "#/components/schemas/SuccessResponse"))
        ]
    )]
    public function listRoomTypes() {}

    #[OA\Post(
        path: "/business/hotel/room-types",
        summary: "Create Room Type",
        description: "Add a new room type category with capacity, pricing, and amenities.",
        tags: ["4. Hotel - Rooms & Pricing Plans"],
        security: [["sanctum" => []]],
        parameters: [
            new OA\Parameter(name: "X-Tenant-ID", in: "header", required: true, schema: new OA\Schema(type: "integer", example: 1))
        ],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ["name", "base_price", "max_adults"],
                properties: [
                    new OA\Property(property: "name", type: "string", example: "Super Deluxe AC"),
                    new OA\Property(property: "description", type: "string", example: "King size bed with valley view and balcony"),
                    new OA\Property(property: "base_price", type: "number", format: "float", example: 4500.00),
                    new OA\Property(property: "max_adults", type: "integer", example: 2),
                    new OA\Property(property: "max_children", type: "integer", example: 2),
                    new OA\Property(property: "amenities", type: "array", items: new OA\Items(type: "string"), example: ["WiFi", "AC", "Smart TV", "Mini Fridge", "Bathtub"])
                ]
            )
        ),
        responses: [
            new OA\Response(response: 201, description: "Room type created", content: new OA\JsonContent(ref: "#/components/schemas/SuccessResponse")),
            new OA\Response(response: 422, ref: "#/components/schemas/ValidationErrorResponse")
        ]
    )]
    public function createRoomType() {}

    #[OA\Get(
        path: "/business/hotel/rooms",
        summary: "List Hotel Rooms",
        description: "Returns room inventory with status filtering (`available`, `occupied`, `dirty`, `maintenance`), floor, and room type.",
        tags: ["4. Hotel - Rooms & Pricing Plans"],
        security: [["sanctum" => []]],
        parameters: [
            new OA\Parameter(name: "X-Tenant-ID", in: "header", required: true, schema: new OA\Schema(type: "integer", example: 1)),
            new OA\Parameter(name: "status", in: "query", schema: new OA\Schema(type: "string", enum: ["available", "occupied", "dirty", "maintenance", "reserved"])),
            new OA\Parameter(name: "room_type_id", in: "query", schema: new OA\Schema(type: "integer")),
            new OA\Parameter(name: "floor", in: "query", schema: new OA\Schema(type: "string"))
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: "List of rooms",
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: "status", type: "string", example: "success"),
                        new OA\Property(property: "data", type: "array", items: new OA\Items(ref: "#/components/schemas/HotelRoomSchema"))
                    ]
                )
            )
        ]
    )]
    public function listRooms() {}

    #[OA\Post(
        path: "/business/hotel/rooms",
        summary: "Add New Room",
        description: "Add a room to the property inventory.",
        tags: ["4. Hotel - Rooms & Pricing Plans"],
        security: [["sanctum" => []]],
        parameters: [
            new OA\Parameter(name: "X-Tenant-ID", in: "header", required: true, schema: new OA\Schema(type: "integer", example: 1))
        ],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ["room_number", "room_type_id", "floor"],
                properties: [
                    new OA\Property(property: "room_number", type: "string", example: "305"),
                    new OA\Property(property: "room_type_id", type: "integer", example: 2),
                    new OA\Property(property: "floor", type: "string", example: "3rd Floor"),
                    new OA\Property(property: "status", type: "string", enum: ["available", "dirty", "maintenance"], example: "available")
                ]
            )
        ),
        responses: [
            new OA\Response(response: 201, description: "Room created", content: new OA\JsonContent(ref: "#/components/schemas/HotelRoomSchema")),
            new OA\Response(response: 422, ref: "#/components/schemas/ValidationErrorResponse")
        ]
    )]
    public function createRoom() {}

    #[OA\Patch(
        path: "/business/hotel/rooms/{id}/status",
        summary: "Quick Update Room Status",
        description: "Change room state (e.g. from `dirty` to `available` after housekeeping, or to `maintenance`).",
        tags: ["4. Hotel - Rooms & Pricing Plans"],
        security: [["sanctum" => []]],
        parameters: [
            new OA\Parameter(name: "X-Tenant-ID", in: "header", required: true, schema: new OA\Schema(type: "integer", example: 1)),
            new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer", example: 12))
        ],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ["status"],
                properties: [
                    new OA\Property(property: "status", type: "string", enum: ["available", "dirty", "maintenance", "occupied"], example: "available"),
                    new OA\Property(property: "remarks", type: "string", example: "Room sanitized and inspected")
                ]
            )
        ),
        responses: [
            new OA\Response(response: 200, description: "Status updated", content: new OA\JsonContent(ref: "#/components/schemas/SuccessResponse"))
        ]
    )]
    public function updateRoomStatus() {}

    #[OA\Get(
        path: "/business/hotel/rate-plans",
        summary: "List Rate Plans (EP, CP, MAP, AP)",
        description: "Fetch dynamic meal plans and seasonal pricing schemes (e.g. Room Only, Bed & Breakfast, Half Board, Full Board).",
        tags: ["4. Hotel - Rooms & Pricing Plans"],
        security: [["sanctum" => []]],
        parameters: [
            new OA\Parameter(name: "X-Tenant-ID", in: "header", required: true, schema: new OA\Schema(type: "integer", example: 1))
        ],
        responses: [
            new OA\Response(response: 200, description: "Rate plans list", content: new OA\JsonContent(ref: "#/components/schemas/SuccessResponse"))
        ]
    )]
    public function listRatePlans() {}
}
