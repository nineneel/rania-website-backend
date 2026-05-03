<?php

use App\Models\RaniaGallery;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

test('admin users can view rania galleries index', function () {
    $user = User::factory()->admin()->create();

    $response = $this->actingAs($user)->get(route('rania-galleries.index'));

    $response->assertOk();
});

test('guests cannot view rania galleries index', function () {
    $response = $this->get(route('rania-galleries.index'));

    $response->assertRedirect(route('login'));
});

test('editors cannot view rania galleries index', function () {
    $user = User::factory()->editor()->create();

    $response = $this->actingAs($user)->get(route('rania-galleries.index'));

    $response->assertForbidden();
});

test('admin users can view create gallery page', function () {
    $user = User::factory()->admin()->create();

    $response = $this->actingAs($user)->get(route('rania-galleries.create'));

    $response->assertOk();
});

test('admin users can create a gallery image', function () {
    Storage::fake('public');

    $user = User::factory()->admin()->create();

    $response = $this->actingAs($user)->post(route('rania-galleries.store'), [
        'title' => 'Sample Image',
        'image' => UploadedFile::fake()->image('photo.jpg', 1200, 800),
        'is_active' => true,
    ]);

    $response->assertRedirect(route('rania-galleries.index'));
    $response->assertSessionHas('success');

    $this->assertDatabaseHas('rania_galleries', [
        'title' => 'Sample Image',
        'is_active' => true,
    ]);
});

test('gallery creation requires an image', function () {
    $user = User::factory()->admin()->create();

    $response = $this->actingAs($user)->post(route('rania-galleries.store'), [
        'title' => 'No image',
        'is_active' => true,
    ]);

    $response->assertSessionHasErrors('image');
});

test('admin users can update a gallery image', function () {
    Storage::fake('public');

    $user = User::factory()->admin()->create();
    $gallery = RaniaGallery::create([
        'title' => 'Old',
        'image_path' => 'rania-galleries/old.jpg',
        'is_active' => true,
        'order' => 0,
    ]);

    $response = $this->actingAs($user)->put(route('rania-galleries.update', $gallery), [
        'title' => 'Updated',
        'is_active' => false,
    ]);

    $response->assertRedirect(route('rania-galleries.index'));

    $this->assertDatabaseHas('rania_galleries', [
        'id' => $gallery->id,
        'title' => 'Updated',
        'is_active' => false,
    ]);
});

test('admin users can delete a gallery image', function () {
    $user = User::factory()->admin()->create();
    $gallery = RaniaGallery::create([
        'title' => 'Delete me',
        'image_path' => 'rania-galleries/delete.jpg',
        'is_active' => true,
        'order' => 0,
    ]);

    $response = $this->actingAs($user)->delete(route('rania-galleries.destroy', $gallery));

    $response->assertRedirect(route('rania-galleries.index'));
    $this->assertDatabaseMissing('rania_galleries', ['id' => $gallery->id]);
});

test('admin users can reorder galleries', function () {
    $user = User::factory()->admin()->create();
    $first = RaniaGallery::create([
        'title' => 'A',
        'image_path' => 'rania-galleries/a.jpg',
        'is_active' => true,
        'order' => 0,
    ]);
    $second = RaniaGallery::create([
        'title' => 'B',
        'image_path' => 'rania-galleries/b.jpg',
        'is_active' => true,
        'order' => 1,
    ]);

    $response = $this->actingAs($user)->postJson(route('rania-galleries.reorder'), [
        'items' => [
            ['id' => $second->id, 'order' => 0],
            ['id' => $first->id, 'order' => 1],
        ],
    ]);

    $response->assertOk();
    $this->assertDatabaseHas('rania_galleries', ['id' => $first->id, 'order' => 1]);
    $this->assertDatabaseHas('rania_galleries', ['id' => $second->id, 'order' => 0]);
});

test('public api returns active galleries with pagination', function () {
    RaniaGallery::create([
        'title' => 'Active Image',
        'image_path' => 'rania-galleries/active.jpg',
        'is_active' => true,
        'order' => 0,
    ]);
    RaniaGallery::create([
        'title' => 'Inactive Image',
        'image_path' => 'rania-galleries/inactive.jpg',
        'is_active' => false,
        'order' => 1,
    ]);

    $response = $this->getJson('/api/rania-galleries');

    $response->assertOk();
    $response->assertJsonCount(1, 'data');
    $response->assertJsonFragment(['title' => 'Active Image']);
    $response->assertJsonMissing(['title' => 'Inactive Image']);
    $response->assertJsonStructure([
        'success',
        'data',
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
        RaniaGallery::create([
            'title' => "Image {$i}",
            'image_path' => "rania-galleries/image{$i}.jpg",
            'is_active' => true,
            'order' => $i,
        ]);
    }

    $response = $this->getJson('/api/rania-galleries?per_page=2');

    $response->assertOk();
    $response->assertJsonCount(2, 'data');
    $response->assertJsonPath('pagination.per_page', 2);
    $response->assertJsonPath('pagination.has_more', true);
});
