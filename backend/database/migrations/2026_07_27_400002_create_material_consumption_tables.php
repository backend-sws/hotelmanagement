<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('material_consumptions')) {
            Schema::create('material_consumptions', function (Blueprint $table) {
                $table->id();
                $table->foreignId('business_id')->constrained()->cascadeOnDelete();
                $table->unsignedBigInteger('project_id'); // FK to projects
                $table->string('consumption_number', 50);
                $table->date('date');
                $table->text('notes')->nullable();
                $table->unsignedBigInteger('entered_by')->nullable();
                $table->timestamps();

                $table->foreign('project_id')->references('id')->on('projects')->cascadeOnDelete();
                $table->index(['business_id', 'project_id', 'date']);
            });
        }

        if (!Schema::hasTable('material_consumption_items')) {
            Schema::create('material_consumption_items', function (Blueprint $table) {
                $table->id();
                $table->foreignId('consumption_id')->constrained('material_consumptions')->cascadeOnDelete();
                $table->foreignId('product_id')->constrained()->cascadeOnDelete();
                $table->decimal('quantity', 10, 3)->default(0);
                $table->string('unit', 20)->default('Pcs');
                $table->decimal('rate', 12, 2)->default(0);
                $table->decimal('amount', 12, 2)->default(0);
                $table->string('notes', 255)->nullable();
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('material_consumption_items');
        Schema::dropIfExists('material_consumptions');
    }
};
