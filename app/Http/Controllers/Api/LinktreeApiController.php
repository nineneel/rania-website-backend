<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LinktreeLink;
use App\Models\LinktreeLinkClick;
use App\Models\SocialMedia;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Throwable;

class LinktreeApiController extends Controller
{
    /**
     * Return combined linktree data: links + social media.
     */
    public function show(): JsonResponse
    {
        try {
            $links = LinktreeLink::active()
                ->ordered()
                ->get()
                ->map(fn ($link) => [
                    'id' => $link->id,
                    'title' => $link->title,
                    'url' => $link->url,
                    'order' => $link->order,
                ])
                ->values();

            $socialMedia = SocialMedia::active()
                ->ordered()
                ->get()
                ->map(fn ($item) => [
                    'id' => $item->id,
                    'name' => $item->name,
                    'url' => $item->url,
                    'icon_url' => $item->icon_url,
                ])
                ->values();

            return response()->json([
                'success' => true,
                'data' => [
                    'links' => $links,
                    'social_media' => $socialMedia,
                ],
            ]);
        } catch (Throwable $e) {
            report($e);

            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch linktree data',
            ], 500);
        }
    }

    /**
     * Track a click event for a linktree link (fire-and-forget from client).
     */
    public function trackClick(Request $request, int $id): JsonResponse
    {
        $link = LinktreeLink::query()->find($id);

        if (! $link) {
            return response()->json([
                'success' => false,
                'message' => 'Link not found',
            ], 404);
        }

        DB::transaction(function () use ($request, $link): void {
            LinktreeLinkClick::create([
                'linktree_link_id' => $link->id,
                'ip_address' => $request->ip(),
                'user_agent' => (string) $request->userAgent(),
                'referer' => $request->headers->get('referer'),
                'country' => null,
                'clicked_at' => Carbon::now(),
            ]);

            LinktreeLink::where('id', $link->id)->increment('click_count');
        });

        return response()->json([
            'success' => true,
            'message' => 'Click recorded',
        ]);
    }
}
