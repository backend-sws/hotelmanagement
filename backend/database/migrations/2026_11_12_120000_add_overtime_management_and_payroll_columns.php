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
        // 1. Business Work Settings - Global Overtime Policies
        if (Schema::hasTable('business_work_settings')) {
            Schema::table('business_work_settings', function (Blueprint $table) {
                if (!Schema::hasColumn('business_work_settings', 'enable_overtime')) {
                    $table->boolean('enable_overtime')->default(false)->after('auto_apply_holidays');
                }
                if (!Schema::hasColumn('business_work_settings', 'overtime_rate_type')) {
                    $table->enum('overtime_rate_type', ['fixed_rate', 'multiplier'])->default('fixed_rate')->after('enable_overtime');
                }
                if (!Schema::hasColumn('business_work_settings', 'overtime_hourly_rate')) {
                    $table->decimal('overtime_hourly_rate', 10, 2)->default(0)->after('overtime_rate_type');
                }
                if (!Schema::hasColumn('business_work_settings', 'overtime_multiplier')) {
                    $table->decimal('overtime_multiplier', 4, 2)->default(1.50)->after('overtime_hourly_rate');
                }
                if (!Schema::hasColumn('business_work_settings', 'overtime_min_minutes')) {
                    $table->unsignedSmallInteger('overtime_min_minutes')->default(30)->after('overtime_multiplier')
                        ->comment('Minimum minutes beyond shift to count as overtime');
                }
                if (!Schema::hasColumn('business_work_settings', 'overtime_require_approval')) {
                    $table->boolean('overtime_require_approval')->default(true)->after('overtime_min_minutes')
                        ->comment('Whether overtime requires manager/admin approval before adding to salary');
                }
            });
        }

        // 2. Staff Overrides in business_user
        if (Schema::hasTable('business_user')) {
            Schema::table('business_user', function (Blueprint $table) {
                if (!Schema::hasColumn('business_user', 'overtime_eligible')) {
                    $table->boolean('overtime_eligible')->default(true)->after('custom_standard_hours');
                }
                if (!Schema::hasColumn('business_user', 'custom_overtime_rate')) {
                    $table->decimal('custom_overtime_rate', 10, 2)->nullable()->after('overtime_eligible')
                        ->comment('Custom hourly overtime rate for this staff member');
                }
            });
        }

        // 3. Attendances - Daily Overtime Tracking & Approval
        if (Schema::hasTable('attendances')) {
            Schema::table('attendances', function (Blueprint $table) {
                if (!Schema::hasColumn('attendances', 'overtime_hours')) {
                    $table->decimal('overtime_hours', 5, 2)->default(0)->after('actual_hours');
                }
                if (!Schema::hasColumn('attendances', 'overtime_approved')) {
                    $table->boolean('overtime_approved')->default(false)->after('overtime_hours');
                }
                if (!Schema::hasColumn('attendances', 'overtime_approved_by')) {
                    $table->foreignId('overtime_approved_by')->nullable()->after('overtime_approved')
                        ->constrained('users')->nullOnDelete();
                }
                if (!Schema::hasColumn('attendances', 'overtime_approved_at')) {
                    $table->timestamp('overtime_approved_at')->nullable()->after('overtime_approved_by');
                }
                if (!Schema::hasColumn('attendances', 'overtime_notes')) {
                    $table->string('overtime_notes', 255)->nullable()->after('overtime_approved_at');
                }
            });
        }

        // 4. Payrolls - Overtime Aggregation & Amount Added to Salary
        if (Schema::hasTable('payrolls')) {
            Schema::table('payrolls', function (Blueprint $table) {
                if (!Schema::hasColumn('payrolls', 'total_overtime_hours')) {
                    $table->decimal('total_overtime_hours', 6, 2)->default(0)->after('total_commission');
                }
                if (!Schema::hasColumn('payrolls', 'total_overtime_amount')) {
                    $table->decimal('total_overtime_amount', 10, 2)->default(0)->after('total_overtime_hours');
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
                $cols = ['enable_overtime', 'overtime_rate_type', 'overtime_hourly_rate', 'overtime_multiplier', 'overtime_min_minutes', 'overtime_require_approval'];
                foreach ($cols as $col) {
                    if (Schema::hasColumn('business_work_settings', $col)) {
                        $table->dropColumn($col);
                    }
                }
            });
        }

        if (Schema::hasTable('business_user')) {
            Schema::table('business_user', function (Blueprint $table) {
                $cols = ['overtime_eligible', 'custom_overtime_rate'];
                foreach ($cols as $col) {
                    if (Schema::hasColumn('business_user', $col)) {
                        $table->dropColumn($col);
                    }
                }
            });
        }

        if (Schema::hasTable('attendances')) {
            Schema::table('attendances', function (Blueprint $table) {
                if (Schema::hasColumn('attendances', 'overtime_approved_by')) {
                    $table->dropConstrainedForeignId('overtime_approved_by');
                }
                $cols = ['overtime_hours', 'overtime_approved', 'overtime_approved_at', 'overtime_notes'];
                foreach ($cols as $col) {
                    if (Schema::hasColumn('attendances', $col)) {
                        $table->dropColumn($col);
                    }
                }
            });
        }

        if (Schema::hasTable('payrolls')) {
            Schema::table('payrolls', function (Blueprint $table) {
                $cols = ['total_overtime_hours', 'total_overtime_amount'];
                foreach ($cols as $col) {
                    if (Schema::hasColumn('payrolls', $col)) {
                        $table->dropColumn($col);
                    }
                }
            });
        }
    }
};

