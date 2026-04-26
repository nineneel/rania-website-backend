<?php

namespace App\Http\Controllers;

use App\Models\SocialMedia;
use App\Models\User;
use App\Services\UploadedFileStorage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class SocialMediaController extends Controller
{
    use UploadedFileStorage;

    /**
     * Get the authenticated user.
     */
    protected function user(): User
    {
        return Auth::user();
    }

    /**
     * Display social media index page.
     */
    public function index()
    {
        if (! $this->user()->canManageHomeContent()) {
            return Inertia::render('errors/403', [
                'message' => 'You do not have permission to manage social media.',
            ])->toResponse(request())->setStatusCode(403);
        }

        $socialMedia = SocialMedia::ordered()->get();

        return Inertia::render('social-media/index', [
            'socialMedia' => $socialMedia,
        ]);
    }

    /**
     * Show the form for creating a new social media.
     */
    public function create()
    {
        if (! $this->user()->canManageHomeContent()) {
            return Inertia::render('errors/403', [
                'message' => 'You do not have permission to manage social media.',
            ])->toResponse(request())->setStatusCode(403);
        }

        return Inertia::render('social-media/create');
    }

    /**
     * Store a new social media.
     */
    public function store(Request $request)
    {
        if (! $this->user()->canManageHomeContent()) {
            abort(403, 'You do not have permission to manage social media.');
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'url' => ['required', 'url', 'max:500'],
            'icon' => ['nullable', 'file', 'mimes:jpg,jpeg,png,webp,svg', 'max:2048'],
            'is_active' => ['boolean'],
        ]);

        // Auto-assign order as the last item
        $validated['order'] = (SocialMedia::max('order') ?? -1) + 1;

        // Handle icon upload
        if ($request->hasFile('icon')) {
            $validated['icon_path'] = $this->storeUploadedFile($request->file('icon'), 'social-media');
            unset($validated['icon']); // Remove icon from validated data
        }

        SocialMedia::create($validated);

        return redirect()->route('social-media.index')
            ->with('success', 'Social media created successfully.');
    }

    /**
     * Show the form for editing a social media.
     */
    public function edit(SocialMedia $socialMedia)
    {
        if (! $this->user()->canManageHomeContent()) {
            return Inertia::render('errors/403', [
                'message' => 'You do not have permission to manage social media.',
            ])->toResponse(request())->setStatusCode(403);
        }

        return Inertia::render('social-media/edit', [
            'socialMedia' => $socialMedia,
        ]);
    }

    /**
     * Update an existing social media.
     */
    public function update(Request $request, SocialMedia $socialMedia)
    {
        if (! $this->user()->canManageHomeContent()) {
            abort(403, 'You do not have permission to manage social media.');
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'url' => ['required', 'url', 'max:500'],
            'icon' => ['nullable', 'file', 'mimes:jpg,jpeg,png,webp,svg', 'max:2048'],
            'is_active' => ['boolean'],
        ]);

        // Handle icon upload if new icon provided
        if ($request->hasFile('icon')) {
            $newIconPath = $this->storeUploadedFile($request->file('icon'), 'social-media');

            if ($socialMedia->icon_path) {
                Storage::disk('public')->delete($socialMedia->icon_path);
            }

            $validated['icon_path'] = $newIconPath;
        }

        unset($validated['icon']); // Never persist the raw file field

        $socialMedia->update($validated);

        return redirect()->route('social-media.index')
            ->with('success', 'Social media updated successfully.');
    }

    /**
     * Delete a social media.
     */
    public function destroy(SocialMedia $socialMedia)
    {
        if (! $this->user()->canManageHomeContent()) {
            abort(403, 'You do not have permission to manage social media.');
        }

        // Delete icon from storage
        if ($socialMedia->icon_path) {
            Storage::disk('public')->delete($socialMedia->icon_path);
        }

        $socialMedia->delete();

        return redirect()->route('social-media.index')
            ->with('success', 'Social media deleted successfully.');
    }

    /**
     * Update the order of social media.
     */
    public function updateOrder(Request $request)
    {
        if (! $this->user()->canManageHomeContent()) {
            abort(403, 'You do not have permission to manage social media.');
        }

        $validated = $request->validate([
            'items' => ['required', 'array'],
            'items.*.id' => ['required', 'exists:social_media,id'],
            'items.*.order' => ['required', 'integer', 'min:0'],
        ]);

        foreach ($validated['items'] as $item) {
            SocialMedia::where('id', $item['id'])->update(['order' => $item['order']]);
        }

        if ($request->expectsJson()) {
            return response()->json(['success' => true]);
        }

        return back();
    }
}
