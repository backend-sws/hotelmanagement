<?php
require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use App\Services\ProfileService;

$user = User::where('email', 'superadmin@mobilecrm.com')->first();
$service = app(ProfileService::class);

setPermissionsTeamId(1);
$profile = $service->getProfile($user);

echo "Roles when team_id=1: " . json_encode($profile['roles']) . "\n";
echo "Permissions count when team_id=1: " . count($profile['permissions']) . "\n";
