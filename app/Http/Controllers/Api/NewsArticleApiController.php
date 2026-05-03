<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\NewsArticle;
use Illuminate\Http\Request;

class NewsArticleApiController extends Controller
{
    /**
     * Get active news articles with pagination.
     *
     * Query params:
     * - per_page: Number of items per page (default: 12, max: 50)
     * - page: Page number (default: 1)
     */
    public function index(Request $request)
    {
        $perPage = min((int) $request->input('per_page', 12), 50);

        $articles = NewsArticle::active()
            ->ordered()
            ->paginate($perPage)
            ->through(function (NewsArticle $article) {
                return [
                    'id' => $article->id,
                    'title' => $article->title,
                    'source' => $article->source,
                    'link' => $article->link,
                    'image_url' => $article->image_url,
                    'order' => $article->order,
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $articles->items(),
            'pagination' => [
                'current_page' => $articles->currentPage(),
                'last_page' => $articles->lastPage(),
                'per_page' => $articles->perPage(),
                'total' => $articles->total(),
                'from' => $articles->firstItem(),
                'to' => $articles->lastItem(),
                'has_more' => $articles->hasMorePages(),
            ],
        ]);
    }
}
