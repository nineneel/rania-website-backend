<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreRaniaGalleryRequest;
use App\Http\Requests\UpdateRaniaGalleryRequest;
use App\Models\RaniaGallery;
use App\Models\User;
use App\Services\UploadedFileStorage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class RaniaGalleryController extends Controller
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
     * Display a listing of galleries.
     */
    public function index(Request $request)
    {
        if (! $this->user()->canManageHomeContent()) {
            return Inertia::render('errors/403', [
                'message' => 'You do not have permission to manage galleries.',
            ])->toResponse(request())->setStatusCode(403);
        }

        $galleries = RaniaGallery::query()
            ->ordered()
            ->paginate(15)
            ->through(function (RaniaGallery $gallery) {
                return [
                    'id' => $gallery->id,
                    'title' => $gallery->title,
                    'image_path' => $gallery->image_path,
                    'image_url' => $gallery->image_url,
                    'order' => $gallery->order,
                    'is_active' => $gallery->is_active,
                    'created_at' => $gallery->created_at,
                    'updated_at' => $gallery->updated_at,
                ];
            });

        return Inertia::render('rania-galleries/index', [
            'galleries' => $galleries,
        ]);
    }

    /**
     * Show the form for creating a new gallery.
     */
    public function create()
    {
        if (! $this->user()->canManageHomeContent()) {
            return Inertia::render('errors/403', [
                'message' => 'You do not have permission to manage galleries.',
            ])->toResponse(request())->setStatusCode(403);
        }

        return Inertia::render('rania-galleries/create');
    }

    /**
     * Store a new gallery.
     */
    public function store(StoreRaniaGalleryRequest $request)
    {
        $validated = $request->validated();

        $validated['order'] = (RaniaGallery::max('order') ?? -1) + 1;

        if ($request->hasFile('image')) {
            $validated['image_path'] = $this->storeUploadedFile($request->file('image'), 'rania-galleries');
        }

        RaniaGallery::create($validated);

        return redirect()->route('rania-galleries.index')
            ->with('success', 'Gallery image created successfully.');
    }

    /**
     * Show the form for editing a gallery.
     */
    public function edit(RaniaGallery $raniaGallery)
    {
        if (! $this->user()->canManageHomeContent()) {
            return Inertia::render('errors/403', [
                'message' => 'You do not have permission to manage galleries.',
            ])->toResponse(request())->setStatusCode(403);
        }

        return Inertia::render('rania-galleries/edit', [
            'gallery' => [
                'id' => $raniaGallery->id,
                'title' => $raniaGallery->title,
                'image_path' => $raniaGallery->image_path,
                'image_url' => $raniaGallery->image_url,
                'order' => $raniaGallery->order,
                'is_active' => $raniaGallery->is_active,
            ],
        ]);
    }

    /**
     * Update an existing gallery.
     */
    public function update(UpdateRaniaGalleryRequest $request, RaniaGallery $raniaGallery)
    {
        $validated = $request->validated();

        if ($request->hasFile('image')) {
            $newImagePath = $this->storeUploadedFile($request->file('image'), 'rania-galleries');

            if ($raniaGallery->image_path) {
                Storage::disk('public')->delete($raniaGallery->image_path);
            }

            $validated['image_path'] = $newImagePath;
        }

        $raniaGallery->update($validated);

        return redirect()->route('rania-galleries.index')
            ->with('success', 'Gallery image updated successfully.');
    }

    /**
     * Delete a gallery.
     */
    public function destroy(RaniaGallery $raniaGallery)
    {
        if (! $this->user()->canManageHomeContent()) {
            abort(403, 'You do not have permission to manage galleries.');
        }

        if ($raniaGallery->image_path) {
            Storage::disk('public')->delete($raniaGallery->image_path);
        }

        $raniaGallery->delete();

        return redirect()->route('rania-galleries.index')
            ->with('success', 'Gallery image deleted successfully.');
    }

    /**
     * Update the order of galleries.
     */
    public function updateOrder(Request $request)
    {
        if (! $this->user()->canManageHomeContent()) {
            abort(403, 'You do not have permission to manage galleries.');
        }

        $validated = $request->validate([
            'items' => ['required', 'array'],
            'items.*.id' => ['required', 'exists:rania_galleries,id'],
            'items.*.order' => ['required', 'integer', 'min:0'],
        ]);

        foreach ($validated['items'] as $item) {
            RaniaGallery::where('id', $item['id'])->update(['order' => $item['order']]);
        }

        if ($request->expectsJson()) {
            return response()->json(['success' => true]);
        }

        return back();
    }
}
