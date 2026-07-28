<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * IMP-06: Add missing indexes for query performance.
     *
     * 1. products.deleted_at — Product uses SoftDeletes but had no index on deleted_at,
     *    causing a full table scan on every query (WHERE deleted_at IS NULL).
     *
     * 2. ledger_entries composite index — Most queries filter by (business_id, party_type, party_id, date).
     *    A composite index on these 4 columns covers both the statement and balance queries.
     *
     * 3. sales status+business_id index — Outstanding and stats queries filter by status.
     */
    public function up(): void
    {
        // Index for SoftDeletes on products
        Schema::table('products', function (Blueprint $table) {
            $table->index('deleted_at', 'products_deleted_at_index');
            $table->index(['business_id', 'deleted_at'], 'products_business_softdelete_index');
        });

        // Composite index for ledger statement/balance queries (most used pattern)
        Schema::table('ledger_entries', function (Blueprint $table) {
            $table->index(
                ['business_id', 'party_type', 'party_id', 'date'],
                'ledger_entries_party_date_index'
            );
        });

        // Status filter on sales for outstanding queries
        Schema::table('sales', function (Blueprint $table) {
            if (!$this->indexExists('sales', 'sales_business_status_index')) {
                $table->index(['business_id', 'status', 'invoice_type'], 'sales_business_status_index');
            }
        });

        // Index on supplier_purchases balance_amount for outstanding supplier queries
        Schema::table('supplier_purchases', function (Blueprint $table) {
            $table->index(['business_id', 'balance_amount'], 'supplier_purchases_balance_index');
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropIndex('products_deleted_at_index');
            $table->dropIndex('products_business_softdelete_index');
        });

        Schema::table('ledger_entries', function (Blueprint $table) {
            $table->dropIndex('ledger_entries_party_date_index');
        });

        Schema::table('sales', function (Blueprint $table) {
            $table->dropIndex('sales_business_status_index');
        });

        Schema::table('supplier_purchases', function (Blueprint $table) {
            $table->dropIndex('supplier_purchases_balance_index');
        });
    }

    private function indexExists(string $table, string $index): bool
    {
        return collect(\Illuminate\Support\Facades\DB::select("SHOW INDEX FROM `{$table}` WHERE Key_name = '{$index}'"))->isNotEmpty();
    }
};
