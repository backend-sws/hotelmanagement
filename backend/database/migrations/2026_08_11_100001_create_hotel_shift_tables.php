<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Hotel Departments (Front Desk, Housekeeping, Restaurant, etc.)
        Schema::create('hotel_departments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('business_id')->constrained('businesses')->cascadeOnDelete();
            $table->string('name');                          // "Front Desk", "Housekeeping"
            $table->string('description')->nullable();
            $table->string('color')->default('#6366f1');     // For UI display
            $table->foreignId('head_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index('business_id');
        });

        // Hotel Shifts (Morning, Evening, Night, Split, etc.)
        Schema::create('hotel_shifts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('business_id')->constrained('businesses')->cascadeOnDelete();
            $table->string('name');                          // "Morning Shift"
            $table->time('start_time');                      // "06:00:00"
            $table->time('end_time');                        // "14:00:00"
            $table->boolean('is_overnight')->default(false); // true if crosses midnight
            $table->string('color')->default('#3b82f6');     // Color band in roster
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index('business_id');
        });

        // Hotel Shift Roster (Who works which shift on which day)
        Schema::create('hotel_shift_roster', function (Blueprint $table) {
            $table->id();
            $table->foreignId('business_id')->constrained('businesses')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('department_id')->nullable()->constrained('hotel_departments')->nullOnDelete();
            $table->foreignId('shift_id')->nullable()->constrained('hotel_shifts')->nullOnDelete();
            $table->date('roster_date');
            $table->enum('status', [
                'scheduled',
                'attended',
                'absent',
                'swapped',
                'on_leave',
                'week_off',
                'holiday',
            ])->default('scheduled');
            $table->foreignId('swap_with_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->text('swap_reason')->nullable();
            $table->enum('swap_status', ['pending', 'approved', 'rejected'])->nullable();
            $table->foreignId('approved_by')->nullable()->constrained('users')->nullOnDelete();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->unique(['business_id', 'user_id', 'roster_date']);
            $table->index(['business_id', 'roster_date']);
            $table->index(['business_id', 'department_id', 'roster_date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('hotel_shift_roster');
        Schema::dropIfExists('hotel_shifts');
        Schema::dropIfExists('hotel_departments');
    }
};
