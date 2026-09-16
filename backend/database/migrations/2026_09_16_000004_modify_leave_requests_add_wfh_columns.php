<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('leave_requests', function (Blueprint $table) {
            // WFH type support — rename existing leave_type to clarify, add request_type
            $table->enum('request_type', ['leave', 'wfh'])->default('leave')->after('user_id')
                  ->comment('Whether this is a leave request or WFH request');

            // Leave category (used for payroll)
            $table->enum('leave_category', ['paid', 'unpaid', 'sick', 'casual', 'earned', 'comp_off'])
                  ->default('paid')->after('leave_type');

            // Admin can override the leave category (e.g., convert paid to unpaid or vice versa)
            $table->enum('admin_override_category', ['paid', 'unpaid'])->nullable()->after('leave_category')
                  ->comment('Admin override: forces payroll to use this category regardless of quota');

            // For WFH requests: track if admin has marked attendance after approval
            $table->boolean('wfh_attendance_marked')->default(false)->after('admin_override_category');

            // Per-staff custom work hours override (for WFH days — optional)
            $table->decimal('custom_work_hours', 4, 2)->nullable()->after('wfh_attendance_marked')
                  ->comment('Custom hours for WFH day if different from standard');

            // Admin remark when overriding category or rejecting
            $table->text('admin_remark')->nullable()->after('custom_work_hours');
        });
    }

    public function down(): void
    {
        Schema::table('leave_requests', function (Blueprint $table) {
            $table->dropColumn([
                'request_type',
                'leave_category',
                'admin_override_category',
                'wfh_attendance_marked',
                'custom_work_hours',
                'admin_remark',
            ]);
        });
    }
};
