<?php

namespace App\Http\Controllers;

use App\Models\FAQ;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class FAQController extends Controller
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
     * Display a listing of FAQs.
     */
    public function index(Request $request)
    {
        if (!$this->user()->canManageHomeContent()) {
            return Inertia::render('errors/403', [
                'message' => 'You do not have permission to manage FAQs.',
            ])->toResponse(request())->setStatusCode(403);
        }

        $faqs = FAQ::query()
            ->ordered()
            ->get();

        return Inertia::render('faqs/index', [
            'faqs' => $faqs,
        ]);
    }

    /**
     * Show the form for creating a new FAQ.
     */
    public function create()
    {
        if (!$this->user()->canManageHomeContent()) {
            return Inertia::render('errors/403', [
                'message' => 'You do not have permission to manage FAQs.',
            ])->toResponse(request())->setStatusCode(403);
        }

        return Inertia::render('faqs/create');
    }

    /**
     * Store a new FAQ.
     */
    public function store(Request $request)
    {
        if (!$this->user()->canManageHomeContent()) {
            abort(403, 'You do not have permission to manage FAQs.');
        }

        $validated = $request->validate([
            'question' => ['required', 'string', 'max:500'],
            'answer' => ['required', 'string'],
            'is_active' => ['boolean'],
        ]);

        // Auto-assign order as the last item
        $validated['order'] = (FAQ::max('order') ?? -1) + 1;

        FAQ::create($validated);

        return redirect()->route('faqs.index')
            ->with('success', 'FAQ created successfully.');
    }

    /**
     * Show the form for editing a FAQ.
     */
    public function edit(FAQ $faq)
    {
        if (!$this->user()->canManageHomeContent()) {
            return Inertia::render('errors/403', [
                'message' => 'You do not have permission to manage FAQs.',
            ])->toResponse(request())->setStatusCode(403);
        }

        return Inertia::render('faqs/edit', [
            'faq' => $faq,
        ]);
    }

    /**
     * Update an existing FAQ.
     */
    public function update(Request $request, FAQ $faq)
    {
        if (!$this->user()->canManageHomeContent()) {
            abort(403, 'You do not have permission to manage FAQs.');
        }

        $validated = $request->validate([
            'question' => ['required', 'string', 'max:500'],
            'answer' => ['required', 'string'],
            'is_active' => ['boolean'],
        ]);

        $faq->update($validated);

        return redirect()->route('faqs.index')
            ->with('success', 'FAQ updated successfully.');
    }

    /**
     * Delete a FAQ.
     */
    public function destroy(FAQ $faq)
    {
        if (!$this->user()->canManageHomeContent()) {
            abort(403, 'You do not have permission to manage FAQs.');
        }

        $faq->delete();

        return redirect()->route('faqs.index')
            ->with('success', 'FAQ deleted successfully.');
    }

    /**
     * Update the order of FAQs.
     */
    public function updateOrder(Request $request)
    {
        if (!$this->user()->canManageHomeContent()) {
            abort(403, 'You do not have permission to manage FAQs.');
        }

        $validated = $request->validate([
            'items' => ['required', 'array'],
            'items.*.id' => ['required', 'exists:faqs,id'],
            'items.*.order' => ['required', 'integer', 'min:0'],
        ]);

        foreach ($validated['items'] as $item) {
            FAQ::where('id', $item['id'])->update(['order' => $item['order']]);
        }

        if ($request->expectsJson()) {
            return response()->json(['success' => true]);
        }

        return back();
    }
}
