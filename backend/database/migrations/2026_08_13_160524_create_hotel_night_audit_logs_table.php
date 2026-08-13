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
        Schema::create('hotel_night_audit_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('business_id')->constrained()->cascadeOnDelete();
            $table->date('audit_date');
            $table->integer('rooms_occupied')->default(0);
            $table->integer('rooms_available')->default(0);
            $table->decimal('occupancy_percent', 5, 2)->default(0);
            $table->decimal('total_revenue_room', 12, 2)->default(0);
            $table->decimal('total_revenue_pos', 12, 2)->default(0);
            $table->decimal('total_revenue_extras', 12, 2)->default(0);
            $table->decimal('total_revenue_gross', 12, 2)->default(0);
            $table->decimal('total_tax_collected', 12, 2)->default(0);
            $table->decimal('total_discount_given', 12, 2)->default(0);
            $table->integer('new_checkins')->default(0);
            $table->integer('checkouts')->default(0);
            $table->integer('no_shows')->default(0);
            $table->integer('cancellations')->default(0);
            $table->enum('status', ['pending', 'running', 'completed', 'failed'])->default('pending');
            $table->foreignId('run_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('run_at')->nullable();
            $table->string('report_path')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hotel_night_audit_logs');
    }
};
