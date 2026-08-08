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
        Schema::create('hotel_guests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('business_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('phone')->nullable();
            $table->string('email')->nullable();
            $table->string('nationality')->default('Indian');
            $table->enum('id_proof_type', ['aadhaar', 'pan', 'passport', 'driving_license', 'voter_id', 'other'])->nullable();
            $table->string('id_proof_number')->nullable();
            $table->string('id_proof_front_url')->nullable();
            $table->string('id_proof_back_url')->nullable();
            $table->date('date_of_birth')->nullable();
            $table->enum('gender', ['male', 'female', 'other'])->nullable();
            $table->text('address')->nullable();
            $table->string('city')->nullable();
            $table->string('state')->nullable();
            $table->string('pincode')->nullable();
            $table->string('country')->nullable();
            $table->string('company_name')->nullable();
            $table->string('gst_number')->nullable();
            $table->integer('total_stays')->default(0);
            $table->decimal('total_spent', 12, 2)->default(0);
            $table->text('notes')->nullable();
            $table->boolean('is_blacklisted')->default(false);
            $table->text('blacklist_reason')->nullable();
            $table->timestamps();

            // Unique constraint on phone per business
            $table->unique(['business_id', 'phone']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hotel_guests');
    }
};
