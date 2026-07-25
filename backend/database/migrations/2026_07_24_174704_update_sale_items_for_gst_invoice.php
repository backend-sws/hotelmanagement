<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // First we modify the quantity column type
        DB::statement('ALTER TABLE sale_items MODIFY quantity DECIMAL(10,3)');

        Schema::table('sale_items', function (Blueprint $table) {
            $table->string('hsn_code', 15)->nullable()->after('quantity');
            $table->string('unit', 20)->nullable()->after('hsn_code');
            $table->decimal('gst_rate', 5, 2)->default(0)->after('unit');
            $table->decimal('taxable_amount', 12, 2)->default(0)->after('gst_rate');
            $table->decimal('cgst_amount', 12, 2)->default(0)->after('taxable_amount');
            $table->decimal('sgst_amount', 12, 2)->default(0)->after('cgst_amount');
            $table->decimal('igst_amount', 12, 2)->default(0)->after('sgst_amount');
            
            // Renaming via statements or renaming methods
            $table->renameColumn('unit_price', 'rate');
            $table->renameColumn('subtotal', 'amount');
        });
    }

    public function down(): void
    {
        Schema::table('sale_items', function (Blueprint $table) {
            $table->dropColumn([
                'hsn_code', 'unit', 'gst_rate', 'taxable_amount', 
                'cgst_amount', 'sgst_amount', 'igst_amount'
            ]);
            $table->renameColumn('rate', 'unit_price');
            $table->renameColumn('amount', 'subtotal');
        });
        
        DB::statement('ALTER TABLE sale_items MODIFY quantity INT');
    }
};
