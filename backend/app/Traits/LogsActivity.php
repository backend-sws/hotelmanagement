<?php

namespace App\Traits;

use App\Models\ActivityLog;
use Illuminate\Support\Facades\Auth;

trait LogsActivity
{
    public static function bootLogsActivity()
    {
        static::created(function ($model) {
            $attrs = $model->getSanitizedAttributes($model->getAttributes());
            $model->logActivity('created', "Created " . static::getModelDisplayName($model), [
                'attributes' => $attrs,
            ]);
        });

        static::updated(function ($model) {
            $changes = $model->getChanges();
            // Remove timestamp-only changes
            unset($changes['updated_at']);

            if (empty($changes)) {
                return;
            }

            $sanitizedChanges = $model->getSanitizedAttributes($changes);
            $rawOriginal = $model->getOriginal();
            $oldValues = [];
            foreach (array_keys($sanitizedChanges) as $key) {
                $oldValues[$key] = $rawOriginal[$key] ?? null;
            }

            $model->logActivity('updated', "Updated " . static::getModelDisplayName($model), [
                'old' => $oldValues,
                'new' => $sanitizedChanges,
            ]);
        });

        static::deleted(function ($model) {
            $attrs = $model->getSanitizedAttributes($model->getOriginal());
            $model->logActivity('deleted', "Deleted " . static::getModelDisplayName($model), [
                'old' => $attrs,
            ]);
        });
    }

    /**
     * Get a human-readable display name for the model instance.
     */
    protected static function getModelDisplayName($model): string
    {
        $baseName = class_basename($model);
        
        // Convert PascalCase to Spaced Words (e.g. HotelBooking -> Hotel Booking)
        $formatted = preg_replace('/(?<!\ )[A-Z]/', ' $0', $baseName);
        $formatted = trim($formatted);

        // Add contextual identifier if available
        if (!empty($model->booking_number)) {
            return "{$formatted} #{$model->booking_number}";
        } elseif (!empty($model->order_number)) {
            return "{$formatted} #{$model->order_number}";
        } elseif (!empty($model->invoice_number)) {
            return "{$formatted} #{$model->invoice_number}";
        } elseif (!empty($model->purchase_number)) {
            return "{$formatted} #{$model->purchase_number}";
        } elseif (!empty($model->room_number)) {
            return "{$formatted} Room {$model->room_number}";
        } elseif (!empty($model->cheque_number)) {
            return "{$formatted} Cheque #{$model->cheque_number}";
        } elseif (!empty($model->name)) {
            return "{$formatted} '{$model->name}'";
        } elseif (!empty($model->title)) {
            return "{$formatted} '{$model->title}'";
        }

        return "{$formatted} #{$model->getKey()}";
    }

    /**
     * Strip sensitive keys from attributes array.
     */
    public function getSanitizedAttributes(array $attributes): array
    {
        $hidden = method_exists($this, 'getHidden') ? $this->getHidden() : [];
        $sensitiveKeys = array_unique(array_merge(
            $hidden,
            ['password', 'remember_token', 'two_factor_secret', 'two_factor_recovery_codes', 'api_token', 'secret_key', 'access_token', 'refresh_token']
        ));

        foreach ($sensitiveKeys as $key) {
            unset($attributes[$key]);
        }

        return $attributes;
    }

    /**
     * Log an activity for the model.
     */
    public function logActivity(string $action, ?string $description = null, ?array $properties = null): ?ActivityLog
    {
        try {
            // Don't log during db seeding or migrations
            if (app()->runningInConsole()) {
                $argv = request()->server('argv', []);
                $cmd = implode(' ', (array)$argv);
                if (str_contains($cmd, 'db:seed') || str_contains($cmd, 'migrate')) {
                    return null;
                }
            }

            $tenantId = null;
            if (!empty($this->business_id)) {
                $tenantId = $this->business_id;
            } elseif (!empty($this->tenant_id)) {
                $tenantId = $this->tenant_id;
            } elseif ($this instanceof \App\Models\Business) {
                $tenantId = $this->id;
            } elseif (app()->bound('current_business_id') && app('current_business_id')) {
                $tenantId = app('current_business_id');
            } elseif (Auth::check() && !empty(Auth::user()->business_id)) {
                $tenantId = Auth::user()->business_id;
            } elseif (isset($this->booking) && !empty($this->booking->business_id)) {
                $tenantId = $this->booking->business_id;
            } elseif (isset($this->order) && !empty($this->order->business_id)) {
                $tenantId = $this->order->business_id;
            } elseif (isset($this->purchase) && !empty($this->purchase->business_id)) {
                $tenantId = $this->purchase->business_id;
            } elseif (isset($this->sale) && !empty($this->sale->business_id)) {
                $tenantId = $this->sale->business_id;
            }

            return ActivityLog::create([
                'tenant_id'   => $tenantId,
                'user_id'     => Auth::id(),
                'action'      => $action,
                'model_type'  => get_class($this),
                'model_id'    => $this->getKey(),
                'description' => $description ?? (ucfirst($action) . ' ' . static::getModelDisplayName($this)),
                'properties'  => $properties,
            ]);
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::warning("Activity log creation failed: " . $e->getMessage());
            return null;
        }
    }
}

