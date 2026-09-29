<?php

namespace App\Services\WhatsApp;

use App\Models\Attendance;
use App\Models\Business;
use App\Models\BusinessLocation;
use App\Models\FieldTask;
use App\Models\TaskProof;
use App\Models\User;
use App\Models\WhatsAppSession;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;
use Exception;

class ConversationEngine
{
    protected WhatsAppService $whatsApp;
    protected GeofenceService $geofence;
    protected AntiFraudMediaService $antiFraud;
    protected WhatsAppWalletService $wallet;
    protected WatermarkService $watermark;
    protected TaskDispatchService $taskDispatch;
    protected AiVerificationService $aiVerification;
    protected TravelAllowanceService $travelAllowance;
    protected HrBotService $hrBot;

    public function __construct(
        WhatsAppService $whatsApp,
        GeofenceService $geofence,
        AntiFraudMediaService $antiFraud,
        WhatsAppWalletService $wallet,
        WatermarkService $watermark,
        TaskDispatchService $taskDispatch,
        AiVerificationService $aiVerification,
        TravelAllowanceService $travelAllowance,
        HrBotService $hrBot
    ) {
        $this->whatsApp        = $whatsApp;
        $this->geofence        = $geofence;
        $this->antiFraud       = $antiFraud;
        $this->wallet          = $wallet;
        $this->watermark       = $watermark;
        $this->taskDispatch    = $taskDispatch;
        $this->aiVerification  = $aiVerification;
        $this->travelAllowance = $travelAllowance;
        $this->hrBot           = $hrBot;
    }

    /**
     * Entry point: processes incoming Meta webhook payload
     */
    public function processPayload(array $payload): void
    {
        $entry = $payload['entry'][0]['changes'][0]['value'] ?? [];
        $messages = $entry['messages'] ?? [];

        if (empty($messages)) {
            // Status update (sent/delivered/read) - not an inbound message
            return;
        }

        foreach ($messages as $msg) {
            $this->handleIncomingMessage($msg);
        }
    }

    /**
     * Handle single incoming WhatsApp message
     */
    protected function handleIncomingMessage(array $message): void
    {
        $rawFrom = $message['from'] ?? '';
        $msgType = $message['type'] ?? 'text';

        if (empty($rawFrom)) return;

        // 1. Normalize Phone Number
        $digitsOnly = preg_replace('/[^0-9]/', '', $rawFrom);
        $local10 = substr($digitsOnly, -10);

        // 2. Identify Staff Member
        $user = User::where('phone', $digitsOnly)
            ->orWhere('phone', $local10)
            ->orWhere('phone', '+' . $digitsOnly)
            ->orWhere('phone', 'like', "%{$local10}")
            ->first();

        if (!$user) {
            $this->whatsApp->sendText(
                $rawFrom,
                "नमस्ते! 🙏\n\nआपका मोबाइल नंबर (+{$digitsOnly}) सिस्टम में किसी भी कर्मचारी खाते से लिंक नहीं है। कृपया अपनी कंपनी के HR/एडमिन से संपर्क करें।"
            );
            return;
        }

        // 3. Identify Business
        $business = $user->businesses()->first() ?? Business::find($user->business_id);
        if (!$business) {
            $this->whatsApp->sendText(
                $rawFrom,
                "नमस्ते {$user->name}! आपका खाता किसी सक्रिय बिज़नेस से नहीं जुड़ा है। कृपया एडमिन से संपर्क करें।"
            );
            return;
        }

        // 4. Resolve or Initialize Conversation Session
        $session = WhatsAppSession::firstOrCreate(
            ['phone_number' => $rawFrom, 'business_id' => $business->id],
            [
                'staff_id'      => $user->id,
                'current_state' => 'IDLE',
                'state_data'    => [],
                'expires_at'    => now()->addMinutes(config('whatsapp.session_ttl_minutes', 60)),
            ]
        );

        if ($session->isExpired()) {
            $session->current_state = 'IDLE';
            $session->state_data = [];
            $session->expires_at = now()->addMinutes(60);
            $session->save();
        }

        // Extract Message Body or Interactive Button ID
        $textBody = strtolower(trim($message['text']['body'] ?? ''));
        $buttonId = $message['interactive']['button_reply']['id'] ?? '';

        // Reset to Main Menu on greeting keywords
        if (in_array($textBody, ['hi', 'hello', 'menu', 'namaste', 'start', 'help'], true)) {
            $session->current_state = 'IDLE';
            $session->state_data = [];
            $session->save();
            $this->sendMainMenu($rawFrom, $user, $business);
            return;
        }

        // Auto-record live location waypoint for FieldOps Live Radar and Travel Tracking
        if ($msgType === 'location' && !empty($message['location']['latitude']) && !empty($message['location']['longitude'])) {
            $lat = (float)$message['location']['latitude'];
            $lng = (float)$message['location']['longitude'];
            try {
                $this->travelAllowance->recordLocation(
                    $business->id,
                    $user->id,
                    $lat,
                    $lng,
                    'whatsapp_live',
                    $session->id,
                    ['name' => $message['location']['name'] ?? '', 'address' => $message['location']['address'] ?? '']
                );
            } catch (\Throwable $e) {
                Log::warning("Failed to record location log: " . $e->getMessage());
            }
        }

        // 5. State Machine Routing
        switch ($session->current_state) {
            case 'IDLE':
                if ($msgType === 'location') {
                    $this->whatsApp->sendText(
                        $rawFrom,
                        "📍 आपकी लाइव लोकेशन प्राप्त हुई और रडार पर अपडेट कर दी गई है!\n\n(Lat: " . round($message['location']['latitude'], 5) . ", Lng: " . round($message['location']['longitude'], 5) . ")"
                    );
                    break;
                }
                $this->handleIdleState($rawFrom, $user, $business, $session, $textBody, $buttonId);
                break;

            case 'AWAITING_PUNCH_LOCATION':
                $this->handleAwaitingLocation($rawFrom, $user, $business, $session, $message, $msgType);
                break;

            case 'AWAITING_PUNCH_SELFIE':
                $this->handleAwaitingSelfie($rawFrom, $user, $business, $session, $message, $msgType);
                break;

            case 'AWAITING_TASK_REACHED_LOCATION':
                $this->handleAwaitingTaskReachedLocation($rawFrom, $user, $business, $session, $message, $msgType);
                break;

            case 'AWAITING_TASK_PROOF':
                $this->handleAwaitingTaskProof($rawFrom, $user, $business, $session, $message, $msgType);
                break;

            case 'AWAITING_TASK_OTP':
                $this->handleAwaitingTaskOtp($rawFrom, $user, $business, $session, $textBody);
                break;

            default:
                $session->current_state = 'IDLE';
                $session->save();
                $this->sendMainMenu($rawFrom, $user, $business);
                break;
        }
    }

