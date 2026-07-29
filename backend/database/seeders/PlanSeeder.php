<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Plan;

class PlanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $plans = [
            [
                'name' => 'Starter Plan',
                'description' => 'Essential tools for single branches — basic invoicing & customer management.',
                'price_monthly' => 999.00,
                'price_yearly' => 9990.00,
                'features' => [
                    // Usage Limits
                    'max_locations' => 1,
                    'max_staff' => 3,
                    'attendance_photo_retention_days' => 0,

                    // Core (always included)
                    // Dashboard, POS, Invoices, Customers, Suppliers — no flag needed, always on

                    // Premium Module Flags (all off for Starter)
                    'has_expenses' => false,
                    'has_purchase_bills' => false,
                    'has_khata_ledger' => false,
                    'has_cashbook' => false,
                    'has_cheques' => false,
                    'has_stock_transfer' => false,
                    'has_projects' => false,
                    'has_gst_reports' => false,
                    'has_financial_reports' => false,
                    'has_payroll' => false,
                    'has_finance' => false,
                    'can_whitelabel_invoice' => false,
                    'has_activity_logs' => false,
                ],
                'is_active' => true,
            ],
            [
                'name' => 'Professional Plan',
                'description' => 'Advanced features for growing businesses — full accounting, payroll & multi-godown.',
                'price_monthly' => 1999.00,
                'price_yearly' => 19990.00,
                'features' => [
                    // Usage Limits
                    'max_locations' => 3,
                    'max_staff' => 10,
                    'attendance_photo_retention_days' => 60,

                    // Premium Module Flags
                    'has_expenses' => true,
                    'has_purchase_bills' => true,
                    'has_khata_ledger' => true,
                    'has_cashbook' => true,
                    'has_cheques' => false,
                    'has_stock_transfer' => true,
                    'has_projects' => false,
                    'has_gst_reports' => true,
                    'has_financial_reports' => false,
                    'has_payroll' => true,
                    'has_finance' => true,
                    'can_whitelabel_invoice' => true,
                    'has_activity_logs' => true,
                ],
                'is_active' => true,
            ],
            [
                'name' => 'Enterprise Plan',
                'description' => 'Complete suite with multi-branch, projects, BOQ & unlimited everything.',
                'price_monthly' => 3999.00,
                'price_yearly' => 39990.00,
                'features' => [
                    // Usage Limits
                    'max_locations' => 999,
                    'max_staff' => 999,
                    'attendance_photo_retention_days' => 180,

                    // Premium Module Flags (ALL ON)
                    'has_expenses' => true,
                    'has_purchase_bills' => true,
                    'has_khata_ledger' => true,
                    'has_cashbook' => true,
                    'has_cheques' => true,
                    'has_stock_transfer' => true,
                    'has_projects' => true,
                    'has_gst_reports' => true,
                    'has_financial_reports' => true,
                    'has_payroll' => true,
                    'has_finance' => true,
                    'can_whitelabel_invoice' => true,
                    'has_activity_logs' => true,
                ],
                'is_active' => true,
            ],
        ];

        foreach ($plans as $planData) {
            Plan::updateOrCreate(
                ['name' => $planData['name']],
                $planData
            );
        }
    }
}
