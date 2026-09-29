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
        Schema::create('field_tasks', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('business_id');
            $table->unsignedBigInteger('staff_id');
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('site_name');
            $table->decimal('site_lat', 10, 7)->nullable();
            $table->decimal('site_lng', 10, 7)->nullable();
            $table->string('site_address')->nullable();
            $table->string('client_name')->nullable();
            $table->string('client_phone', 25)->nullable();
            $table->string('client_otp', 10)->nullable();
            $table->timestamp('otp_verified_at')->nullable();
            $table->enum('status', [
                'assigned',
                'in_transit',
                'reached',
                'awaiting_otp',
                'completed',
                'cancelled'
            ])->default('assigned');
            $table->enum('priority', ['low', 'medium', 'high', 'urgent'])->default('medium');
            $table->timestamp('due_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();

            $table->foreign('business_id')->references('id')->on('businesses')->onDelete('cascade');
            $table->foreign('staff_id')->references('id')->on('users')->onDelete('cascade');
            $table->index(['business_id', 'status']);
            $table->index(['staff_id', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('field_tasks');
    }
};
