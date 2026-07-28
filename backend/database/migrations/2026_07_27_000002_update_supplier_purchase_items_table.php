<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('supplier_purchase_items', function (Blueprint $table) {
            $table->string('hsn_code', 20)->nullable()->after('product_id');
            $table->string('unit', 20)->nullable()->after('hsn_code');
            $table->decimal('gst_rate', 5, 2)->default(0)->after('purchase_price');
            $table->decimal('taxable_amount', 12, 2)->default(0)->after('total_price');
            $table->decimal('cgst_amount', 12, 2)->default(0)->after('taxable_amount');
            $table->decimal('sgst_amount', 12, 2)->default(0)->after('cgst_amount');
            $table->decimal('igst_amount', 12, 2)->default(0)->after('sgst_amount');
        });

        // Backfill taxable_amount for existing items
        DB::table('supplier_purchase_items')->update([
            'taxable_amount' => DB::raw('total_price')
        ]);
    }

    public function down(): void
    {
        Schema::table('supplier_purchase_items', function (Blueprint $table) {
            $table->dropColumn([
                'hsn_code',
                'unit',
                'gst_rate',
                'taxable_amount',
                'cgst_amount',
                'sgst_amount',
                'igst_amount'
            ]);
        });
    }
};
