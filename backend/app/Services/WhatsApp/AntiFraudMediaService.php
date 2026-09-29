<?php

namespace App\Services\WhatsApp;

class AntiFraudMediaService
{
    protected WhatsAppService $whatsAppService;

    public function __construct(WhatsAppService $whatsAppService)
    {
        $this->whatsAppService = $whatsAppService;
    }

    /**
     * Inspect image payload for anti-fraud rules (forwarded detection, freshness)
     */
    public function inspectPhotoPayload(array $message): array
    {
        // 1. Forwarded Detection
        $isForwarded = !empty($message['context']['forwarded']);

        if ($isForwarded) {
            return [
                'is_valid' => false,
                'reason'   => 'FORWARDED_PHOTO',
                'error_message_hi' => "❌ यह फोटो फॉरवर्ड की गई है। कृपया अभी लाइव कैमरे से खींचकर भेजें।",
            ];
        }

        // 2. Freshness Check (WhatsApp timestamp vs current time, max 3 minutes skew)
        $msgTimestamp = (int)($message['timestamp'] ?? time());
        $now = time();
        if (($now - $msgTimestamp) > 180) {
            return [
                'is_valid' => false,
                'reason'   => 'EXPIRED_TIMESTAMP',
                'error_message_hi' => "❌ यह फोटो पुरानी है। कृपया अभी ताज़ा लाइव सेल्फी लें।",
            ];
        }

        $mediaId = $message['image']['id'] ?? null;

        return [
            'is_valid' => true,
            'media_id' => $mediaId,
        ];
    }

    /**
     * Download and save verified selfie
     */
    public function saveSelfie(string $mediaId): ?string
    {
        return $this->whatsAppService->downloadMedia($mediaId, 'attendance_selfies');
    }

    /**
     * Download and save verified task work photo
     */
    public function saveTaskPhoto(string $mediaId): ?string
    {
        return $this->whatsAppService->downloadMedia($mediaId, 'task_proofs_raw');
    }
}
