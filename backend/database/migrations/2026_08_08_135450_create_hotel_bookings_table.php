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
        Schema::create('hotel_bookings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('business_id')->constrained()->cascadeOnDelete();
            $table->string('booking_number')->unique();
            $table->string('booking_source', 50)->default('direct');
            $table->string('ota_booking_ref')->nullable();
            // We will add ota_channel_id foreign key in Phase 6
            $table->foreignId('guest_id')->constrained('hotel_guests')->cascadeOnDelete();
            $table->foreignId('room_id')->constrained('hotel_rooms')->cascadeOnDelete();
            
            $table->date('check_in_date');
            $table->date('check_out_date');
            $table->timestamp('actual_check_in_at')->nullable();
            $table->timestamp('actual_check_out_at')->nullable();
            
            $table->integer('total_nights');
            $table->integer('adults')->default(1);
            $table->integer('children')->default(0);
            
            $table->decimal('room_rate_per_night', 10, 2);
            $table->decimal('total_room_charges', 10, 2);
            $table->decimal('total_extra_charges', 10, 2)->default(0);
            $table->decimal('total_taxes', 10, 2)->default(0);
            $table->decimal('grand_total', 10, 2)->default(0);
            $table->decimal('amount_paid', 10, 2)->default(0);
            $table->decimal('balance_due', 10, 2)->default(0);
            
            $table->enum('status', ['confirmed', 'checked_in', 'checked_out', 'cancelled', 'no_show'])->default('confirmed');
            
            $table->text('special_requests')->nullable();
            $table->text('notes')->nullable();
            
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hotel_bookings');
    }
};
