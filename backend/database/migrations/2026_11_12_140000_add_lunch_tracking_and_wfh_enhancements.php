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
        // 1. Add lunch break tracking and gross presence hours to attendances
        if (Schema::hasTable('attendances')) {
            Schema::table('attendances', function (Blueprint $table) {
                if (!Schema::hasColumn('attendances', 'lunch_start_time')) {
                    $table->time('lunch_start_time')->nullable()->after('check_out_time')
                        ->comment('Time when staff started lunch break');
                }
                if (!Schema::hasColumn('attendances', 'lunch_end_time')) {
                    $table->time('lunch_end_time')->nullable()->after('lunch_start_time')
                        ->comment('Time when staff ended lunch break');
                }
                if (!Schema::hasColumn('attendances', 'lunch_minutes')) {
                    $table->unsignedSmallInteger('lunch_minutes')->default(0)->after('lunch_end_time')
                        ->comment('Total duration of lunch break in minutes');
                }
                if (!Schema::hasColumn('attendances', 'gross_presence_hours')) {
                    $table->decimal('gross_presence_hours', 5, 2)->nullable()->after('lunch_minutes')
                        ->comment('Total office presence duration (check-out minus check-in)');
                }
            });
        }

        // 2. Add default lunch break setting to business_work_settings
        if (Schema::hasTable('business_work_settings')) {
            Schema::table('business_work_settings', function (Blueprint $table) {
                if (!Schema::hasColumn('business_work_settings', 'default_lunch_minutes')) {
                    $table->unsignedSmallInteger('default_lunch_minutes')->default(60)->after('late_mark_grace_minutes')
                        ->comment('Default standard lunch break duration in minutes');
                }
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('attendances')) {
            Schema::table('attendances', function (Blueprint $table) {
                $columns = ['lunch_start_time', 'lunch_end_time', 'lunch_minutes', 'gross_presence_hours'];
                foreach ($columns as $column) {
                    if (Schema::hasColumn('attendances', $column)) {
                        $table->dropColumn($column);
                    }
                }
            });
        }

        if (Schema::hasTable('business_work_settings')) {
            Schema::table('business_work_settings', function (Blueprint $table) {
                if (Schema::hasColumn('business_work_settings', 'default_lunch_minutes')) {
                    $table->dropColumn('default_lunch_minutes');
                }
            });
        }
    }
};

