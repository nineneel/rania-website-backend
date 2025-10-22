<?php

use App\Models\SocialMedia;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

test('admin users can view social media index', function () {
    $user = User::factory()->admin()->create();

    $response = $this->actingAs($user)->get(route('social-media.index'));

    $response->assertOk();
});

test('guests cannot view social media index', function () {
    $response = $this->get(route('social-media.index'));

    $response->assertRedirect(route('login'));
});

test('admin users can view create social media page', function () {
    $user = User::factory()->admin()->create();

    $response = $this->actingAs($user)->get(route('social-media.create'));

    $response->assertOk();
});

test('admin users can create social media', function () {
    Storage::fake('public');
    $user = User::factory()->admin()->create();

    $response = $this->actingAs($user)->post(route('social-media.store'), [
        'name' => 'Facebook',
        'url' => 'https://facebook.com/example',
        'icon' => UploadedFile::fake()->image('facebook.png'),
        'is_active' => true,
    ]);

    $response->assertRedirect(route('social-media.index'));
    $response->assertSessionHas('success');

    $this->assertDatabaseHas('social_media', [
        'name' => 'Facebook',
        'url' => 'https://facebook.com/example',
        'is_active' => true,
    ]);

    $socialMedia = SocialMedia::where('name', 'Facebook')->first();
    Storage::disk('public')->assertExists($socialMedia->icon_path);
});

test('social media creation requires name', function () {
    $user = User::factory()->admin()->create();

    $response = $this->actingAs($user)->post(route('social-media.store'), [
        'url' => 'https://facebook.com/example',
    ]);

    $response->assertSessionHasErrors('name');
});

test('social media creation requires url', function () {
    $user = User::factory()->admin()->create();

    $response = $this->actingAs($user)->post(route('social-media.store'), [
        'name' => 'Facebook',
    ]);

    $response->assertSessionHasErrors('url');
});

test('social media url must be valid', function () {
    $user = User::factory()->admin()->create();

    $response = $this->actingAs($user)->post(route('social-media.store'), [
        'name' => 'Facebook',
        'url' => 'not-a-valid-url',
    ]);

    $response->assertSessionHasErrors('url');
});

test('admin users can view edit social media page', function () {
    $user = User::factory()->admin()->create();
    $socialMedia = SocialMedia::create([
        'name' => 'Twitter',
        'url' => 'https://twitter.com/example',
        'is_active' => true,
        'order' => 1,
    ]);

    $response = $this->actingAs($user)->get(route('social-media.edit', $socialMedia));

    $response->assertOk();
});

test('admin users can update social media', function () {
    $user = User::factory()->admin()->create();
    $socialMedia = SocialMedia::create([
        'name' => 'Twitter',
        'url' => 'https://twitter.com/example',
        'is_active' => true,
        'order' => 1,
    ]);

    $response = $this->actingAs($user)->put(route('social-media.update', $socialMedia), [
        'name' => 'X (Twitter)',
        'url' => 'https://x.com/example',
        'is_active' => false,
    ]);

    $response->assertRedirect(route('social-media.index'));
    $response->assertSessionHas('success');

    $this->assertDatabaseHas('social_media', [
        'id' => $socialMedia->id,
        'name' => 'X (Twitter)',
        'url' => 'https://x.com/example',
        'is_active' => false,
    ]);
});

test('admin users can delete social media', function () {
    Storage::fake('public');
    $user = User::factory()->admin()->create();

    $socialMedia = SocialMedia::create([
        'name' => 'Instagram',
        'url' => 'https://instagram.com/example',
        'icon_path' => 'social-media/test.png',
        'is_active' => true,
        'order' => 1,
    ]);

    Storage::disk('public')->put('social-media/test.png', 'test content');

    $response = $this->actingAs($user)->delete(route('social-media.destroy', $socialMedia));

    $response->assertRedirect(route('social-media.index'));
    $response->assertSessionHas('success');

    $this->assertDatabaseMissing('social_media', [
        'id' => $socialMedia->id,
    ]);

    Storage::disk('public')->assertMissing('social-media/test.png');
});

test('admin users can reorder social media', function () {
    $user = User::factory()->admin()->create();
    $social1 = SocialMedia::create([
        'name' => 'Facebook',
        'url' => 'https://facebook.com',
        'is_active' => true,
        'order' => 1,
    ]);
    $social2 = SocialMedia::create([
        'name' => 'Twitter',
        'url' => 'https://twitter.com',
        'is_active' => true,
        'order' => 2,
    ]);

    $response = $this->actingAs($user)->postJson(route('social-media.reorder'), [
        'items' => [
            ['id' => $social2->id, 'order' => 1],
            ['id' => $social1->id, 'order' => 2],
        ],
    ]);

    $response->assertOk();

    $this->assertDatabaseHas('social_media', [
        'id' => $social1->id,
        'order' => 2,
    ]);
    $this->assertDatabaseHas('social_media', [
        'id' => $social2->id,
        'order' => 1,
    ]);
});
