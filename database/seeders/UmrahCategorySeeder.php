<?php

namespace Database\Seeders;

use App\Models\UmrahCategory;
use Illuminate\Database\Seeder;

class UmrahCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            ['name' => 'Umrah Private', 'slug' => 'umrah-private'],
            ['name' => 'Umrah Corporate', 'slug' => 'umrah-corporate'],
            ['name' => 'Umrah Plus', 'slug' => 'umrah-plus'],
            ['name' => 'Umrah Private VIP', 'slug' => 'umrah-private-vip'],
        ];

        foreach ($categories as $index => $category) {
            UmrahCategory::firstOrCreate(
                ['slug' => $category['slug']],
                [
                    'name' => $category['name'],
                    'description' => null,
                    'is_active' => true,
                    'order' => $index,
                ],
            );
        }
    }
}
