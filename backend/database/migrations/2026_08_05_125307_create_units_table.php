<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('units', function (Blueprint $table) {
            $table->id();
            $table->foreignId('business_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->timestamps();

            $table->unique(['business_id', 'name']);
        });

        // Seed some default units for all existing businesses
        $businesses = DB::table('businesses')->get();
        $defaultUnits = ['Pcs', 'Nos', 'Kgs', 'Ltrs', 'Box', 'Pkts', 'Mtrs', 'Rolls', 'Set', 'SqFt'];
        
        foreach ($businesses as $business) {
            $insertData = [];
            foreach ($defaultUnits as $unit) {
                $insertData[] = [
                    'business_id' => $business->id,
                    'name' => $unit,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
            DB::table('units')->insertOrIgnore($insertData);
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('units');
    }
};