    /**
     * Send Main Welcome & Menu with Action Buttons
     */
    protected function sendMainMenu(string $to, User $user, Business $business): void
    {
        $todayAttendance = Attendance::where('user_id', $user->id)
            ->where('business_id', $business->id)
            ->whereDate('date', today())
            ->first();

        $todayDateStr = now()->format('d M Y');

        if (!$todayAttendance || !$todayAttendance->check_in_time) {
            // Not punched in yet
            $body = "📅 तारीख: {$todayDateStr}\n🏢 कंपनी: {$business->name}\n\nआज आपकी हाज़िरी दर्ज नहीं हुई है। कृपया 'Punch In' दबाकर अपनी हाज़िरी लगाएं:";
            $buttons = [
                ['id' => 'btn_punch_in', 'title' => '📍 Punch In'],
                ['id' => 'btn_status',   'title' => 'ℹ️ My Status'],
                ['id' => 'btn_help',     'title' => '❓ Help'],
            ];
        } elseif (!$todayAttendance->check_out_time) {
            // Punched in, active shift
            $checkInTime = Carbon::parse($todayAttendance->check_in_time)->format('h:i A');
            $body = "📅 तारीख: {$todayDateStr}\n✅ आप आज {$checkInTime} पर Punch In कर चुके हैं।\n\nशिफ्ट समाप्त होने पर Punch Out करें:";
            $buttons = [
                ['id' => 'btn_punch_out', 'title' => '📍 Punch Out'],
                ['id' => 'btn_status',    'title' => 'ℹ️ My Status'],
                ['id' => 'btn_help',      'title' => '❓ Help'],
            ];
        } else {
            // Already completed both punches
            $checkIn = Carbon::parse($todayAttendance->check_in_time)->format('h:i A');
            $checkOut = Carbon::parse($todayAttendance->check_out_time)->format('h:i A');
            $body = "📅 तारीख: {$todayDateStr}\n✅ आज का कार्य समाप्त हो चुका है!\nIn: {$checkIn} | Out: {$checkOut}\nकुल घंटे: {$todayAttendance->actual_hours} hrs";
            $buttons = [
                ['id' => 'btn_status', 'title' => 'ℹ️ My Status'],
                ['id' => 'btn_help',   'title' => '❓ Help'],
            ];
        }

        $this->whatsApp->sendButtons(
            $to,
            $body,
            $buttons,
            "नमस्ते {$user->name}! 👋"
        );
    }

