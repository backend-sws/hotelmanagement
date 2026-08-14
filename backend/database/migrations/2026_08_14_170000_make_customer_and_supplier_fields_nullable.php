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
        Schema::table('customers', function (Blueprint $table) {
            $table->decimal('credit_limit', 12, 2)->default(0)->nullable()->change();
            $table->decimal('opening_balance', 12, 2)->default(0)->nullable()->change();
            $table->string('credit_period', 20)->default('0')->nullable()->change();
            $table->string('balance_type', 10)->default('debit')->nullable()->change();
        });

        Schema::table('suppliers', function (Blueprint $table) {
            $table->decimal('opening_balance', 12, 2)->default(0)->nullable()->change();
            $table->string('balance_type', 10)->default('credit')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('customers', function (Blueprint $table) {
            $table->decimal('credit_limit', 12, 2)->default(0)->nullable(false)->change();
            $table->decimal('opening_balance', 12, 2)->default(0)->nullable(false)->change();
            $table->string('credit_period', 20)->default('0')->nullable(false)->change();
            $table->string('balance_type', 10)->default('debit')->nullable(false)->change();
        });

        Schema::table('suppliers', function (Blueprint $table) {
            $table->decimal('opening_balance', 12, 2)->default(0)->nullable(false)->change();
            $table->string('balance_type', 10)->default('credit')->nullable(false)->change();
        });
    }
};
