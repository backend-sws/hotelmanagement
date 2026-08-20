<?php

namespace App\Docs\Swagger;

use OpenApi\Attributes as OA;

class BillingSalesSwagger
{
    #[OA\Get(
        path: "/business/invoices",
        summary: "List Invoices / Sales",
        description: "Returns paginated list of sales invoices with search, date filter, customer filter, and payment status (`paid`, `unpaid`, `partial`).",
        tags: ["12. Billing & Invoicing (ERP)"],
        security: [["sanctum" => []]],
        parameters: [
            new OA\Parameter(name: "X-Tenant-ID", in: "header", required: true, schema: new OA\Schema(type: "integer", example: 1)),
            new OA\Parameter(name: "search", in: "query", schema: new OA\Schema(type: "string", example: "INV-2026")),
            new OA\Parameter(name: "status", in: "query", schema: new OA\Schema(type: "string", enum: ["paid", "partial", "unpaid", "cancelled"])),
            new OA\Parameter(name: "from_date", in: "query", schema: new OA\Schema(type: "string", format: "date")),
            new OA\Parameter(name: "to_date", in: "query", schema: new OA\Schema(type: "string", format: "date")),
            new OA\Parameter(name: "page", in: "query", schema: new OA\Schema(type: "integer", default: 1))
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: "Invoices list",
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: "status", type: "string", example: "success"),
                        new OA\Property(property: "data", type: "array", items: new OA\Items(ref: "#/components/schemas/InvoiceSchema"))
                    ]
                )
            )
        ]
    )]
    public function listInvoices() {}

    #[OA\Post(
        path: "/business/invoices",
        summary: "Create Tax Invoice / Cash Sale",
        description: "Creates a GST/tax invoice or cash bill, updates inventory stock, and posts transaction to customer Khata.",
        tags: ["12. Billing & Invoicing (ERP)"],
        security: [["sanctum" => []]],
        parameters: [
            new OA\Parameter(name: "X-Tenant-ID", in: "header", required: true, schema: new OA\Schema(type: "integer", example: 1))
        ],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ["customer_id", "items", "total_amount"],
                properties: [
                    new OA\Property(property: "customer_id", type: "integer", example: 18),
                    new OA\Property(property: "date", type: "string", format: "date", example: "2026-08-19"),
                    new OA\Property(property: "due_date", type: "string", format: "date", example: "2026-08-26"),
                    new OA\Property(
                        property: "items",
                        type: "array",
                        items: new OA\Items(
                            properties: [
                                new OA\Property(property: "product_id", type: "integer", example: 10),
                                new OA\Property(property: "quantity", type: "number", format: "float", example: 2.0),
                                new OA\Property(property: "unit_price", type: "number", format: "float", example: 1500.00),
                                new OA\Property(property: "gst_rate", type: "number", format: "float", example: 18.0),
                                new OA\Property(property: "discount", type: "number", format: "float", example: 100.00)
                            ]
                        )
                    ),
                    new OA\Property(property: "paid_amount", type: "number", format: "float", example: 3440.00),
                    new OA\Property(property: "payment_mode", type: "string", enum: ["cash", "upi", "card", "bank_transfer", "credit"], example: "upi"),
                    new OA\Property(property: "notes", type: "string", example: "Thank you for your business!")
                ]
            )
        ),
        responses: [
            new OA\Response(response: 201, description: "Invoice created", content: new OA\JsonContent(ref: "#/components/schemas/InvoiceSchema")),
            new OA\Response(response: 422, ref: "#/components/schemas/ValidationErrorResponse")
        ]
    )]
    public function createInvoice() {}

    #[OA\Get(
        path: "/business/invoices/{invoice}/pdf",
        summary: "Download Invoice PDF",
        description: "Returns PDF binary download or printable invoice layout.",
        tags: ["12. Billing & Invoicing (ERP)"],
        security: [["sanctum" => []]],
        parameters: [
            new OA\Parameter(name: "X-Tenant-ID", in: "header", required: true, schema: new OA\Schema(type: "integer", example: 1)),
            new OA\Parameter(name: "invoice", in: "path", required: true, schema: new OA\Schema(type: "integer", example: 301))
        ],
        responses: [
            new OA\Response(response: 200, description: "PDF document generated")
        ]
    )]
    public function invoicePdf() {}

    #[OA\Get(
        path: "/business/challans",
        summary: "List Delivery Challans",
        description: "Fetch delivery challans for dispatched goods and truck slips.",
        tags: ["13. Documents - Challans, Proforma, Quotations"],
        security: [["sanctum" => []]],
        parameters: [
            new OA\Parameter(name: "X-Tenant-ID", in: "header", required: true, schema: new OA\Schema(type: "integer", example: 1))
        ],
        responses: [
            new OA\Response(response: 200, description: "Challans list", content: new OA\JsonContent(ref: "#/components/schemas/SuccessResponse"))
        ]
    )]
    public function listChallans() {}

    #[OA\Get(
        path: "/business/quotations",
        summary: "List Quotations & Estimates",
        description: "Fetch client price quotations and cost estimates.",
        tags: ["13. Documents - Challans, Proforma, Quotations"],
        security: [["sanctum" => []]],
        parameters: [
            new OA\Parameter(name: "X-Tenant-ID", in: "header", required: true, schema: new OA\Schema(type: "integer", example: 1))
        ],
        responses: [
            new OA\Response(response: 200, description: "Quotations list", content: new OA\JsonContent(ref: "#/components/schemas/SuccessResponse"))
        ]
    )]
    public function listQuotations() {}

    #[OA\Post(
        path: "/business/quotations/{id}/convert",
        summary: "Convert Quotation to Invoice",
        description: "Converts an accepted quotation into a finalized tax invoice.",
        tags: ["13. Documents - Challans, Proforma, Quotations"],
        security: [["sanctum" => []]],
        parameters: [
            new OA\Parameter(name: "X-Tenant-ID", in: "header", required: true, schema: new OA\Schema(type: "integer", example: 1)),
            new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer", example: 12))
        ],
        responses: [
            new OA\Response(response: 200, description: "Converted to invoice", content: new OA\JsonContent(ref: "#/components/schemas/InvoiceSchema"))
        ]
    )]
    public function convertQuotation() {}
}
