<?php

require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Http\Controllers\Api\Superadmin\WhatsAppPricingController;
use Illuminate\Http\Request;

$controller = app(WhatsAppPricingController::class);

echo "--- TEST 1: Page 1, per_page 10 ---\n";
$response = $controller->getTenantWallets(new Request(['page' => 1, 'per_page' => 10]));
$data = json_decode($response->getContent(), true)['data'];
echo "Current Page: {$data['current_page']} | Last Page: {$data['last_page']} | Total: {$data['total']} | Count: " . count($data['data']) . "\n";

echo "\n--- TEST 2: Search 'SuperMart' ---\n";
$response2 = $controller->getTenantWallets(new Request(['search' => 'SuperMart', 'per_page' => 10]));
$data2 = json_decode($response2->getContent(), true)['data'];
echo "Found: {$data2['total']} results\n";
foreach ($data2['data'] as $w) {
    echo "- " . $w['business']['name'] . " (Balance: {$w['balance']})\n";
}

echo "\n--- TEST 3: Status 'depleted' ---\n";
$response3 = $controller->getTenantWallets(new Request(['status' => 'depleted', 'per_page' => 5]));
$data3 = json_decode($response3->getContent(), true)['data'];
echo "Depleted count: {$data3['total']}\n";
