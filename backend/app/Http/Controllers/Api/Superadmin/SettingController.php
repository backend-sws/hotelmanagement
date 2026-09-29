<?php

namespace App\Http\Controllers\Api\Superadmin;

use App\Http\Controllers\BaseController;
use App\Services\SettingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SettingController extends BaseController
{
    public function __construct(
        protected SettingService $settingService
    ) {
    }

    /**
     * Update settings.
     */
    public function update(Request $request): JsonResponse
    {
        $data = $request->validate([
            'settings' => 'required|array',
            'settings.*' => 'nullable|string',
        ]);

        $this->settingService->updateMany($data['settings']);

        return $this->success(
            $this->settingService->getAll(),
            'Settings updated successfully.'
        );
    }

    /**
     * Upload a setting file (e.g. logo).
     */
    public function uploadLogo(Request $request): JsonResponse
    {
        $request->validate([
            'logo' => 'required|image|mimes:jpeg,png,jpg,svg,webp|max:2048',
        ]);

        $url = $this->settingService->uploadFile('app_logo', $request->file('logo'));

        return $this->success(
            ['url' => $url],
            'Logo uploaded successfully.'
        );
    }

    /**
     * Upload a setting file (e.g. favicon).
     */
    public function uploadFavicon(Request $request): JsonResponse
    {
        $request->validate([
            'favicon' => 'required|image|mimes:jpeg,png,jpg,svg,webp,ico|max:1024',
        ]);

        $url = $this->settingService->uploadFile('app_favicon', $request->file('favicon'));

        return $this->success(
            ['url' => $url],
            'Favicon uploaded successfully.'
        );
    }

    /**
     * Test Meta WhatsApp Cloud API credentials & optionally send ping to a phone
     */
    public function testWhatsApp(Request $request): JsonResponse
    {
        $phoneId = $request->input('phone_number_id') 
            ?: (\App\Models\Setting::where('key', 'whatsapp_phone_number_id')->value('value') ?: config('whatsapp.phone_number_id'));
        $token = $request->input('access_token') 
            ?: (\App\Models\Setting::where('key', 'whatsapp_access_token')->value('value') ?: config('whatsapp.access_token'));
        $testPhone = $request->input('test_phone');

        if (empty($phoneId) || empty($token)) {
            return $this->error('Phone Number ID and Access Token are required to test connection.', 422);
        }

        try {
            // 1. Query Meta Graph API for Phone Number metadata
            $response = \Illuminate\Support\Facades\Http::withToken($token)
                ->timeout(10)
                ->get("https://graph.facebook.com/v21.0/{$phoneId}");

            if (!$response->successful()) {
                $error = $response->json()['error'] ?? [];
                $errorMsg = $error['message'] ?? 'Meta API responded with HTTP status ' . $response->status();
                return $this->error("Meta Cloud API Error: {$errorMsg}", 400, $error);
            }

            $metaData = $response->json();

            // 2. If test_phone provided, dispatch a live test message
            $messageStatus = null;
            if (!empty($testPhone)) {
                $cleanPhone = preg_replace('/[^0-9]/', '', $testPhone);
                $msgResponse = \Illuminate\Support\Facades\Http::withToken($token)
                    ->timeout(10)
                    ->post("https://graph.facebook.com/v21.0/{$phoneId}/messages", [
                        'messaging_product' => 'whatsapp',
                        'recipient_type'    => 'individual',
                        'to'                => $cleanPhone,
                        'type'              => 'text',
                        'text'              => [
                            'body' => "🚀 *Meta WhatsApp Webhook Test Successful!*\n\nThis confirms your Meta Cloud API connection is active and operational.",
                        ],
                    ]);

                if ($msgResponse->successful()) {
                    $messageStatus = 'Test message dispatched successfully to +' . $cleanPhone;
                } else {
                    $msgError = $msgResponse->json()['error']['message'] ?? 'Failed to send message';
                    $messageStatus = 'Warning: Meta connected, but test dispatch failed: ' . $msgError;
                }
            }

            return $this->success([
                'phone_number'    => $metaData['display_phone_number'] ?? $phoneId,
                'verified_name'   => $metaData['verified_name'] ?? 'Meta Verified',
                'quality_rating'  => $metaData['quality_rating'] ?? 'UNKNOWN',
                'id'              => $metaData['id'] ?? $phoneId,
                'dispatch_status' => $messageStatus,
            ], 'WhatsApp Cloud API connection verified successfully!');
        } catch (\Throwable $e) {
            return $this->error('Connection test exception: ' . $e->getMessage(), 500);
        }
    }
}
