<?php

namespace Database\Seeders;

use App\Models\SocialMedia;
use Illuminate\Database\Seeder;

class SocialMediaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $socialMediaLinks = [
            [
                'name' => 'Instagram',
                'url' => 'https://www.instagram.com/hajj.rania.co/',
                'icon_path' => 'social-media/instagram-icon.png',
                'order' => 0,
                'is_active' => true,
            ],
            [
                'name' => 'LinkedIn',
                'url' => 'https://www.linkedin.com/company/pt-rania-almutamayizah-travel/',
                'icon_path' => 'social-media/linkedin-icon.png',
                'order' => 1,
                'is_active' => true,
            ],
            [
                'name' => 'Facebook',
                'url' => 'https://www.facebook.com/raniaalmutamayizahtravel/',
                'icon_path' => 'social-media/facebook-icon.png',
                'order' => 2,
                'is_active' => true,
            ],
            [
                'name' => 'YouTube',
                'url' => 'https://www.youtube.com/@HajjRania',
                'icon_path' => 'social-media/youtube-icon.png',
                'order' => 3,
                'is_active' => true,
            ],
            [
                'name' => 'TikTok',
                'url' => 'https://www.tiktok.com/@hajjrania.co?_t=ZS-90RuTBM3OZI&_r=1',
                'icon_path' => 'social-media/tiktok-icon.png',
                'order' => 4,
                'is_active' => true,
            ],
        ];

        foreach ($socialMediaLinks as $link) {
            SocialMedia::firstOrCreate(
                ['name' => $link['name']],
                $link
            );
        }
    }
}
