<?php

namespace App\Http\Controllers\Api\Business;

use App\Http\Controllers\BaseController;
use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Category;
use App\Models\Brand;
use App\Services\Business\InventoryService;
use Illuminate\Support\Facades\Response;
use OpenApi\Attributes as OA;

class InventoryController extends BaseController
{
    protected $inventoryService;

    public function __construct(InventoryService $inventoryService)
    {
        $this->inventoryService = $inventoryService;
    }

    #[OA\Get(
        path: '/business/inventory',
        summary: 'List Inventory Products',
        description: 'Get a paginated list of all products for the active business.',
        tags: ['Business - Inventory'],
        security: [['sanctum' => []]],
        responses: [
            new OA\Response(response: 200, description: 'Successful operation')
        ]
    )]
    public function index(Request $request)
    {
        try {
            $filters = $request->only(['search', 'category_id', 'brand_id', 'low_stock_days', 'price_list_id']);
            $perPage = $request->input('per_page', 10);
            $paginator = $this->inventoryService->getInventory($filters, $perPage);
            
            return $this->paginated($paginator, 'Inventory retrieved successfully');
        } catch (\Throwable $e) {
            return $this->error($e->getMessage(), 500);
        }
    }

    #[OA\Post(
        path: '/business/inventory',
        summary: 'Create Product',
        description: 'Adds a new product to the inventory.',
        tags: ['Business - Inventory'],
        security: [['sanctum' => []]],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['category_id', 'brand', 'model_name', 'purchase_price', 'mrp', 'quantity'],
                properties: [
                    new OA\Property(property: 'category_id', type: 'integer'),
                    new OA\Property(property: 'brand', type: 'string'),
                    new OA\Property(property: 'model_name', type: 'string'),
                    new OA\Property(property: 'imei', type: 'string', nullable: true),
                    new OA\Property(property: 'serial_no', type: 'string', nullable: true),
                    new OA\Property(property: 'variant', type: 'string', nullable: true),
                    new OA\Property(property: 'purchase_price', type: 'number'),
                    new OA\Property(property: 'mrp', type: 'number'),
                    new OA\Property(property: 'quantity', type: 'integer'),
                    new OA\Property(property: 'supplier_id', type: 'integer', nullable: true),
                    new OA\Property(property: 'status', type: 'string', nullable: true)
                ]
            )
        ),
        responses: [
            new OA\Response(response: 201, description: 'Product created successfully')
        ]
    )]
    public function store(Request $request)
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'brand_id' => 'nullable|exists:brands,id',
            'model_name' => 'required|string|max:255',
            'imei' => 'nullable|string|max:255',
            'serial_no' => 'nullable|string|max:255',
            'variant' => 'nullable|string|max:255',
            'purchase_price' => 'required|numeric|min:0',
            'mrp' => 'required|numeric|min:0',
            'quantity' => 'required|numeric|min:0',
            'supplier_id' => 'nullable|integer',
            'status' => 'nullable|string|in:in_stock,sold,damaged',
            'item_code' => 'nullable|string|max:50',
            'unit' => 'nullable|string|max:30',
            'hsn_code' => 'nullable|string|max:10',
            'gst_rate' => 'nullable|numeric|min:0',
            'sale_rate' => 'nullable|numeric|min:0',
            'purchase_rate' => 'nullable|numeric|min:0',
            'min_stock_alert' => 'nullable|numeric|min:0',
            'barcode' => 'nullable|string|max:100',
            'description' => 'nullable|string'
        ]);

        return $this->executeAction(function () use ($validated) {
            return $this->inventoryService->createProduct($validated);
        }, 'Product created successfully');
    }

    #[OA\Get(
        path: '/business/inventory/{id}',
        summary: 'Get Product',
        description: 'Get details of a specific product.',
        tags: ['Business - Inventory'],
        security: [['sanctum' => []]],
        parameters: [
            new OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))
        ],
        responses: [
            new OA\Response(response: 200, description: 'Successful operation')
        ]
    )]
    public function show(Product $inventory)
    {
        return $this->success($inventory->load('category'), 'Product retrieved successfully');
    }

    #[OA\Patch(
        path: '/business/inventory/{id}',
        summary: 'Update Product',
        description: 'Updates a specific product in the inventory.',
        tags: ['Business - Inventory'],
        security: [['sanctum' => []]],
        parameters: [
            new OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))
        ],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: 'category_id', type: 'integer'),
                    new OA\Property(property: 'brand', type: 'string'),
                    new OA\Property(property: 'model_name', type: 'string'),
                    new OA\Property(property: 'imei', type: 'string', nullable: true),
                    new OA\Property(property: 'purchase_price', type: 'number'),
                    new OA\Property(property: 'mrp', type: 'number'),
                    new OA\Property(property: 'quantity', type: 'integer')
                ]
            )
        ),
        responses: [
            new OA\Response(response: 200, description: 'Product updated successfully')
        ]
    )]
    public function update(Request $request, Product $inventory)
    {
        $validated = $request->validate([
            'category_id' => 'sometimes|exists:categories,id',
            'brand_id' => 'nullable|exists:brands,id',
            'model_name' => 'sometimes|string|max:255',
            'imei' => 'nullable|string|max:255',
            'serial_no' => 'nullable|string|max:255',
            'variant' => 'nullable|string|max:255',
            'purchase_price' => 'sometimes|numeric|min:0',
            'mrp' => 'sometimes|numeric|min:0',
            'quantity' => 'sometimes|numeric|min:0',
            'supplier_id' => 'nullable|integer',
            'status' => 'nullable|string|in:in_stock,sold,damaged',
            'item_code' => 'nullable|string|max:50',
            'unit' => 'nullable|string|max:30',
            'hsn_code' => 'nullable|string|max:10',
            'gst_rate' => 'nullable|numeric|min:0',
            'sale_rate' => 'nullable|numeric|min:0',
            'purchase_rate' => 'nullable|numeric|min:0',
            'min_stock_alert' => 'nullable|numeric|min:0',
            'barcode' => 'nullable|string|max:100',
            'description' => 'nullable|string'
        ]);

        return $this->executeAction(function () use ($inventory, $validated) {
            return $this->inventoryService->updateProduct($inventory, $validated);
        }, 'Product updated successfully');
    }

    #[OA\Delete(
        path: '/business/inventory/{id}',
        summary: 'Delete Product',
        description: 'Deletes a product from the inventory.',
        tags: ['Business - Inventory'],
        security: [['sanctum' => []]],
        parameters: [
            new OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))
        ],
        responses: [
            new OA\Response(response: 200, description: 'Product deleted successfully')
        ]
    )]
    public function destroy(Product $inventory)
    {
        return $this->executeAction(function () use ($inventory) {
            $this->inventoryService->deleteProduct($inventory);
            return null;
        }, 'Product deleted successfully');
    }

    #[OA\Post(
        path: '/business/inventory/direct-inward',
        summary: 'Direct Add Stock',
        description: 'Directly add stock to an existing product without a supplier bill.',
        tags: ['Business - Inventory'],
        security: [['sanctum' => []]],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['product_id', 'quantity'],
                properties: [
                    new OA\Property(property: 'product_id', type: 'integer'),
                    new OA\Property(property: 'quantity', type: 'integer'),
                    new OA\Property(property: 'purchase_price', type: 'number', nullable: true)
                ]
            )
        ),
        responses: [
            new OA\Response(response: 200, description: 'Stock added successfully')
        ]
    )]
    public function directInward(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|numeric|min:0.001',
            'purchase_price' => 'nullable|numeric|min:0',
            'mrp' => 'nullable|numeric|min:0',
            'batch_number' => 'nullable|string|max:255',
        ]);

        return $this->executeAction(function () use ($validated) {
            return $this->inventoryService->directInward($validated);
        }, 'Stock added successfully');
    }

    /**
     * Download CSV Template for Bulk Import
     */
    public function downloadTemplate()
    {
        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="products_import_template.csv"',
        ];

        $columns = ['Category Name', 'Brand Name', 'Model Name', 'Quantity', 'Purchase Price', 'MRP', 'Unit', 'HSN Code', 'GST Rate'];

        $callback = function () use ($columns) {
            $file = fopen('php://output', 'w');
            fputcsv($file, $columns);
            
            // Add a sample row
            fputcsv($file, ['Electronics', 'Samsung', 'Galaxy S23', '50', '50000', '65000', 'pcs', '8517', '18']);
            
            fclose($file);
        };

        return Response::stream($callback, 200, $headers);
    }

    /**
     * Bulk Import Products from CSV
     */
    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:csv,txt|max:5120', // 5MB max
        ]);

        $file = $request->file('file');
        $path = $file->getRealPath();

        $data = array_map('str_getcsv', file($path));
        $header = array_shift($data);

        if (!$header) {
            return $this->error("Invalid or empty CSV file", 422);
        }

        // Standardize header for easy mapping
        $headerMap = [];
        foreach ($header as $index => $colName) {
            $headerMap[trim(strtolower($colName))] = $index;
        }

        $requiredCols = ['category name', 'model name', 'quantity', 'purchase price', 'mrp'];
        foreach ($requiredCols as $req) {
            if (!isset($headerMap[$req])) {
                return $this->error("Missing required column: " . ucwords($req), 422);
            }
        }

        $businessId = app('current_business_id');
        $importedCount = 0;

        return $this->executeAction(function () use ($data, $headerMap, $businessId, &$importedCount) {
            foreach ($data as $row) {
                if (empty(array_filter($row))) {
                    continue; // Skip empty rows
                }

                // Safely get column value
                $getVal = function($col) use ($row, $headerMap) {
                    return isset($headerMap[$col]) && isset($row[$headerMap[$col]]) ? trim($row[$headerMap[$col]]) : null;
                };

                $catName = $getVal('category name');
                $brandName = $getVal('brand name');
                $modelName = $getVal('model name');
                $quantity = floatval($getVal('quantity'));
                $purchasePrice = floatval($getVal('purchase price'));
                $mrp = floatval($getVal('mrp'));
                $unit = $getVal('unit');
                $hsnCode = $getVal('hsn code');
                $gstRate = floatval($getVal('gst rate'));

                if (!$catName || !$modelName) {
                    continue; // Skip invalid rows
                }

                // Resolve Category
                $category = Category::firstOrCreate([
                    'business_id' => $businessId,
                    'name' => $catName
                ]);

                // Resolve Brand (Optional)
                $brandId = null;
                if ($brandName) {
                    $brand = Brand::firstOrCreate([
                        'business_id' => $businessId,
                        'name' => $brandName
                    ]);
                    $brandId = $brand->id;
                }

                $productData = [
                    'category_id' => $category->id,
                    'brand_id' => $brandId,
                    'model_name' => $modelName,
                    'quantity' => $quantity,
                    'purchase_price' => $purchasePrice,
                    'mrp' => $mrp,
                    'unit' => $unit ?: 'pcs',
                    'hsn_code' => $hsnCode,
                    'gst_rate' => $gstRate,
                    'status' => 'in_stock',
                ];

                $this->inventoryService->createProduct($productData);
                $importedCount++;
            }

            return ['imported' => $importedCount];
        }, 'Successfully imported products');
    }

    /**
     * Get products below their min_stock_alert threshold.
     */
    public function lowStockAlert(Request $request)
    {
        try {
            $products = Product::where('quantity', '<=', \DB::raw('COALESCE(min_stock_alert, 0)'))
                ->where('min_stock_alert', '>', 0)
                ->with('category')
                ->orderBy('quantity', 'asc')
                ->get();

            return $this->success($products, 'Low stock items retrieved');
        } catch (\Throwable $e) {
            return $this->error($e->getMessage(), 500);
        }
    }

    /**
     * Auto-generate a unique barcode for a product.
     */
    public function generateBarcode(Request $request)
    {
        try {
            $businessId = app('current_business_id');
            $prefix = str_pad($businessId, 3, '0', STR_PAD_LEFT);
            $lastProduct = Product::orderBy('id', 'desc')->first();
            $nextId = $lastProduct ? $lastProduct->id + 1 : 1;
            $barcode = $prefix . str_pad($nextId, 9, '0', STR_PAD_LEFT);

            return $this->success(['barcode' => $barcode], 'Barcode generated');
        } catch (\Throwable $e) {
            return $this->error($e->getMessage(), 500);
        }
    }
}
