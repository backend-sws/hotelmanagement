<?php

namespace App\Docs\Swagger;

use OpenApi\Attributes as OA;

class ReportsLogsSwagger
{
    #[OA\Get(
        path: "/business/reports/gst/gstr1",
        summary: "GSTR-1 Sales Report",
        description: "Returns GST outward supplies structured for GSTR-1 compliance: B2B Invoices (with GSTIN), B2C Large, B2C Small, and HSN Summary.",
        tags: ["12. Billing & Invoicing (ERP)"],
        security: [["sanctum" => []]],
        parameters: [
            new OA\Parameter(name: "X-Tenant-ID", in: "header", required: true, schema: new OA\Schema(type: "integer", example: 1)),
            new OA\Parameter(name: "month", in: "query", schema: new OA\Schema(type: "integer", example: 8)),
            new OA\Parameter(name: "year", in: "query", schema: new OA\Schema(type: "integer", example: 2026))
        ],
        responses: [
            new OA\Response(response: 200, description: "GSTR-1 report", content: new OA\JsonContent(ref: "#/components/schemas/SuccessResponse"))
        ]
    )]
    public function gstr1() {}

    #[OA\Get(
        path: "/business/reports/profit-loss",
        summary: "Profit & Loss (P&L) Statement",
        description: "Calculates Total Sales Revenue, Cost of Goods Sold (COGS), Gross Profit, Operating Expenses, Hotel Departmental Revenue, and Net Profit.",
        tags: ["12. Billing & Invoicing (ERP)"],
        security: [["sanctum" => []]],
        parameters: [
            new OA\Parameter(name: "X-Tenant-ID", in: "header", required: true, schema: new OA\Schema(type: "integer", example: 1)),
            new OA\Parameter(name: "from_date", in: "query", schema: new OA\Schema(type: "string", format: "date")),
            new OA\Parameter(name: "to_date", in: "query", schema: new OA\Schema(type: "string", format: "date"))
        ],
        responses: [
            new OA\Response(response: 200, description: "P&L Statement", content: new OA\JsonContent(ref: "#/components/schemas/SuccessResponse"))
        ]
    )]
    public function profitLoss() {}

    #[OA\Get(
        path: "/business/activity-logs",
        summary: "System Audit Logs & Operational History",
        description: "Fetch comprehensive multi-tenant audit logs with text search, module filtering (`hotel`, `sales`, `purchases_inventory`, `finance`, `hrm`), date range, staff info, and field-level diffs (`old` vs `new`).",
        tags: ["21. System Audit Logs"],
        security: [["sanctum" => []]],
        parameters: [
            new OA\Parameter(name: "X-Tenant-ID", in: "header", required: true, schema: new OA\Schema(type: "integer", example: 1)),
            new OA\Parameter(name: "search", in: "query", schema: new OA\Schema(type: "string", example: "Check-in"), description: "Keyword search in description, model label, or staff name"),
            new OA\Parameter(name: "module", in: "query", schema: new OA\Schema(type: "string", enum: ["hotel", "sales", "purchases_inventory", "finance", "hrm", "settings"])),
            new OA\Parameter(name: "from_date", in: "query", schema: new OA\Schema(type: "string", format: "date")),
            new OA\Parameter(name: "to_date", in: "query", schema: new OA\Schema(type: "string", format: "date")),
            new OA\Parameter(name: "page", in: "query", schema: new OA\Schema(type: "integer", default: 1))
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: "Paginated audit logs with live statistics",
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: "status", type: "string", example: "success"),
                        new OA\Property(
                            property: "stats",
                            type: "object",
                            properties: [
                                new OA\Property(property: "total_events", type: "integer", example: 1420),
                                new OA\Property(property: "today_events", type: "integer", example: 64),
                                new OA\Property(property: "hotel_events", type: "integer", example: 450),
                                new OA\Property(property: "financial_events", type: "integer", example: 380)
                            ]
                        ),
                        new OA\Property(
                            property: "data",
                            type: "array",
                            items: new OA\Items(
                                properties: [
                                    new OA\Property(property: "id", type: "integer", example: 890),
                                    new OA\Property(property: "log_name", type: "string", example: "hotel"),
                                    new OA\Property(property: "description", type: "string", example: "Guest checked in to Room 201 (Booking #BK-2026-001)"),
                                    new OA\Property(property: "event", type: "string", example: "check_in"),
                                    new OA\Property(property: "causer_name", type: "string", example: "Amit Verma (Front Desk)"),
                                    new OA\Property(property: "ip_address", type: "string", example: "192.168.1.45"),
                                    new OA\Property(property: "created_at", type: "string", format: "date-time")
                                ]
                            )
                        )
                    ]
                )
            )
        ]
    )]
    public function listActivityLogs() {}
}
