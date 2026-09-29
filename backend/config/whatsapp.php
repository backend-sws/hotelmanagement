<?php

return [
    /*
    |--------------------------------------------------------------------------
    | WhatsApp Cloud API Configuration
    |--------------------------------------------------------------------------
    |
    | Credentials and webhook secrets for Meta WhatsApp Business Cloud API.
    |
    */
    'verify_token'     => env('WHATSAPP_VERIFY_TOKEN', 'hotel_whatsapp_bot_verify_token_2026'),
    'access_token'     => env('WHATSAPP_ACCESS_TOKEN', ''),
    'phone_number_id'  => env('WHATSAPP_PHONE_NUMBER_ID', ''),
    'business_id'      => env('WHATSAPP_BUSINESS_ACCOUNT_ID', ''),
    'app_secret'       => env('WHATSAPP_APP_SECRET', ''),
    'api_version'      => env('WHATSAPP_API_VERSION', 'v21.0'),
    'api_url'          => env('WHATSAPP_API_URL', 'https://graph.facebook.com'),

    /*
    |--------------------------------------------------------------------------
    | Anti-Fraud & Attendance Defaults
    |--------------------------------------------------------------------------
    */
    'default_geofence_radius' => 100, // meters
    'session_ttl_minutes'     => 60,  // active conversation state timeout
];
