<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('sales', function (Blueprint $table) {
            $table->enum('invoice_type', [
                'sales_invoice', 'proforma', 'delivery_challan', 
                'quotation', 'credit_note', 'debit_note', 'purchase_bill'
            ])->default('sales_invoice')->after('invoice_number');
            $table->enum('tax_type', ['gst', 'igst', 'none'])->default('gst')->after('invoice_type');
            $table->decimal('cgst_amount', 12, 2)->default(0)->after('discount');
            $table->decimal('sgst_amount', 12, 2)->default(0)->after('cgst_amount');
            $table->decimal('igst_amount', 12, 2)->default(0)->after('sgst_amount');
            $table->decimal('total_tax_amount', 12, 2)->default(0)->after('igst_amount');
            $table->decimal('taxable_amount', 12, 2)->default(0)->after('total_tax_amount');
            $table->string('place_of_supply', 2)->nullable()->after('taxable_amount')->comment('State Code');
            $table->date('due_date')->nullable()->after('date');
            $table->string('vehicle_number', 50)->nullable()->after('due_date');
            $table->string('driver_name', 100)->nullable()->after('vehicle_number');
            $table->unsignedBigInteger('project_id')->nullable()->after('driver_name');
            $table->unsignedBigInteger('location_id')->nullable()->after('project_id');
            $table->boolean('is_recurring')->default(false)->after('location_id');
            $table->enum('recurring_freq', ['weekly', 'monthly', 'quarterly'])->nullable()->after('is_recurring');
            $table->date('recurring_end_date')->nullable()->after('recurring_freq');
            $table->unsignedBigInteger('parent_id')->nullable()->after('recurring_end_date')->comment('Source doc ID');
            $table->timestamp('converted_at')->nullable()->after('parent_id');
            $table->string('reference_number', 50)->nullable()->after('converted_at')->comment('Supplier Bill No');
            $table->text('terms_conditions')->nullable()->after('notes');
            $table->date('validity_date')->nullable()->after('due_date');
            $table->text('narration')->nullable()->after('terms_conditions');
        });
    }

    public function down(): void
    {
        Schema::table('sales', function (Blueprint $table) {
            $table->dropColumn([
                'invoice_type', 'tax_type', 'cgst_amount', 'sgst_amount', 'igst_amount', 
                'total_tax_amount', 'taxable_amount', 'place_of_supply', 'due_date', 
                'vehicle_number', 'driver_name', 'project_id', 'location_id', 
                'is_recurring', 'recurring_freq', 'recurring_end_date', 'parent_id', 
                'converted_at', 'reference_number', 'terms_conditions', 'validity_date', 'narration'
            ]);
        });
    }
};
