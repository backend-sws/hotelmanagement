<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('customers', function (Blueprint $table) {
            $table->string('gstin', 15)->nullable()->after('address');
            $table->string('state_code', 2)->nullable()->after('gstin');
            $table->string('state_name', 50)->nullable()->after('state_code');
            $table->string('email', 100)->nullable()->after('phone');
            $table->string('credit_period', 20)->default('0')->after('state_name')
                  ->comment('Number of days credit allowed');
            $table->decimal('credit_limit', 12, 2)->default(0)->after('credit_period');
            $table->decimal('opening_balance', 12, 2)->default(0)->after('credit_limit');
            $table->enum('balance_type', ['debit', 'credit'])->default('debit')->after('opening_balance')
                  ->comment('debit = customer owes us, credit = we owe customer');
            $table->unsignedBigInteger('price_list_id')->nullable()->after('balance_type');
            // Note: FK to price_lists added after price_lists table is created
        });
    }

    public function down(): void
    {
        Schema::table('customers', function (Blueprint $table) {
            $table->dropColumn([
                'gstin', 'state_code', 'state_name', 'email',
                'credit_period', 'credit_limit', 'opening_balance',
                'balance_type', 'price_list_id',
            ]);
        });
    }
};
