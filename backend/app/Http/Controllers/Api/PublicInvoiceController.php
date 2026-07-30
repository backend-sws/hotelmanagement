<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Sale;
use Illuminate\Http\Request;

class PublicInvoiceController extends Controller
{
    public function show($uuid)
    {
        $sale = Sale::where('uuid', $uuid)
            ->with(['customer', 'user', 'items.product', 'payments', 'emiDetail', 'business'])
            ->firstOrFail();
            
        $business = $sale->business;
        $settings = $business->settings['invoice_settings'] ?? [];
        
        return response()->json([
            'sale' => $sale,
            'business' => $business,
            'settings' => $settings
        ]);
    }
}
