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
        // 1. Staff Location Logs for Route Tracking & TA/DA
        Schema::create('staff_location_logs', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('business_id');
            $table->unsignedBigInteger('staff_id');
            $table->decimal('lat', 10, 7);
            $table->decimal('lng', 10, 7);
            $table->enum('location_source', ['punch_in', 'task_reached', 'punch_out', 'manual'])->default('task_reached');
            $table->unsignedBigInteger('reference_id')->nullable()->comment('attendance_id or task_id');
            $table->json('metadata')->nullable();
            $table->dateTime('recorded_at');
            $table->timestamps();

            $table->foreign('business_id')->references('id')->on('businesses')->onDelete('cascade');
            $table->foreign('staff_id')->references('id')->on('users')->onDelete('cascade');
            $table->index(['business_id', 'staff_id', 'recorded_at']);
        });

        // 2. Daily Travel Allowances (TA/DA) Claims
        Schema::create('travel_allowances', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('business_id');
            $table->unsignedBigInteger('staff_id');
            $table->date('date');
            $table->enum('vehicle_type', ['bike', 'car', 'public_transit'])->default('bike');
            $table->string('start_location', 255)->nullable();
            $table->string('end_location', 255)->nullable();
            $table->decimal('total_km', 8, 2)->default(0.00);
            $table->decimal('rate_per_km', 6, 2)->default(3.50);
            $table->decimal('total_amount', 10, 2)->default(0.00);
            $table->enum('status', ['pending', 'approved', 'rejected', 'paid'])->default('pending');
            $table->unsignedBigInteger('approved_by')->nullable();
            $table->unsignedBigInteger('payroll_id')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->foreign('business_id')->references('id')->on('businesses')->onDelete('cascade');
            $table->foreign('staff_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('approved_by')->references('id')->on('users')->onDelete('set null');
            $table->unique(['business_id', 'staff_id', 'date']);
            $table->index(['business_id', 'status']);
        });

        // 3. Add AI Vision columns to task_proofs
        Schema::table('task_proofs', function (Blueprint $table) {
            $table->decimal('ai_confidence', 5, 2)->nullable()->after('is_gallery_photo');
            $table->boolean('is_ai_approved')->default(true)->after('ai_confidence');
            $table->json('ai_analysis')->nullable()->after('is_ai_approved');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('task_proofs', function (Blueprint $table) {
            $table->dropColumn(['ai_confidence', 'is_ai_approved', 'ai_analysis']);
        });

        Schema::dropIfExists('travel_allowances');
        Schema::dropIfExists('staff_location_logs');
    }
};
