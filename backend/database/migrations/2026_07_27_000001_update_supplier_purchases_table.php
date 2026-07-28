<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('supplier_purchases', function (Blueprint $table) {
            $table->string('invoice_type', 50)->default('purchase_bill')->after('supplier_id');
            $table->string('bill_number', 50)->nullable()->after('purchase_number');
            $table->date('bill_date')->nullable()->after('bill_number');
            $table->decimal('taxable_amount', 12, 2)->default(0)->after('bill_amount');
            $table->decimal('cgst_amount', 12, 2)->default(0)->after('taxable_amount');
            $table->decimal('sgst_amount', 12, 2)->default(0)->after('cgst_amount');
            $table->decimal('igst_amount', 12, 2)->default(0)->after('sgst_amount');
            $table->decimal('total_tax_amount', 12, 2)->default(0)->after('igst_amount');
            $table->decimal('balance_amount', 12, 2)->default(0)->after('paid_amount');
            $table->unsignedBigInteger('location_id')->nullable()->after('due_date');
            $table->text('notes')->nullable()->after('invoice_file');
            $table->string('status', 20)->default('confirmed')->after('notes');
            $table->boolean('is_itc_eligible')->default(true)->after('status');

            $table->foreign('location_id')->references('id')->on('business_locations')->nullOnDelete();
        });

        // Backfill balance_amount for any existing purchase bills
        DB::table('supplier_purchases')->update([
            'balance_amount' => DB::raw('bill_amount - paid_amount'),
            'taxable_amount' => DB::raw('bill_amount'),
            'status' => 'confirmed'
        ]);
    }

    public function down(): void
    {
        Schema::table('supplier_purchases', function (Blueprint $table) {
            $table->dropForeign(['location_id']);
            $table->dropColumn([
                'invoice_type',
                'bill_number',
                'bill_date',
                'taxable_amount',
                'cgst_amount',
                'sgst_amount',
                'igst_amount',
                'total_tax_amount',
                'balance_amount',
                'location_id',
                'notes',
                'status',
                'is_itc_eligible'
            ]);
        });
    }
};
