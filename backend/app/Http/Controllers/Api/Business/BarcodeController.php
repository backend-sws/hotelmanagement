<?php

namespace App\Http\Controllers\Api\Business;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class BarcodeController extends Controller
{
    /**
     * POST /barcode/generate/{productId}
     * Generate a unique barcode for a product and return base64 image.
     *
     * Uses: picqer/php-barcode-generator
     * Install: composer require picqer/php-barcode-generator
     */
    public function generate(Request $request, int $productId)
    {
        $businessId = app('current_business_id') ?? $request->user()->business_id;
        $product    = Product::where('business_id', $businessId)->findOrFail($productId);

        // Generate barcode value if not already set
        $barcodeValue = $product->barcode;
        if (!$barcodeValue) {
            // Use item_code if available, otherwise generate unique code
            $barcodeValue = $product->item_code
                ?? str_pad($businessId, 4, '0', STR_PAD_LEFT) . str_pad($productId, 8, '0', STR_PAD_LEFT);

            $product->update(['barcode' => $barcodeValue]);
        }

        // Check if picqer/php-barcode-generator is installed
        if (!class_exists(\Picqer\Barcode\BarcodeGeneratorPNG::class)) {
            // Return barcode value only (frontend can render using a JS barcode library like JsBarcode)
            return response()->json([
                'status'        => 'success',
                'barcode_value' => $barcodeValue,
                'barcode_image' => null,
                'message'       => 'Barcode value generated. Install picqer/php-barcode-generator for server-side image generation.',
            ]);
        }

        try {
            $generator  = new \Picqer\Barcode\BarcodeGeneratorPNG();
            $barcodeImg = $generator->getBarcode($barcodeValue, $generator::TYPE_CODE_128);
            $base64     = 'data:image/png;base64,' . base64_encode($barcodeImg);

            return response()->json([
                'status'        => 'success',
                'barcode_value' => $barcodeValue,
                'barcode_image' => $base64,
                'product'       => [
                    'id'        => $product->id,
                    'name'      => $product->name,
                    'item_code' => $product->item_code,
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status'        => 'success',
                'barcode_value' => $barcodeValue,
                'barcode_image' => null,
                'message'       => 'Barcode value saved. Image generation failed: ' . $e->getMessage(),
            ]);
        }
    }

    /**
     * POST /barcode/scan
     * Lookup product by barcode value.
     * Used by invoice form for quick scan-to-add.
     */
    public function scan(Request $request)
    {
        $businessId = app('current_business_id') ?? $request->user()->business_id;

        $request->validate([
            'barcode' => 'required|string|max:100',
        ]);

        $barcodeValue = trim($request->input('barcode'));

        // Search by barcode field first, then item_code, then model_name
        $product = Product::where('business_id', $businessId)
            ->whereNull('deleted_at')
            ->where(function ($q) use ($barcodeValue) {
                $q->where('barcode', $barcodeValue)
                  ->orWhere('item_code', $barcodeValue)
                  ->orWhere('imei', $barcodeValue)
                  ->orWhere('serial_no', $barcodeValue);
            })
            ->first();

        if (!$product) {
            return response()->json([
                'status'  => 'error',
                'message' => "No product found for barcode: {$barcodeValue}",
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data'   => [
                'id'            => $product->id,
                'name'          => $product->name,
                'model_name'    => $product->model_name,
                'item_code'     => $product->item_code,
                'barcode'       => $product->barcode,
                'unit'          => $product->unit,
                'gst_rate'      => (float) ($product->gst_rate ?? 0),
                'hsn_code'      => $product->hsn_code,
                'sale_rate'     => (float) ($product->sale_rate ?? $product->mrp ?? 0),
                'purchase_rate' => (float) ($product->purchase_rate ?? $product->purchase_price ?? 0),
                'current_stock' => (float) $product->quantity,
                'is_available'  => $product->quantity > 0,
            ],
        ]);
    }
}
