<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

try {
    Illuminate\Support\Facades\Storage::disk('s3')->put('test.txt', 'test');
    echo 'Success';
} catch (\Exception $e) {
    echo $e->getMessage();
}
