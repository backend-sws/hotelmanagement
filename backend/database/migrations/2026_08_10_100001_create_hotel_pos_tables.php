<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Hotel Outlets (Restaurant, Bar, Spa, Room Service, etc.)
        Schema::create('hotel_outlets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('business_id')->constrained('businesses')->cascadeOnDelete();
            $table->string('name'); // "Main Restaurant", "Poolside Bar", "Spa"
            $table->enum('outlet_type', ['restaurant', 'bar', 'spa', 'room_service', 'banquet', 'laundry', 'other'])->default('restaurant');
            $table->boolean('is_active')->default(true);
            $table->text('description')->nullable();
            $table->timestamps();

            $table->index('business_id');
        });

        // Hotel Services / Menu Catalog
        Schema::create('hotel_services', function (Blueprint $table) {
            $table->id();
            $table->foreignId('business_id')->constrained('businesses')->cascadeOnDelete();
            $table->foreignId('outlet_id')->constrained('hotel_outlets')->cascadeOnDelete();
            $table->string('name'); // "Masala Dosa", "Extra Bed", "Airport Drop"
            $table->enum('category', ['food', 'beverage', 'laundry', 'transport', 'spa', 'minibar', 'misc'])->default('food');
            $table->text('description')->nullable();
            $table->decimal('price', 10, 2)->default(0);
            $table->enum('tax_type', ['inclusive', 'exclusive', 'nil'])->default('exclusive');
            $table->decimal('tax_percent', 5, 2)->default(5.00);
            $table->boolean('is_available')->default(true);
            $table->string('image_url')->nullable();
            $table->integer('sort_order')->default(0);
            $table->timestamps();

            $table->index(['business_id', 'outlet_id']);
        });

        // Hotel POS Orders
        Schema::create('hotel_pos_orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('business_id')->constrained('businesses')->cascadeOnDelete();
            $table->string('order_number')->unique();
            $table->foreignId('outlet_id')->constrained('hotel_outlets');
            $table->foreignId('booking_id')->nullable()->constrained('hotel_bookings')->nullOnDelete();
            $table->string('table_no')->nullable(); // "T5", "R101" (room number for room service)
            $table->enum('order_type', ['dine_in', 'room_service', 'takeaway', 'post_to_room'])->default('dine_in');
            $table->enum('status', ['pending', 'processing', 'served', 'billed', 'cancelled'])->default('pending');
            $table->decimal('subtotal', 10, 2)->default(0);
            $table->decimal('tax_amount', 10, 2)->default(0);
            $table->decimal('discount_amount', 10, 2)->default(0);
            $table->decimal('total', 10, 2)->default(0);
            $table->enum('payment_mode', ['cash', 'upi', 'card', 'post_to_room', 'complimentary'])->nullable();
            $table->string('notes')->nullable();
            $table->foreignId('billed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('billed_at')->nullable();
            $table->timestamp('kot_printed_at')->nullable();
            $table->timestamps();

            $table->index(['business_id', 'status']);
            $table->index(['business_id', 'outlet_id']);
        });

        // Hotel POS Order Items
        Schema::create('hotel_pos_order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('hotel_pos_orders')->cascadeOnDelete();
            $table->foreignId('service_id')->nullable()->constrained('hotel_services')->nullOnDelete();
            $table->string('name'); // snapshot of service name
            $table->string('category')->nullable();
            $table->decimal('qty', 8, 2)->default(1);
            $table->decimal('unit_price', 10, 2);
            $table->decimal('tax_percent', 5, 2)->default(0);
            $table->decimal('tax_amount', 10, 2)->default(0);
            $table->decimal('total_price', 10, 2);
            $table->string('notes')->nullable(); // "No onion", "Extra spicy"
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('hotel_pos_order_items');
        Schema::dropIfExists('hotel_pos_orders');
        Schema::dropIfExists('hotel_services');
        Schema::dropIfExists('hotel_outlets');
    }
};
