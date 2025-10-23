<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\HeroSlide;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class HomeContentController extends Controller
{
    /**
     * Get the authenticated user.
     *
     * @return User
     */
    protected function user(): User
    {
        return Auth::user();
    }

    /**
     * Display home content management page (dashboard).
     */
    public function index(Request $request)
    {
        // Check if user can manage home content
        if (!$this->user()->canManageHomeContent()) {
            return Inertia::render('errors/403', [
                'message' => 'You do not have permission to manage home content.',
            ])->toResponse(request())->setStatusCode(403);
        }

        $heroSlides = HeroSlide::ordered()->get();
        $events = Event::ordered()->get();

        return Inertia::render('home-content/index', [
            'heroSlides' => $heroSlides,
            'events' => $events,
            'activeTab' => $request->query('tab', 'hero-slides'),
        ]);
    }

    /**
     * Display hero slides index page.
     */
    public function indexHeroSlides()
    {
        if (!$this->user()->canManageHomeContent()) {
            return Inertia::render('errors/403', [
                'message' => 'You do not have permission to manage home content.',
            ])->toResponse(request())->setStatusCode(403);
        }

        $heroSlides = HeroSlide::ordered()->get();

        return Inertia::render('home-content/hero-slides/index', [
            'heroSlides' => $heroSlides,
        ]);
    }

    /**
     * Show the form for creating a new hero slide.
     */
    public function createHeroSlide()
    {
        if (!$this->user()->canManageHomeContent()) {
            return Inertia::render('errors/403', [
                'message' => 'You do not have permission to manage home content.',
            ])->toResponse(request())->setStatusCode(403);
        }

        return Inertia::render('home-content/hero-slides/create');
    }

    /**
     * Show the form for editing a hero slide.
     */
    public function editHeroSlide(HeroSlide $heroSlide)
    {
        if (!$this->user()->canManageHomeContent()) {
            return Inertia::render('errors/403', [
                'message' => 'You do not have permission to manage home content.',
            ])->toResponse(request())->setStatusCode(403);
        }

        return Inertia::render('home-content/hero-slides/edit', [
            'heroSlide' => $heroSlide,
        ]);
    }

    /**
     * Display events index page.
     */
    public function indexEvents()
    {
        if (!$this->user()->canManageHomeContent()) {
            return Inertia::render('errors/403', [
                'message' => 'You do not have permission to manage home content.',
            ])->toResponse(request())->setStatusCode(403);
        }

        $events = Event::ordered()->get();

        return Inertia::render('home-content/events/index', [
            'events' => $events,
        ]);
    }

    /**
     * Show the form for creating a new event.
     */
    public function createEvent()
    {
        if (!$this->user()->canManageHomeContent()) {
            return Inertia::render('errors/403', [
                'message' => 'You do not have permission to manage home content.',
            ])->toResponse(request())->setStatusCode(403);
        }

        return Inertia::render('home-content/events/create');
    }

    /**
     * Show the form for editing an event.
     */
    public function editEvent(Event $event)
    {
        if (!$this->user()->canManageHomeContent()) {
            return Inertia::render('errors/403', [
                'message' => 'You do not have permission to manage home content.',
            ])->toResponse(request())->setStatusCode(403);
        }

        return Inertia::render('home-content/events/edit', [
            'event' => $event,
        ]);
    }

    /**
     * Store a new hero slide.
     */
    public function storeHeroSlide(Request $request)
    {
        if (!$this->user()->canManageHomeContent()) {
            abort(403, 'You do not have permission to manage home content.');
        }

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'subtitle' => ['required', 'string', 'max:255'],
            'image' => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
            'is_active' => ['boolean'],
        ]);

        // Auto-assign order as the last item
        $validated['order'] = (HeroSlide::max('order') ?? -1) + 1;

        // Handle image upload
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('hero-slides', 'public');
            $validated['image_path'] = $imagePath;
        }

        HeroSlide::create($validated);

        return redirect()->route('home-content.index', ['tab' => 'hero-slides'])
            ->with('success', 'Hero slide created successfully.');
    }

    /**
     * Update an existing hero slide.
     */
    public function updateHeroSlide(Request $request, HeroSlide $heroSlide)
    {
        if (!$this->user()->canManageHomeContent()) {
            abort(403, 'You do not have permission to manage home content.');
        }

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'subtitle' => ['required', 'string', 'max:255'],
            'image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
            'is_active' => ['boolean'],
        ]);

        // Handle image upload if new image provided
        if ($request->hasFile('image')) {
            // Delete old image
            if ($heroSlide->image_path) {
                Storage::disk('public')->delete($heroSlide->image_path);
            }

            $imagePath = $request->file('image')->store('hero-slides', 'public');
            $validated['image_path'] = $imagePath;
        }

        $heroSlide->update($validated);

        return redirect()->route('home-content.index', ['tab' => 'hero-slides'])
            ->with('success', 'Hero slide updated successfully.');
    }

    /**
     * Delete a hero slide.
     */
    public function destroyHeroSlide(HeroSlide $heroSlide)
    {
        if (!$this->user()->canManageHomeContent()) {
            abort(403, 'You do not have permission to manage home content.');
        }

        // Delete image from storage
        if ($heroSlide->image_path) {
            Storage::disk('public')->delete($heroSlide->image_path);
        }

        $heroSlide->delete();

        return redirect()->route('home-content.index', ['tab' => 'hero-slides'])
            ->with('success', 'Hero slide deleted successfully.');
    }

    /**
     * Update the order of hero slides.
     */
    public function updateHeroSlidesOrder(Request $request)
    {
        if (!$this->user()->canManageHomeContent()) {
            abort(403, 'You do not have permission to manage home content.');
        }

        $validated = $request->validate([
            'items' => ['required', 'array'],
            'items.*.id' => ['required', 'exists:hero_slides,id'],
            'items.*.order' => ['required', 'integer', 'min:0'],
        ]);

        foreach ($validated['items'] as $item) {
            HeroSlide::where('id', $item['id'])->update(['order' => $item['order']]);
        }

        return back();
    }

    /**
     * Store a new event.
     */
    public function storeEvent(Request $request)
    {
        if (!$this->user()->canManageHomeContent()) {
            abort(403, 'You do not have permission to manage home content.');
        }

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'image' => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
            'link' => ['nullable', 'url', 'max:500'],
            'is_available' => ['boolean'],
        ]);

        // Auto-assign order as the last item
        $validated['order'] = (Event::max('order') ?? -1) + 1;

        // Handle image upload
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('events', 'public');
            $validated['image_path'] = $imagePath;
        }

        Event::create($validated);

        return redirect()->route('home-content.index', ['tab' => 'events'])
            ->with('success', 'Event created successfully.');
    }

    /**
     * Update an existing event.
     */
    public function updateEvent(Request $request, Event $event)
    {
        if (!$this->user()->canManageHomeContent()) {
            abort(403, 'You do not have permission to manage home content.');
        }

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
            'link' => ['nullable', 'url', 'max:500'],
            'is_available' => ['boolean'],
        ]);

        // Handle image upload if new image provided
        if ($request->hasFile('image')) {
            // Delete old image
            if ($event->image_path) {
                Storage::disk('public')->delete($event->image_path);
            }

            $imagePath = $request->file('image')->store('events', 'public');
            $validated['image_path'] = $imagePath;
        }

        $event->update($validated);

        return redirect()->route('home-content.index', ['tab' => 'events'])
            ->with('success', 'Event updated successfully.');
    }

    /**
     * Delete an event.
     */
    public function destroyEvent(Event $event)
    {
        if (!$this->user()->canManageHomeContent()) {
            abort(403, 'You do not have permission to manage home content.');
        }

        // Delete image from storage
        if ($event->image_path) {
            Storage::disk('public')->delete($event->image_path);
        }

        $event->delete();

        return redirect()->route('home-content.index', ['tab' => 'events'])
            ->with('success', 'Event deleted successfully.');
    }

    /**
     * Update the order of events.
     */
    public function updateEventsOrder(Request $request)
    {
        if (!$this->user()->canManageHomeContent()) {
            abort(403, 'You do not have permission to manage home content.');
        }

        $validated = $request->validate([
            'items' => ['required', 'array'],
            'items.*.id' => ['required', 'exists:events,id'],
            'items.*.order' => ['required', 'integer', 'min:0'],
        ]);

        foreach ($validated['items'] as $item) {
            Event::where('id', $item['id'])->update(['order' => $item['order']]);
        }

        return back();
    }
}
