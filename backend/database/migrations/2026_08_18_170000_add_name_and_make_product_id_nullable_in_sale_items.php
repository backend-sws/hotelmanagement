<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement('ALTER TABLE sale_items MODIFY product_id BIGINT UNSIGNED NULL');

        Schema::table('sale_items', function (Blueprint $table) {
            if (!Schema::hasColumn('sale_items', 'name')) {
                $table->string('name')->nullable()->after('product_id');
            }
            if (!Schema::hasColumn('sale_items', 'description')) {
                $table->text('description')->nullable()->after('name');
            }
        });
    }

    public function down(): void
    {
        Schema::table('sale_items', function (Blueprint $table) {
            if (Schema::hasColumn('sale_items', 'description')) {
                $table->dropColumn('description');
            }
            if (Schema::hasColumn('sale_items', 'name')) {
                $table->dropColumn('name');
            }
        });
    }
};
