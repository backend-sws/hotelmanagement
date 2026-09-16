<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('attendances', function (Blueprint $table) {
            // Work type — office/wfh/field
            $table->enum('work_type', ['office', 'wfh', 'field'])->default('office')->after('notes');

            // Actual working hours computed from check_in/check_out
            $table->decimal('actual_hours', 5, 2)->nullable()->after('work_type')
                  ->comment('Actual hours worked = checkout - checkin in decimal');

            // Late mark: how many minutes after work_start_time
            $table->unsignedSmallInteger('late_mark_minutes')->nullable()->after('actual_hours')
                  ->comment('Minutes late relative to business work_start_time');

            // ── Regularization (backdated time-correction request by staff) ──
            $table->timestamp('regularization_requested_at')->nullable()->after('late_mark_minutes');
            $table->time('regularization_requested_checkin')->nullable()
                  ->comment('Corrected check-in time requested by staff');
            $table->time('regularization_requested_checkout')->nullable()
                  ->comment('Corrected check-out time requested by staff');
            $table->text('regularization_reason')->nullable();
            $table->enum('regularization_status', ['pending', 'approved', 'rejected'])
                  ->nullable()->after('regularization_reason');
            $table->foreignId('regularization_approved_by')->nullable()
                  ->constrained('users')->nullOnDelete();
            $table->timestamp('regularization_actioned_at')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('attendances', function (Blueprint $table) {
            $table->dropForeign(['regularization_approved_by']);
            $table->dropColumn([
                'work_type',
                'actual_hours',
                'late_mark_minutes',
                'regularization_requested_at',
                'regularization_requested_checkin',
                'regularization_requested_checkout',
                'regularization_reason',
                'regularization_status',
                'regularization_approved_by',
                'regularization_actioned_at',
            ]);
        });
    }
};
