<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('gst_settings', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('business_id')->unique();
            $table->string('gstin', 15)->nullable();
            $table->string('legal_name', 150)->nullable();
            $table->string('trade_name', 150)->nullable();
            $table->string('composition_scheme')->default(false);
            $table->string('default_hsn', 20)->nullable();
            $table->decimal('default_gst_rate', 5, 2)->nullable();
            $table->boolean('enable_e_invoicing')->default(false);
            $table->string('e_invoice_username')->nullable();
            $table->string('e_invoice_password')->nullable();
            $table->timestamps();

            $table->foreign('business_id')->references('id')->on('businesses')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('gst_settings');
    }
};
