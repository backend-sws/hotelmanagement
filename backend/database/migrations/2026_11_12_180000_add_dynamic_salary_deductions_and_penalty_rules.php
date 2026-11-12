<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (Schema::hasTable('business_work_settings')) {
            Schema::table('business_work_settings', function (Blueprint $table) {
                // Rule 1: Late Arrivals
                if (!Schema::hasColumn('business_work_settings', 'enable_late_deduction')) {
                    $table->boolean('enable_late_deduction')->default(true)->after('late_mark_grace_minutes');
                }
                if (!Schema::hasColumn('business_work_settings', 'late_free_waiver_count')) {
                    $table->integer('late_free_waiver_count')->default(2)->after('enable_late_deduction');
                }
                if (!Schema::hasColumn('business_work_settings', 'late_deduction_trigger_count')) {
                    $table->integer('late_deduction_trigger_count')->default(4)->after('late_free_waiver_count');
                }
                if (!Schema::hasColumn('business_work_settings', 'late_deduction_amount_type')) {
                    $table->decimal('late_deduction_amount_type', 4, 2)->default(1.0)->after('late_deduction_trigger_count');
                }

                // Rule 2: Unapproved Absence
                if (!Schema::hasColumn('business_work_settings', 'enable_absence_penalty')) {
                    $table->boolean('enable_absence_penalty')->default(true)->after('late_deduction_amount_type');
                }
                if (!Schema::hasColumn('business_work_settings', 'absence_penalty_multiplier')) {
                    $table->decimal('absence_penalty_multiplier', 4, 2)->default(2.0)->after('enable_absence_penalty');
                }

                // Rule 3: Advance Leave Notice
                if (!Schema::hasColumn('business_work_settings', 'enable_leave_notice_rule')) {
                    $table->boolean('enable_leave_notice_rule')->default(true)->after('absence_penalty_multiplier');
                }
                if (!Schema::hasColumn('business_work_settings', 'leave_notice_days_required')) {
                    $table->integer('leave_notice_days_required')->default(2)->after('enable_leave_notice_rule');
                }
            });
        }

        if (Schema::hasTable('leave_requests')) {
            Schema::table('leave_requests', function (Blueprint $table) {
                if (!Schema::hasColumn('leave_requests', 'is_short_notice')) {
                    $table->boolean('is_short_notice')->default(false)->after('custom_work_hours');
                }
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('business_work_settings')) {
            Schema::table('business_work_settings', function (Blueprint $table) {
                $columns = [
                    'enable_late_deduction',
                    'late_free_waiver_count',
                    'late_deduction_trigger_count',
                    'late_deduction_amount_type',
                    'enable_absence_penalty',
                    'absence_penalty_multiplier',
                    'enable_leave_notice_rule',
                    'leave_notice_days_required',
                ];
                foreach ($columns as $col) {
                    if (Schema::hasColumn('business_work_settings', $col)) {
                        $table->dropColumn($col);
                    }
                }
            });
        }

        if (Schema::hasTable('leave_requests')) {
            Schema::table('leave_requests', function (Blueprint $table) {
                if (Schema::hasColumn('leave_requests', 'is_short_notice')) {
                    $table->dropColumn('is_short_notice');
                }
            });
        }
    }
};

