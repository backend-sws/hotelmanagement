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
        Schema::create('hotel_tax_configs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('business_id')->constrained()->cascadeOnDelete();
            $table->integer('room_slab_1_upto')->default(1000); // 0%
            $table->integer('room_slab_2_upto')->default(7500); // 12%
            $table->decimal('room_slab_3_rate', 5, 2)->default(18); // Above slab 2
            $table->decimal('restaurant_non_ac_rate', 5, 2)->default(5);
            $table->decimal('restaurant_ac_rate', 5, 2)->default(18);
            $table->boolean('luxury_tax_applicable')->default(false);
            $table->decimal('luxury_tax_rate', 5, 2)->default(0);
            $table->boolean('is_gst_registered')->default(true);
            $table->string('gstin')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hotel_tax_configs');
    }
};
