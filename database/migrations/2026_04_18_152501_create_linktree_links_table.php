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
        Schema::create('linktree_links', function (Blueprint $table) {
            $table->id();
            $table->string('title', 100);
            $table->string('url', 500);
            $table->unsignedInteger('order')->default(0)->index();
            $table->boolean('is_active')->default(true);
            $table->unsignedInteger('click_count')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('linktree_links');
    }
};
