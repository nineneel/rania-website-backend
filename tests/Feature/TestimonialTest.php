<?php

use App\Models\Testimonial;
use App\Models\User;

test('admin users can view testimonials index', function () {
    $user = User::factory()->admin()->create();

    $response = $this->actingAs($user)->get(route('testimonials.index'));

    $response->assertOk();
});

test('guests cannot view testimonials index', function () {
    $response = $this->get(route('testimonials.index'));

    $response->assertRedirect(route('login'));
});

test('editors cannot view testimonials index', function () {
    $user = User::factory()->editor()->create();

    $response = $this->actingAs($user)->get(route('testimonials.index'));

    $response->assertStatus(403);
});

test('admin users can view create testimonial page', function () {
    $user = User::factory()->admin()->create();

    $response = $this->actingAs($user)->get(route('testimonials.create'));

    $response->assertOk();
});

test('admin users can create a testimonial', function () {
    $user = User::factory()->admin()->create();

    $response = $this->actingAs($user)->post(route('testimonials.store'), [
        'name' => 'John Doe',
        'subtitle' => 'Happy Customer',
        'text' => 'Great service!',
        'is_active' => true,
    ]);

    $response->assertRedirect(route('testimonials.index'));
    $response->assertSessionHas('success');

    $this->assertDatabaseHas('testimonials', [
        'name' => 'John Doe',
        'subtitle' => 'Happy Customer',
        'text' => 'Great service!',
        'is_active' => true,
    ]);
});

test('testimonial creation requires name', function () {
    $user = User::factory()->admin()->create();

    $response = $this->actingAs($user)->post(route('testimonials.store'), [
        'subtitle' => 'Happy Customer',
        'text' => 'Great service!',
    ]);

    $response->assertSessionHasErrors('name');
});

test('testimonial creation requires text', function () {
    $user = User::factory()->admin()->create();

    $response = $this->actingAs($user)->post(route('testimonials.store'), [
        'name' => 'John Doe',
        'subtitle' => 'Happy Customer',
    ]);

    $response->assertSessionHasErrors('text');
});

test('admin users can view edit testimonial page', function () {
    $user = User::factory()->admin()->create();
    $testimonial = Testimonial::create([
        'name' => 'John Doe',
        'subtitle' => 'Customer',
        'text' => 'Great!',
        'is_active' => true,
        'order' => 1,
    ]);

    $response = $this->actingAs($user)->get(route('testimonials.edit', $testimonial));

    $response->assertOk();
});

test('admin users can update a testimonial', function () {
    $user = User::factory()->admin()->create();
    $testimonial = Testimonial::create([
        'name' => 'John Doe',
        'subtitle' => 'Customer',
        'text' => 'Great!',
        'is_active' => true,
        'order' => 1,
    ]);

    $response = $this->actingAs($user)->put(route('testimonials.update', $testimonial), [
        'name' => 'Jane Doe',
        'subtitle' => 'VIP Customer',
        'text' => 'Excellent service!',
        'is_active' => false,
    ]);

    $response->assertRedirect(route('testimonials.index'));
    $response->assertSessionHas('success');

    $this->assertDatabaseHas('testimonials', [
        'id' => $testimonial->id,
        'name' => 'Jane Doe',
        'subtitle' => 'VIP Customer',
        'text' => 'Excellent service!',
        'is_active' => false,
    ]);
});

test('admin users can delete a testimonial', function () {
    $user = User::factory()->admin()->create();
    $testimonial = Testimonial::create([
        'name' => 'John Doe',
        'subtitle' => 'Customer',
        'text' => 'Great!',
        'is_active' => true,
        'order' => 1,
    ]);

    $response = $this->actingAs($user)->delete(route('testimonials.destroy', $testimonial));

    $response->assertRedirect(route('testimonials.index'));
    $response->assertSessionHas('success');

    $this->assertDatabaseMissing('testimonials', [
        'id' => $testimonial->id,
    ]);
});

test('admin users can reorder testimonials', function () {
    $user = User::factory()->admin()->create();
    $testimonial1 = Testimonial::create([
        'name' => 'First',
        'text' => 'First testimonial',
        'is_active' => true,
        'order' => 1,
    ]);
    $testimonial2 = Testimonial::create([
        'name' => 'Second',
        'text' => 'Second testimonial',
        'is_active' => true,
        'order' => 2,
    ]);

    $response = $this->actingAs($user)->postJson(route('testimonials.reorder'), [
        'items' => [
            ['id' => $testimonial2->id, 'order' => 1],
            ['id' => $testimonial1->id, 'order' => 2],
        ],
    ]);

    $response->assertOk();

    $this->assertDatabaseHas('testimonials', [
        'id' => $testimonial1->id,
        'order' => 2,
    ]);
    $this->assertDatabaseHas('testimonials', [
        'id' => $testimonial2->id,
        'order' => 1,
    ]);
});
