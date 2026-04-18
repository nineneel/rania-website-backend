<?php

namespace App\Http\Controllers;

use App\Models\LinktreeLink;
use App\Models\LinktreeLinkClick;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class LinktreeController extends Controller
{
    /**
     * Get the authenticated user.
     */
    protected function user(): User
    {
        return Auth::user();
    }

    /**
     * Ensure the current user can manage linktree content.
     */
    protected function authorizeManage(): void
    {
        if (! $this->user()->canManageHomeContent()) {
            abort(403, 'You do not have permission to manage the linktree.');
        }
    }

    /**
     * Display the linktree management dashboard (tabs for links/analytics).
     */
    public function index(Request $request)
    {
        if (! $this->user()->canManageHomeContent()) {
            return Inertia::render('errors/403', [
                'message' => 'You do not have permission to manage the linktree.',
            ])->toResponse(request())->setStatusCode(403);
        }

        $links = LinktreeLink::query()->ordered()->get();

        return Inertia::render('linktree/index', [
            'links' => $links,
            'analytics' => $this->buildAnalytics(),
            'activeTab' => $request->query('tab', 'links'),
        ]);
    }

    // -----------------------------
    // Links
    // -----------------------------

    /**
     * Show the form for creating a new link.
     */
    public function createLink()
    {
        if (! $this->user()->canManageHomeContent()) {
            return Inertia::render('errors/403', [
                'message' => 'You do not have permission to manage the linktree.',
            ])->toResponse(request())->setStatusCode(403);
        }

        return Inertia::render('linktree/links/create');
    }

    /**
     * Store a newly created link.
     */
    public function storeLink(Request $request)
    {
        $this->authorizeManage();

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:100'],
            'url' => ['required', 'url', 'max:500'],
            'is_active' => ['boolean'],
        ]);

        $validated['order'] = (LinktreeLink::max('order') ?? -1) + 1;

        LinktreeLink::create($validated);

        return redirect()->route('linktree.index', ['tab' => 'links'])
            ->with('success', 'Link created successfully.');
    }

    /**
     * Show the form for editing a link.
     */
    public function editLink(LinktreeLink $link)
    {
        if (! $this->user()->canManageHomeContent()) {
            return Inertia::render('errors/403', [
                'message' => 'You do not have permission to manage the linktree.',
            ])->toResponse(request())->setStatusCode(403);
        }

        return Inertia::render('linktree/links/edit', [
            'link' => $link,
        ]);
    }

    /**
     * Update an existing link.
     */
    public function updateLink(Request $request, LinktreeLink $link)
    {
        $this->authorizeManage();

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:100'],
            'url' => ['required', 'url', 'max:500'],
            'is_active' => ['boolean'],
        ]);

        $link->update($validated);

        return redirect()->route('linktree.index', ['tab' => 'links'])
            ->with('success', 'Link updated successfully.');
    }

    /**
     * Delete a link.
     */
    public function destroyLink(LinktreeLink $link)
    {
        $this->authorizeManage();

        $link->delete();

        return redirect()->route('linktree.index', ['tab' => 'links'])
            ->with('success', 'Link deleted successfully.');
    }

    /**
     * Update the order of links (drag & drop).
     */
    public function reorderLinks(Request $request)
    {
        $this->authorizeManage();

        $validated = $request->validate([
            'items' => ['required', 'array', 'min:1'],
            'items.*.id' => ['required', 'integer', 'exists:linktree_links,id'],
            'items.*.order' => ['required', 'integer', 'min:0'],
        ]);

        foreach ($validated['items'] as $item) {
            LinktreeLink::where('id', $item['id'])->update(['order' => $item['order']]);
        }

        if ($request->expectsJson()) {
            return response()->json(['success' => true]);
        }

        return back();
    }

    // -----------------------------
    // Analytics
    // -----------------------------

    /**
     * Build aggregated analytics payload for the dashboard.
     *
     * @return array{total_clicks:int,total_clicks_today:int,total_clicks_this_week:int,top_links:array,clicks_by_day:array}
     */
    protected function buildAnalytics(): array
    {
        $today = Carbon::today();
        $startOfWeek = Carbon::now()->startOfWeek();
        $fourteenDaysAgo = Carbon::today()->subDays(13);

        $totalClicks = LinktreeLinkClick::query()->count();
        $totalClicksToday = LinktreeLinkClick::query()
            ->where('clicked_at', '>=', $today)
            ->count();
        $totalClicksThisWeek = LinktreeLinkClick::query()
            ->where('clicked_at', '>=', $startOfWeek)
            ->count();

        $topLinks = LinktreeLink::query()
            ->orderByDesc('click_count')
            ->take(5)
            ->get(['id', 'title', 'click_count'])
            ->map(fn ($link) => [
                'id' => $link->id,
                'title' => $link->title,
                'click_count' => $link->click_count,
            ])
            ->toArray();

        $clicksByDay = LinktreeLinkClick::query()
            ->where('clicked_at', '>=', $fourteenDaysAgo)
            ->selectRaw('DATE(clicked_at) as date, COUNT(*) as count')
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(fn ($row) => [
                'date' => (string) $row->date,
                'count' => (int) $row->count,
            ])
            ->toArray();

        return [
            'total_clicks' => $totalClicks,
            'total_clicks_today' => $totalClicksToday,
            'total_clicks_this_week' => $totalClicksThisWeek,
            'top_links' => $topLinks,
            'clicks_by_day' => $clicksByDay,
        ];
    }
}
