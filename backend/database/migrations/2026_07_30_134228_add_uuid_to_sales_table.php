<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (!Schema::hasColumn('sales', 'uuid')) {
            Schema::table('sales', function (Blueprint $table) {
                $table->uuid('uuid')->nullable()->unique()->after('id');
            });
        }
        
        // Populate existing sales with UUIDs using direct DB query (avoids Eloquent SoftDeletes issue)
        $sales = DB::table('sales')->whereNull('uuid')->get();
        foreach ($sales as $sale) {
            DB::table('sales')->where('id', $sale->id)->update([
                'uuid' => (string) Str::uuid(),
            ]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasColumn('sales', 'uuid')) {
            Schema::table('sales', function (Blueprint $table) {
                $table->dropColumn('uuid');
            });
        }
    }
};
