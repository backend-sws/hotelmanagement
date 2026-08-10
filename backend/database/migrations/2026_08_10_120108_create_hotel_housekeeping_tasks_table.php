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
        Schema::create('hotel_housekeeping_tasks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('business_id')->constrained()->onDelete('cascade');
            $table->foreignId('room_id')->constrained('hotel_rooms')->onDelete('cascade');
            $table->foreignId('booking_id')->nullable()->constrained('hotel_bookings')->nullOnDelete();
            
            $table->enum('task_type', [
                'daily_cleaning', 
                'deep_cleaning', 
                'checkout_cleaning', 
                'turndown_service', 
                'maintenance_check', 
                'inspect'
            ]);
            
            $table->foreignId('assigned_user_id')->nullable()->constrained('users')->nullOnDelete();
            
            $table->enum('priority', ['low', 'normal', 'high', 'urgent'])->default('normal');
            
            $table->enum('status', [
                'pending', 
                'in_progress', 
                'completed', 
                'skipped', 
                'issue_reported'
            ])->default('pending');
            
            $table->timestamp('started_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            
            $table->text('notes')->nullable();
            $table->text('issue_description')->nullable();
            $table->json('images')->nullable();
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hotel_housekeeping_tasks');
    }
};
