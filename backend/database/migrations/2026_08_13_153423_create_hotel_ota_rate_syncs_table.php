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
        Schema::create('hotel_ota_rate_syncs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('business_id')->constrained()->cascadeOnDelete();
            $table->foreignId('channel_id')->constrained('hotel_ota_channels')->cascadeOnDelete();
            $table->foreignId('room_type_id')->constrained('hotel_room_types')->cascadeOnDelete();
            $table->date('sync_date');
            $table->integer('available_rooms');
            $table->decimal('rate', 10, 2);
            $table->json('restrictions')->nullable();
            $table->enum('sync_status', ['pending', 'synced', 'failed'])->default('pending');
            $table->timestamp('synced_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hotel_ota_rate_syncs');
    }
};
