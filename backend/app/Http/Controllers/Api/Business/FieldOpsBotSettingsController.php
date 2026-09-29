<?php

namespace App\Http\Controllers\Api\Business;

use App\Http\Controllers\BaseController;
use App\Models\Business;
use App\Models\BusinessLocation;
use App\Models\BusinessWallet;
use App\Models\BusinessWorkSetting;
use App\Models\Setting;
use App\Services\WhatsApp\WhatsAppService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FieldOpsBotSettingsController extends BaseController
{
    protected WhatsAppService $whatsApp;

    public function __construct(WhatsAppService $whatsApp)
    {
        $this->whatsApp = $whatsApp;
    }

    protected function getBusinessId(Request $request): int
    {
        if (app()->bound('current_business_id')) {
            return (int)app('current_business_id');
        }

        $headerId = $request->header('X-Tenant-ID');
        if ($headerId && is_numeric($headerId)) {
            return (int)$headerId;
        }

        $userBizId = $request->user()?->businesses()->first()?->id;
        if ($userBizId) {
            return (int)$userBizId;
        }

        return (int)(Business::value('id') ?? 1);
    }

    /**
     * Get the FieldOps & WhatsApp Bot configuration for this tenant.
     */
    public function index(Request $request): JsonResponse
    {
        $businessId = $this->getBusinessId($request);
        $business = Business::find($businessId);

        if (!$business) {
            return response()->json(['message' => 'Business not found'], 404);
        }

        $customBotSettings = $business->settings['fieldops_bot'] ?? [];

        // Primary base location
        $location = BusinessLocation::where('business_id', $businessId)->first();
        // Shift settings
        $workSetting = BusinessWorkSetting::where('business_id', $businessId)->first();

        $settings = [
            'bot_enabled'            => (bool)($customBotSettings['bot_enabled'] ?? true),
            'require_selfie'         => (bool)($customBotSettings['require_selfie'] ?? true),
            'ai_vision_enabled'      => (bool)($customBotSettings['ai_vision_enabled'] ?? true),
            'require_client_otp'     => (bool)($customBotSettings['require_client_otp'] ?? true),
            'auto_dispatch_whatsapp' => (bool)($customBotSettings['auto_dispatch_whatsapp'] ?? true),
            'auto_tada_tracking'     => (bool)($customBotSettings['auto_tada_tracking'] ?? true),
            'two_wheeler_rate'       => (float)($customBotSettings['two_wheeler_rate'] ?? 3.50),
            'four_wheeler_rate'      => (float)($customBotSettings['four_wheeler_rate'] ?? 8.00),
            'public_transit_rate'    => (float)($customBotSettings['public_transit_rate'] ?? 2.50),
            'watermark_branding'     => (string)($customBotSettings['watermark_branding'] ?? $business->name),
            'geofence_radius'        => (int)($location?->radius_meters ?? $customBotSettings['geofence_radius'] ?? 100),
            'site_lat'               => (float)($location?->latitude ?? $customBotSettings['site_lat'] ?? 19.0760),
            'site_lng'               => (float)($location?->longitude ?? $customBotSettings['site_lng'] ?? 72.8777),
            'site_name'              => (string)($location?->name ?? $customBotSettings['site_name'] ?? 'Base HQ / Hotel'),
            'shift_start_time'       => substr((string)($workSetting?->work_start_time ?? $customBotSettings['shift_start_time'] ?? '09:30'), 0, 5),
            'shift_end_time'         => substr((string)($workSetting?->work_end_time ?? $customBotSettings['shift_end_time'] ?? '18:30'), 0, 5),
            'late_grace_minutes'     => (int)($workSetting?->late_mark_grace_minutes ?? $customBotSettings['late_grace_minutes'] ?? 15),
        ];

        // Meta connection status & Bot link
        $metaPhoneId = config('whatsapp.phone_number_id') ?: Setting::where('key', 'whatsapp_phone_number_id')->value('value');
        $displayPhone = Setting::where('key', 'whatsapp_display_phone')->value('value')
            ?: Setting::where('key', 'whatsapp_phone_number')->value('value')
            ?: '';
        $geminiKey = config('services.gemini.api_key') ?: Setting::where('key', 'gemini_api_key')->value('value');
        $walletBalance = BusinessWallet::where('business_id', $businessId)->value('balance') ?? 0;

        $cleanPhone = preg_replace('/[^0-9]/', '', (string)$displayPhone);
        $waLink = !empty($cleanPhone) ? "https://wa.me/{$cleanPhone}?text=Hi" : 'https://wa.me/?text=Hi';

        $botInfo = [
            'display_phone'        => $displayPhone,
            'wa_link'              => $waLink,
            'phone_number_id'      => $metaPhoneId ? (substr($metaPhoneId, 0, 4) . '****' . substr($metaPhoneId, -4)) : 'Not configured (Simulated)',
            'is_meta_configured'   => !empty($metaPhoneId),
            'is_gemini_configured' => !empty($geminiKey),
            'wallet_balance'       => (float)$walletBalance,
            'status'               => $settings['bot_enabled'] ? 'active' : 'paused',
        ];

        $commandDirectory = [
            [
                'command'      => 'Punch In',
                'keywords'     => '1, in, punch in',
                'description'  => 'Mark shift start with live GPS location & selfie verification.',
                'description_hi' => 'लाइव जीपीएस और सेल्फी के साथ हाज़िरी शुरू करें।',
                'category'     => 'Attendance',
            ],
            [
                'command'      => 'Punch Out',
                'keywords'     => 'punch out, out, bye',
                'description'  => 'End shift and auto-calculate total daily travel allowance distance.',
                'description_hi' => 'शिफ्ट समाप्त करें और आज का टीए/डीए माइलेज क्लेम जनरेट करें।',
                'category'     => 'Attendance',
            ],
            [
                'command'      => 'My Tasks',
                'keywords'     => 'tasks, kaam, 2',
                'description'  => 'List all assigned field maintenance & guest service jobs.',
                'description_hi' => 'आज के सभी निर्धारित कार्य और साइट देखें।',
                'category'     => 'Tasks',
            ],
            [
                'command'      => 'Start Task',
                'keywords'     => 'start <task_id>',
                'description'  => 'Notify client that technician has departed & start journey tracking.',
                'description_hi' => 'यात्रा शुरू करें और ग्राहक को अलर्ट भेजें।',
                'category'     => 'Tasks',
            ],
            [
                'command'      => 'Reached Site',
                'keywords'     => 'reached <task_id>',
                'description'  => 'Verify geofence boundary upon arriving at customer site.',
                'description_hi' => 'साइट पर पहुँचने की पुष्टि और जियोफेंस जांच।',
                'category'     => 'Tasks',
            ],
            [
                'command'      => 'Complete Task',
                'keywords'     => 'done <id>, complete <id>',
                'description'  => 'Upload work proof photo for watermarking & prompt for client OTP.',
                'description_hi' => 'काम की फोटो अपलोड करें और ग्राहक का 4-अंकीय ओटीपी दर्ज करें।',
                'category'     => 'Tasks',
            ],
            [
                'command'      => 'Check Balance',
                'keywords'     => 'balance, leave, chhutti',
                'description'  => 'Instant check for remaining casual, medical, or earned leaves.',
                'description_hi' => 'बची हुई छुट्टियों (Leave Balance) की जानकारी लें।',
                'category'     => 'HR & Leaves',
            ],
            [
                'command'      => 'Apply Leave',
                'keywords'     => 'apply leave',
                'description'  => 'Submit leave request directly to manager via WhatsApp.',
                'description_hi' => 'व्हाट्सएप से सीधे छुट्टी के लिए आवेदन करें।',
                'category'     => 'HR & Leaves',
            ],
            [
                'command'      => 'Salary Slip',
                'keywords'     => 'payslip, salary',
                'description'  => 'Get a downloadable PDF link of the latest approved payslip.',
                'description_hi' => 'नवीनतम वेतन पर्ची (Payslip PDF) प्राप्त करें।',
                'category'     => 'HR & Leaves',
            ],
        ];

        return response()->json([
            'settings'          => $settings,
            'bot_info'          => $botInfo,
            'command_directory' => $commandDirectory,
        ]);
    }

    /**
     * Update the FieldOps & WhatsApp Bot configuration.
     */
    public function update(Request $request): JsonResponse
    {
        $businessId = $this->getBusinessId($request);
        $business = Business::findOrFail($businessId);

        $validated = $request->validate([
            'bot_enabled'            => 'required|boolean',
            'require_selfie'         => 'required|boolean',
            'ai_vision_enabled'      => 'required|boolean',
            'require_client_otp'     => 'required|boolean',
            'auto_dispatch_whatsapp' => 'required|boolean',
            'auto_tada_tracking'     => 'required|boolean',
            'two_wheeler_rate'       => 'required|numeric|min:0|max:100',
            'four_wheeler_rate'      => 'required|numeric|min:0|max:100',
            'public_transit_rate'    => 'required|numeric|min:0|max:100',
            'watermark_branding'     => 'required|string|max:100',
            'geofence_radius'        => 'required|integer|min:20|max:5000',
            'site_lat'               => 'required|numeric|between:-90,90',
            'site_lng'               => 'required|numeric|between:-180,180',
            'site_name'              => 'nullable|string|max:150',
            'shift_start_time'       => 'nullable|string|max:10',
            'shift_end_time'         => 'nullable|string|max:10',
            'late_grace_minutes'     => 'nullable|integer|min:0|max:120',
        ]);

        // Save in business settings
        $existingSettings = $business->settings ?? [];
        $existingSettings['fieldops_bot'] = $validated;
        $business->settings = $existingSettings;
        $business->save();

        // Sync or create primary BusinessLocation
        $location = BusinessLocation::where('business_id', $businessId)->first();
        if ($location) {
            $location->latitude = $validated['site_lat'];
            $location->longitude = $validated['site_lng'];
            $location->radius_meters = $validated['geofence_radius'];
            if (!empty($validated['site_name'])) {
                $location->name = $validated['site_name'];
            }
            $location->save();
        } else {
            BusinessLocation::create([
                'business_id'   => $businessId,
                'name'          => $validated['site_name'] ?: 'Base HQ',
                'latitude'      => $validated['site_lat'],
                'longitude'     => $validated['site_lng'],
                'radius_meters' => $validated['geofence_radius'],
                'is_default'    => true,
            ]);
        }

        // Sync shift timings in BusinessWorkSetting
        if (!empty($validated['shift_start_time']) && !empty($validated['shift_end_time'])) {
            BusinessWorkSetting::updateOrCreate(
                ['business_id' => $businessId],
                [
                    'work_start_time'         => $validated['shift_start_time'] . ':00',
                    'work_end_time'           => $validated['shift_end_time'] . ':00',
                    'late_mark_grace_minutes' => $validated['late_grace_minutes'] ?? 15,
                ]
            );
        }

        return response()->json([
            'message'  => 'FieldOps WhatsApp Bot automation settings updated successfully.',
            'settings' => $validated,
        ]);
    }

    /**
     * Send a test WhatsApp message to verify bot connection.
     */
    public function testMessage(Request $request): JsonResponse
    {
        $request->validate([
            'phone' => 'required|string|min:10',
        ]);

        $businessId = $this->getBusinessId($request);
        $business = Business::find($businessId);
        $bizName = $business?->name ?? 'Hotel / Enterprise ERP';

        $phone = preg_replace('/[^0-9]/', '', $request->phone);
        if (strlen($phone) === 10) {
            $phone = '91' . $phone;
        }

        $testText = "⚡ *WhatsApp FieldOps Bot Test*\n\n"
            . "नमस्ते! यह *{$bizName}* के ऑटोमेशन सिस्टम से टेस्ट मैसेज है।\n\n"
            . "✅ Bot Status: Active\n"
            . "📍 Geofence & GPS: Enabled\n"
            . "📸 AI Watermark & OTP: Ready\n"
            . "🚗 TA/DA Engine: Active\n\n"
            . "मेनू देखने के लिए *Menu* लिखकर भेजें।";

        try {
            $res = $this->whatsApp->sendText($phone, $testText);
            return response()->json([
                'message'  => 'Test message dispatched successfully to +' . $phone,
                'response' => $res,
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'Failed to send WhatsApp message: ' . $e->getMessage(),
            ], 400);
        }
    }
}
