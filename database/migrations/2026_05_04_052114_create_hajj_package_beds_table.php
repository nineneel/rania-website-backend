<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Stores per-package bed configurations (e.g. quad/triple/double room bed counts and capacity).
     */
    public function up(): void
    {
        Schema::create('hajj_package_beds', function (Blueprint $table) {
            $table->id();
            $table->foreignId('hajj_package_id')->constrained()->cascadeOnDelete();
            $table->string('type', 50);
            $table->unsignedInteger('bed_count')->default(0);
            $table->integer('order')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hajj_package_beds');
    }
};
