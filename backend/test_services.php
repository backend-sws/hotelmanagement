<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$user = App\Models\User::first(); 
auth()->login($user); 

$req = \Illuminate\Http\Request::create('/api/v1/business/hotel/services', 'GET', ['is_available' => 'true', 'outlet_id' => 1]); 
$res = app(\App\Http\Controllers\Api\Business\HotelPosController::class)->indexServices($req);
echo json_encode($res);
