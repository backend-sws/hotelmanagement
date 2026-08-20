<?php

namespace App\Http\Controllers\Api\Business;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class InvoiceSettingController extends Controller
{
    /**
     * Get the current invoice settings for the business.
     */
    public function getSettings(Request $request)
    {
        $business = app('tenant');

        $settings = $business->settings ?? [];
        $invoiceSettings = $settings['invoice_settings'] ?? $this->getDefaultSettings();

        return response()->json([
            'status' => 'success',
            'data' => $invoiceSettings
        ]);
    }

    /**
     * Update the invoice settings for the business.
     */
    public function updateSettings(Request $request)
    {
        $business = app('tenant');

        $validator = Validator::make($request->all(), [
            'template' => 'nullable|string|in:default,modern,classic,premium,pos',
            'signature_label' => 'nullable|string|max:100',
            'custom_fields' => 'nullable|array',
            'fields' => 'nullable|array',
            'styles' => 'nullable|array',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'errors' => $validator->errors()], 422);
        }

        $settings = $business->settings ?? [];
        $currentInvoiceSettings = $settings['invoice_settings'] ?? $this->getDefaultSettings();

        $updatedInvoiceSettings = array_merge($currentInvoiceSettings, [
            'template' => $request->input('template', $currentInvoiceSettings['template']),
            'signature_label' => $request->input('signature_label', $currentInvoiceSettings['signature_label'] ?? 'Authorized Signatory'),
            'default_terms' => $request->input('default_terms', $currentInvoiceSettings['default_terms'] ?? ''),
            'default_bank_details' => $request->input('default_bank_details', $currentInvoiceSettings['default_bank_details'] ?? ''),
            'custom_fields' => $request->input('custom_fields', $currentInvoiceSettings['custom_fields'] ?? []),
            'fields' => $request->input('fields', $currentInvoiceSettings['fields']),
            'styles' => $request->input('styles', $currentInvoiceSettings['styles']),
        ]);

        $settings['invoice_settings'] = $updatedInvoiceSettings;
        $business->settings = $settings;
        $business->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Invoice settings updated successfully.',
            'data' => $updatedInvoiceSettings
        ]);
    }

    /**
     * Upload custom header or footer image for invoices.
     */
    public function uploadImage(Request $request, $type)
    {
        if (!in_array($type, ['header', 'footer', 'signature', 'background'])) {
            return response()->json(['status' => 'error', 'message' => 'Invalid image type.'], 400);
        }

        $business = app('tenant');

        $validator = Validator::make($request->all(), [
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'errors' => $validator->errors()], 422);
        }

        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $filename = 'business_' . $business->id . '/invoice_' . $type . '_' . time() . '.' . $file->getClientOriginalExtension();
            
            // Store file
            $path = $file->storeAs('uploads/invoice_images', $filename, 's3');
            
            if (!$path) {
                return response()->json(['status' => 'error', 'message' => 'Failed to upload image to storage.'], 500);
            }
            
            // Generate public URL
            $url = Storage::disk('s3')->url($path);

            // Update settings
            $settings = $business->settings ?? [];
            $invoiceSettings = $settings['invoice_settings'] ?? $this->getDefaultSettings();
            
            // Optional: delete old image if exists
            $oldImageKey = $type . '_image';
            if (!empty($invoiceSettings[$oldImageKey])) {
                $this->deleteImageFromDisk($invoiceSettings[$oldImageKey]);
            }

            $invoiceSettings[$oldImageKey] = $url;
            $settings['invoice_settings'] = $invoiceSettings;
            $business->settings = $settings;
            $business->save();

            return response()->json([
                'status' => 'success',
                'message' => ucfirst($type) . ' image uploaded successfully.',
                'url' => $url,
                'data' => $invoiceSettings
            ]);
        }

        return response()->json(['status' => 'error', 'message' => 'File not found.'], 400);
    }

    /**
     * Remove custom header or footer image.
     */
    public function deleteImage(Request $request, $type)
    {
        if (!in_array($type, ['header', 'footer', 'signature', 'background'])) {
            return response()->json(['status' => 'error', 'message' => 'Invalid image type.'], 400);
        }

        $business = app('tenant');

        $settings = $business->settings ?? [];
        $invoiceSettings = $settings['invoice_settings'] ?? $this->getDefaultSettings();
        
        $imageKey = $type . '_image';
        
        if (!empty($invoiceSettings[$imageKey])) {
            $this->deleteImageFromDisk($invoiceSettings[$imageKey]);
            
            $invoiceSettings[$imageKey] = null;
            $settings['invoice_settings'] = $invoiceSettings;
            $business->settings = $settings;
            $business->save();
        }

        return response()->json([
            'status' => 'success',
            'message' => ucfirst($type) . ' image removed successfully.',
            'data' => $invoiceSettings
        ]);
    }

    /**
     * Default Invoice Settings
     */
    private function getDefaultSettings()
    {
        return [
            'template' => 'default',
            'header_image' => null,
            'footer_image' => null,
            'signature_image' => null,
            'background_image' => null,
            'signature_label' => 'Authorized Signatory',
            'default_terms' => '',
            'default_bank_details' => '',
            'custom_fields' => [],
            'fields' => [
                'show_logo' => true,
                'show_hsn' => true,
                'show_bank_details' => true,
                'show_terms' => true,
                'show_discount' => true,
                'show_vehicle_info' => true,
                'show_amount_in_words' => true,
                'show_gstin' => true,
                'show_place_of_supply' => true,
                'show_due_date' => true,
                'show_invoice_type' => true,
                'show_signature' => true,
                'show_customer_phone' => true,
                'show_tax_amount' => true,
                'show_tax_breakdown' => true,
                'show_rate' => true,
                'show_qty' => true,
                'show_reference_number' => true,
                'show_watermark' => true,
                'show_receiver_signature' => true,
            ],
            'styles' => [
                'primary_color' => '#1a1a1a',
                'secondary_color' => '#64748b',
                'border_color' => '#e2e8f0',
                'font_size' => 12,
                'margin_top' => 10,
                'margin_bottom' => 10,
                'margin_left' => 10,
                'margin_right' => 10,
                'border_radius' => 6,
                'frame_style' => 'solid',
            ]
        ];
    }

    private function deleteImageFromDisk($url)
    {
        if (empty($url)) return;
        
        if (str_starts_with($url, config('app.url'))) {
            $path = str_replace(config('app.url') . '/storage/', '', $url);
            Storage::disk('public')->delete($path);
        } else {
            $s3Url = config('filesystems.disks.s3.url');
            if ($s3Url && str_starts_with($url, rtrim($s3Url, '/') . '/')) {
                $path = str_replace(rtrim($s3Url, '/') . '/', '', $url);
                Storage::disk('s3')->delete($path);
            }
        }
    }
}