    /**
     * Handle actions from IDLE state
     */
    protected function handleIdleState(string $to, User $user, Business $business, WhatsAppSession $session, string $text, string $buttonId): void
    {
        // 1. Punch In Action
        if ($buttonId === 'btn_punch_in' || str_contains($text, 'punch in') || $text === '1') {
            // Check wallet balance
            if (!$this->wallet->canAfford($business->id, 'utility')) {
                $this->whatsApp->sendText(
                    $to,
                    "⚠️ सेवा अस्थायी रूप से अनुपलब्ध है। कृपया अपने कंपनी एडमिन से संपर्क करें। (Code: WLT_EXH)"
                );
                return;
            }

            $session->current_state = 'AWAITING_PUNCH_LOCATION';
            $session->expires_at = now()->addMinutes(15);
            $session->save();

            $this->whatsApp->sendText(
                $to,
                "📍 *हाज़िरी (Punch In) - स्टेप 1/2*\n\nकृपया अपनी **करंट लाइव लोकेशन** शेयर करें।\n\n📌 *कैसे भेजें:*\n1. नीचे 📎 (Attachment) आइकन दबाएं\n2. 'Location' चुनें\n3. 'Send Your Current Location' चुनें।"
            );
            return;
        }

        // 2. Punch Out Action
        if ($buttonId === 'btn_punch_out' || str_contains($text, 'punch out') || $text === '2') {
            $this->handlePunchOut($to, $user, $business, $session);
            return;
        }

        // 3. Status Action
        if ($buttonId === 'btn_status' || str_contains($text, 'status') || $text === '3') {
            $this->sendStatusSummary($to, $user, $business);
            return;
        }

        // 4. Task Start Action
        if (str_starts_with($buttonId, 'btn_start_task_')) {
            $taskId = (int)str_replace('btn_start_task_', '', $buttonId);
            $this->handleStartTask($to, $user, $business, $session, $taskId);
            return;
        }

        // 5. Task Reached Action
        if (str_starts_with($buttonId, 'btn_reached_task_')) {
            $taskId = (int)str_replace('btn_reached_task_', '', $buttonId);
            $this->handlePromptReachedTaskLocation($to, $user, $business, $session, $taskId);
            return;
        }

        // 6. Task Proof Action
        if (str_starts_with($buttonId, 'btn_proof_task_')) {
            $taskId = (int)str_replace('btn_proof_task_', '', $buttonId);
            $this->handlePromptTaskProof($to, $user, $business, $session, $taskId);
            return;
        }

        // 7. My Tasks Query
        if ($buttonId === 'btn_tasks' || str_contains($text, 'task') || str_contains($text, 'kaam') || $text === '4') {
            $this->handleListTasks($to, $user, $business);
            return;
        }

        // 8. Manager Leave Approval/Rejection Actions
        if (str_starts_with($buttonId, 'btn_approve_leave_')) {
            $leaveId = (int)str_replace('btn_approve_leave_', '', $buttonId);
            $this->hrBot->processLeaveDecision($leaveId, 'approve', $user);
            $this->whatsApp->sendText($to, "✅ छुट्टी आवेदन #{$leaveId} सफलतापूर्वक मंजूर कर दिया गया है।");
            return;
        }

        if (str_starts_with($buttonId, 'btn_reject_leave_')) {
            $leaveId = (int)str_replace('btn_reject_leave_', '', $buttonId);
            $this->hrBot->processLeaveDecision($leaveId, 'reject', $user);
            $this->whatsApp->sendText($to, "❌ छुट्टी आवेदन #{$leaveId} अस्वीकार कर दिया गया है।");
            return;
        }

        // 9. Leave Application Action
        if ($buttonId === 'btn_leave' || str_contains($text, 'leave') || str_contains($text, 'chutti')) {
            $this->handlePromptLeave($to, $user, $business, $session, $text);
            return;
        }

        // 10. Salary Slip On-Demand Delivery
        if ($buttonId === 'btn_salary' || str_contains($text, 'salary') || str_contains($text, 'slip') || str_contains($text, 'tankhwah')) {
            $this->hrBot->sendSalarySlipSummary($user, $business, $to);
            return;
        }

        // Fallback: Resend menu
        $this->sendMainMenu($to, $user, $business);
    }

    /**
     * Handle incoming Location pin
     */
    protected function handleAwaitingLocation(string $to, User $user, Business $business, WhatsAppSession $session, array $message, string $msgType): void
    {
        if ($msgType !== 'location' || empty($message['location'])) {
            $this->whatsApp->sendText(
                $to,
                "⚠️ कृपया अपनी लोकेशन शेयर करें। 📎 आइकन दबाकर 'Location' > 'Send your current location' चुनें।"
            );
            return;
        }

        $empLat = (float)$message['location']['latitude'];
        $empLng = (float)$message['location']['longitude'];

        // Find business target location
        $location = BusinessLocation::where('business_id', $business->id)->where('is_default', true)->first()
            ?? BusinessLocation::where('business_id', $business->id)->first();

        // If business hasn't defined location coordinates, default to accepting with 0m
        $siteLat = $location ? (float)$location->latitude : $empLat;
        $siteLng = $location ? (float)$location->longitude : $empLng;
        $radius  = $location ? (float)$location->radius_meters : 100.0;

        $geoResult = $this->geofence->isWithinGeofence($empLat, $empLng, $siteLat, $siteLng, $radius);

        if (!$geoResult['is_within']) {
            $distMeters = $geoResult['distance_meters'];
            $this->whatsApp->sendText(
                $to,
                "❌ *लोकेशन अस्वीकृत (Geofence Breach)!*\n\n📍 आपकी दूरी: {$distMeters} मीटर\n🏢 स्वीकृत दायरा: {$radius} मीटर\n\nआप ऑफिस/साइट से दूर हैं। कृपया सही स्थान पर पहुंचकर दोबारा लोकेशन भेजें।"
            );
            return;
        }

        // Location Verified! Advance state to await selfie
        $session->current_state = 'AWAITING_PUNCH_SELFIE';
        $session->state_data = [
            'lat'         => $empLat,
            'lng'         => $empLng,
            'distance'    => $geoResult['distance_meters'],
            'location_id' => $location?->id,
        ];
        $session->expires_at = now()->addMinutes(15);
        $session->save();

        $this->whatsApp->sendText(
            $to,
            "✅ *लोकेशन वेरिफाइड!* (दूरी: {$geoResult['distance_meters']} मीटर)\n\n📸 *स्टेप 2/2: लाइव सेल्फी*\nकृपया अभी कैमरे से अपनी एक **लाइव सेल्फी** खींचकर भेजें।\n\n⚠️ ध्यान रखें: गैलरी या फॉरवर्ड की गई फोटो मान्य नहीं होगी।"
        );
    }

