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
        Schema::create('hotel_corporate_payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('hotel_corporate_account_id')->constrained('hotel_corporate_accounts')->cascadeOnDelete();
            $table->decimal('amount', 12, 2);
            $table->date('payment_date');
            $table->enum('payment_mode', ['bank_transfer', 'cheque', 'upi', 'neft', 'rtgs', 'cash']);
            $table->string('transaction_ref')->nullable();
            $table->string('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hotel_corporate_payments');
    }
};
