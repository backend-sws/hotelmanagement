<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('suppliers', function (Blueprint $table) {
            $table->string('gstin', 15)->nullable()->after('address');
            $table->string('state_code', 2)->nullable()->after('gstin');
            $table->string('state_name', 50)->nullable()->after('state_code');
            $table->decimal('opening_balance', 12, 2)->default(0)->after('items_supplied');
            $table->enum('balance_type', ['debit', 'credit'])->default('credit')->after('opening_balance')
                  ->comment('credit = we owe supplier, debit = supplier owes us');
        });
    }

    public function down(): void
    {
        Schema::table('suppliers', function (Blueprint $table) {
            $table->dropColumn([
                'gstin', 'state_code', 'state_name', 'opening_balance', 'balance_type'
            ]);
        });
    }
};
