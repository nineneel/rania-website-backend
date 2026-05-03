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
        Schema::create('hajj_package_transportation', function (Blueprint $table) {
            $table->id();
            $table->foreignId('hajj_package_id')->constrained()->cascadeOnDelete();
            $table->foreignId('umrah_transportation_id')->constrained()->cascadeOnDelete();
            $table->integer('order')->default(0);
            $table->timestamps();

            $table->unique(['hajj_package_id', 'umrah_transportation_id'], 'hajj_pkg_transportation_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hajj_package_transportation');
    }
};
