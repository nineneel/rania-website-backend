<?php

namespace App\Http\Controllers;

use App\Models\Testimonial;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class TestimonialController extends Controller
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
     * Display a listing of testimonials.
     */
    public function index(Request $request)
    {
        if (!$this->user()->canManageHomeContent()) {
            return Inertia::render('errors/403', [
                'message' => 'You do not have permission to manage testimonials.',
            ])->toResponse(request())->setStatusCode(403);
        }

        $testimonials = Testimonial::query()
            ->ordered()
            ->latest()
            ->paginate(15);

        return Inertia::render('testimonials/index', [
            'testimonials' => $testimonials,
        ]);
    }

    /**
     * Show the form for creating a new testimonial.
     */
    public function create()
    {
        if (!$this->user()->canManageHomeContent()) {
            return Inertia::render('errors/403', [
                'message' => 'You do not have permission to manage testimonials.',
            ])->toResponse(request())->setStatusCode(403);
        }

        return Inertia::render('testimonials/create');
    }

    /**
     * Store a new testimonial.
     */
    public function store(Request $request)
    {
        if (!$this->user()->canManageHomeContent()) {
            abort(403, 'You do not have permission to manage testimonials.');
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'subtitle' => ['nullable', 'string', 'max:255'],
            'text' => ['required', 'string'],
            'is_active' => ['boolean'],
        ]);

        // Auto-assign order as the last item
        $validated['order'] = (Testimonial::max('order') ?? -1) + 1;

        Testimonial::create($validated);

        return redirect()->route('testimonials.index')
            ->with('success', 'Testimonial created successfully.');
    }

    /**
     * Show the form for editing a testimonial.
     */
    public function edit(Testimonial $testimonial)
    {
        if (!$this->user()->canManageHomeContent()) {
            return Inertia::render('errors/403', [
                'message' => 'You do not have permission to manage testimonials.',
            ])->toResponse(request())->setStatusCode(403);
        }

        return Inertia::render('testimonials/edit', [
            'testimonial' => $testimonial,
        ]);
    }

    /**
     * Update an existing testimonial.
     */
    public function update(Request $request, Testimonial $testimonial)
    {
        if (!$this->user()->canManageHomeContent()) {
            abort(403, 'You do not have permission to manage testimonials.');
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'subtitle' => ['nullable', 'string', 'max:255'],
            'text' => ['required', 'string'],
            'is_active' => ['boolean'],
        ]);

        $testimonial->update($validated);

        return redirect()->route('testimonials.index')
            ->with('success', 'Testimonial updated successfully.');
    }

    /**
     * Delete a testimonial.
     */
    public function destroy(Testimonial $testimonial)
    {
        if (!$this->user()->canManageHomeContent()) {
            abort(403, 'You do not have permission to manage testimonials.');
        }

        $testimonial->delete();

        return redirect()->route('testimonials.index')
            ->with('success', 'Testimonial deleted successfully.');
    }

    /**
     * Update the order of testimonials.
     */
    public function updateOrder(Request $request)
    {
        if (!$this->user()->canManageHomeContent()) {
            abort(403, 'You do not have permission to manage testimonials.');
        }

        $validated = $request->validate([
            'items' => ['required', 'array'],
            'items.*.id' => ['required', 'exists:testimonials,id'],
            'items.*.order' => ['required', 'integer', 'min:0'],
        ]);

        foreach ($validated['items'] as $item) {
            Testimonial::where('id', $item['id'])->update(['order' => $item['order']]);
        }

        return back();
    }
}
