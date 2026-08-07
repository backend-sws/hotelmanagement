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
        Schema::table('sales', function (Blueprint $table) {
            $table->decimal('cess_amount', 12, 2)->default(0)->after('igst_amount');
        });

        Schema::table('sale_items', function (Blueprint $table) {
            $table->decimal('cess_rate', 5, 2)->default(0)->after('gst_rate');
            $table->decimal('cess_amount', 12, 2)->default(0)->after('igst_amount');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('sales_and_items', function (Blueprint $table) {
            //
        });
    }
};
