<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('notice_board', function (Blueprint $table) {
            $table->id();
            $table->foreignId('business_id')->constrained('businesses')->cascadeOnDelete();
            $table->foreignId('posted_by')->constrained('users')->cascadeOnDelete();

            $table->string('title', 255);
            $table->text('body');

            // public = visible to all staff; private = only for target_user_id
            $table->enum('visibility', ['public', 'private'])->default('public');

            // Only set when visibility = private
            $table->foreignId('target_user_id')->nullable()->constrained('users')->nullOnDelete();

            $table->boolean('is_pinned')->default(false)->comment('Pinned notices appear at top');
            $table->timestamp('expires_at')->nullable()->comment('Notice auto-hides after this date');

            $table->timestamps();

            $table->index(['business_id', 'visibility']);
            $table->index(['business_id', 'target_user_id']);
        });

        // Track which staff have read each public notice
        Schema::create('notice_board_reads', function (Blueprint $table) {
            $table->id();
            $table->foreignId('notice_id')->constrained('notice_board')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->timestamp('read_at')->useCurrent();
            $table->unique(['notice_id', 'user_id']);
        });

        // Per-staff work hour override (business_work_settings is global; this overrides per staff)
        Schema::table('business_user', function (Blueprint $table) {
            $table->time('custom_work_start_time')->nullable()->after('status')
                  ->comment('Per-staff override for work start time');
            $table->time('custom_work_end_time')->nullable()->after('custom_work_start_time')
                  ->comment('Per-staff override for work end time');
            $table->decimal('custom_standard_hours', 4, 2)->nullable()->after('custom_work_end_time')
                  ->comment('Per-staff override for standard hours per day');
        });
    }

    public function down(): void
    {
        Schema::table('business_user', function (Blueprint $table) {
            $table->dropColumn(['custom_work_start_time', 'custom_work_end_time', 'custom_standard_hours']);
        });
        Schema::dropIfExists('notice_board_reads');
        Schema::dropIfExists('notice_board');
    }
};
