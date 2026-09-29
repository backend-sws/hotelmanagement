<?php
require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use Spatie\Permission\Models\Permission;

$user = User::where('email', 'superadmin@mobilecrm.com')->first();

setPermissionsTeamId(1);

$currentTeamId = getPermissionsTeamId();

// 1. Fetch global roles & permissions
setPermissionsTeamId(null);
$user->unsetRelation('roles')->unsetRelation('permissions');
$globalRoles = $user->roles()->get();
$globalPermissions = $user->getAllPermissions();

// 2. Fetch team-specific
$teamRoles = collect();
$teamPermissions = collect();
if ($currentTeamId !== null) {
    setPermissionsTeamId($currentTeamId);
    $user->unsetRelation('roles')->unsetRelation('permissions');
    $teamRoles = $user->roles()->get();
    $teamPermissions = $user->getAllPermissions();
}

setPermissionsTeamId($currentTeamId);

$allRoles = $globalRoles->concat($teamRoles)->unique('id');
$allPermissions = $globalPermissions->concat($teamPermissions)->pluck('name')->unique()->values();

if ($allRoles->contains('name', 'Superadmin')) {
    $allPermissions = Permission::pluck('name')->unique()->values();
}

echo "With fix when team_id=1:\n";
echo "Roles: " . json_encode($allRoles->pluck('name')) . "\n";
echo "Permissions count: " . count($allPermissions) . "\n";
