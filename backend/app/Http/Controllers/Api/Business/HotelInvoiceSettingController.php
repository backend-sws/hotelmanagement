<?php

namespace App\Http\Controllers\Api\Business;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class HotelInvoiceSettingController extends Controller
{
    /**
     * Get the hotel invoice/billing settings for the business.
     */
    public function show(Request $request)
    {
        $businessId = app('current_business_id') ?? $request->user()->business_id;
        $business = \App\Models\Business::find($businessId);

        $settings = $business->settings ?? [];
        $hotelInvoiceSettings = $settings['hotel_invoice_settings'] ?? $this->getDefaultSettings();

        return response()->json([
            'status' => 'success',
            'data' => $hotelInvoiceSettings
        ]);
    }

    /**
     * Update the hotel invoice/billing settings.
     */
    public function update(Request $request)
    {
        $businessId = app('current_business_id') ?? $request->user()->business_id;
        $business = \App\Models\Business::find($businessId);

        $validator = Validator::make($request->all(), [
            'template' => 'nullable|string|in:default,modern,classic,premium,pos',
            'receipt_template' => 'nullable|string|in:voucher,pos',
            'signature_label' => 'nullable|string|max:100',
            'default_terms' => 'nullable|string',
            'check_in_time' => 'nullable|string|max:20',
            'check_out_time' => 'nullable|string|max:20',
            'default_bank_details' => 'nullable|string',
            'upi_id' => 'nullable|string|max:100',
            'fields' => 'nullable|array',
            'styles' => 'nullable|array',
            'kot_settings' => 'nullable|array',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'errors' => $validator->errors()], 422);
        }

        $settings = $business->settings ?? [];
        $current = $settings['hotel_invoice_settings'] ?? $this->getDefaultSettings();

        $updated = array_merge($current, [
            'template' => $request->input('template', $current['template']),
            'receipt_template' => $request->input('receipt_template', $current['receipt_template'] ?? 'voucher'),
            'signature_label' => $request->input('signature_label', $current['signature_label'] ?? 'Hotel Manager / Authorized Signatory'),
            'default_terms' => $request->input('default_terms', $current['default_terms'] ?? ''),
            'check_in_time' => $request->input('check_in_time', $current['check_in_time'] ?? '12:00 PM'),
            'check_out_time' => $request->input('check_out_time', $current['check_out_time'] ?? '11:00 AM'),
            'default_bank_details' => $request->input('default_bank_details', $current['default_bank_details'] ?? ''),
            'upi_id' => $request->input('upi_id', $current['upi_id'] ?? ''),
            'fields' => $request->input('fields', $current['fields']),
            'styles' => $request->input('styles', $current['styles']),
            'kot_settings' => $request->input('kot_settings', $current['kot_settings'] ?? [
                'show_restaurant_name' => true,
                'show_server_name' => true,
                'show_special_instructions' => true,
                'font_size' => 12,
            ]),
        ]);

        $settings['hotel_invoice_settings'] = $updated;
        $business->settings = $settings;
        $business->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Hotel billing settings updated successfully',
            'data' => $updated
        ]);
    }

    private function getDefaultSettings()
    {
        return [
            'template' => 'default',
            'receipt_template' => 'voucher',
            'signature_label' => 'Hotel Manager / Front Desk',
            'default_terms' => "1. Standard Check-In time is 12:00 PM & Check-Out time is 11:00 AM.\n2. Valid government photo ID is mandatory at the time of check-in.\n3. Goods once billed will not be refunded.\n4. Subject to local jurisdiction.",
            'check_in_time' => '12:00 PM',
            'check_out_time' => '11:00 AM',
            'default_bank_details' => '',
            'upi_id' => '',
            'fields' => [
                'show_logo' => true,
                'logo_size' => 50,
                'show_gstin' => true,
                'show_stay_dates' => true,
                'show_guest_id_proof' => true,
                'show_room_details' => true,
                'show_folio_breakdown' => true,
                'show_tax_breakdown' => true,
                'show_payment_breakdown' => true,
                'show_amount_in_words' => true,
                'show_qr_code' => true,
                'show_terms' => true,
                'show_signature' => true,
                'show_receiver_signature' => false,
            ],
            'styles' => [
                'primary_color' => '#1e293b',
                'secondary_color' => '#64748b',
                'border_color' => '#e2e8f0',
                'font_size' => 12,
                'font_family' => 'Inter',
                'line_spacing' => 1.4,
                'margin_top' => 10,
                'margin_bottom' => 10,
                'margin_left' => 10,
                'margin_right' => 10,
                'border_radius' => 6,
                'frame_style' => 'none',
            ],
            'kot_settings' => [
                'show_restaurant_name' => true,
                'show_server_name' => true,
                'show_special_instructions' => true,
                'font_size' => 12,
            ],
        ];
    }
}
