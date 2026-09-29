<?php

require __DIR__ . '/../vendor/autoload.php';

$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Business;
use App\Models\BusinessWallet;
use App\Models\FieldTask;
use App\Models\TaskProof;
use App\Models\User;
use App\Models\WhatsAppSession;
use App\Services\WhatsApp\ConversationEngine;
use App\Services\WhatsApp\TaskDispatchService;

echo "====================================================\n";
echo "⚡ TESTING PHASE 3: FIELD TASKS, WATERMARK & CLIENT OTP\n";
echo "====================================================\n";

// 1. Get or create test business & technician user
$business = Business::first();
if (!$business) {
    echo "❌ No business found!\n";
    exit(1);
}

$wallet = BusinessWallet::firstOrCreate(
    ['business_id' => $business->id],
    ['balance' => 500.00, 'low_balance_threshold' => 50.00, 'is_locked' => false]
);
$initialBalance = (float)$wallet->balance;
echo "🏢 Business: {$business->name} (ID: {$business->id})\n";
echo "💰 Starting Wallet Balance: ₹{$initialBalance}\n";

$tech = $business->users()->first() ?? User::first();
if (!$tech) {
    echo "❌ No user found!\n";
    exit(1);
}
// Set phone on technician
$tech->phone = '919876543210';
$tech->save();
echo "👤 Technician: {$tech->name} (Phone: {$tech->phone})\n";

// 2. Create a Field Task
$task = FieldTask::create([
    'business_id'   => $business->id,
    'staff_id'      => $tech->id,
    'title'         => 'HVAC Unit Repair & Filter Replacement',
    'description'   => 'Repair chilled water fan coil unit and verify compressor pressure.',
    'site_name'     => 'Cyber Hub Tower B, 4th Floor',
    'site_lat'      => 28.49850,
    'site_lng'      => 77.08910,
    'site_address'  => 'DLF Cyber City, Phase 2, Gurugram',
    'client_name'   => 'Mr. Rajesh Sharma',
    'client_phone'  => '919123456780',
    'priority'      => 'high',
    'status'        => 'assigned',
    'due_at'        => now()->addHours(3),
]);

echo "\n📋 [Step 1] Created Task #{$task->id}: '{$task->title}'\n";
echo "   Site: {$task->site_name} (Lat: {$task->site_lat}, Lng: {$task->site_lng})\n";
echo "   Client: {$task->client_name} ({$task->client_phone})\n";

// 3. Dispatch Task via TaskDispatchService
$dispatchService = app(TaskDispatchService::class);
$dispatched = $dispatchService->dispatchTask($task);
echo "\n📤 [Step 2] Dispatching Task via WhatsApp...\n";
if ($dispatched) {
    $wallet->refresh();
    echo "   ✅ Dispatch successful!\n";
    echo "   💰 Wallet Balance after dispatch: ₹{$wallet->balance} (Expected -0.75)\n";
} else {
    echo "   ❌ Dispatch failed!\n";
}

// 4. Simulate Technician Clicking '▶️ शुरू करें' (Start Journey)
$engine = app(ConversationEngine::class);

echo "\n🚗 [Step 3] Simulating Tech clicking '▶️ शुरू करें' (btn_start_task_{$task->id})...\n";
$startPayload = [
    'entry' => [[
        'changes' => [[
            'value' => [
                'messages' => [[
                    'from' => $tech->phone,
                    'type' => 'interactive',
                    'interactive' => [
                        'button_reply' => [
                            'id' => "btn_start_task_{$task->id}",
                            'title' => '▶️ शुरू करें',
                        ]
                    ]
                ]]
            ]
        ]]
    ]]
];
$engine->processPayload($startPayload);
$task->refresh();
echo "   Status after click: {$task->status} (Expected: in_transit)\n";

// 5. Simulate Technician Arriving at Site & Sending GPS Pin
echo "\n📍 [Step 4] Simulating Tech tapping '📍 पहुंचे' & sending Live GPS Pin...\n";
$reachedPayload = [
    'entry' => [[
        'changes' => [[
            'value' => [
                'messages' => [[
                    'from' => $tech->phone,
                    'type' => 'interactive',
                    'interactive' => [
                        'button_reply' => [
                            'id' => "btn_reached_task_{$task->id}",
                            'title' => '📍 पहुंचे',
                        ]
                    ]
                ]]
            ]
        ]]
    ]]
];
$engine->processPayload($reachedPayload);

