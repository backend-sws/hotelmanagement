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
        Schema::table('suppliers', function (Blueprint $table) {
            if (!Schema::hasColumn('suppliers', 'email')) {
                $table->string('email')->nullable()->after('phone');
            }
            if (!Schema::hasColumn('suppliers', 'pan')) {
                $table->string('pan', 10)->nullable()->after('gstin');
            }
            if (!Schema::hasColumn('suppliers', 'bank_name')) {
                $table->string('bank_name', 100)->nullable()->after('state_name');
            }
            if (!Schema::hasColumn('suppliers', 'account_number')) {
                $table->string('account_number', 50)->nullable()->after('bank_name');
            }
            if (!Schema::hasColumn('suppliers', 'ifsc_code')) {
                $table->string('ifsc_code', 20)->nullable()->after('account_number');
            }
            if (!Schema::hasColumn('suppliers', 'branch_name')) {
                $table->string('branch_name', 100)->nullable()->after('ifsc_code');
            }
            if (!Schema::hasColumn('suppliers', 'upi_id')) {
                $table->string('upi_id', 100)->nullable()->after('branch_name');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('suppliers', function (Blueprint $table) {
            $columnsToDrop = [];
            foreach (['email', 'pan', 'bank_name', 'account_number', 'ifsc_code', 'branch_name', 'upi_id'] as $column) {
                if (Schema::hasColumn('suppliers', $column)) {
                    $columnsToDrop[] = $column;
                }
            }
            if (!empty($columnsToDrop)) {
                $table->dropColumn($columnsToDrop);
            }
        });
    }
};
