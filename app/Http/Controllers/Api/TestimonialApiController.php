<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Testimonial;
use Illuminate\Http\Request;

class TestimonialApiController extends Controller
{
    /**
     * Get active testimonials with pagination.
     *
     * Query params:
     * - per_page: Number of items per page (default: 10, max: 50)
     * - page: Page number (default: 1)
     */
    public function index(Request $request)
    {
        $perPage = min((int) $request->input('per_page', 10), 50);

        $testimonials = Testimonial::active()
            ->ordered()
            ->paginate($perPage)
            ->through(function ($testimonial) {
                return [
                    'id' => $testimonial->id,
                    'name' => $testimonial->name,
                    'subtitle' => $testimonial->subtitle,
                    'text' => $testimonial->text,
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $testimonials->items(),
            'pagination' => [
                'current_page' => $testimonials->currentPage(),
                'last_page' => $testimonials->lastPage(),
                'per_page' => $testimonials->perPage(),
                'total' => $testimonials->total(),
                'from' => $testimonials->firstItem(),
                'to' => $testimonials->lastItem(),
                'has_more' => $testimonials->hasMorePages(),
            ],
        ]);
    }
}
