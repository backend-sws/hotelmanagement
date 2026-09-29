<?php

require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Api\ProfileController;

$superadmin = User::where('email', 'superadmin@mobilecrm.com')->first();
if (!$superadmin) {
    echo "❌ Superadmin user not found\n";
    exit(1);
}

// Simulate request with X-Tenant-ID header
$request = Request::create('/api/v1/profile', 'GET');
$request->headers->set('X-Tenant-ID', '1');
$request->setUserResolver(fn() => $superadmin);

$controller = app(ProfileController::class);
$response = $controller->show($request);
$data = json_decode($response->getContent(), true);

echo "=== PROFILE API ENDPOINT TEST WITH X-Tenant-ID: 1 ===\n";
echo "Status Code: " . $response->getStatusCode() . "\n";
echo "User ID: " . $data['data']['id'] . " | Name: " . $data['data']['name'] . "\n";
echo "Roles returned: " . json_encode($data['data']['roles']) . "\n";
echo "Permissions count: " . count($data['data']['permissions']) . "\n";

$hasSuperadminRole = false;
foreach ($data['data']['roles'] as $r) {
    if (strtolower($r['name']) === 'superadmin') {
        $hasSuperadminRole = true;
    }
}

if ($hasSuperadminRole && count($data['data']['permissions']) > 0) {
    echo "✅ SUCCESS: Superadmin role and permissions are fully preserved!\n";
} else {
    echo "❌ FAILED: Roles or permissions are missing!\n";
}
