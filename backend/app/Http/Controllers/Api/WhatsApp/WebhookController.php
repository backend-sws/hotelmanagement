<?php

namespace App\Http\Controllers\Api\WhatsApp;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use App\Services\WhatsApp\ConversationEngine;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class WebhookController extends Controller
{
    /**
     * Meta Webhook Handshake Verification (GET)
     * Meta sends: hub.mode=subscribe&hub.challenge=XXX&hub.verify_token=YYY
     * Note: PHP / proxies may deliver these as hub.mode or hub_mode.
     */
    public function verify(Request $request)
    {
        // 1. Fetch configured token from DB Settings or fallback to config / default
        $dbToken = Setting::where('key', 'whatsapp_verify_token')->value('value');
        $verifyToken = !empty($dbToken) ? trim($dbToken) : config('whatsapp.verify_token', 'hotel_whatsapp_bot_verify_token_2026');

        // 2. Normalize query params (handling both dot and underscore notations)
        $mode = $request->input('hub_mode', $request->input('hub.mode', $request->query('hub_mode', $request->query('hub.mode'))));
        $token = $request->input('hub_verify_token', $request->input('hub.verify_token', $request->query('hub_verify_token', $request->query('hub.verify_token'))));
        $challenge = $request->input('hub_challenge', $request->input('hub.challenge', $request->query('hub_challenge', $request->query('hub.challenge'))));

        if ($mode === 'subscribe' && $token === $verifyToken) {
            Log::info("WhatsApp Webhook Handshake Verified Successfully", [
                'mode'  => $mode,
                'token' => substr($token, 0, 5) . '***',
            ]);
            return response($challenge, 200)->header('Content-Type', 'text/plain');
        }

        Log::warning("WhatsApp Webhook Handshake Failed", [
            'mode'     => $mode,
            'token'    => $token,
            'expected' => $verifyToken,
        ]);

        return response('Unauthorized challenge token', 403);
    }

    /**
     * Meta Inbound Webhook Ingestion (POST)
     * Optimized for Shared Hosting & FastCGI
     */
    public function handle(Request $request, ConversationEngine $engine)
    {
        $payload = $request->all();

        Log::info("WhatsApp Webhook Inbound Message Received", [
            'keys'    => array_keys($payload),
            'entries' => count($payload['entry'] ?? []),
        ]);

        // Free up the FastCGI connection if supported on production/shared hosting
        if (function_exists('fastcgi_finish_request')) {
            response()->json(['status' => 'received'], 200)->send();
            fastcgi_finish_request();
        }

        // Process the message payload through conversation engine
        try {
            $engine->processPayload($payload);
        } catch (\Throwable $e) {
            Log::error("WhatsApp Webhook Processing Exception: " . $e->getMessage(), [
                'file'  => $e->getFile(),
                'line'  => $e->getLine(),
                'trace' => $e->getTraceAsString(),
            ]);
        }

        return response()->json(['status' => 'received'], 200);
    }
}
