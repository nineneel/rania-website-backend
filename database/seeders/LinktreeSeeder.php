<?php

namespace Database\Seeders;

use App\Models\LinktreeLink;
use Illuminate\Database\Seeder;

class LinktreeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $links = [
            [
                'title' => 'Official Website',
                'url' => 'https://www.rania.co.id',
                'order' => 1,
                'is_active' => true,
            ],
            [
                'title' => 'Hajj Packages',
                'url' => 'https://www.rania.co.id/hajj',
                'order' => 2,
                'is_active' => true,
            ],
            [
                'title' => 'Umrah Packages',
                'url' => 'https://www.rania.co.id/umrah',
                'order' => 3,
                'is_active' => true,
            ],
        ];

        foreach ($links as $link) {
            LinktreeLink::firstOrCreate(
                ['title' => $link['title']],
                $link
            );
        }
    }
}
