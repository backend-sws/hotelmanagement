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
        Schema::create('business_wallets', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('business_id')->unique();
            $table->decimal('balance', 10, 4)->default(0.0000);
            $table->string('currency', 10)->default('INR');
            $table->decimal('low_balance_threshold', 10, 2)->default(200.00);
            $table->boolean('auto_recharge_enabled')->default(false);
            $table->decimal('auto_recharge_amount', 10, 2)->nullable();
            $table->decimal('total_recharged', 12, 4)->default(0.0000);
            $table->decimal('total_consumed', 12, 4)->default(0.0000);
            $table->enum('status', ['active', 'low_balance', 'suspended', 'depleted'])->default('active');
            $table->timestamps();

            $table->foreign('business_id')->references('id')->on('businesses')->onDelete('cascade');
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('business_wallets');
    }
};
