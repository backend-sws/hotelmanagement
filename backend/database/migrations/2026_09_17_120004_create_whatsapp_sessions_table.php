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
        Schema::create('whatsapp_sessions', function (Blueprint $table) {
            $table->id();
            $table->string('phone_number', 25)->index();
            $table->unsignedBigInteger('business_id')->index();
            $table->unsignedBigInteger('staff_id')->nullable()->index();
            $table->string('current_state', 50)->default('IDLE');
            $table->json('state_data')->nullable();
            $table->timestamp('expires_at')->index();
            $table->timestamps();

            $table->unique(['phone_number', 'business_id'], 'unique_phone_biz_session');
            $table->foreign('business_id')->references('id')->on('businesses')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('whatsapp_sessions');
    }
};