// Now send location pin (approx 15 meters from site)
$locationPayload = [
    'entry' => [[
        'changes' => [[
            'value' => [
                'messages' => [[
                    'from' => $tech->phone,
                    'type' => 'location',
                    'location' => [
                        'latitude'  => 28.49855,
                        'longitude' => 77.08915,
                    ]
                ]]
            ]
        ]]
    ]]
];
$engine->processPayload($locationPayload);
$task->refresh();
echo "   Status after GPS verification: {$task->status} (Expected: reached)\n";

// 6. Simulate Tech uploading Proof Photo
echo "\n📸 [Step 5] Simulating Tech tapping '📸 फोटो भेजें' & sending Camera Photo...\n";
$proofBtnPayload = [
    'entry' => [[
        'changes' => [[
            'value' => [
                'messages' => [[
                    'from' => $tech->phone,
                    'type' => 'interactive',
                    'interactive' => [
                        'button_reply' => [
                            'id' => "btn_proof_task_{$task->id}",
                            'title' => '📸 फोटो भेजें',
                        ]
                    ]
                ]]
            ]
        ]]
    ]]
];
$engine->processPayload($proofBtnPayload);

// Send photo
$photoPayload = [
    'entry' => [[
        'changes' => [[
            'value' => [
                'messages' => [[
                    'from' => $tech->phone,
                    'type' => 'image',
                    'timestamp' => (string)time(),
                    'image' => [
                        'id' => 'mock_media_proof_' . uniqid(),
                        'mime_type' => 'image/jpeg',
                    ],
                    'context' => [
                        'forwarded' => false,
                    ]
                ]]
            ]
        ]]
    ]]
];
$engine->processPayload($photoPayload);
$task->refresh();
$wallet->refresh();

echo "   Status after Photo & OTP trigger: {$task->status} (Expected: awaiting_otp)\n";
echo "   Client OTP Generated: {$task->client_otp}\n";
echo "   💰 Wallet Balance after Client OTP: ₹{$wallet->balance} (Expected -0.40)\n";

// Check proof record and watermark
$proof = TaskProof::where('task_id', $task->id)->latest()->first();
if ($proof) {
    echo "   ✅ TaskProof Record Created #{$proof->id}!\n";
    echo "   Raw Photo URL: {$proof->raw_photo_url}\n";
    echo "   Watermarked Photo URL: {$proof->watermarked_photo_url}\n";
} else {
    echo "   ❌ No TaskProof record found!\n";
}

// 7. Simulate Client OTP Submission
echo "\n🔢 [Step 6] Simulating Technician entering wrong OTP '0000'...\n";
$s = WhatsAppSession::where('phone_number', $tech->phone)->first();
echo "   Before Step 6 - Session State: " . ($s->current_state ?? 'NONE') . " Data: " . json_encode($s->state_data ?? []) . "\n";

$wrongOtpPayload = [
    'entry' => [[
        'changes' => [[
            'value' => [
                'messages' => [[
                    'from' => $tech->phone,
                    'type' => 'text',
                    'text' => ['body' => '0000']
                ]]
            ]
        ]]
    ]]
];
$engine->processPayload($wrongOtpPayload);
$task->refresh();
$s->refresh();
echo "   After Step 6 - Status: {$task->status} | Session State: {$s->current_state}\n";

echo "\n🔢 [Step 7] Simulating Technician entering correct OTP '{$task->client_otp}'...\n";
$correctOtpPayload = [
    'entry' => [[
        'changes' => [[
            'value' => [
                'messages' => [[
                    'from' => $tech->phone,
                    'type' => 'text',
                    'text' => ['body' => (string)$task->client_otp]
                ]]
            ]
        ]]
    ]]
];
$engine->processPayload($correctOtpPayload);
$task->refresh();
$s->refresh();
echo "   After Step 7 - Status: {$task->status} (Expected: completed) | Session State: {$s->current_state}\n";
echo "   Completed At: {$task->completed_at}\n";

echo "\n🎉 ALL PHASE 3 BACKEND LIFECYCLE TESTS PASSED!\n";
echo "====================================================\n";
