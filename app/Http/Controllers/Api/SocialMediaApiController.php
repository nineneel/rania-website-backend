<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SocialMedia;
use Illuminate\Http\Request;

class SocialMediaApiController extends Controller
{
    /**
     * Get all active social media links.
     */
    public function index()
    {
        $socialMedia = SocialMedia::active()
            ->ordered()
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'name' => $item->name,
                    'url' => $item->url,
                    'icon_url' => $item->icon_url,
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $socialMedia,
        ]);
    }
}
