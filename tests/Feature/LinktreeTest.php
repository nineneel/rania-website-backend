<?php

use App\Models\LinktreeLink;
use App\Models\LinktreeLinkClick;
use App\Models\SocialMedia;
use App\Models\User;

test('admin users can view linktree index', function () {
    $user = User::factory()->admin()->create();

    $response = $this->actingAs($user)->get(route('linktree.index'));

    $response->assertOk();
});

test('guests cannot view linktree index', function () {
    $response = $this->get(route('linktree.index'));

    $response->assertRedirect(route('login'));
});

test('editors cannot view linktree index', function () {
    $user = User::factory()->editor()->create();

    $response = $this->actingAs($user)->get(route('linktree.index'));

    $response->assertStatus(403);
});

test('admin users can create a link', function () {
    $user = User::factory()->admin()->create();

    $response = $this->actingAs($user)->post(route('linktree.links.store'), [
        'title' => 'Official Website',
        'url' => 'https://www.rania.co.id',
        'is_active' => true,
    ]);

    $response->assertRedirect();
    $response->assertSessionHas('success');

    $this->assertDatabaseHas('linktree_links', [
        'title' => 'Official Website',
        'url' => 'https://www.rania.co.id',
        'is_active' => true,
    ]);
});

test('link creation auto-assigns order', function () {
    $user = User::factory()->admin()->create();
    LinktreeLink::create([
        'title' => 'First',
        'url' => 'https://first.test',
        'is_active' => true,
        'order' => 5,
    ]);

    $this->actingAs($user)->post(route('linktree.links.store'), [
        'title' => 'Second',
        'url' => 'https://second.test',
        'is_active' => true,
    ]);

    $this->assertDatabaseHas('linktree_links', [
        'title' => 'Second',
        'order' => 6,
    ]);
});

test('link creation validates required fields', function () {
    $user = User::factory()->admin()->create();

    $response = $this->actingAs($user)->post(route('linktree.links.store'), [
        'url' => 'not-a-url',
    ]);

    $response->assertSessionHasErrors(['title', 'url']);
});

test('admin users can update a link', function () {
    $user = User::factory()->admin()->create();
    $link = LinktreeLink::create([
        'title' => 'Old',
        'url' => 'https://old.test',
        'is_active' => true,
        'order' => 0,
    ]);

    $response = $this->actingAs($user)->put(route('linktree.links.update', $link), [
        'title' => 'New',
        'url' => 'https://new.test',
        'is_active' => false,
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('linktree_links', [
        'id' => $link->id,
        'title' => 'New',
        'url' => 'https://new.test',
        'is_active' => false,
    ]);
});

test('admin users can delete a link', function () {
    $user = User::factory()->admin()->create();
    $link = LinktreeLink::create([
        'title' => 'Gone',
        'url' => 'https://gone.test',
        'is_active' => true,
        'order' => 0,
    ]);

    $this->actingAs($user)->delete(route('linktree.links.destroy', $link))
        ->assertRedirect();

    $this->assertDatabaseMissing('linktree_links', ['id' => $link->id]);
});

test('admin users can reorder links', function () {
    $user = User::factory()->admin()->create();
    $a = LinktreeLink::create(['title' => 'A', 'url' => 'https://a.test', 'is_active' => true, 'order' => 1]);
    $b = LinktreeLink::create(['title' => 'B', 'url' => 'https://b.test', 'is_active' => true, 'order' => 2]);

    $response = $this->actingAs($user)->postJson(route('linktree.links.reorder'), [
        'items' => [
            ['id' => $b->id, 'order' => 1],
            ['id' => $a->id, 'order' => 2],
        ],
    ]);

    $response->assertOk();

    $this->assertDatabaseHas('linktree_links', ['id' => $a->id, 'order' => 2]);
    $this->assertDatabaseHas('linktree_links', ['id' => $b->id, 'order' => 1]);
});

test('editors cannot manage links', function () {
    $user = User::factory()->editor()->create();

    $this->actingAs($user)
        ->post(route('linktree.links.store'), [
            'title' => 'X',
            'url' => 'https://x.test',
            'is_active' => true,
        ])
        ->assertStatus(403);
});

// Public API
test('public linktree endpoint returns links and social media', function () {
    LinktreeLink::create([
        'title' => 'Website',
        'url' => 'https://www.rania.co.id',
        'is_active' => true,
        'order' => 1,
    ]);
    LinktreeLink::create([
        'title' => 'Hidden',
        'url' => 'https://hidden.test',
        'is_active' => false,
        'order' => 2,
    ]);
    SocialMedia::create([
        'name' => 'Instagram',
        'url' => 'https://instagram.com/rania',
        'icon_path' => 'social-media/ig.png',
        'is_active' => true,
        'order' => 0,
    ]);

    $response = $this->getJson('/api/linktree');

    $response->assertOk();
    $response->assertJsonPath('success', true);
    $response->assertJsonCount(1, 'data.links');
    $response->assertJsonPath('data.links.0.title', 'Website');
    $response->assertJsonCount(1, 'data.social_media');
    $response->assertJsonPath('data.social_media.0.name', 'Instagram');
});

test('public linktree endpoint orders links ascending', function () {
    LinktreeLink::create(['title' => 'Third', 'url' => 'https://c.test', 'is_active' => true, 'order' => 3]);
    LinktreeLink::create(['title' => 'First', 'url' => 'https://a.test', 'is_active' => true, 'order' => 1]);
    LinktreeLink::create(['title' => 'Second', 'url' => 'https://b.test', 'is_active' => true, 'order' => 2]);

    $response = $this->getJson('/api/linktree');

    $response->assertOk();
    $titles = collect($response->json('data.links'))->pluck('title')->all();
    expect($titles)->toBe(['First', 'Second', 'Third']);
});

test('click tracking records a click and increments counter', function () {
    $link = LinktreeLink::create([
        'title' => 'Track',
        'url' => 'https://t.test',
        'is_active' => true,
        'order' => 0,
    ]);

    $response = $this->postJson("/api/linktree/links/{$link->id}/click");

    $response->assertOk();
    $response->assertJsonPath('success', true);

    expect($link->fresh()->click_count)->toBe(1);
    expect(LinktreeLinkClick::where('linktree_link_id', $link->id)->count())->toBe(1);
});

test('click tracking returns 404 for missing link', function () {
    $response = $this->postJson('/api/linktree/links/999999/click');

    $response->assertNotFound();
    $response->assertJsonPath('success', false);
});
