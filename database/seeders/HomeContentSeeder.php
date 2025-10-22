<?php

namespace Database\Seeders;

use App\Models\Event;
use App\Models\HeroSlide;
use Illuminate\Database\Seeder;

class HomeContentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create Hero Slides
        HeroSlide::create([
            'title' => 'Weekly Departure From Jakarta To Makkah',
            'subtitle' => 'The Sacred Umrah Journey Crafted For Your Heart',
            'image_path' => 'hero-slides/sample-1.jpg',
            'order' => 0,
            'is_active' => true,
        ]);

        HeroSlide::create([
            'title' => 'Hajj Without Wait, Hajj With Rania',
            'subtitle' => 'We remove the worry. You receive the blessing',
            'image_path' => 'hero-slides/sample-2.jpg',
            'order' => 1,
            'is_active' => true,
        ]);

        HeroSlide::create([
            'title' => 'Webinar With Rania',
            'subtitle' => 'Let us help you replace your worries with wisdom',
            'image_path' => 'hero-slides/sample-3.jpg',
            'order' => 2,
            'is_active' => true,
        ]);

        // Create Events
        Event::create([
            'title' => 'Scheduled Webinar',
            'description' => 'Join our complimentary webinar for heartfelt guidance on your upcoming pilgrimage.',
            'image_path' => 'events/sample-1.jpg',
            'link' => 'https://example.com/webinar',
            'order' => 0,
            'is_available' => true,
        ]);

        Event::create([
            'title' => 'Digital Manasik',
            'description' => 'Find the true understanding, learn the Manasik with our supportive and accessible online program.',
            'image_path' => 'events/sample-2.jpg',
            'link' => null,
            'order' => 1,
            'is_available' => false,
        ]);

        Event::create([
            'title' => 'Live Event',
            'description' => 'Join our live event to share in the spirit and prepare your heart for the journey ahead.',
            'image_path' => 'events/sample-3.jpg',
            'link' => null,
            'order' => 2,
            'is_available' => false,
        ]);
    }
}
