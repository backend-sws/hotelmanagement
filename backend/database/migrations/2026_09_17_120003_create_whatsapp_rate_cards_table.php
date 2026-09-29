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
        Schema::create('whatsapp_rate_cards', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('business_id')->nullable()->comment('NULL = Global platform default, otherwise tenant custom override');
            $table->enum('category', [
                'utility',
                'authentication',
                'service',
                'marketing',
                'ai_vision'
            ]);
            $table->decimal('wholesale_cost', 8, 4)->comment('Meta or AI cost in INR');
            $table->decimal('retail_price', 8, 4)->comment('Price charged to business in INR');
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->foreign('business_id')->references('id')->on('businesses')->onDelete('cascade');
            $table->index(['business_id', 'category']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('whatsapp_rate_cards');
    }
};
