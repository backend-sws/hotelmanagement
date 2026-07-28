<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cheque_registers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('business_id')->constrained('businesses')->onDelete('cascade');
            $table->foreignId('bank_account_id')->nullable()->constrained('bank_accounts')->onDelete('set null');
            $table->string('cheque_number', 50);
            $table->string('bank_name', 100);
            $table->string('branch', 100)->nullable();
            $table->date('cheque_date');
            $table->decimal('amount', 12, 2);
            $table->enum('type', ['received', 'issued']); // received from customer / issued to supplier
            $table->string('party_type', 50)->default('customer'); // customer, supplier, other
            $table->unsignedBigInteger('party_id')->nullable();
            $table->string('in_favour_of', 150)->nullable();
            $table->date('deposit_date')->nullable();
            $table->date('clearance_date')->nullable();
            $table->date('bounce_date')->nullable();
            $table->string('bounce_reason', 255)->nullable();
            $table->enum('status', ['pending', 'deposited', 'cleared', 'bounced', 'cancelled'])->default('pending');
            $table->unsignedBigInteger('reference_invoice_id')->nullable(); // invoice or purchase bill id
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index(['business_id', 'status']);
            $table->index(['business_id', 'type', 'cheque_date']);
            $table->index(['party_type', 'party_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cheque_registers');
    }
};
