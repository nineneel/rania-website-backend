<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\HeroSlide;
use Illuminate\Http\Request;

class HomeContentApiController extends Controller
{
    /**
     * Get active hero slides ordered by order field with pagination.
     *
     * Query params:
     * - per_page: Number of items per page (default: 10, max: 50)
     * - page: Page number (default: 1)
     */
    public function getHeroSlides(Request $request)
    {
        $perPage = min((int) $request->input('per_page', 10), 50);

        $slides = HeroSlide::active()
            ->ordered()
            ->paginate($perPage)
            ->through(function ($slide) {
                return [
                    'id' => $slide->id,
                    'title' => $slide->title,
                    'subtitle' => $slide->subtitle,
                    'image_url' => $slide->image_url,
                    'order' => $slide->order,
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $slides->items(),
            'pagination' => [
                'current_page' => $slides->currentPage(),
                'last_page' => $slides->lastPage(),
                'per_page' => $slides->perPage(),
                'total' => $slides->total(),
                'from' => $slides->firstItem(),
                'to' => $slides->lastItem(),
                'has_more' => $slides->hasMorePages(),
            ],
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
