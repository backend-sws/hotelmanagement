<?php

namespace App\Services\System;

use App\Models\ActivityLog;
use Illuminate\Support\Facades\Auth;

class ActivityLogService
{
    /**
     * Create a new activity log entry.
     */
    public function log(string $action, ?string $modelType = null, ?int $modelId = null, ?string $description = null, ?array $properties = null, ?int $tenantId = null): ActivityLog
    {
        $tenantId = $tenantId 
            ?? (app()->bound('current_business_id') ? app('current_business_id') : null)
            ?? (Auth::check() ? Auth::user()->business_id : null);

        return ActivityLog::create([
            'tenant_id'   => $tenantId,
            'user_id'     => Auth::id(),
            'action'      => $action,
            'model_type'  => $modelType,
            'model_id'    => $modelId,
            'description' => $description,
            'properties'  => $properties,
        ]);
    }
}

