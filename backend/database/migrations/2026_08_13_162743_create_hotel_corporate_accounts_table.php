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
        Schema::create('hotel_corporate_accounts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('business_id')->constrained()->cascadeOnDelete();
            
            $table->string('company_name');
            $table->string('gst_number')->nullable();
            
            // Contact Details
            $table->string('address')->nullable();
            $table->string('city')->nullable();
            $table->string('state')->nullable();
            $table->string('pincode')->nullable();
            $table->string('contact_person')->nullable();
            $table->string('contact_phone')->nullable();
            $table->string('contact_email')->nullable();
            
            // Financials & Credit terms
            $table->decimal('credit_limit', 12, 2)->default(0);
            $table->enum('billing_cycle', ['weekly', 'fortnightly', 'monthly'])->default('monthly');
            $table->integer('credit_days')->default(30);
            $table->decimal('discount_percent', 5, 2)->default(0); // negotiated discount
            
            // Balances
            $table->decimal('current_outstanding', 12, 2)->default(0);
            
            // Metadata
            $table->date('contract_start_date')->nullable();
            $table->date('contract_end_date')->nullable();
            $table->enum('status', ['active', 'suspended', 'expired'])->default('active');
            $table->text('notes')->nullable();
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hotel_corporate_accounts');
    }
};
