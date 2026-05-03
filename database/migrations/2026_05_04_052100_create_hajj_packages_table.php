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
        Schema::create('hajj_packages', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->string('subtitle')->nullable();
            $table->string('description', 500);
            $table->string('image_path');
            $table->string('color', 50)->nullable();
            $table->string('departure');
            $table->string('duration', 50);
            $table->string('departure_schedule', 50);
            $table->string('date')->nullable();
            $table->decimal('price_idr', 15, 2)->nullable();
            $table->decimal('price_usd', 15, 2)->nullable();
            $table->decimal('price_sar', 15, 2)->nullable();
            $table->decimal('price_quad_idr', 15, 2)->nullable();
            $table->decimal('price_triple_idr', 15, 2)->nullable();
            $table->decimal('price_double_idr', 15, 2)->nullable();
            $table->decimal('price_quad_usd', 15, 2)->nullable();
            $table->decimal('price_triple_usd', 15, 2)->nullable();
            $table->decimal('price_double_usd', 15, 2)->nullable();
            $table->decimal('price_quad_sar', 15, 2)->nullable();
            $table->decimal('price_triple_sar', 15, 2)->nullable();
            $table->decimal('price_double_sar', 15, 2)->nullable();
            $table->string('link')->nullable();
            $table->boolean('is_active')->default(true);
            $table->integer('order')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hajj_packages');
    }
};
