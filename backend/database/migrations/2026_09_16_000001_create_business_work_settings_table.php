<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('business_work_settings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('business_id')->constrained('businesses')->cascadeOnDelete();

            // Global business-level defaults
            $table->time('work_start_time')->default('09:00:00')->comment('Default work start time');
            $table->time('work_end_time')->default('18:00:00')->comment('Default work end time');
            $table->decimal('standard_hours_per_day', 4, 2)->default(9.00)->comment('Standard working hours per day (business default)');
            $table->json('work_days')->nullable()->comment('Array of work days: ["Mon","Tue","Wed","Thu","Fri","Sat"]');
            $table->unsignedSmallInteger('late_mark_grace_minutes')->default(15)->comment('Minutes of grace before marking as late');
            $table->boolean('auto_apply_holidays')->default(true)->comment('Auto-mark holiday status on attendance when holiday is defined');

            $table->timestamps();
            $table->unique('business_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('business_work_settings');
    }
};
