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
                // Punch Modes & Security Rules
                if (!Schema::hasColumn('business_work_settings', 'punch_mode_office')) {
                    $table->boolean('punch_mode_office')->default(true)->after('enable_auto_absent')
                        ->comment('Allow at-office punch with geofence');
                }
                if (!Schema::hasColumn('business_work_settings', 'punch_mode_wfh')) {
                    $table->boolean('punch_mode_wfh')->default(true)->after('punch_mode_office')
                        ->comment('Allow work from home punch');
                }
                if (!Schema::hasColumn('business_work_settings', 'punch_mode_quick_gps')) {
                    $table->boolean('punch_mode_quick_gps')->default(false)->after('punch_mode_wfh')
                        ->comment('Allow quick GPS punch without camera');
                }
                if (!Schema::hasColumn('business_work_settings', 'punch_mode_selfie_required')) {
                    $table->boolean('punch_mode_selfie_required')->default(true)->after('punch_mode_quick_gps')
                        ->comment('Require camera selfie verification on clock in/out');
                }
                if (!Schema::hasColumn('business_work_settings', 'punch_mode_on_duty')) {
                    $table->boolean('punch_mode_on_duty')->default(false)->after('punch_mode_selfie_required')
                        ->comment('Allow on-duty/field visit punch');
                }

                // Forgot Check-out Fallback Policy & Alert
                if (!Schema::hasColumn('business_work_settings', 'forgot_checkout_policy')) {
                    $table->string('forgot_checkout_policy', 20)->default('half_day')->after('punch_mode_on_duty')
                        ->comment('Fallback policy when staff forgets to checkout: half_day, auto_full, incomplete');
                }
                if (!Schema::hasColumn('business_work_settings', 'forgot_checkout_alert_time')) {
                    $table->time('forgot_checkout_alert_time')->default('19:00:00')->after('forgot_checkout_policy')
                        ->comment('Time after which forgot checkout alert triggers');
                }
                if (!Schema::hasColumn('business_work_settings', 'enable_forgot_checkout_alert')) {
                    $table->boolean('enable_forgot_checkout_alert')->default(true)->after('forgot_checkout_alert_time')
                        ->comment('Send alert to staff who have not checked out after alert time');
                }
            });
        }

        if (Schema::hasTable('attendances')) {
            Schema::table('attendances', function (Blueprint $table) {
                if (!Schema::hasColumn('attendances', 'forgot_checkout_applied')) {
                    $table->boolean('forgot_checkout_applied')->default(false)->after('gross_presence_hours')
                        ->comment('Indicates if forgot-checkout policy (e.g. half-day penalty) was applied');
                }
                if (!Schema::hasColumn('attendances', 'is_auto_closed')) {
                    $table->boolean('is_auto_closed')->default(false)->after('forgot_checkout_applied')
                        ->comment('Indicates if attendance was auto-closed by system');
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
                $cols = [
                    'punch_mode_office', 'punch_mode_wfh', 'punch_mode_quick_gps',
                    'punch_mode_selfie_required', 'punch_mode_on_duty',
                    'forgot_checkout_policy', 'forgot_checkout_alert_time', 'enable_forgot_checkout_alert'
                ];
                foreach ($cols as $col) {
                    if (Schema::hasColumn('business_work_settings', $col)) {
                        $table->dropColumn($col);
                    }
                }
            });
        }

        if (Schema::hasTable('attendances')) {
            Schema::table('attendances', function (Blueprint $table) {
                $cols = ['forgot_checkout_applied', 'is_auto_closed'];
                foreach ($cols as $col) {
                    if (Schema::hasColumn('attendances', $col)) {
                        $table->dropColumn($col);
                    }
                }
            });
        }
    }
};

