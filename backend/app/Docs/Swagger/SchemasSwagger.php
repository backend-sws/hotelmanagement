<?php

namespace App\Docs\Swagger;

use OpenApi\Attributes as OA;

#[OA\Schema(
    schema: "SuccessResponse",
    type: "object",
    properties: [
        new OA\Property(property: "status", type: "string", example: "success"),
        new OA\Property(property: "message", type: "string", example: "Action completed successfully"),
        new OA\Property(property: "data", type: "object", nullable: true)
    ]
)]
#[OA\Schema(
    schema: "ErrorResponse",
    type: "object",
    properties: [
        new OA\Property(property: "status", type: "string", example: "error"),
        new OA\Property(property: "message", type: "string", example: "Something went wrong"),
        new OA\Property(property: "errors", type: "object", nullable: true)
    ]
)]
#[OA\Schema(
    schema: "ValidationErrorResponse",
    type: "object",
    properties: [
        new OA\Property(property: "status", type: "string", example: "error"),
        new OA\Property(property: "message", type: "string", example: "Validation Error."),
        new OA\Property(
            property: "errors",
            type: "object",
            example: ["phone" => ["The phone field is required."], "email" => ["Invalid email format."]]
        )
    ]
)]
#[OA\Schema(
    schema: "UserSchema",
    type: "object",
    properties: [
        new OA\Property(property: "id", type: "integer", example: 1),
        new OA\Property(property: "name", type: "string", example: "Rajesh Sharma"),
        new OA\Property(property: "phone", type: "string", example: "9876543210"),
        new OA\Property(property: "email", type: "string", example: "rajesh@hotelroyal.com"),
        new OA\Property(property: "role", type: "string", example: "admin"),
        new OA\Property(property: "created_at", type: "string", format: "date-time")
    ]
)]
#[OA\Schema(
    schema: "HotelBookingSchema",
    type: "object",
    properties: [
        new OA\Property(property: "id", type: "integer", example: 101),
        new OA\Property(property: "booking_number", type: "string", example: "BK-202608-001"),
        new OA\Property(property: "guest_id", type: "integer", example: 45),
        new OA\Property(property: "room_id", type: "integer", example: 12),
        new OA\Property(property: "room_type_id", type: "integer", example: 3),
        new OA\Property(property: "check_in_date", type: "string", format: "date", example: "2026-08-20"),
        new OA\Property(property: "check_out_date", type: "string", format: "date", example: "2026-08-23"),
        new OA\Property(property: "total_nights", type: "integer", example: 3),
        new OA\Property(property: "adults", type: "integer", example: 2),
        new OA\Property(property: "children", type: "integer", example: 1),
        new OA\Property(property: "total_amount", type: "number", format: "float", example: 10500.00),
        new OA\Property(property: "paid_amount", type: "number", format: "float", example: 5000.00),
        new OA\Property(property: "due_amount", type: "number", format: "float", example: 5500.00),
        new OA\Property(property: "status", type: "string", enum: ["confirmed", "checked_in", "checked_out", "cancelled", "no_show"], example: "confirmed"),
        new OA\Property(property: "payment_status", type: "string", enum: ["unpaid", "partial", "paid"], example: "partial")
    ]
)]
#[OA\Schema(
    schema: "HotelRoomSchema",
    type: "object",
    properties: [
        new OA\Property(property: "id", type: "integer", example: 12),
        new OA\Property(property: "room_number", type: "string", example: "201"),
        new OA\Property(property: "floor", type: "string", example: "2nd Floor"),
        new OA\Property(property: "room_type_id", type: "integer", example: 3),
        new OA\Property(property: "base_price", type: "number", format: "float", example: 3500.00),
        new OA\Property(property: "status", type: "string", enum: ["available", "occupied", "dirty", "maintenance", "reserved"], example: "available"),
        new OA\Property(property: "is_active", type: "boolean", example: true)
    ]
)]
#[OA\Schema(
    schema: "HotelPosOrderSchema",
    type: "object",
    properties: [
        new OA\Property(property: "id", type: "integer", example: 55),
        new OA\Property(property: "order_number", type: "string", example: "POS-2026-088"),
        new OA\Property(property: "outlet_id", type: "integer", example: 1),
        new OA\Property(property: "table_id", type: "integer", nullable: true, example: 4),
        new OA\Property(property: "booking_id", type: "integer", nullable: true, example: 101),
        new OA\Property(property: "subtotal", type: "number", format: "float", example: 1200.00),
        new OA\Property(property: "tax_amount", type: "number", format: "float", example: 60.00),
        new OA\Property(property: "final_amount", type: "number", format: "float", example: 1260.00),
        new OA\Property(property: "status", type: "string", enum: ["open", "billed", "paid", "posted_to_room", "cancelled"], example: "open")
    ]
)]
#[OA\Schema(
    schema: "InvoiceSchema",
    type: "object",
    properties: [
        new OA\Property(property: "id", type: "integer", example: 301),
        new OA\Property(property: "invoice_number", type: "string", example: "INV-2026-0042"),
        new OA\Property(property: "customer_id", type: "integer", example: 18),
        new OA\Property(property: "date", type: "string", format: "date", example: "2026-08-19"),
        new OA\Property(property: "total_amount", type: "number", format: "float", example: 8400.00),
        new OA\Property(property: "tax_amount", type: "number", format: "float", example: 1512.00),
        new OA\Property(property: "final_amount", type: "number", format: "float", example: 9912.00),
        new OA\Property(property: "paid_amount", type: "number", format: "float", example: 9912.00),
        new OA\Property(property: "status", type: "string", enum: ["paid", "partial", "unpaid", "cancelled"], example: "paid")
    ]
)]
class SchemasSwagger
{
}
