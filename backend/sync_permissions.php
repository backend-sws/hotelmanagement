<?php

use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

$businessPermissions = [
    'manage_sales',
    'manage_inventory',
    'manage_purchases',
    'manage_expenses',
    'manage_customers',
    'manage_suppliers',
    'manage_staff',
    'manage_attendance',
    'manage_payroll',
    'manage_business_settings',
    'manage_ledger',
    'manage_finance',
    'manage_projects',
    'view_reports',
];

$roles = Role::where('name', 'Business Admin')->get();
foreach ($roles as $role) {
    setPermissionsTeamId($role->business_id);
    $role->syncPermissions($businessPermissions);
}

echo "Permissions synced for all Business Admin roles.\n";
