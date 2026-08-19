<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use App\Models\User;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Ensure Spatie uses global scope for Superadmin permissions
        setPermissionsTeamId(null);

        // Define all Superadmin permissions
        $permissions = [
            'view_dashboard',
            'manage_plans',
            'manage_tenants',
            'manage_partners',
            'manage_leads',
            'manage_commissions',
            'manage_users',
            'manage_settings',
            'manage_system_logs',
            'manage_roles',
            'manage_payouts',
        ];

        // Partner-specific permissions
        $partnerPermissions = [
            'view_partner_dashboard',
            'view_own_referrals',
            'view_own_commissions',
            'manage_own_payouts',
            'manage_own_profile',
        ];

        // Comprehensive Business, Hotel, and Staff permissions
        $businessPermissions = [
            // Hotel Operations
            'manage_hotel_dashboard',
            'manage_hotel_bookings',
            'manage_hotel_rooms',
            'manage_hotel_pos',
            'manage_hotel_housekeeping',
            'manage_hotel_shifts',
            'manage_hotel_night_audit',
            'manage_hotel_reports',
            'manage_hotel_ota',
            'manage_hotel_corporate',

            // Sales & Billing
            'manage_sales',
            'manage_challans',
            'manage_proforma',
            'manage_quotations',
            'manage_credit_notes',
            'manage_expenses',

            // Purchases & Inventory
            'manage_purchases',
            'manage_inventory',
            'manage_stock_transfers',
            'manage_material_consumption',
            'manage_price_lists',

            // Customers & Suppliers Khata
            'manage_customers',
            'manage_suppliers',
            'manage_ledger',

            // Finance, Cash & Cheques
            'manage_finance',
            'manage_cheques',

            // Projects & BOQ
            'manage_projects',

            // HRM & Staff
            'manage_staff',
            'manage_attendance',
            'view_attendance',
            'manage_payroll',
            'manage_leaves',
            'manage_salary_advances',

            // Reports & Settings
            'view_reports',
            'view_audit_logs',
            'manage_business_settings',
        ];

        // Create all permissions in database
        $allPermissions = array_unique(array_merge($permissions, $partnerPermissions, $businessPermissions));
        foreach ($allPermissions as $permission) {
            Permission::firstOrCreate(['name' => $permission, 'guard_name' => 'web']);
        }

        // Create the root Superadmin role
        $superadminRole = Role::firstOrCreate(['name' => 'Superadmin', 'guard_name' => 'web']);
        
        // Assign all permissions to Superadmin
        $superadminRole->syncPermissions(Permission::all());

        // Create and assign Partner role permissions
        $partnerRole = Role::firstOrCreate(['name' => 'Partner', 'guard_name' => 'web']);
        $partnerRole->syncPermissions($partnerPermissions);

        // Ensure user ID 1 is assigned Superadmin role if it exists
        $user = User::find(1);
        if ($user && !$user->hasRole('Superadmin')) {
            $user->assignRole($superadminRole);
        }
    }
}

