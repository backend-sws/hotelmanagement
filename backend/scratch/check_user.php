<?php
require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;

$users = User::take(5)->get();
foreach ($users as $u) {
    echo "ID: {$u->id} | Email: {$u->email} | Name: {$u->name} | Phone: {$u->phone}\n";
    echo "  Roles: " . json_encode($u->roles->pluck('name')) . "\n";
    echo "  Businesses: " . json_encode($u->businesses->pluck('id')) . "\n";
    echo "  Permissions Count: " . count($u->getAllPermissions()) . "\n";
}
