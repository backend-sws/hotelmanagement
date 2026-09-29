<?php

require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

// Test 1: GET Handshake with dot-notation
$req1 = Illuminate\Http\Request::create(
    '/api/v1/whatsapp/webhook',
    'GET',
    [
        'hub.mode' => 'subscribe',
        'hub.challenge' => 'challenge_code_999888',
        'hub.verify_token' => 'hotel_whatsapp_bot_verify_token_2026'
    ]
);

$ctrl = app(App\Http\Controllers\Api\WhatsApp\WebhookController::class);
$res1 = $ctrl->verify($req1);
echo "Test 1 (hub.mode dot-notation): Status " . $res1->getStatusCode() . " => Response: '" . $res1->getContent() . "'\n";

// Test 2: GET Handshake with underscore notation
$req2 = Illuminate\Http\Request::create(
    '/api/v1/whatsapp/webhook',
    'GET',
    [
        'hub_mode' => 'subscribe',
        'hub_challenge' => 'challenge_code_111222',
        'hub_verify_token' => 'hotel_whatsapp_bot_verify_token_2026'
    ]
);
$res2 = $ctrl->verify($req2);
echo "Test 2 (hub_mode underscore): Status " . $res2->getStatusCode() . " => Response: '" . $res2->getContent() . "'\n";

// Test 3: Unauthorized challenge token
$req3 = Illuminate\Http\Request::create(
    '/api/v1/whatsapp/webhook',
    'GET',
    [
        'hub_mode' => 'subscribe',
        'hub_challenge' => 'challenge_code_bad',
        'hub_verify_token' => 'wrong_token'
    ]
);
$res3 = $ctrl->verify($req3);
echo "Test 3 (Wrong Token): Status " . $res3->getStatusCode() . " => Response: '" . $res3->getContent() . "'\n";

// Test 4: POST Ingestion with Location Message
$engine = app(App\Services\WhatsApp\ConversationEngine::class);
$postReq = Illuminate\Http\Request::create(
    '/api/v1/whatsapp/webhook',
    'POST',
    [],
    [],
    [],
    ['CONTENT_TYPE' => 'application/json'],
    json_encode([
        'object' => 'whatsapp_business_account',
        'entry' => [
            [
                'id' => '100000000',
                'changes' => [
                    [
                        'value' => [
                            'messaging_product' => 'whatsapp',
                            'metadata' => [
                                'display_phone_number' => '919876543210',
                                'phone_number_id' => '109876543210987'
                            ],
                            'messages' => [
                                [
                                    'from' => '919876543210',
                                    'id' => 'wamid.test_' . uniqid(),
                                    'timestamp' => (string)time(),
                                    'type' => 'text',
                                    'text' => [
                                        'body' => 'hi'
                                    ]
                                ]
                            ]
                        ],
                        'field' => 'messages'
                    ]
                ]
            ]
        ]
    ])
);

$res4 = $ctrl->handle($postReq, $engine);
echo "Test 4 (POST Inbound Message): Status " . $res4->getStatusCode() . " => " . $res4->getContent() . "\n";

// Test 5: Superadmin WhatsApp Test Connection Endpoint
$settingCtrl = app(App\Http\Controllers\Api\Superadmin\SettingController::class);
$testConnReq = Illuminate\Http\Request::create('/api/v1/superadmin/whatsapp/test-connection', 'POST', [
    'phone_number_id' => '',
    'access_token' => '',
]);
$res5 = $settingCtrl->testWhatsApp($testConnReq);
echo "Test 5 (Missing Credentials): Status " . $res5->getStatusCode() . " => " . $res5->getContent() . "\n";


