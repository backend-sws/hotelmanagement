<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('itc_ledgers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('business_id')->constrained()->cascadeOnDelete();
            $table->foreignId('supplier_purchase_id')->constrained('supplier_purchases')->cascadeOnDelete();
            $table->string('month', 10); // Format: YYYY-MM
            $table->decimal('cgst_amount', 12, 2)->default(0);
            $table->decimal('sgst_amount', 12, 2)->default(0);
            $table->decimal('igst_amount', 12, 2)->default(0);
            $table->decimal('total_itc', 12, 2)->default(0);
            $table->boolean('is_claimed')->default(false);
            $table->timestamp('claimed_at')->nullable();
            $table->timestamps();

            $table->index(['business_id', 'month']);
            $table->index(['business_id', 'is_claimed']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('itc_ledgers');
    }
};