    /**
     * Handle incoming Camera Selfie Photo
     */
    protected function handleAwaitingSelfie(string $to, User $user, Business $business, WhatsAppSession $session, array $message, string $msgType): void
    {
        if ($msgType !== 'image' || empty($message['image'])) {
            $this->whatsApp->sendText(
                $to,
                "⚠️ कृपया कैमरे से सेल्फी फोटो भेजें।"
            );
            return;
        }

        // Anti-Fraud inspection
        $inspection = $this->antiFraud->inspectPhotoPayload($message);
        if (!$inspection['is_valid']) {
            $this->whatsApp->sendText($to, $inspection['error_message_hi']);
            return;
        }

        // Download and store selfie
        $mediaId = $inspection['media_id'];
        $selfieUrl = $this->antiFraud->saveSelfie($mediaId);

        $stateData = $session->state_data ?? [];
        $lat = $stateData['lat'] ?? null;
        $lng = $stateData['lng'] ?? null;
        $locationId = $stateData['location_id'] ?? null;

        // Record Attendance in Database
        $attendance = Attendance::updateOrCreate(
            [
                'business_id' => $business->id,
                'user_id'     => $user->id,
                'date'        => today()->toDateString(),
            ],
            [
                'status'             => 'present',
                'check_in_time'      => now()->format('H:i:s'),
                'check_in_latitude'  => $lat,
                'check_in_longitude' => $lng,
                'check_in_photo'     => $selfieUrl,
                'is_within_geofence' => true,
                'location_id'        => $locationId,
                'notes'              => 'Marked via WhatsApp Bot',
            ]
        );

        // Record GPS waypoint for automated TA/DA
        if ($lat && $lng) {
            try {
                $this->travelAllowance->recordLocation(
                    $business->id,
                    $user->id,
                    (float)$lat,
                    (float)$lng,
                    'punch_in',
                    $attendance->id,
                    ['site_name' => 'Attendance Punch In']
                );
            } catch (Exception $e) {
                Log::warning("TA/DA punch_in waypoint log failed: " . $e->getMessage());
            }
        }

        // Atomic Wallet Debit (₹0.75 Utility Template)
        try {
            $this->wallet->debit(
                $business->id,
                'utility',
                "WhatsApp Punch-in for {$user->name} (+{$to})",
                [
                    'user_id'       => $user->id,
                    'phone'         => $to,
                    'attendance_id' => $attendance->id,
                    'action'        => 'punch_in',
                ]
            );
        } catch (Exception $e) {
            Log::warning("Wallet debit warning during punch-in: " . $e->getMessage());
        }

        // Reset session state to IDLE
        $session->current_state = 'IDLE';
        $session->state_data = [];
        $session->save();

        $punchTime = now()->format('h:i A');
        $this->whatsApp->sendText(
            $to,
            "🎉 *हाज़िरी (Punch In) दर्ज हो गई!* ✅\n\n👤 नाम: {$user->name}\n📅 तारीख: " . now()->format('d M Y') . "\n⏰ समय: {$punchTime}\n📍 लोकेशन: वेरिफाइड\n\nआपका दिन शुभ हो! 👍"
        );
    }

