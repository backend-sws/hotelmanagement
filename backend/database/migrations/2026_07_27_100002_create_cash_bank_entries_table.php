<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cash_bank_entries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('business_id')->constrained('businesses')->onDelete('cascade');
            $table->foreignId('bank_account_id')->nullable()->constrained('bank_accounts')->onDelete('set null');
            $table->enum('entry_type', ['cash_receipt', 'cash_payment', 'bank_receipt', 'bank_payment', 'contra']);
            $table->enum('account_type', ['cash', 'bank'])->default('cash');
            $table->string('account_name', 100)->nullable(); // e.g., Petty Cash or Bank Account Name
            $table->string('party_type', 50)->nullable(); // customer, supplier, expense, other
            $table->unsignedBigInteger('party_id')->nullable();
            $table->decimal('amount', 12, 2);
            $table->string('payment_mode', 50)->default('cash'); // cash, upi, neft, rtgs, cheque, dd, other
            $table->string('reference_no', 100)->nullable(); // UPI txn id, cheque number, UTR
            $table->text('narration')->nullable();
            $table->date('date');
            $table->foreignId('entered_by')->nullable()->constrained('users')->onDelete('set null');
            $table->string('reference_type', 50)->nullable(); // invoice, purchase, cheque, expense
            $table->unsignedBigInteger('reference_id')->nullable();
            $table->timestamps();

            $table->index(['business_id', 'date', 'account_type']);
            $table->index(['business_id', 'entry_type']);
            $table->index(['party_type', 'party_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cash_bank_entries');
    }
};
