<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('umrah_packages', function (Blueprint $table) {
            $table->string('slug')->nullable()->after('title');
        });

        $existingSlugs = [];
        $packages = DB::table('umrah_packages')
            ->select(['id', 'title'])
            ->orderBy('id')
            ->get();

        foreach ($packages as $package) {
            $baseSlug = Str::slug($package->title ?? '');
            if ($baseSlug === '') {
                $baseSlug = 'umrah-package';
            }

            $slug = $baseSlug;
            $counter = 2;

            while (in_array($slug, $existingSlugs, true)) {
                $slug = $baseSlug.'-'.$counter;
                $counter++;
            }

            DB::table('umrah_packages')
                ->where('id', $package->id)
                ->update(['slug' => $slug]);

            $existingSlugs[] = $slug;
        }

        Schema::table('umrah_packages', function (Blueprint $table) {
            $table->unique('slug');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('umrah_packages', function (Blueprint $table) {
            $table->dropUnique('umrah_packages_slug_unique');
            $table->dropColumn('slug');
        });
    }
};
