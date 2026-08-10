<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('hotel_pos_tables', function (Blueprint $table) {
            $table->id();
            $table->foreignId('business_id')->constrained('businesses')->cascadeOnDelete();
            $table->foreignId('outlet_id')->constrained('hotel_outlets')->cascadeOnDelete();
            $table->string('name');
            $table->integer('capacity')->default(2);
            $table->enum('status', ['available', 'occupied', 'reserved', 'out_of_service'])->default('available');
            $table->timestamps();
        });

        Schema::create('hotel_table_reservations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('business_id')->constrained('businesses')->cascadeOnDelete();
            $table->foreignId('outlet_id')->constrained('hotel_outlets')->cascadeOnDelete();
            $table->foreignId('table_id')->constrained('hotel_pos_tables')->cascadeOnDelete();
            $table->string('guest_name');
            $table->string('guest_phone')->nullable();
            $table->integer('guest_count')->default(2);
            $table->dateTime('reservation_time');
            $table->integer('grace_period_minutes')->default(15);
            $table->decimal('deposit_amount', 10, 2)->default(0);
            $table->text('special_requests')->nullable();
            $table->enum('status', ['pending', 'seated', 'cancelled', 'completed', 'no_show'])->default('pending');
            $table->timestamps();
        });

        Schema::table('hotel_pos_orders', function (Blueprint $table) {
            $table->foreignId('table_id')->nullable()->after('outlet_id')->constrained('hotel_pos_tables')->nullOnDelete();
            $table->foreignId('reservation_id')->nullable()->after('table_id')->constrained('hotel_table_reservations')->nullOnDelete();
            $table->decimal('deposit_applied', 10, 2)->default(0)->after('discount_amount');
        });
    }

    public function down(): void
    {
        Schema::table('hotel_pos_orders', function (Blueprint $table) {
            $table->dropForeign(['reservation_id']);
            $table->dropColumn('reservation_id');
            $table->dropForeign(['table_id']);
            $table->dropColumn('table_id');
            $table->dropColumn('deposit_applied');
        });

        Schema::dropIfExists('hotel_table_reservations');
        Schema::dropIfExists('hotel_pos_tables');
    }
};
