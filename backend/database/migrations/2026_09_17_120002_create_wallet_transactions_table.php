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
        Schema::create('wallet_transactions', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('business_id');
            $table->unsignedBigInteger('wallet_id');
            $table->enum('type', ['credit', 'debit']);
            $table->enum('category', [
                'recharge',
                'refund',
                'whatsapp_utility',
                'whatsapp_auth',
                'whatsapp_service',
                'whatsapp_marketing',
                'ai_vision_check',
                'admin_adjustment'
            ]);
            $table->decimal('amount', 10, 4);
            $table->decimal('balance_before', 10, 4);
            $table->decimal('balance_after', 10, 4);
            $table->string('reference_id', 100)->nullable()->comment('Payment gateway ID, WAMID, or task ID');
            $table->string('description', 255);
            $table->json('metadata')->nullable()->comment('staff_id, recipient_phone, wholesale_cost, retail_price, platform_profit');
            $table->timestamps();

            $table->foreign('business_id')->references('id')->on('businesses')->onDelete('cascade');
            $table->foreign('wallet_id')->references('id')->on('business_wallets')->onDelete('cascade');
            $table->index(['business_id', 'created_at']);
            $table->index('category');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('wallet_transactions');
    }
};
