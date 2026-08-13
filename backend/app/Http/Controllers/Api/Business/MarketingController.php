<?php

namespace App\Http\Controllers\Api\Business;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Customer;
use Illuminate\Support\Facades\Log;

class MarketingController extends Controller
{
    public function sendWhatsappCampaign(Request $request)
    {
        $businessId = app('current_business_id');
        $target = $request->input('target', 'all');
        $message = $request->input('message');

        if (empty($message)) {
            return response()->json(['message' => 'Message content is required'], 422);
        }

        $query = Customer::where('business_id', $businessId)->whereNotNull('phone');

        if ($target === 'with_dues') {
            // Find customers with outstanding dues
            $query->whereHas('ledgerEntries', function ($q) {
                // Not perfectly accurate without summing, but good enough for a basic filter
            })->withSum('ledgerEntries as total_debit', 'debit')
              ->withSum('ledgerEntries as total_credit', 'credit');
        }

        $customers = $query->get();

        if ($target === 'with_dues') {
            $customers = $customers->filter(function($customer) {
                return ($customer->total_debit - $customer->total_credit) > 0;
            });
        }

        // Simulate sending campaign in background
        // In a real app, you would dispatch a Job for each customer to send via WhatsApp API
        foreach ($customers as $customer) {
            Log::info("WhatsApp Campaign queued for {$customer->name} ({$customer->phone}): {$message}");
        }

        return response()->json([
            'message' => 'Campaign queued successfully',
            'customers_targeted' => $customers->count()
        ]);
    }
}
