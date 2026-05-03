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
        Schema::create('hajj_package_additional_service', function (Blueprint $table) {
            $table->id();
            $table->foreignId('hajj_package_id');
            $table->foreignId('umrah_additional_service_id');
            $table->integer('order')->default(0);
            $table->timestamps();

            $table->foreign('hajj_package_id', 'hpas_package_id_foreign')
                ->references('id')->on('hajj_packages')
                ->cascadeOnDelete();

            $table->foreign('umrah_additional_service_id', 'hpas_service_id_foreign')
                ->references('id')->on('umrah_additional_services')
                ->cascadeOnDelete();

            $table->unique(['hajj_package_id', 'umrah_additional_service_id'], 'hpas_package_service_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hajj_package_additional_service');
    }
};
