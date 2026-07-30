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
            $table->uuid('uuid')->nullable()->unique()->after('id');
        });
        
        // Populate existing sales with UUIDs
        $sales = \App\Models\Sale::all();
        foreach ($sales as $sale) {
            $sale->uuid = (string) \Illuminate\Support\Str::uuid();
            $sale->save();
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('sales', function (Blueprint $table) {
            $table->dropColumn('uuid');
        });
    }
};