    /**
     * Handle Punch Out
     */
    protected function handlePunchOut(string $to, User $user, Business $business, WhatsAppSession $session): void
    {
        $attendance = Attendance::where('user_id', $user->id)
            ->where('business_id', $business->id)
            ->whereDate('date', today())
            ->first();

        if (!$attendance || !$attendance->check_in_time) {
            $this->whatsApp->sendText(
                $to,
                "❌ आपने आज अभी तक Punch In नहीं किया है।"
            );
            return;
        }

        if ($attendance->check_out_time) {
            $checkOutStr = Carbon::parse($attendance->check_out_time)->format('h:i A');
            $this->whatsApp->sendText(
                $to,
                "ℹ️ आप आज पहले ही {$checkOutStr} पर Punch Out कर चुके हैं।"
            );
            return;
        }

        // Calculate hours
        $checkInTime = Carbon::parse($attendance->check_in_time);
        $checkOutTime = now();
        $hoursWorked = round($checkOutTime->diffInMinutes($checkInTime) / 60, 2);

        $attendance->check_out_time = $checkOutTime->format('H:i:s');
        $attendance->actual_hours = $hoursWorked;
        $attendance->save();

        // Atomic Wallet Debit (₹0.75 Utility Template)
        try {
            $this->wallet->debit(
                $business->id,
                'utility',
                "WhatsApp Punch-out for {$user->name} (+{$to})",
                ['user_id' => $user->id, 'phone' => $to, 'action' => 'punch_out']
            );
        } catch (Exception $e) {
            Log::warning("Wallet debit warning during punch-out: " . $e->getMessage());
        }

        $session->current_state = 'IDLE';
        $session->state_data = [];
        $session->save();

        // Calculate final daily TA/DA travel allowance
        $travelMsg = "";
        try {
            $tada = $this->travelAllowance->calculateDailyTravel($business->id, $user->id);
            if ($tada && (float)$tada->total_km > 0) {
                $travelMsg = "\n🚗 आज का कुल सफर: {$tada->total_km} KM (TA/DA: ₹{$tada->total_amount})";
            }
        } catch (Exception $e) {
            Log::warning("TA/DA punch-out computation warning: " . $e->getMessage());
        }

        $punchOutStr = $checkOutTime->format('h:i A');
        $this->whatsApp->sendText(
            $to,
            "👋 *Punch Out सफल!* ✅\n\n👤 नाम: {$user->name}\n⏰ Punch Out समय: {$punchOutStr}\n⏱️ कुल काम के घंटे: {$hoursWorked} hrs{$travelMsg}\n\nधन्यवाद! आराम करें।"
        );
    }

    /**
     * Send Attendance and Shift Status Summary
     */
    protected function sendStatusSummary(string $to, User $user, Business $business): void
    {
        $attendance = Attendance::where('user_id', $user->id)
            ->where('business_id', $business->id)
            ->whereDate('date', today())
            ->first();

        $statusText = "अनुपस्थित (Not Punched)";
        if ($attendance) {
            if ($attendance->check_out_time) {
                $statusText = "Completed (In: {$attendance->check_in_time}, Out: {$attendance->check_out_time})";
            } else {
                $statusText = "Active on Duty (Checked in at: {$attendance->check_in_time})";
            }
        }

        $this->whatsApp->sendText(
            $to,
            "📊 *आज की हाज़िरी स्थिति:*\n\n👤 नाम: {$user->name}\n🏢 कंपनी: {$business->name}\n📌 स्थिति: {$statusText}\n\nमुख्य मेन्यू के लिए 'Hi' लिखें।"
        );
    }

    /**
     * Handle technician starting journey for a task
     */
    protected function handleStartTask(string $to, User $user, Business $business, WhatsAppSession $session, int $taskId): void
    {
        $task = FieldTask::where('id', $taskId)
            ->where('business_id', $business->id)
            ->where('staff_id', $user->id)
            ->first();

        if (!$task) {
            $this->whatsApp->sendText($to, "❌ कार्य #{$taskId} नहीं मिला या यह आपको असाइन नहीं है।");
            return;
        }

        if (in_array($task->status, ['completed', 'cancelled'])) {
            $this->whatsApp->sendText($to, "ℹ️ कार्य #{$taskId} ('{$task->title}') पहले ही समाप्त हो चुका है।");
            return;
        }

        $task->status = 'in_transit';
        $task->save();

        $session->current_state = 'IDLE';
        $session->state_data = [];
        $session->save();

        $body = "🚗 *यात्रा शुरू हुई (In Transit)!*\n\n"
              . "📋 कार्य: *{$task->title}*\n"
              . "🏢 साइट: *{$task->site_name}*\n"
              . ($task->site_address ? "🏠 पता: {$task->site_address}\n" : "")
              . "\nसाइट पर पहुंचने के बाद कृपया नीचे '📍 पहुंचे' बटन दबाएं।";

        $buttons = [
            ['id' => "btn_reached_task_{$task->id}", 'title' => '📍 पहुंचे'],
            ['id' => "btn_proof_task_{$task->id}",   'title' => '📸 फोटो भेजें'],
        ];

        $this->whatsApp->sendButtons($to, $body, $buttons, "फील्ड टास्क अपडेट");
    }

