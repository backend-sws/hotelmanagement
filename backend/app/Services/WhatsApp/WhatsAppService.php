<?php

namespace App\Services\WhatsApp;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Exception;

use App\Models\Setting;

class WhatsAppService
{
    protected string $accessToken;
    protected string $phoneNumberId;
    protected string $apiVersion;
    protected string $apiUrl;

    public function __construct()
    {
        $this->accessToken   = config('whatsapp.access_token') ?: (Setting::where('key', 'whatsapp_access_token')->value('value') ?? '');
        $this->phoneNumberId = config('whatsapp.phone_number_id') ?: (Setting::where('key', 'whatsapp_phone_number_id')->value('value') ?? '');
        $this->apiVersion    = config('whatsapp.api_version') ?? 'v21.0';
        $this->apiUrl        = config('whatsapp.api_url') ?? 'https://graph.facebook.com';
    }

    /**
     * Check if live WhatsApp Cloud API credentials are configured
     */
    public function isConfigured(): bool
    {
        return !empty($this->accessToken) && !empty($this->phoneNumberId);
    }

    /**
     * Send plain text message to a phone number
     */
    public function sendText(string $to, string $message): array
    {
        // Normalize phone number (digits only, e.g. 919876543210)
        $cleanTo = preg_replace('/[^0-9]/', '', $to);

        $payload = [
            'messaging_product' => 'whatsapp',
            'recipient_type'    => 'individual',
            'to'                => $cleanTo,
            'type'              => 'text',
            'text'              => [
                'preview_url' => false,
                'body'        => $message,
            ],
        ];

        return $this->dispatchToMeta($payload);
    }

    /**
     * Send interactive quick reply buttons (up to 3 buttons supported by Meta)
     */
    public function sendButtons(string $to, string $bodyText, array $buttons, ?string $headerText = null): array
    {
        $cleanTo = preg_replace('/[^0-9]/', '', $to);

        $formattedButtons = [];
        foreach (array_slice($buttons, 0, 3) as $btn) {
            $formattedButtons[] = [
                'type'  => 'reply',
                'reply' => [
                    'id'    => $btn['id'] ?? ('btn_' . uniqid()),
                    'title' => substr($btn['title'], 0, 20), // Meta max 20 chars
                ],
            ];
        }

        $interactive = [
            'type'   => 'button',
            'body'   => ['text' => $bodyText],
            'action' => ['buttons' => $formattedButtons],
        ];

        if ($headerText) {
            $interactive['header'] = [
                'type' => 'text',
                'text' => $headerText,
            ];
        }

        $payload = [
            'messaging_product' => 'whatsapp',
            'recipient_type'    => 'individual',
            'to'                => $cleanTo,
            'type'              => 'interactive',
            'interactive'       => $interactive,
        ];

        return $this->dispatchToMeta($payload);
    }

    /**
     * Send pre-approved Meta message template (Utility, Authentication, or Marketing)
     */
    public function sendTemplate(string $to, string $templateName, string $languageCode = 'en_US', array $components = []): array
    {
        $cleanTo = preg_replace('/[^0-9]/', '', $to);

        $payload = [
            'messaging_product' => 'whatsapp',
            'recipient_type'    => 'individual',
            'to'                => $cleanTo,
            'type'              => 'template',
            'template'          => [
                'name'       => $templateName,
                'language'   => ['code' => $languageCode],
                'components' => $components,
            ],
        ];

        return $this->dispatchToMeta($payload);
    }

    /**
     * Download media (photo/document) from Meta Cloud API
     */
    public function downloadMedia(string $mediaId, string $subfolder = 'attendance_selfies'): ?string
    {
        if (!$this->isConfigured()) {
            Log::info("WhatsApp [MOCK]: Media download simulated for ID: {$mediaId}");
            $filename = "{$subfolder}/" . uniqid('sim_') . ".jpg";
            if (function_exists('imagecreatetruecolor')) {
                $im = imagecreatetruecolor(640, 480);
                $bg = imagecolorallocate($im, 30, 41, 59);
                imagefill($im, 0, 0, $bg);
                $white = imagecolorallocate($im, 255, 255, 255);
                imagestring($im, 5, 20, 200, "FIELD OPS CAMERA CAPTURE (MOCK)", $white);
                ob_start();
                imagejpeg($im, null, 80);
                $bytes = ob_get_clean();
                imagedestroy($im);
                Storage::disk('public')->put($filename, $bytes);
            } else {
                Storage::disk('public')->put($filename, 'SIMULATED_IMAGE_DATA');
            }
            return Storage::disk('public')->url($filename);
        }

        try {
            // 1. Get media URL
            $urlResponse = Http::withToken($this->accessToken)
                ->get("{$this->apiUrl}/{$this->apiVersion}/{$mediaId}");

            if ($urlResponse->failed()) {
                Log::error("Failed to retrieve WhatsApp media URL", ['response' => $urlResponse->json()]);
                return null;
            }

            $downloadUrl = $urlResponse->json('url');
            $mimeType = $urlResponse->json('mime_type') ?? 'image/jpeg';
            $ext = str_contains($mimeType, 'png') ? 'png' : 'jpg';

            // 2. Download binary bytes
            $mediaBinary = Http::withToken($this->accessToken)->get($downloadUrl)->body();

            // 3. Save to storage
            $filename = "{$subfolder}/" . uniqid('wa_') . ".{$ext}";
            Storage::disk('public')->put($filename, $mediaBinary);

            return Storage::disk('public')->url($filename);

        } catch (Exception $e) {
            Log::error("WhatsApp Media Download Exception: " . $e->getMessage());
            return null;
        }
    }

    /**
     * Internal HTTP dispatcher with graceful Mock fallback for development
     */
    protected function dispatchToMeta(array $payload): array
    {
        // Sandbox/Mock Mode if API token not yet provided in .env
        if (!$this->isConfigured()) {
            Log::info("WhatsApp [SANDBOX/MOCK DISPATCH]:", $payload);
            return [
                'mock'       => true,
                'messages'   => [['id' => 'wamid.MOCK_' . strtoupper(uniqid())]],
                'status'     => 'simulated_success',
            ];
        }

        try {
            $endpoint = "{$this->apiUrl}/{$this->apiVersion}/{$this->phoneNumberId}/messages";
            $response = Http::withToken($this->accessToken)
                ->withHeaders(['Content-Type' => 'application/json'])
                ->post($endpoint, $payload);

            if ($response->failed()) {
                Log::error("WhatsApp Meta API Error:", [
                    'status'   => $response->status(),
                    'response' => $response->json(),
                    'payload'  => $payload,
                ]);
                throw new Exception("Meta WhatsApp API Error: " . ($response->json('error.message') ?? $response->body()));
            }

            return $response->json();

        } catch (Exception $e) {
            Log::error("WhatsApp Dispatch Exception: " . $e->getMessage());
            throw $e;
        }
    }
}
