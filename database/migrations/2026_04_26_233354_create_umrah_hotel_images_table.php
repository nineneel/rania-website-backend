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
        Schema::create('umrah_hotel_images', function (Blueprint $table) {
            $table->id();
            $table->foreignId('umrah_hotel_id')->constrained()->cascadeOnDelete();
            $table->string('image_path');
            $table->unsignedInteger('order')->default(0);
            $table->timestamps();
        });

        if (Schema::hasColumn('umrah_hotels', 'image_path')) {
            DB::table('umrah_hotels')
                ->whereNotNull('image_path')
                ->where('image_path', '!=', '')
                ->orderBy('id')
                ->each(function ($hotel) {
                    DB::table('umrah_hotel_images')->insert([
                        'umrah_hotel_id' => $hotel->id,
                        'image_path' => $hotel->image_path,
                        'order' => 0,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                });

            Schema::table('umrah_hotels', function (Blueprint $table) {
                $table->dropColumn('image_path');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (! Schema::hasColumn('umrah_hotels', 'image_path')) {
            Schema::table('umrah_hotels', function (Blueprint $table) {
                $table->string('image_path')->nullable()->after('description');
            });
        }

        DB::table('umrah_hotel_images')
            ->orderBy('umrah_hotel_id')
            ->orderBy('order')
            ->each(function ($image) {
                DB::table('umrah_hotels')
                    ->where('id', $image->umrah_hotel_id)
                    ->whereNull('image_path')
                    ->update(['image_path' => $image->image_path]);
            });

        Schema::dropIfExists('umrah_hotel_images');
    }
};