    /**
     * Prompt technician to share live GPS to verify arrival at site
     */
    protected function handlePromptReachedTaskLocation(string $to, User $user, Business $business, WhatsAppSession $session, int $taskId): void
    {
        $task = FieldTask::where('id', $taskId)
            ->where('business_id', $business->id)
            ->where('staff_id', $user->id)
            ->first();

        if (!$task) {
            $this->whatsApp->sendText($to, "❌ कार्य #{$taskId} नहीं मिला।");
            return;
        }

        $session->current_state = 'AWAITING_TASK_REACHED_LOCATION';
        $session->state_data = [
            'task_id'   => $task->id,
            'site_lat'  => $task->site_lat,
            'site_lng'  => $task->site_lng,
            'site_name' => $task->site_name,
        ];
        $session->expires_at = now()->addMinutes(20);
        $session->save();

        $this->whatsApp->sendText(
            $to,
            "📍 *साइट आगमन वेरिफिकेशन*\n\n"
            . "कार्य: *{$task->title}*\n"
            . "साइट: *{$task->site_name}*\n\n"
            . "कृपया अपनी **वर्तमान लाइव लोकेशन** (GPS Pin) भेजें ताकि सिस्टम वेरिफाई कर सके कि आप साइट पर पहुंच गए हैं।\n\n"
            . "📌 *कैसे भेजें:*\n📎 आइकन > 'Location' > 'Send Your Current Location'"
        );
    }

    /**
     * Verify technician's arrival location against task site GPS
     */
    protected function handleAwaitingTaskReachedLocation(string $to, User $user, Business $business, WhatsAppSession $session, array $message, string $msgType): void
    {
        if ($msgType !== 'location' || empty($message['location'])) {
            $this->whatsApp->sendText(
                $to,
                "⚠️ कृपया अपनी लोकेशन शेयर करें। 📎 आइकन दबाकर 'Location' > 'Send your current location' चुनें।"
            );
            return;
        }

        $empLat = (float)$message['location']['latitude'];
        $empLng = (float)$message['location']['longitude'];

        $taskId = $session->state_data['task_id'] ?? null;
        $task = FieldTask::where('id', $taskId)
            ->where('business_id', $business->id)
            ->where('staff_id', $user->id)
            ->first();

        if (!$task) {
            $session->current_state = 'IDLE';
            $session->save();
            $this->whatsApp->sendText($to, "❌ कार्य की जानकारी नहीं मिली। मुख्य मेन्यू के लिए 'Hi' लिखें।");
            return;
        }

        // If site lat/lng are specified, verify geofence (350 meter allowance for field sites)
        if ($task->site_lat && $task->site_lng) {
            $geoResult = $this->geofence->isWithinGeofence($empLat, $empLng, (float)$task->site_lat, (float)$task->site_lng, 350.0);
            if (!$geoResult['is_within']) {
                $dist = $geoResult['distance_meters'];
                $this->whatsApp->sendText(
                    $to,
                    "❌ *लोकेशन अस्वीकृत (Geofence Breach)!*\n\n"
                    . "📍 आपकी दूरी: {$dist} मीटर\n"
                    . "🏢 अनुमत दायरा: 350 मीटर\n\n"
                    . "आप असाइन की गई साइट से दूर हैं। कृपया साइट पर पहुंचकर दोबारा लोकेशन भेजें।"
                );
                return;
            }
        }

        $task->status = 'reached';
        $task->save();

        // Record GPS waypoint for route tracking and update daily TA/DA
        try {
            $this->travelAllowance->recordLocation(
                $business->id,
                $user->id,
                $empLat,
                $empLng,
                'task_reached',
                $task->id,
                ['site_name' => $task->site_name]
            );
            $this->travelAllowance->calculateDailyTravel($business->id, $user->id);
        } catch (Exception $e) {
            Log::warning("TA/DA task_reached waypoint warning: " . $e->getMessage());
        }

        $session->current_state = 'IDLE';
        $session->state_data = [];
        $session->save();

        $body = "✅ *साइट आगमन वेरिफाइड!*\n\n"
              . "कार्य: *{$task->title}*\n"
              . "साइट: *{$task->site_name}*\n\n"
              . "काम समाप्त होने पर नीचे '📸 फोटो भेजें' बटन दबाकर कार्य का फोटो प्रूफ अपलोड करें:";

        $buttons = [
            ['id' => "btn_proof_task_{$task->id}", 'title' => '📸 फोटो भेजें'],
        ];

        $this->whatsApp->sendButtons($to, $body, $buttons, "साइट उपस्थिति दर्ज");
    }

