<?php

namespace App\Docs\Swagger;

use OpenApi\Attributes as OA;

class HotelOperationsSwagger
{
    #[OA\Get(
        path: "/business/hotel/housekeeping",
        summary: "List Housekeeping Tasks Board",
        description: "Returns housekeeping tasks categorized by room number, task type (cleaning, inspection, deep clean), status (`pending`, `in_progress`, `completed`), and assigned cleaner.",
        tags: ["6. Hotel - Housekeeping Operations"],
        security: [["sanctum" => []]],
        parameters: [
            new OA\Parameter(name: "X-Tenant-ID", in: "header", required: true, schema: new OA\Schema(type: "integer", example: 1)),
            new OA\Parameter(name: "status", in: "query", schema: new OA\Schema(type: "string", enum: ["pending", "in_progress", "completed", "failed"])),
            new OA\Parameter(name: "room_id", in: "query", schema: new OA\Schema(type: "integer"))
        ],
        responses: [
            new OA\Response(response: 200, description: "Housekeeping tasks list", content: new OA\JsonContent(ref: "#/components/schemas/SuccessResponse"))
        ]
    )]
    public function listHousekeeping() {}

    #[OA\Patch(
        path: "/business/hotel/housekeeping/{task}/status",
        summary: "Update Housekeeping Task Status",
        description: "Housekeeping staff marks a room cleaning as `in_progress` or `completed`. When marked `completed`, room status automatically updates to `available`.",
        tags: ["6. Hotel - Housekeeping Operations"],
        security: [["sanctum" => []]],
        parameters: [
            new OA\Parameter(name: "X-Tenant-ID", in: "header", required: true, schema: new OA\Schema(type: "integer", example: 1)),
            new OA\Parameter(name: "task", in: "path", required: true, schema: new OA\Schema(type: "integer", example: 18))
        ],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ["status"],
                properties: [
                    new OA\Property(property: "status", type: "string", enum: ["pending", "in_progress", "completed", "failed"], example: "completed"),
                    new OA\Property(property: "notes", type: "string", example: "Linen changed, bathroom sanitized")
                ]
            )
        ),
        responses: [
            new OA\Response(response: 200, description: "Task status updated", content: new OA\JsonContent(ref: "#/components/schemas/SuccessResponse"))
        ]
    )]
    public function updateHousekeepingStatus() {}

    #[OA\Get(
        path: "/business/hotel/night-audit/preview",
        summary: "Preview Night Audit (EOD) Operations",
        description: "Returns a preview of all room charges to be posted, no-show bookings to be processed, and revenue totals before running the Night Audit.",
        tags: ["8. Hotel - Night Audit & EOD"],
        security: [["sanctum" => []]],
        parameters: [
            new OA\Parameter(name: "X-Tenant-ID", in: "header", required: true, schema: new OA\Schema(type: "integer", example: 1))
        ],
        responses: [
            new OA\Response(response: 200, description: "Night audit preview", content: new OA\JsonContent(ref: "#/components/schemas/SuccessResponse"))
        ]
    )]
    public function previewNightAudit() {}

    #[OA\Post(
        path: "/business/hotel/night-audit/run",
        summary: "Execute Night Audit (End-Of-Day Roll Over)",
        description: "Performs official EOD Night Audit: posts daily room tariffs and taxes to in-house guest folios, processes guaranteed no-shows, generates audit log, and advances business hotel business date.",
        tags: ["8. Hotel - Night Audit & EOD"],
        security: [["sanctum" => []]],
        parameters: [
            new OA\Parameter(name: "X-Tenant-ID", in: "header", required: true, schema: new OA\Schema(type: "integer", example: 1))
        ],
        responses: [
            new OA\Response(response: 200, description: "Night audit completed successfully", content: new OA\JsonContent(ref: "#/components/schemas/SuccessResponse"))
        ]
    )]
    public function runNightAudit() {}

    #[OA\Get(
        path: "/business/hotel/ota-channels",
        summary: "List Connected OTA Channels",
        description: "Returns Online Travel Agency channel connections (MakeMyTrip, Booking.com, Agoda, Goibibo) with sync status.",
        tags: ["9. Hotel - OTA Channel Integration"],
        security: [["sanctum" => []]],
        parameters: [
            new OA\Parameter(name: "X-Tenant-ID", in: "header", required: true, schema: new OA\Schema(type: "integer", example: 1))
        ],
        responses: [
            new OA\Response(response: 200, description: "OTA channels list", content: new OA\JsonContent(ref: "#/components/schemas/SuccessResponse"))
        ]
    )]
    public function listOtaChannels() {}

    #[OA\Post(
        path: "/business/hotel/ota/sync-all",
        summary: "Trigger Real-time Rate & Inventory Sync to OTAs",
        description: "Pushes current room availability and rate plan updates across all active OTA channels.",
        tags: ["9. Hotel - OTA Channel Integration"],
        security: [["sanctum" => []]],
        parameters: [
            new OA\Parameter(name: "X-Tenant-ID", in: "header", required: true, schema: new OA\Schema(type: "integer", example: 1))
        ],
        responses: [
            new OA\Response(response: 200, description: "OTA sync triggered", content: new OA\JsonContent(ref: "#/components/schemas/SuccessResponse"))
        ]
    )]
    public function syncOtaAll() {}

    #[OA\Get(
        path: "/business/hotel/corporate-accounts",
        summary: "List Corporate & Company Accounts",
        description: "Fetch B2B corporate client accounts, credit limits, outstanding balances, and GSTIN.",
        tags: ["10. Hotel - Corporate Accounts & City Ledger"],
        security: [["sanctum" => []]],
        parameters: [
            new OA\Parameter(name: "X-Tenant-ID", in: "header", required: true, schema: new OA\Schema(type: "integer", example: 1))
        ],
        responses: [
            new OA\Response(response: 200, description: "Corporate accounts list", content: new OA\JsonContent(ref: "#/components/schemas/SuccessResponse"))
        ]
    )]
    public function listCorporateAccounts() {}

    #[OA\Get(
        path: "/business/hotel/reports/occupancy",
        summary: "Hotel Occupancy & RevPAR Analytics",
        description: "Returns date-wise breakdown of Occupancy %, Available Room Nights, Sold Room Nights, ADR (Average Daily Rate), and RevPAR (Revenue Per Available Room).",
        tags: ["11. Hotel - Reports & Occupancy Analytics"],
        security: [["sanctum" => []]],
        parameters: [
            new OA\Parameter(name: "X-Tenant-ID", in: "header", required: true, schema: new OA\Schema(type: "integer", example: 1)),
            new OA\Parameter(name: "from_date", in: "query", schema: new OA\Schema(type: "string", format: "date")),
            new OA\Parameter(name: "to_date", in: "query", schema: new OA\Schema(type: "string", format: "date"))
        ],
        responses: [
            new OA\Response(response: 200, description: "Occupancy analytics", content: new OA\JsonContent(ref: "#/components/schemas/SuccessResponse"))
        ]
    )]
    public function getOccupancyReport() {}

    #[OA\Get(
        path: "/business/hotel/reports/revenue",
        summary: "Hotel Revenue Breakdown Report",
        description: "Returns revenue split by Department: Room Tariffs, F&B Dining, Room Service, Laundry, Extra Beds, and Miscellaneous.",
        tags: ["11. Hotel - Reports & Occupancy Analytics"],
        security: [["sanctum" => []]],
        parameters: [
            new OA\Parameter(name: "X-Tenant-ID", in: "header", required: true, schema: new OA\Schema(type: "integer", example: 1)),
            new OA\Parameter(name: "from_date", in: "query", schema: new OA\Schema(type: "string", format: "date")),
            new OA\Parameter(name: "to_date", in: "query", schema: new OA\Schema(type: "string", format: "date"))
        ],
        responses: [
            new OA\Response(response: 200, description: "Revenue breakdown", content: new OA\JsonContent(ref: "#/components/schemas/SuccessResponse"))
        ]
    )]
    public function getRevenueReport() {}
}
