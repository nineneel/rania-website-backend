<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreNewsArticleRequest;
use App\Http\Requests\UpdateNewsArticleRequest;
use App\Models\NewsArticle;
use App\Models\User;
use App\Services\UploadedFileStorage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class NewsArticleController extends Controller
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
     * Display a listing of news articles.
     */
    public function index(Request $request)
    {
        if (! $this->user()->canManageHomeContent()) {
            return Inertia::render('errors/403', [
                'message' => 'You do not have permission to manage news & articles.',
            ])->toResponse(request())->setStatusCode(403);
        }

        $articles = NewsArticle::query()
            ->ordered()
            ->paginate(15)
            ->through(function (NewsArticle $article) {
                return [
                    'id' => $article->id,
                    'title' => $article->title,
                    'source' => $article->source,
                    'link' => $article->link,
                    'image_path' => $article->image_path,
                    'image_url' => $article->image_url,
                    'order' => $article->order,
                    'is_active' => $article->is_active,
                    'created_at' => $article->created_at,
                    'updated_at' => $article->updated_at,
                ];
            });

        return Inertia::render('news-articles/index', [
            'articles' => $articles,
        ]);
    }

    /**
     * Show the form for creating a new news article.
     */
    public function create()
    {
        if (! $this->user()->canManageHomeContent()) {
            return Inertia::render('errors/403', [
                'message' => 'You do not have permission to manage news & articles.',
            ])->toResponse(request())->setStatusCode(403);
        }

        return Inertia::render('news-articles/create');
    }

    /**
     * Store a new news article.
     */
    public function store(StoreNewsArticleRequest $request)
    {
        $validated = $request->validated();

        $validated['order'] = (NewsArticle::max('order') ?? -1) + 1;

        if ($request->hasFile('image')) {
            $validated['image_path'] = $this->storeUploadedFile($request->file('image'), 'news-articles');
        }

        NewsArticle::create($validated);

        return redirect()->route('news-articles.index')
            ->with('success', 'News article created successfully.');
    }

    /**
     * Show the form for editing a news article.
     */
    public function edit(NewsArticle $newsArticle)
    {
        if (! $this->user()->canManageHomeContent()) {
            return Inertia::render('errors/403', [
                'message' => 'You do not have permission to manage news & articles.',
            ])->toResponse(request())->setStatusCode(403);
        }

        return Inertia::render('news-articles/edit', [
            'article' => [
                'id' => $newsArticle->id,
                'title' => $newsArticle->title,
                'source' => $newsArticle->source,
                'link' => $newsArticle->link,
                'image_path' => $newsArticle->image_path,
                'image_url' => $newsArticle->image_url,
                'order' => $newsArticle->order,
                'is_active' => $newsArticle->is_active,
            ],
        ]);
    }

    /**
     * Update an existing news article.
     */
    public function update(UpdateNewsArticleRequest $request, NewsArticle $newsArticle)
    {
        $validated = $request->validated();

        if ($request->hasFile('image')) {
            $newImagePath = $this->storeUploadedFile($request->file('image'), 'news-articles');

            if ($newsArticle->image_path) {
                Storage::disk('public')->delete($newsArticle->image_path);
            }

            $validated['image_path'] = $newImagePath;
        }

        $newsArticle->update($validated);

        return redirect()->route('news-articles.index')
            ->with('success', 'News article updated successfully.');
    }

    /**
     * Delete a news article.
     */
    public function destroy(NewsArticle $newsArticle)
    {
        if (! $this->user()->canManageHomeContent()) {
            abort(403, 'You do not have permission to manage news & articles.');
        }

        if ($newsArticle->image_path) {
            Storage::disk('public')->delete($newsArticle->image_path);
        }

        $newsArticle->delete();

        return redirect()->route('news-articles.index')
            ->with('success', 'News article deleted successfully.');
    }

    /**
     * Update the order of news articles.
     */
    public function updateOrder(Request $request)
    {
        if (! $this->user()->canManageHomeContent()) {
            abort(403, 'You do not have permission to manage news & articles.');
        }

        $validated = $request->validate([
            'items' => ['required', 'array'],
            'items.*.id' => ['required', 'exists:news_articles,id'],
            'items.*.order' => ['required', 'integer', 'min:0'],
        ]);

        foreach ($validated['items'] as $item) {
            NewsArticle::where('id', $item['id'])->update(['order' => $item['order']]);
        }

        if ($request->expectsJson()) {
            return response()->json(['success' => true]);
        }

        return back();
    }
}