    /**
     * Prompt technician to upload work photo proof
     */
    protected function handlePromptTaskProof(string $to, User $user, Business $business, WhatsAppSession $session, int $taskId): void
    {
        $task = FieldTask::where('id', $taskId)
            ->where('business_id', $business->id)
            ->where('staff_id', $user->id)
            ->first();

        if (!$task) {
            $this->whatsApp->sendText($to, "❌ कार्य #{$taskId} नहीं मिला।");
            return;
        }

        $session->current_state = 'AWAITING_TASK_PROOF';
        $session->state_data = [
            'task_id'   => $task->id,
            'site_lat'  => $task->site_lat,
            'site_lng'  => $task->site_lng,
            'site_name' => $task->site_name,
        ];
        $session->expires_at = now()->addMinutes(20);
        $session->save();

        $this->whatsApp->sendText(
            $to,
            "📸 *कार्य प्रमाण (Proof Photo) - स्टेप 1*\n\n"
            . "कार्य: *{$task->title}*\n"
            . "साइट: *{$task->site_name}*\n\n"
            . "कृपया पूर्ण किए गए कार्य की कैमरे से सीधी फोटो खींचकर भेजें।\n\n"
            . "⚠️ ध्यान दें: फोटो पर जीपीएस, समय और आपका नाम वाटरमार्क किया जाएगा। गैलरी या फॉरवर्ड की गई फोटो मान्य नहीं होगी।"
        );
    }

    /**
     * Process received work photo, stamp watermark, and initiate Client OTP if configured
     */
    protected function handleAwaitingTaskProof(string $to, User $user, Business $business, WhatsAppSession $session, array $message, string $msgType): void
    {
        if ($msgType !== 'image' || empty($message['image'])) {
            $this->whatsApp->sendText($to, "⚠️ कृपया कैमरे से कार्य की फोटो खींचकर भेजें।");
            return;
        }

        $inspection = $this->antiFraud->inspectPhotoPayload($message);
        if (!$inspection['is_valid']) {
            $this->whatsApp->sendText($to, $inspection['error_message_hi']);
            return;
        }

        $taskId = $session->state_data['task_id'] ?? null;
        $task = FieldTask::where('id', $taskId)
            ->where('business_id', $business->id)
            ->where('staff_id', $user->id)
            ->first();

        if (!$task) {
            $session->current_state = 'IDLE';
            $session->save();
            $this->whatsApp->sendText($to, "❌ कार्य की जानकारी नहीं मिली।");
            return;
        }

        // 1. Download raw photo
        $rawPhotoUrl = $this->antiFraud->saveTaskPhoto($inspection['media_id']);

        // 2. Gemini AI Vision Inspection (Anti-Fraud, Work Match & ₹0.25 Surcharge)
        $aiVerdict = $this->aiVerification->verifyWorkProof($rawPhotoUrl ?? '', $task);

        // 3. Stamp Watermark (Staff, Time, Coordinates, Site)
        $meta = [
            'staff_name' => $user->name,
            'lat'        => $task->site_lat ?? 0.0,
            'lng'        => $task->site_lng ?? 0.0,
            'site_name'  => $task->site_name,
        ];
        $watermarkedUrl = $this->watermark->stampProof($rawPhotoUrl ?? '', $meta);

        // 4. Save TaskProof record with AI score and analysis
        TaskProof::create([
            'task_id'               => $task->id,
            'staff_id'              => $user->id,
            'raw_photo_url'         => $rawPhotoUrl,
            'watermarked_photo_url' => $watermarkedUrl,
            'lat'                   => $task->site_lat,
            'lng'                   => $task->site_lng,
            'distance_from_site'    => 0,
            'is_gallery_photo'      => false,
            'ai_confidence'         => $aiVerdict['confidence'] ?? 90.0,
            'is_ai_approved'        => $aiVerdict['is_valid_proof'] ?? true,
            'ai_analysis'           => $aiVerdict,
            'notes'                 => $aiVerdict['summary_hindi'] ?? 'Submitted via WhatsApp Bot with Watermark',
        ]);

        // 4. If client phone is present, trigger Client OTP verification workflow
        if (!empty($task->client_phone)) {
            $this->taskDispatch->sendClientOtp($task);

            $session->current_state = 'AWAITING_TASK_OTP';
            $session->state_data = ['task_id' => $task->id];
            $session->expires_at = now()->addMinutes(30);
            $session->save();

            $clientPhoneMasked = substr($task->client_phone, 0, 4) . '****' . substr($task->client_phone, -2);
            $this->whatsApp->sendText(
                $to,
                "📸 *फोटो प्रूफ सफलतापूर्वक दर्ज हो गया!* ✅\n\n"
                . "🔢 *ग्राहक संतुष्टि OTP वेरिफिकेशन:*\n"
                . "ग्राहक {$task->client_name} ({$clientPhoneMasked}) के व्हाट्सएप पर 4-अंकों का वेरिफिकेशन OTP भेज दिया गया है।\n\n"
                . "कृपया ग्राहक से 4-अंकों का OTP पूछकर यहां दर्ज करें (उदा. 4821):"
            );
            return;
        }

        // If no client phone, mark completed directly
        $task->status = 'completed';
        $task->completed_at = now();
        $task->save();

        $session->current_state = 'IDLE';
        $session->state_data = [];
        $session->save();

        $this->whatsApp->sendText(
            $to,
            "🎉 *टास्क सफलता पूर्वक पूरा हो गया!* ✅\n\n"
            . "📋 कार्य: *{$task->title}*\n"
            . "🏢 साइट: *{$task->site_name}*\n"
            . "📸 वाटरमार्क फोटो एडमिन पोर्टल पर सुरक्षित कर दी गई है।\n\nधन्यवाद! 👍"
        );
    }

