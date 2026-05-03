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
        Schema::create('hajj_package_airline', function (Blueprint $table) {
            $table->id();
            $table->foreignId('hajj_package_id')->constrained()->cascadeOnDelete();
            $table->foreignId('umrah_airline_id')->constrained()->cascadeOnDelete();
            $table->string('class')->default('economy');
            $table->string('meal')->nullable();
            $table->string('baggage')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hajj_package_airline');
    }
};
