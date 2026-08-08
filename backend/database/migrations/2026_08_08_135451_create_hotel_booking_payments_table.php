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
        Schema::create('hotel_booking_payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('booking_id')->constrained('hotel_bookings')->cascadeOnDelete();
            $table->decimal('amount', 10, 2);
            $table->enum('payment_mode', ['cash', 'upi', 'card', 'bank_transfer', 'corporate']);
            $table->string('transaction_ref')->nullable();
            $table->foreignId('collected_by')->nullable()->constrained('users')->nullOnDelete();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hotel_booking_payments');
    }
};