    /**
     * Verify customer OTP submitted by technician
     */
    protected function handleAwaitingTaskOtp(string $to, User $user, Business $business, WhatsAppSession $session, string $textBody): void
    {
        $taskId = $session->state_data['task_id'] ?? null;
        $task = FieldTask::where('id', $taskId)
            ->where('business_id', $business->id)
            ->where('staff_id', $user->id)
            ->first();

        if (!$task) {
            $session->current_state = 'IDLE';
            $session->save();
            $this->whatsApp->sendText($to, "❌ कार्य की जानकारी नहीं मिली। मुख्य मेन्यू के लिए 'Hi' लिखें।");
            return;
        }

        $enteredOtp = trim($textBody);

        if (!preg_match('/^\d{4}$/', $enteredOtp)) {
            $this->whatsApp->sendText(
                $to,
                "⚠️ कृपया ग्राहक द्वारा प्राप्त 4-अंकों का संख्यात्मक OTP ही दर्ज करें (उदा. 7412)।"
            );
            return;
        }

        $verified = $this->taskDispatch->verifyClientOtp($task, $enteredOtp);

        if (!$verified) {
            $this->whatsApp->sendText(
                $to,
                "❌ *गलत OTP दर्ज किया गया!*\n\nदर्ज किया गया OTP ग्राहक के कोड से मेल नहीं खाता। कृपया ग्राहक से सही 4-अंकों का OTP पूछकर दोबारा दर्ज करें।"
            );
            return;
        }

        $session->current_state = 'IDLE';
        $session->state_data = [];
        $session->save();

        $this->whatsApp->sendText(
            $to,
            "🎉 *बधाई हो! कार्य पूर्ण और सत्यापित!* ✅\n\n"
            . "📋 कार्य: *{$task->title}*\n"
            . "👤 ग्राहक: *{$task->client_name}*\n"
            . "✅ ग्राहक संतुष्टि OTP वेरिफाइड\n"
            . "📸 वाटरमार्क प्रूफ एडमिन पोर्टल में सहेज दिया गया है।\n\n"
            . "मैनेजर को कार्य समाप्ति का अलर्ट भेज दिया गया है। धन्यवाद!"
        );
    }

    /**
     * List active tasks assigned to employee
     */
    protected function handleListTasks(string $to, User $user, Business $business): void
    {
        $pendingTasks = FieldTask::where('business_id', $business->id)
            ->where('staff_id', $user->id)
            ->whereNotIn('status', ['completed', 'cancelled'])
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        if ($pendingTasks->isEmpty()) {
            $this->whatsApp->sendText(
                $to,
                "📋 *आपके फील्ड टास्क:*\n\nवर्तमान में आपके लिए कोई नया पेंडिंग फील्ड टास्क नहीं है। 👍"
            );
            return;
        }

        $task = $pendingTasks->first();
        $dueStr = $task->due_at ? Carbon::parse($task->due_at)->format('d M, h:i A') : 'आज';

        $body = "📋 *आपके पेंडिंग टास्क (कुल: {$pendingTasks->count()}):*\n\n"
              . "🔹 कार्य: *{$task->title}*\n"
              . "🏢 साइट: *{$task->site_name}*\n"
              . "📌 स्थिति: *{$task->status}*\n"
              . "⏰ समय: {$dueStr}\n\n"
              . "कार्य शुरू करने या अपडेट करने के लिए नीचे बटन चुनें:";

        $buttons = [
            ['id' => "btn_start_task_{$task->id}",   'title' => '▶️ शुरू करें'],
            ['id' => "btn_reached_task_{$task->id}", 'title' => '📍 पहुंचे'],
            ['id' => "btn_proof_task_{$task->id}",   'title' => '📸 फोटो भेजें'],
        ];

        $this->whatsApp->sendButtons($to, $body, $buttons, "फील्ड टास्क");
    }

    /**
     * Submit employee leave application via WhatsApp
     */
    protected function handlePromptLeave(string $to, User $user, Business $business, WhatsAppSession $session, string $text): void
    {
        $reason = trim(preg_replace('/leave|chutti/i', '', $text));
        $reason = empty($reason) ? 'Personal leave applied via WhatsApp' : $reason;

        $leave = $this->hrBot->submitLeaveRequest($user, $business, 'casual', tomorrow()->toDateString(), null, $reason);

        $this->whatsApp->sendText(
            $to,
            "🌴 *छुट्टी का आवेदन दर्ज हो गया!* ✅\n\n"
            . "👤 नाम: {$user->name}\n"
            . "📅 तारीख: " . tomorrow()->format('d M Y') . "\n"
            . "📝 कारण: {$reason}\n\n"
            . "प्रबंधक को मंजूरी हेतु अलर्ट भेज दिया गया है। निर्णय होते ही आपको व्हाट्सएप पर सूचित किया जाएगा।"
        );
    }
}
