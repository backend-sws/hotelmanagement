<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ledger_entries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('business_id')->constrained()->cascadeOnDelete();
            $table->string('party_type', 30); // 'customer', 'supplier'
            $table->unsignedBigInteger('party_id'); // customer_id or supplier_id
            $table->string('entry_type', 50); // invoice, purchase_bill, payment, credit_note, debit_note, opening_balance, adjustment
            $table->string('reference_type', 50)->nullable(); // model name or short string: 'invoice', 'purchase', 'payment'
            $table->unsignedBigInteger('reference_id')->nullable();
            $table->date('date');
            $table->decimal('debit', 12, 2)->default(0);
            $table->decimal('credit', 12, 2)->default(0);
            $table->decimal('balance', 12, 2)->default(0); // running net balance
            $table->text('narration')->nullable();
            $table->timestamps();

            $table->index(['business_id', 'party_type', 'party_id']);
            $table->index(['date']);
            $table->index(['reference_type', 'reference_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ledger_entries');
    }
};
