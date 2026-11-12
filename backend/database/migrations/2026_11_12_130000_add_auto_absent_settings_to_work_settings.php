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
                if (!Schema::hasColumn('business_work_settings', 'enable_auto_absent')) {
                    $table->boolean('enable_auto_absent')->default(true)->after('auto_apply_holidays')
                        ->comment('Automatically mark staff absent if they do not punch in before half-shift cutoff');
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
                if (Schema::hasColumn('business_work_settings', 'enable_auto_absent')) {
                    $table->dropColumn('enable_auto_absent');
                }
            });
        }
    }
};

