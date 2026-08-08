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
        Schema::create('hotel_folio_charges', function (Blueprint $table) {
            $table->id();
            $table->foreignId('booking_id')->constrained('hotel_bookings')->cascadeOnDelete();
            $table->enum('charge_type', [
                'room_rent', 'room_service', 'restaurant', 'laundry', 
                'minibar', 'telephone', 'spa', 'extra_bed', 'early_checkin', 
                'late_checkout', 'cancellation_fee', 'other'
            ]);
            // Service ID will be used in Phase 3 for POS linking, nullable for now
            $table->unsignedBigInteger('hotel_service_id')->nullable();
            
            $table->string('description');
            $table->date('charge_date');
            
            $table->decimal('qty', 8, 2)->default(1);
            $table->decimal('unit_price', 10, 2);
            $table->decimal('total_price', 10, 2); // qty * unit_price
            
            $table->decimal('tax_percent', 5, 2)->default(0);
            $table->decimal('tax_amount', 10, 2)->default(0);
            $table->decimal('grand_total', 10, 2)->default(0); // total_price + tax_amount
            
            $table->foreignId('posted_by')->nullable()->constrained('users')->nullOnDelete();
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hotel_folio_charges');
    }
};
