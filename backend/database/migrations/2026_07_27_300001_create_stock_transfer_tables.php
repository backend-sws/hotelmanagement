<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Stock Transfers
        Schema::create('stock_transfers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('business_id')->constrained('businesses')->cascadeOnDelete();
            $table->string('transfer_number', 50)->unique();
            $table->foreignId('from_location_id')->nullable()->constrained('business_locations')->nullOnDelete();
            $table->foreignId('to_location_id')->nullable()->constrained('business_locations')->nullOnDelete();
            $table->date('transfer_date');
            $table->text('notes')->nullable();
            $table->enum('status', ['draft', 'completed', 'cancelled'])->default('completed');
            $table->foreignId('transferred_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->index(['business_id', 'transfer_date']);
            $table->index(['business_id', 'status']);
        });

        // 2. Stock Transfer Items
        Schema::create('stock_transfer_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('stock_transfer_id')->constrained('stock_transfers')->cascadeOnDelete();
            $table->foreignId('product_id')->constrained('products')->cascadeOnDelete();
            $table->decimal('quantity', 10, 3);
            $table->string('unit', 20)->nullable();
            $table->string('notes', 255)->nullable();
            $table->timestamps();

            $table->index(['stock_transfer_id']);
            $table->index(['product_id']);
        });

        // 3. Product Stock per Location (Godown-wise)
        Schema::create('product_stock_locations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('business_id')->constrained('businesses')->cascadeOnDelete();
            $table->foreignId('product_id')->constrained('products')->cascadeOnDelete();
            $table->foreignId('location_id')->constrained('business_locations')->cascadeOnDelete();
            $table->decimal('quantity', 10, 3)->default(0);
            $table->timestamps();

            $table->unique(['product_id', 'location_id'], 'product_location_unique');
            $table->index(['business_id', 'location_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('stock_transfer_items');
        Schema::dropIfExists('stock_transfers');
        Schema::dropIfExists('product_stock_locations');
    }
};
