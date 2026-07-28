<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('projects')) {
            Schema::create('projects', function (Blueprint $table) {
                $table->id();
                $table->foreignId('business_id')->constrained()->cascadeOnDelete();
                $table->string('name', 100);
                $table->string('project_code', 50)->nullable();
                $table->string('client_name', 100)->nullable();
                $table->string('client_phone', 20)->nullable();
                $table->text('site_address')->nullable();
                $table->string('city', 100)->nullable();
                $table->date('start_date')->nullable();
                $table->date('end_date')->nullable();
                $table->decimal('contract_value', 12, 2)->default(0);
                $table->enum('status', ['planning', 'active', 'on_hold', 'completed', 'cancelled'])->default('active');
                $table->text('description')->nullable();
                $table->text('notes')->nullable();
                $table->unsignedBigInteger('location_id')->nullable(); // FK to business_locations
                $table->unsignedBigInteger('created_by')->nullable();
                $table->timestamps();

                $table->index(['business_id', 'status']);
                $table->index('project_code');
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
