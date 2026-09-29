<?php

namespace App\Services\WhatsApp;

use App\Models\FieldTask;
use App\Models\TaskProof;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;
use Exception;

class TaskDispatchService
{
    protected WhatsAppService $whatsApp;
    protected WhatsAppWalletService $wallet;
    protected WatermarkService $watermark;

    public function __construct(
        WhatsAppService $whatsApp,
        WhatsAppWalletService $wallet,
        WatermarkService $watermark
    ) {
        $this->whatsApp  = $whatsApp;
        $this->wallet    = $wallet;
        $this->watermark = $watermark;
    }

    /**
     * Dispatch a newly created field task to the assigned technician via WhatsApp
     */
    public function dispatchTask(FieldTask $task): bool
    {
        $staff = $task->staff;
        if (!$staff || empty($staff->phone)) {
            Log::warning("Cannot dispatch task #{$task->id}: Staff phone missing");
            return false;
        }

        $business = $task->business;
        $siteName = $task->site_name;
        $dueStr = $task->due_at ? Carbon::parse($task->due_at)->format('d M, h:i A') : 'आज ही';
        
        $mapUrl = ($task->site_lat && $task->site_lng)
            ? "https://maps.google.com/?q={$task->site_lat},{$task->site_lng}"
            : "No GPS coordinates";

        $body = "📋 *नया कार्य सौंपा गया!*\n\n"
              . "🔹 कार्य: *{$task->title}*\n"
              . "🏢 साइट: *{$siteName}*\n"
              . ($task->client_name ? "👤 ग्राहक: {$task->client_name} ({$task->client_phone})\n" : "")
              . ($task->site_address ? "🏠 पता: {$task->site_address}\n" : "")
              . "⏰ समय: {$dueStr}\n"
              . "📍 लोकेशन: {$mapUrl}\n"
              . ($task->description ? "\n📝 विवरण: {$task->description}\n" : "");

        $buttons = [
            ['id' => "btn_start_task_{$task->id}",   'title' => '▶️ शुरू करें'],
            ['id' => "btn_reached_task_{$task->id}", 'title' => '📍 पहुंचे'],
            ['id' => "btn_proof_task_{$task->id}",   'title' => '📸 फोटो भेजें'],
        ];

        try {
            $this->whatsApp->sendButtons(
                $staff->phone,
                $body,
                $buttons,
                "{$business->name} - फील्ड टास्क"
            );

            // Deduct ₹0.75 Utility Template charge
            $this->wallet->debit(
                $task->business_id,
                'utility',
                "Field Task Dispatch #{$task->id} to {$staff->name}",
                ['task_id' => $task->id, 'staff_id' => $staff->id, 'phone' => $staff->phone]
            );

            return true;
        } catch (Exception $e) {
            Log::error("Failed to dispatch WhatsApp task: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Send 4-digit verification OTP to the customer's WhatsApp
     */
    public function sendClientOtp(FieldTask $task): bool
    {
        if (empty($task->client_phone)) {
            return false;
        }

        $otp = (string)mt_rand(1000, 9999);
        $task->client_otp = $otp;
        $task->status = 'awaiting_otp';
        $task->save();

        $business = $task->business;
        $clientMsg = "🏢 नमस्ते {$task->client_name}! 🙏\n\n"
                   . "{$business->name} की ओर से आपके कार्य *'{$task->title}'* का काम पूरा होने के लिए संतुष्टि OTP है:\n\n"
                   . "🔢 *{$otp}*\n\n"
                   . "यह OTP केवल कार्य पूरी तरह समाप्त होने के बाद ही फील्ड टेक्नीशियन को बताएं। धन्यवाद!";

        try {
            $this->whatsApp->sendText($task->client_phone, $clientMsg);

            // Deduct ₹0.40 Authentication Template rate
            $this->wallet->debit(
                $task->business_id,
                'authentication',
                "Task #{$task->id} Completion Client OTP to {$task->client_phone}",
                ['task_id' => $task->id, 'client_phone' => $task->client_phone, 'otp' => $otp]
            );

            return true;
        } catch (Exception $e) {
            Log::error("Failed to send Client WhatsApp OTP: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Verify client OTP and mark task completed
     */
    public function verifyClientOtp(FieldTask $task, string $enteredOtp): bool
    {
        if (trim($task->client_otp) === trim($enteredOtp)) {
            $task->otp_verified_at = now();
            $task->status = 'completed';
            $task->completed_at = now();
            $task->save();
            return true;
        }

        return false;
    }
}
