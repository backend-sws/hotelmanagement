<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('business_holidays', function (Blueprint $table) {
            $table->id();
            $table->foreignId('business_id')->constrained('businesses')->cascadeOnDelete();
            $table->date('date');
            $table->string('name', 150)->comment('Holiday name e.g. Diwali, Republic Day');
            $table->enum('type', ['national', 'optional', 'custom'])->default('custom')
                  ->comment('national=gazetted, optional=optional holiday, custom=business-defined');
            $table->boolean('is_paid')->default(true)->comment('Is this a paid holiday?');
            $table->text('description')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->unique(['business_id', 'date'], 'unique_business_holiday_date');
            $table->index(['business_id', 'date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('business_holidays');
    }
};
