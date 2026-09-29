<?php

namespace App\Services\WhatsApp;

use App\Models\WhatsAppRateCard;
use Illuminate\Support\Collection;

class WhatsAppPricingService
{
    /**
     * Default fallbacks if database record is missing
     */
    protected array $hardcodedDefaults = [
        'utility'        => ['wholesale' => 0.35, 'retail' => 0.75],
        'authentication' => ['wholesale' => 0.12, 'retail' => 0.40],
        'service'        => ['wholesale' => 0.30, 'retail' => 0.60],
        'marketing'      => ['wholesale' => 0.85, 'retail' => 1.40],
        'ai_vision'      => ['wholesale' => 0.04, 'retail' => 0.25],
    ];

    /**
     * Get the effective rate card for a business and category.
     * Hierarchy: Custom Tenant Rate > Global Platform Rate > Hardcoded Fallback.
     */
    public function getRateForTenant(int $businessId, string $category): object
    {
        // 1. Check custom override for this specific tenant
        $tenantRate = WhatsAppRateCard::where('business_id', $businessId)
            ->where('category', $category)
            ->where('is_active', true)
            ->first();

        if ($tenantRate) {
            return (object)[
                'category'       => $tenantRate->category,
                'wholesale_cost' => (float)$tenantRate->wholesale_cost,
                'retail_price'   => (float)$tenantRate->retail_price,
                'is_custom'      => true,
            ];
        }

        // 2. Fallback to global platform default (business_id is null)
        $globalRate = WhatsAppRateCard::whereNull('business_id')
            ->where('category', $category)
            ->where('is_active', true)
            ->first();

        if ($globalRate) {
            return (object)[
                'category'       => $globalRate->category,
                'wholesale_cost' => (float)$globalRate->wholesale_cost,
                'retail_price'   => (float)$globalRate->retail_price,
                'is_custom'      => false,
            ];
        }

        // 3. Fallback to hardcoded default
        $fallback = $this->hardcodedDefaults[$category] ?? ['wholesale' => 0.50, 'retail' => 1.00];
        return (object)[
            'category'       => $category,
            'wholesale_cost' => (float)$fallback['wholesale'],
            'retail_price'   => (float)$fallback['retail'],
            'is_custom'      => false,
        ];
    }

    /**
     * Get all global default rates
     */
    public function getGlobalRates(): Collection
    {
        return WhatsAppRateCard::whereNull('business_id')
            ->orderBy('category')
            ->get();
    }

    /**
     * Get custom rates for a tenant
     */
    public function getTenantCustomRates(int $businessId): Collection
    {
        return WhatsAppRateCard::where('business_id', $businessId)
            ->orderBy('category')
            ->get();
    }

    /**
     * Update or create a global rate
     */
    public function setGlobalRate(string $category, float $wholesaleCost, float $retailPrice): WhatsAppRateCard
    {
        return WhatsAppRateCard::updateOrCreate(
            ['business_id' => null, 'category' => $category],
            [
                'wholesale_cost' => $wholesaleCost,
                'retail_price'   => $retailPrice,
                'is_active'      => true,
            ]
        );
    }

    /**
     * Set a custom rate override for a tenant
     */
    public function setTenantRate(int $businessId, string $category, float $wholesaleCost, float $retailPrice): WhatsAppRateCard
    {
        return WhatsAppRateCard::updateOrCreate(
            ['business_id' => $businessId, 'category' => $category],
            [
                'wholesale_cost' => $wholesaleCost,
                'retail_price'   => $retailPrice,
                'is_active'      => true,
            ]
        );
    }

    /**
     * Delete custom override for tenant (reverts to global rate)
     */
    public function deleteTenantRate(int $businessId, string $category): bool
    {
        return (bool)WhatsAppRateCard::where('business_id', $businessId)
            ->where('category', $category)
            ->delete();
    }
}
