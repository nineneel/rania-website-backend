<?php

use App\Models\UmrahCategory;
use App\Models\UmrahPackage;
use App\Models\User;

test('admin users can create a category', function () {
    $user = User::factory()->admin()->create();

    $response = $this->actingAs($user)->post(route('umrah-content.categories.store'), [
        'name' => 'Umrah Premium',
        'slug' => 'umrah-premium',
        'description' => 'Premium category',
        'is_active' => true,
    ]);

    $response->assertRedirect(route('umrah-content.categories.index'));

    $this->assertDatabaseHas('umrah_categories', [
        'name' => 'Umrah Premium',
        'slug' => 'umrah-premium',
    ]);
});

test('category slug is auto-generated from name when not provided', function () {
    $user = User::factory()->admin()->create();

    $this->actingAs($user)->post(route('umrah-content.categories.store'), [
        'name' => 'Umrah Private VIP',
        'slug' => '',
        'description' => null,
        'is_active' => true,
    ]);

    $this->assertDatabaseHas('umrah_categories', [
        'slug' => 'umrah-private-vip',
    ]);
});

test('category slug must be unique', function () {
    $user = User::factory()->admin()->create();

    UmrahCategory::create([
        'name' => 'Existing',
        'slug' => 'existing-slug',
        'is_active' => true,
        'order' => 0,
    ]);

    $response = $this->actingAs($user)->post(route('umrah-content.categories.store'), [
        'name' => 'Another',
        'slug' => 'existing-slug',
        'is_active' => true,
    ]);

    $response->assertSessionHasErrors('slug');
});

test('admin users can update a category', function () {
    $user = User::factory()->admin()->create();

    $category = UmrahCategory::create([
        'name' => 'Old Name',
        'slug' => 'old-name',
        'is_active' => true,
        'order' => 0,
    ]);

    $response = $this->actingAs($user)->put(route('umrah-content.categories.update', $category), [
        'name' => 'New Name',
        'slug' => 'new-name',
        'description' => 'Updated description',
        'is_active' => false,
    ]);

    $response->assertRedirect(route('umrah-content.categories.index'));

    $category->refresh();
    expect($category->name)->toBe('New Name');
    expect($category->slug)->toBe('new-name');
    expect($category->is_active)->toBeFalse();
});

test('admin users can delete a category and packages are unlinked', function () {
    $user = User::factory()->admin()->create();

    $category = UmrahCategory::create([
        'name' => 'Deletable',
        'slug' => 'deletable',
        'is_active' => true,
        'order' => 0,
    ]);

    $package = UmrahPackage::create([
        'umrah_category_id' => $category->id,
        'title' => 'Linked Package',
        'slug' => 'linked-package',
        'description' => 'Description',
        'image_path' => 'umrah/packages/a.jpg',
        'departure' => 'Jakarta',
        'duration' => '9 days',
        'departure_schedule' => 'Weekly',
        'price_idr' => 5000,
        'is_active' => true,
        'order' => 0,
    ]);

    $this->actingAs($user)->delete(route('umrah-content.categories.destroy', $category))
        ->assertRedirect(route('umrah-content.categories.index'));

    $this->assertDatabaseMissing('umrah_categories', ['id' => $category->id]);

    $package->refresh();
    expect($package->umrah_category_id)->toBeNull();
});

test('non-admin users cannot manage categories', function () {
    $editor = User::factory()->create(['role' => User::ROLE_EDITOR]);

    $this->actingAs($editor)->post(route('umrah-content.categories.store'), [
        'name' => 'Forbidden',
        'slug' => 'forbidden',
    ])->assertForbidden();
});
