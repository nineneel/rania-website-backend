<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\RaniaGallery;
use Illuminate\Http\Request;

class RaniaGalleryApiController extends Controller
{
    /**
     * Get active Rania Gallery images with pagination.
     *
     * Query params:
     * - per_page: Number of items per page (default: 12, max: 50)
     * - page: Page number (default: 1)
     */
    public function index(Request $request)
    {
        $perPage = min((int) $request->input('per_page', 12), 50);

        $galleries = RaniaGallery::active()
            ->ordered()
            ->paginate($perPage)
            ->through(function (RaniaGallery $gallery) {
                return [
                    'id' => $gallery->id,
                    'title' => $gallery->title,
                    'image_url' => $gallery->image_url,
                    'order' => $gallery->order,
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $galleries->items(),
            'pagination' => [
                'current_page' => $galleries->currentPage(),
                'last_page' => $galleries->lastPage(),
                'per_page' => $galleries->perPage(),
                'total' => $galleries->total(),
                'from' => $galleries->firstItem(),
                'to' => $galleries->lastItem(),
                'has_more' => $galleries->hasMorePages(),
            ],
        ]);
    }
}
