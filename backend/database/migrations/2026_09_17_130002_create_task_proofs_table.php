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
        Schema::create('task_proofs', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('task_id');
            $table->unsignedBigInteger('staff_id');
            $table->string('raw_photo_url');
            $table->string('watermarked_photo_url')->nullable();
            $table->decimal('lat', 10, 7)->nullable();
            $table->decimal('lng', 10, 7)->nullable();
            $table->decimal('distance_from_site', 10, 2)->nullable();
            $table->boolean('is_gallery_photo')->default(false);
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->foreign('task_id')->references('id')->on('field_tasks')->onDelete('cascade');
            $table->foreign('staff_id')->references('id')->on('users')->onDelete('cascade');
            $table->index(['task_id', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('task_proofs');
    }
};
