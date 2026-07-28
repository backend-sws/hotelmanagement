<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Add location_id and notes to inventory_movements
        Schema::table('inventory_movements', function (Blueprint $table) {
            $table->foreignId('location_id')->nullable()->after('reference_id')
                ->constrained('business_locations')->nullOnDelete();
            $table->text('notes')->nullable()->after('location_id');
        });

        // Add track_by_location flag to products
        Schema::table('products', function (Blueprint $table) {
            $table->boolean('track_by_location')->default(false)->after('min_stock_alert');
        });
    }

    public function down(): void
    {
        Schema::table('inventory_movements', function (Blueprint $table) {
            $table->dropForeign(['location_id']);
            $table->dropColumn(['location_id', 'notes']);
        });

        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn('track_by_location');
        });
    }
};
