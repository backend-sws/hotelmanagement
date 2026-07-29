<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckFeatureAccess
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next, string $feature): Response
    {
        $business = $request->attributes->get('business') ?? (app()->bound('tenant') ? app('tenant') : null);
        
        if (!$business) {
            return response()->json(['message' => 'No active business context.'], 403);
        }

        // Allow Superadmin to bypass all feature checks
        if ($request->user() && $request->user()->hasRole('Superadmin')) {
            return $next($request);
        }

        // Check plan expiry first
        if ($business->plan_expires_at && $business->plan_expires_at->isPast()) {
            return response()->json([
                'error' => 'plan_expired',
                'feature' => $feature,
                'message' => 'Your subscription has expired. Please renew your plan to continue using this feature.',
                'expired_at' => $business->plan_expires_at->toISOString(),
            ], 403);
        }

        $plan = $business->plan;
        
        if (!$plan) {
            return response()->json([
                'error' => 'plan_upgrade_required',
                'feature' => $feature,
                'message' => 'Your business does not have an active subscription plan.'
            ], 403);
        }

        // Use the Business model's hasFeature() method which checks custom_features first
        if (!$business->hasFeature($feature)) {
            return response()->json([
                'error' => 'plan_upgrade_required',
                'feature' => $feature,
                'plan_name' => $plan->name,
                'message' => 'This feature requires a plan upgrade. Please contact your administrator.',
            ], 403);
        }

        return $next($request);
    }
}
