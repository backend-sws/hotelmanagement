<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Hotel Property Settings (per hotel config)
        Schema::create('hotel_property_settings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('business_id')->constrained('businesses')->cascadeOnDelete();
            $table->enum('property_type', ['boutique', 'budget', 'resort', '3star', '4star', '5star', 'luxury'])->default('3star');
            $table->integer('total_rooms')->default(0);
            $table->time('check_in_time')->default('14:00:00');
            $table->time('check_out_time')->default('11:00:00');
            $table->decimal('late_checkout_charge', 10, 2)->default(0);
            $table->decimal('early_checkin_charge', 10, 2)->default(0);
            $table->enum('default_gst_category', ['ac_room', 'non_ac_room', 'luxury'])->default('ac_room');
            $table->boolean('city_ledger_enabled')->default(false);
            $table->text('footer_for_bills')->nullable();
            $table->string('gstin')->nullable();
            $table->boolean('is_gst_registered')->default(true);
            $table->timestamps();

            $table->unique('business_id');
        });

        // Hotel Room Types
        Schema::create('hotel_room_types', function (Blueprint $table) {
            $table->id();
            $table->foreignId('business_id')->constrained('businesses')->cascadeOnDelete();
            $table->string('name'); // "Deluxe AC", "Suite", "Standard Non-AC"
            $table->string('short_code', 10)->nullable(); // "DLX", "STD", "SUT"
            $table->decimal('base_price_weekday', 10, 2)->default(0);
            $table->decimal('base_price_weekend', 10, 2)->default(0);
            $table->decimal('base_price_peak', 10, 2)->default(0);
            $table->decimal('extra_person_charge', 10, 2)->default(0);
            $table->integer('max_occupancy')->default(2);
            $table->json('amenities')->nullable(); // ["AC", "WiFi", "TV", "Mini-Bar"]
            $table->text('description')->nullable();
            $table->string('display_image_url')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // Hotel Rooms
        Schema::create('hotel_rooms', function (Blueprint $table) {
            $table->id();
            $table->foreignId('business_id')->constrained('businesses')->cascadeOnDelete();
            $table->string('room_number'); // "101", "201A", "Penthouse"
            $table->string('floor')->nullable(); // "Ground", "1st", "2nd"
            $table->foreignId('room_type_id')->constrained('hotel_room_types')->cascadeOnDelete();
            $table->boolean('is_ac')->default(true);
            $table->decimal('current_tariff', 10, 2)->default(0); // Override from room type
            $table->enum('status', ['available', 'occupied', 'reserved', 'dirty', 'maintenance', 'blocked'])->default('available');
            $table->enum('view_type', ['city', 'garden', 'pool', 'sea', 'mountain', 'courtyard', 'none'])->default('none');
            $table->enum('bed_type', ['single', 'double', 'twin', 'king', 'queen'])->default('double');
            $table->integer('max_occupancy')->nullable(); // Override from room type
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->unique(['business_id', 'room_number']);
        });

        // Hotel Rate Plans (Seasonal / Promotional)
        Schema::create('hotel_rate_plans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('business_id')->constrained('businesses')->cascadeOnDelete();
            $table->string('name'); // "Summer Special", "Diwali Package"
            $table->date('start_date');
            $table->date('end_date');
            $table->foreignId('room_type_id')->nullable()->constrained('hotel_room_types')->nullOnDelete(); // null = all types
            $table->enum('modifier_type', ['fixed', 'percentage'])->default('percentage');
            $table->decimal('modifier_value', 10, 2)->default(0); // e.g. 20 = 20% hike, -500 = flat discount
            $table->integer('min_stay_nights')->default(1);
            $table->boolean('is_active')->default(true);
            $table->text('description')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('hotel_rate_plans');
        Schema::dropIfExists('hotel_rooms');
        Schema::dropIfExists('hotel_room_types');
        Schema::dropIfExists('hotel_property_settings');
    }
};
