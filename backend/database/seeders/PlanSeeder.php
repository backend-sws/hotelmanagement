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
        $hotelFeaturesFull = [
            'has_hotel_dashboard' => true,
            'has_hotel_rooms' => true,
            'has_hotel_reservations' => true,
            'has_hotel_pos' => true,
            'has_hotel_housekeeping' => true,
            'has_hotel_shift_roster' => true,
            'has_hotel_night_audit' => true,
            'has_hotel_ota' => true,
            'has_hotel_gst_compliance' => true,
            'has_hotel_reports' => true,
            'has_hotel_corporate' => true,
        ];

        $hotelFeaturesBasic = [
            'has_hotel_dashboard' => true,
            'has_hotel_rooms' => true,
            'has_hotel_reservations' => true,
            'has_hotel_pos' => true,
            'has_hotel_housekeeping' => true,
            'has_hotel_shift_roster' => false,
            'has_hotel_night_audit' => false,
            'has_hotel_ota' => false,
            'has_hotel_gst_compliance' => true,
            'has_hotel_reports' => true,
            'has_hotel_corporate' => false,
        ];

        $hotelFeaturesOff = [
            'has_hotel_dashboard' => false,
            'has_hotel_rooms' => false,
            'has_hotel_reservations' => false,
            'has_hotel_pos' => false,
            'has_hotel_housekeeping' => false,
            'has_hotel_shift_roster' => false,
            'has_hotel_night_audit' => false,
            'has_hotel_ota' => false,
            'has_hotel_gst_compliance' => false,
            'has_hotel_reports' => false,
            'has_hotel_corporate' => false,
        ];

        $plans = [
            [
                'name' => 'Starter Plan',
                'description' => 'Essential tools for single branches — basic invoicing & customer management.',
                'price_monthly' => 999.00,
                'price_yearly' => 9990.00,
                'features' => array_merge([
                    'max_locations' => 1,
                    'max_staff' => 3,
                    'attendance_photo_retention_days' => 0,
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
                ], $hotelFeaturesOff),
                'is_active' => true,
            ],
            [
                'name' => 'Professional Plan',
                'description' => 'Advanced features for growing businesses — full accounting, payroll & basic hotel PMS.',
                'price_monthly' => 1999.00,
                'price_yearly' => 19990.00,
                'features' => array_merge([
                    'max_locations' => 3,
                    'max_staff' => 10,
                    'attendance_photo_retention_days' => 60,
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
                ], $hotelFeaturesBasic),
                'is_active' => true,
            ],
            [
                'name' => 'Hotel & Resort Suite',
                'description' => 'Dedicated all-in-one Property Management System (PMS) for Hotels, Resorts, Homestays & Restaurants.',
                'price_monthly' => 2999.00,
                'price_yearly' => 29990.00,
                'features' => array_merge([
                    'max_locations' => 5,
                    'max_staff' => 25,
                    'attendance_photo_retention_days' => 90,
                    'has_expenses' => true,
                    'has_purchase_bills' => true,
                    'has_khata_ledger' => true,
                    'has_cashbook' => true,
                    'has_cheques' => true,
                    'has_stock_transfer' => true,
                    'has_projects' => false,
                    'has_gst_reports' => true,
                    'has_financial_reports' => true,
                    'has_payroll' => true,
                    'has_finance' => true,
                    'can_whitelabel_invoice' => true,
                    'has_activity_logs' => true,
                ], $hotelFeaturesFull),
                'is_active' => true,
            ],
            [
                'name' => 'Enterprise Plan',
                'description' => 'Complete suite with multi-branch, projects, BOQ, full Hotel PMS & unlimited everything.',
                'price_monthly' => 3999.00,
                'price_yearly' => 39990.00,
                'features' => array_merge([
                    'max_locations' => 999,
                    'max_staff' => 999,
                    'attendance_photo_retention_days' => 180,
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
                ], $hotelFeaturesFull),
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

