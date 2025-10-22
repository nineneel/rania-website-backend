<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\HeroSlide;

class HomeContentApiController extends Controller
{
    /**
     * Get all active hero slides ordered by order field.
     */
    public function getHeroSlides()
    {
        $slides = HeroSlide::active()
            ->ordered()
            ->get()
            ->map(function ($slide) {
                return [
                    'id' => $slide->id,
                    'title' => $slide->title,
                    'subtitle' => $slide->subtitle,
                    'image_url' => $slide->image_url,
                    'order' => $slide->order,
                ];
            });

        return response()->json([
            'data' => $slides,
        ]);
    }

    /**
     * Get all events ordered by order field.
     */
    public function getEvents()
    {
        $events = Event::ordered()
            ->get()
            ->map(function ($event) {
                return [
                    'id' => $event->id,
                    'title' => $event->title,
                    'description' => $event->description,
                    'image_url' => $event->image_url,
                    'link' => $event->link,
                    'is_available' => $event->is_available,
                    'order' => $event->order,
                ];
            });

        return response()->json([
            'data' => $events,
        ]);
    }
}
