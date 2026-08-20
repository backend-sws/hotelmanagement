<?php

namespace App\Docs\Swagger;

use OpenApi\Attributes as OA;

class InventoryPurchasesSwagger
{
    #[OA\Get(
        path: "/business/inventory",
        summary: "List Products / Inventory Items",
        description: "Fetch paginated inventory products with category, brand, stock levels, and search.",
        tags: ["15. Inventory, Stock & Godowns"],
        security: [["sanctum" => []]],
        parameters: [
            new OA\Parameter(name: "X-Tenant-ID", in: "header", required: true, schema: new OA\Schema(type: "integer", example: 1)),
            new OA\Parameter(name: "search", in: "query", schema: new OA\Schema(type: "string", example: "Mineral Water")),
            new OA\Parameter(name: "category_id", in: "query", schema: new OA\Schema(type: "integer")),
            new OA\Parameter(name: "brand_id", in: "query", schema: new OA\Schema(type: "integer"))
        ],
        responses: [
            new OA\Response(response: 200, description: "Inventory items list", content: new OA\JsonContent(ref: "#/components/schemas/SuccessResponse"))
        ]
    )]
    public function listInventory() {}

    #[OA\Post(
        path: "/business/inventory",
        summary: "Create Product / Item",
        description: "Add a new product with SKU, barcode, unit, purchase price, selling price, GST rate, and min stock alert.",
        tags: ["15. Inventory, Stock & Godowns"],
        security: [["sanctum" => []]],
        parameters: [
            new OA\Parameter(name: "X-Tenant-ID", in: "header", required: true, schema: new OA\Schema(type: "integer", example: 1))
        ],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ["name", "unit_id", "selling_price"],
                properties: [
                    new OA\Property(property: "name", type: "string", example: "Shampoo Bottle 50ml"),
                    new OA\Property(property: "sku", type: "string", example: "HK-SHAMP-001"),
                    new OA\Property(property: "barcode", type: "string", example: "890123456789"),
                    new OA\Property(property: "category_id", type: "integer", example: 2),
                    new OA\Property(property: "unit_id", type: "integer", example: 1),
                    new OA\Property(property: "purchase_price", type: "number", format: "float", example: 15.00),
                    new OA\Property(property: "selling_price", type: "number", format: "float", example: 35.00),
                    new OA\Property(property: "gst_rate", type: "number", format: "float", example: 18.0),
                    new OA\Property(property: "opening_stock", type: "number", format: "float", example: 200.0),
                    new OA\Property(property: "min_stock_alert", type: "number", format: "float", example: 30.0)
                ]
            )
        ),
        responses: [
            new OA\Response(response: 201, description: "Product created", content: new OA\JsonContent(ref: "#/components/schemas/SuccessResponse")),
            new OA\Response(response: 422, ref: "#/components/schemas/ValidationErrorResponse")
        ]
    )]
    public function createProduct() {}

    #[OA\Get(
        path: "/business/inventory/low-stock",
        summary: "Low Stock Alerts",
        description: "Returns all products whose current stock level is below the minimum reorder threshold.",
        tags: ["15. Inventory, Stock & Godowns"],
        security: [["sanctum" => []]],
        parameters: [
            new OA\Parameter(name: "X-Tenant-ID", in: "header", required: true, schema: new OA\Schema(type: "integer", example: 1))
        ],
        responses: [
            new OA\Response(response: 200, description: "Low stock items", content: new OA\JsonContent(ref: "#/components/schemas/SuccessResponse"))
        ]
    )]
    public function lowStockAlert() {}

    #[OA\Get(
        path: "/business/suppliers",
        summary: "List Suppliers / Vendors",
        description: "Fetch suppliers directory with outstanding balance and contact information.",
        tags: ["14. Purchases & Suppliers"],
        security: [["sanctum" => []]],
        parameters: [
            new OA\Parameter(name: "X-Tenant-ID", in: "header", required: true, schema: new OA\Schema(type: "integer", example: 1))
        ],
        responses: [
            new OA\Response(response: 200, description: "Suppliers list", content: new OA\JsonContent(ref: "#/components/schemas/SuccessResponse"))
        ]
    )]
    public function listSuppliers() {}

    #[OA\Post(
        path: "/business/purchases",
        summary: "Record Purchase Bill (Stock Inward)",
        description: "Records an inward vendor purchase bill, increases inventory stock, and logs GST ITC eligibility.",
        tags: ["14. Purchases & Suppliers"],
        security: [["sanctum" => []]],
        parameters: [
            new OA\Parameter(name: "X-Tenant-ID", in: "header", required: true, schema: new OA\Schema(type: "integer", example: 1))
        ],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ["supplier_id", "bill_number", "items", "total_amount"],
                properties: [
                    new OA\Property(property: "supplier_id", type: "integer", example: 5),
                    new OA\Property(property: "bill_number", type: "string", example: "SUPP-BILL-8891"),
                    new OA\Property(property: "date", type: "string", format: "date", example: "2026-08-18"),
                    new OA\Property(
                        property: "items",
                        type: "array",
                        items: new OA\Items(
                            properties: [
                                new OA\Property(property: "product_id", type: "integer", example: 10),
                                new OA\Property(property: "quantity", type: "number", format: "float", example: 50.0),
                                new OA\Property(property: "unit_price", type: "number", format: "float", example: 800.00),
                                new OA\Property(property: "gst_rate", type: "number", format: "float", example: 18.0)
                            ]
                        )
                    ),
                    new OA\Property(property: "paid_amount", type: "number", format: "float", example: 20000.00),
                    new OA\Property(property: "payment_mode", type: "string", enum: ["cash", "bank_transfer", "cheque", "credit"], example: "bank_transfer")
                ]
            )
        ),
        responses: [
            new OA\Response(response: 201, description: "Purchase recorded", content: new OA\JsonContent(ref: "#/components/schemas/SuccessResponse")),
            new OA\Response(response: 422, ref: "#/components/schemas/ValidationErrorResponse")
        ]
    )]
    public function createPurchase() {}

    #[OA\Get(
        path: "/business/stock-transfers",
        summary: "List Stock Transfers Between Godowns",
        description: "Returns inter-warehouse and godown inventory transfer records.",
        tags: ["15. Inventory, Stock & Godowns"],
        security: [["sanctum" => []]],
        parameters: [
            new OA\Parameter(name: "X-Tenant-ID", in: "header", required: true, schema: new OA\Schema(type: "integer", example: 1))
        ],
        responses: [
            new OA\Response(response: 200, description: "Stock transfers list", content: new OA\JsonContent(ref: "#/components/schemas/SuccessResponse"))
        ]
    )]
    public function listStockTransfers() {}
}
