<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('boq_templates')) {
            Schema::create('boq_templates', function (Blueprint $table) {
                $table->id();
                $table->foreignId('business_id')->constrained()->cascadeOnDelete();
                $table->unsignedBigInteger('project_id')->nullable();
                $table->string('name', 100);
                $table->string('client_name', 100)->nullable();
                $table->string('project_name', 100)->nullable();
                $table->enum('status', ['draft', 'sent', 'approved', 'rejected'])->default('draft');
                $table->date('validity_date')->nullable();
                $table->text('notes')->nullable();
                $table->decimal('total_amount', 12, 2)->default(0);
                $table->timestamps();

                $table->foreign('project_id')->references('id')->on('projects')->nullOnDelete();
                $table->index(['business_id', 'status']);
            });
        }

        if (!Schema::hasTable('boq_sections')) {
            Schema::create('boq_sections', function (Blueprint $table) {
                $table->id();
                $table->foreignId('boq_id')->constrained('boq_templates')->cascadeOnDelete();
                $table->string('section_name', 100);
                $table->integer('sort_order')->default(0);
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('boq_items')) {
            Schema::create('boq_items', function (Blueprint $table) {
                $table->id();
                $table->foreignId('boq_section_id')->constrained('boq_sections')->cascadeOnDelete();
                $table->foreignId('boq_id')->constrained('boq_templates')->cascadeOnDelete();
                $table->string('item_name', 200);
                $table->text('description')->nullable();
                $table->string('unit', 20)->default('nos');
                $table->decimal('quantity', 10, 3)->default(1);
                $table->decimal('rate', 12, 2)->default(0);
                $table->decimal('amount', 12, 2)->default(0);
                $table->unsignedBigInteger('product_id')->nullable();
                $table->integer('sort_order')->default(0);
                $table->timestamps();

                $table->foreign('product_id')->references('id')->on('products')->nullOnDelete();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('boq_items');
        Schema::dropIfExists('boq_sections');
        Schema::dropIfExists('boq_templates');
    }
};
