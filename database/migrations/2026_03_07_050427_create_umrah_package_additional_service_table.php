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
        Schema::create('umrah_package_additional_service', function (Blueprint $table) {
            $table->id();
            $table->foreignId('umrah_package_id')->constrained()->cascadeOnDelete();
            $table->foreignId('umrah_additional_service_id')->constrained()->cascadeOnDelete();
            $table->integer('order')->default(0);
            $table->timestamps();

            $table->unique(['umrah_package_id', 'umrah_additional_service_id'], 'umrah_package_additional_service_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('umrah_package_additional_service');
    }
};
