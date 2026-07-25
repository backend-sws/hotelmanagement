<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            // Billing software fields
            $table->string('item_code', 50)->nullable()->after('model_name');
            $table->string('unit', 30)->default('nos')->after('item_code')
                  ->comment('ton, cft, brass, bag, sqft, nos, rft, lumpsum, kg, ltr, mtr, set');
            $table->string('hsn_code', 10)->nullable()->after('unit');
            $table->decimal('gst_rate', 5, 2)->default(18)->after('hsn_code')
                  ->comment('0, 5, 12, 18, 28');
            $table->decimal('sale_rate', 12, 2)->default(0)->after('gst_rate');
            $table->decimal('min_stock_alert', 10, 3)->default(0)->after('sale_rate');
            $table->string('barcode', 100)->nullable()->unique()->after('min_stock_alert');
            $table->text('description')->nullable()->after('barcode');

            // Rename purchase_price → keep as is (already exists), add purchase_rate alias
            // purchase_price already exists — we keep it and add purchase_rate for billing
            $table->decimal('purchase_rate', 12, 2)->default(0)->after('sale_rate');

            // Make quantity DECIMAL for weight-based billing (was integer)
            // We'll change via raw for safety
        });

        // Change quantity column to DECIMAL for weight-based items
        Schema::table('products', function (Blueprint $table) {
            $table->decimal('quantity', 12, 3)->default(0)->change();
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn([
                'item_code', 'unit', 'hsn_code', 'gst_rate',
                'sale_rate', 'purchase_rate', 'min_stock_alert',
                'barcode', 'description',
            ]);
            $table->integer('quantity')->default(0)->change();
        });
    }
};
