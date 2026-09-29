<?php

require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Business;
use App\Models\BusinessWallet;

app(\App\Services\WhatsApp\WhatsAppWalletService::class)->ensureWalletsExist();

echo "--- ALL BUSINESSES ---\n";
$businesses = Business::all(['id', 'name', 'status']);
foreach ($businesses as $b) {
    echo "ID: {$b->id} | Name: {$b->name} | Status: {$b->status}\n";
}

echo "\n--- ALL WALLETS ---\n";
$wallets = BusinessWallet::with('business')->get();
foreach ($wallets as $w) {
    echo "Wallet ID: {$w->id} | Business ID: {$w->business_id} | Business Name: " . ($w->business->name ?? 'NULL') . " | Balance: {$w->balance}\n";
}
