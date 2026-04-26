<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Step 1: add the new nullable multi-currency columns alongside the legacy price/currency columns.
        Schema::table('umrah_packages', function (Blueprint $table) {
            $table->decimal('price_idr', 15, 2)->nullable()->after('price');
            $table->decimal('price_usd', 15, 2)->nullable()->after('price_idr');
            $table->decimal('price_sar', 15, 2)->nullable()->after('price_usd');
        });

        // Step 2: backfill price_idr from the existing price column so no data is lost.
        DB::table('umrah_packages')
            ->whereNotNull('price')
            ->update(['price_idr' => DB::raw('price')]);

        // Step 3: drop the now-redundant legacy columns.
        Schema::table('umrah_packages', function (Blueprint $table) {
            $table->dropColumn(['price', 'currency']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Restore the legacy columns.
        Schema::table('umrah_packages', function (Blueprint $table) {
            $table->decimal('price', 15, 2)->default(0)->after('departure_schedule');
            $table->string('currency', 10)->default('Rp')->after('price');
        });

        // Backfill price from price_idr so rolling back is non-destructive.
        DB::table('umrah_packages')
            ->whereNotNull('price_idr')
            ->update(['price' => DB::raw('price_idr')]);

        Schema::table('umrah_packages', function (Blueprint $table) {
            $table->dropColumn(['price_idr', 'price_usd', 'price_sar']);
        });
    }
};
