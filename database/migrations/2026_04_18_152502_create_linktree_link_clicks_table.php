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
        Schema::create('linktree_link_clicks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('linktree_link_id')
                ->constrained('linktree_links')
                ->cascadeOnDelete();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->string('referer', 500)->nullable();
            $table->string('country', 2)->nullable();
            $table->timestamp('clicked_at')->index();

            $table->index(['linktree_link_id', 'clicked_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('linktree_link_clicks');
    }
};
