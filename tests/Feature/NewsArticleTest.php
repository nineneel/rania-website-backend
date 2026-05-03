<?php

use App\Models\NewsArticle;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

test('admin users can view news articles index', function () {
    $user = User::factory()->admin()->create();

    $response = $this->actingAs($user)->get(route('news-articles.index'));

    $response->assertOk();
});

test('guests cannot view news articles index', function () {
    $response = $this->get(route('news-articles.index'));

    $response->assertRedirect(route('login'));
});

test('editors cannot view news articles index', function () {
    $user = User::factory()->editor()->create();

    $response = $this->actingAs($user)->get(route('news-articles.index'));

    $response->assertForbidden();
});

test('admin users can view create article page', function () {
    $user = User::factory()->admin()->create();

    $response = $this->actingAs($user)->get(route('news-articles.create'));

    $response->assertOk();
});

test('admin users can create a news article', function () {
    Storage::fake('public');

    $user = User::factory()->admin()->create();

    $response = $this->actingAs($user)->post(route('news-articles.store'), [
        'title' => 'Sample Article',
        'source' => 'Liputan6',
        'link' => 'https://liputan6.com/sample-article',
        'image' => UploadedFile::fake()->image('cover.jpg', 1200, 800),
        'is_active' => true,
    ]);

    $response->assertRedirect(route('news-articles.index'));
    $response->assertSessionHas('success');

    $this->assertDatabaseHas('news_articles', [
        'title' => 'Sample Article',
        'source' => 'Liputan6',
        'link' => 'https://liputan6.com/sample-article',
        'is_active' => true,
    ]);
});

test('news article creation requires title, link, and image', function () {
    $user = User::factory()->admin()->create();

    $response = $this->actingAs($user)->post(route('news-articles.store'), [
        'is_active' => true,
    ]);

    $response->assertSessionHasErrors(['title', 'link', 'image']);
});

test('news article creation requires a valid url', function () {
    Storage::fake('public');

    $user = User::factory()->admin()->create();

    $response = $this->actingAs($user)->post(route('news-articles.store'), [
        'title' => 'Sample Article',
        'link' => 'not-a-url',
        'image' => UploadedFile::fake()->image('cover.jpg'),
        'is_active' => true,
    ]);

    $response->assertSessionHasErrors('link');
});

test('admin users can update a news article', function () {
    Storage::fake('public');

    $user = User::factory()->admin()->create();
    $article = NewsArticle::create([
        'title' => 'Old',
        'source' => 'Old Source',
        'link' => 'https://example.com/old',
        'image_path' => 'news-articles/old.jpg',
        'is_active' => true,
        'order' => 0,
    ]);

    $response = $this->actingAs($user)->put(route('news-articles.update', $article), [
        'title' => 'Updated',
        'source' => 'Updated Source',
        'link' => 'https://example.com/updated',
        'is_active' => false,
    ]);

    $response->assertRedirect(route('news-articles.index'));

    $this->assertDatabaseHas('news_articles', [
        'id' => $article->id,
        'title' => 'Updated',
        'source' => 'Updated Source',
        'link' => 'https://example.com/updated',
        'is_active' => false,
    ]);
});

test('admin users can delete a news article', function () {
    $user = User::factory()->admin()->create();
    $article = NewsArticle::create([
        'title' => 'Delete me',
        'link' => 'https://example.com/delete',
        'image_path' => 'news-articles/delete.jpg',
        'is_active' => true,
        'order' => 0,
    ]);

    $response = $this->actingAs($user)->delete(route('news-articles.destroy', $article));

    $response->assertRedirect(route('news-articles.index'));
    $this->assertDatabaseMissing('news_articles', ['id' => $article->id]);
});

test('admin users can reorder news articles', function () {
    $user = User::factory()->admin()->create();
    $first = NewsArticle::create([
        'title' => 'A',
        'link' => 'https://example.com/a',
        'image_path' => 'news-articles/a.jpg',
        'is_active' => true,
        'order' => 0,
    ]);
    $second = NewsArticle::create([
        'title' => 'B',
        'link' => 'https://example.com/b',
        'image_path' => 'news-articles/b.jpg',
        'is_active' => true,
        'order' => 1,
    ]);

    $response = $this->actingAs($user)->postJson(route('news-articles.reorder'), [
        'items' => [
            ['id' => $second->id, 'order' => 0],
            ['id' => $first->id, 'order' => 1],
        ],
    ]);

    $response->assertOk();
    $this->assertDatabaseHas('news_articles', ['id' => $first->id, 'order' => 1]);
    $this->assertDatabaseHas('news_articles', ['id' => $second->id, 'order' => 0]);
});

test('public api returns active news articles with pagination', function () {
    NewsArticle::create([
        'title' => 'Active Article',
        'source' => 'Liputan6',
        'link' => 'https://example.com/active',
        'image_path' => 'news-articles/active.jpg',
        'is_active' => true,
        'order' => 0,
    ]);
    NewsArticle::create([
        'title' => 'Inactive Article',
        'link' => 'https://example.com/inactive',
        'image_path' => 'news-articles/inactive.jpg',
        'is_active' => false,
        'order' => 1,
    ]);

    $response = $this->getJson('/api/news-articles');

    $response->assertOk();
    $response->assertJsonCount(1, 'data');
    $response->assertJsonFragment(['title' => 'Active Article']);
    $response->assertJsonMissing(['title' => 'Inactive Article']);
    $response->assertJsonStructure([
        'success',
        'data' => [
            '*' => ['id', 'title', 'source', 'link', 'image_url', 'order'],
        ],
        'pagination' => [
            'current_page',
            'last_page',
            'per_page',
            'total',
            'from',
            'to',
            'has_more',
        ],
    ]);
});

test('public api respects per_page query parameter', function () {
    foreach (range(1, 5) as $i) {
        NewsArticle::create([
            'title' => "Article {$i}",
            'link' => "https://example.com/article-{$i}",
            'image_path' => "news-articles/article{$i}.jpg",
            'is_active' => true,
            'order' => $i,
        ]);
    }

    $response = $this->getJson('/api/news-articles?per_page=2');

    $response->assertOk();
    $response->assertJsonCount(2, 'data');
    $response->assertJsonPath('pagination.per_page', 2);
    $response->assertJsonPath('pagination.has_more', true);
});
