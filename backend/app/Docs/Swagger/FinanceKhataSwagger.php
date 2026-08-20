<?php

namespace App\Docs\Swagger;

use OpenApi\Attributes as OA;

class FinanceKhataSwagger
{
    #[OA\Get(
        path: "/business/customers",
        summary: "List Customers",
        description: "Fetch customer directory with opening balances, phone numbers, and total Khata receivables.",
        tags: ["16. Customers & Khata Ledgers"],
        security: [["sanctum" => []]],
        parameters: [
            new OA\Parameter(name: "X-Tenant-ID", in: "header", required: true, schema: new OA\Schema(type: "integer", example: 1)),
            new OA\Parameter(name: "search", in: "query", schema: new OA\Schema(type: "string", example: "Sharma"))
        ],
        responses: [
            new OA\Response(response: 200, description: "Customers list", content: new OA\JsonContent(ref: "#/components/schemas/SuccessResponse"))
        ]
    )]
    public function listCustomers() {}

    #[OA\Get(
        path: "/business/ledger/customer/{id}",
        summary: "Get Customer Khata Ledger Statement",
        description: "Returns running chronological ledger entries (Invoices, Debit/Credit Notes, Payments, Advances, Running Balance) for a customer.",
        tags: ["16. Customers & Khata Ledgers"],
        security: [["sanctum" => []]],
        parameters: [
            new OA\Parameter(name: "X-Tenant-ID", in: "header", required: true, schema: new OA\Schema(type: "integer", example: 1)),
            new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer", example: 18)),
            new OA\Parameter(name: "from_date", in: "query", schema: new OA\Schema(type: "string", format: "date")),
            new OA\Parameter(name: "to_date", in: "query", schema: new OA\Schema(type: "string", format: "date"))
        ],
        responses: [
            new OA\Response(response: 200, description: "Customer ledger", content: new OA\JsonContent(ref: "#/components/schemas/SuccessResponse"))
        ]
    )]
    public function customerStatement() {}

    #[OA\Get(
        path: "/business/outstanding/summary",
        summary: "Outstanding Aging Breakdown",
        description: "Returns aged receivables and payables broken down into: 0-30 Days, 31-60 Days, 61-90 Days, and 90+ Days overdue.",
        tags: ["16. Customers & Khata Ledgers"],
        security: [["sanctum" => []]],
        parameters: [
            new OA\Parameter(name: "X-Tenant-ID", in: "header", required: true, schema: new OA\Schema(type: "integer", example: 1))
        ],
        responses: [
            new OA\Response(response: 200, description: "Outstanding aging summary", content: new OA\JsonContent(ref: "#/components/schemas/SuccessResponse"))
        ]
    )]
    public function outstandingSummary() {}

    #[OA\Get(
        path: "/business/cash-bank/day-book",
        summary: "Rozka Day Book",
        description: "Returns daily chronological cash in and cash out transactions with opening and closing cash balances.",
        tags: ["17. Cash, Banking & Cheques"],
        security: [["sanctum" => []]],
        parameters: [
            new OA\Parameter(name: "X-Tenant-ID", in: "header", required: true, schema: new OA\Schema(type: "integer", example: 1)),
            new OA\Parameter(name: "date", in: "query", schema: new OA\Schema(type: "string", format: "date", example: "2026-08-19"))
        ],
        responses: [
            new OA\Response(response: 200, description: "Day book entries", content: new OA\JsonContent(ref: "#/components/schemas/SuccessResponse"))
        ]
    )]
    public function dayBook() {}

    #[OA\Get(
        path: "/business/cheques",
        summary: "List Cheque Register",
        description: "Returns all issued and received cheques with status filtering (`pending`, `deposited`, `cleared`, `bounced`, `cancelled`).",
        tags: ["17. Cash, Banking & Cheques"],
        security: [["sanctum" => []]],
        parameters: [
            new OA\Parameter(name: "X-Tenant-ID", in: "header", required: true, schema: new OA\Schema(type: "integer", example: 1)),
            new OA\Parameter(name: "type", in: "query", schema: new OA\Schema(type: "string", enum: ["received", "issued"])),
            new OA\Parameter(name: "status", in: "query", schema: new OA\Schema(type: "string", enum: ["pending", "deposited", "cleared", "bounced", "cancelled"]))
        ],
        responses: [
            new OA\Response(response: 200, description: "Cheques list", content: new OA\JsonContent(ref: "#/components/schemas/SuccessResponse"))
        ]
    )]
    public function listCheques() {}

    #[OA\Patch(
        path: "/business/cheques/{id}/status",
        summary: "Update Cheque Status (Clearance / Bounce)",
        description: "Update cheque status. Clearing a cheque automatically posts credit/debit to the bank account; bouncing a cheque posts reverse entries and penalty.",
        tags: ["17. Cash, Banking & Cheques"],
        security: [["sanctum" => []]],
        parameters: [
            new OA\Parameter(name: "X-Tenant-ID", in: "header", required: true, schema: new OA\Schema(type: "integer", example: 1)),
            new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer", example: 8))
        ],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ["status"],
                properties: [
                    new OA\Property(property: "status", type: "string", enum: ["deposited", "cleared", "bounced", "cancelled"], example: "cleared"),
                    new OA\Property(property: "clearance_date", type: "string", format: "date", example: "2026-08-19"),
                    new OA\Property(property: "bounce_reason", type: "string", example: "Insufficient Funds")
                ]
            )
        ),
        responses: [
            new OA\Response(response: 200, description: "Cheque status updated", content: new OA\JsonContent(ref: "#/components/schemas/SuccessResponse"))
        ]
    )]
    public function updateChequeStatus() {}

    #[OA\Get(
        path: "/business/expenses",
        summary: "List Business Expenses",
        description: "Fetch paginated operational and petty cash expenses with category breakdown.",
        tags: ["18. Expenses & Petty Cash"],
        security: [["sanctum" => []]],
        parameters: [
            new OA\Parameter(name: "X-Tenant-ID", in: "header", required: true, schema: new OA\Schema(type: "integer", example: 1)),
            new OA\Parameter(name: "category_id", in: "query", schema: new OA\Schema(type: "integer"))
        ],
        responses: [
            new OA\Response(response: 200, description: "Expenses list", content: new OA\JsonContent(ref: "#/components/schemas/SuccessResponse"))
        ]
    )]
    public function listExpenses() {}

    #[OA\Post(
        path: "/business/expenses",
        summary: "Record Business Expense",
        description: "Add an operational expense (e.g. Utility Bills, Diesel Generator, Maintenance, Staff Meals).",
        tags: ["18. Expenses & Petty Cash"],
        security: [["sanctum" => []]],
        parameters: [
            new OA\Parameter(name: "X-Tenant-ID", in: "header", required: true, schema: new OA\Schema(type: "integer", example: 1))
        ],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ["category_id", "amount", "payment_mode"],
                properties: [
                    new OA\Property(property: "category_id", type: "integer", example: 3),
                    new OA\Property(property: "amount", type: "number", format: "float", example: 2500.00),
                    new OA\Property(property: "date", type: "string", format: "date", example: "2026-08-19"),
                    new OA\Property(property: "payment_mode", type: "string", enum: ["cash", "bank_transfer", "upi", "card"], example: "cash"),
                    new OA\Property(property: "description", type: "string", example: "Commercial Gas Cylinder refilling")
                ]
            )
        ),
        responses: [
            new OA\Response(response: 201, description: "Expense recorded", content: new OA\JsonContent(ref: "#/components/schemas/SuccessResponse")),
            new OA\Response(response: 422, ref: "#/components/schemas/ValidationErrorResponse")
        ]
    )]
    public function createExpense() {}
}
