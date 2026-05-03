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
        Schema::table('umrah_package_airline', function (Blueprint $table) {
            $table->string('class')->default('economy')->after('umrah_airline_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('umrah_package_airline', function (Blueprint $table) {
            $table->dropColumn('class');
        });
    }
};
