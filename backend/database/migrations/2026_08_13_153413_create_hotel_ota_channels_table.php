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
        Schema::create('hotel_ota_channels', function (Blueprint $table) {
            $table->id();
            $table->foreignId('business_id')->constrained()->cascadeOnDelete();
            $table->string('channel_name');
            $table->enum('channel_type', ['ota_direct', 'channel_manager']);
            $table->text('api_key')->nullable();
            $table->text('api_secret')->nullable();
            $table->string('property_code')->nullable();
            $table->string('webhook_secret')->nullable();
            $table->enum('sync_status', ['connected', 'disconnected', 'error', 'pending_setup'])->default('pending_setup');
            $table->timestamp('last_sync_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hotel_ota_channels');
    }
};
