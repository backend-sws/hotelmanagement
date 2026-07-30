<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$file = \Illuminate\Http\UploadedFile::fake()->image('header.jpg');
$filename = 'business_1/invoice_header_123.jpg';

try {
    $path = $file->storeAs('uploads/invoice_images', $filename, 's3');
    echo "Success: " . ($path ? $path : 'false');
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage();
}
