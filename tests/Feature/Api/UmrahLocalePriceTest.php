<?php

use App\Models\UmrahCategory;
use App\Models\UmrahPackage;

function createMultiCurrencyPackage(?int $categoryId = null): UmrahPackage
{
    return UmrahPackage::create([
        'umrah_category_id' => $categoryId,
        'title' => 'Locale Package',
        'slug' => 'locale-package',
        'description' => 'Description',
        'image_path' => 'packages/locale.jpg',
        'departure' => 'Jakarta',
        'duration' => '9 days',
        'departure_schedule' => 'Weekly',
        'price_idr' => 54800000,
        'price_usd' => 3500,
        'price_sar' => 13125,
        'is_active' => true,
        'order' => 0,
    ]);
}

test('api returns IDR price when lang=id', function () {
    createMultiCurrencyPackage();

    $response = $this->getJson('/api/umrah-packages?lang=id');

    $response->assertOk();
    expect($response->json('locale'))->toBe('id');
    expect($response->json('currency'))->toBe('IDR');
    expect($response->json('data.0.price'))->toBe('54800000.00');
    expect($response->json('data.0.currency'))->toBe('IDR');
});

test('api returns USD price when lang=en', function () {
    createMultiCurrencyPackage();

    $response = $this->getJson('/api/umrah-packages?lang=en');

    $response->assertOk();
    expect($response->json('currency'))->toBe('USD');
    expect($response->json('data.0.price'))->toBe('3500.00');
    expect($response->json('data.0.currency'))->toBe('USD');
});

test('api returns SAR price when lang=ar', function () {
    createMultiCurrencyPackage();

    $response = $this->getJson('/api/umrah-packages?lang=ar');

    $response->assertOk();
    expect($response->json('currency'))->toBe('SAR');
    expect($response->json('data.0.price'))->toBe('13125.00');
});

test('api falls back to IDR for unknown locales when no Accept-Language', function () {
    createMultiCurrencyPackage();

    $response = $this->getJson('/api/umrah-packages?lang=xx', ['Accept-Language' => '']);

    $response->assertOk();
    expect($response->json('locale'))->toBe('id');
    expect($response->json('currency'))->toBe('IDR');
});

test('api uses Accept-Language header when no lang query param', function () {
    createMultiCurrencyPackage();

    $response = $this->getJson('/api/umrah-packages', ['Accept-Language' => 'en-US']);

    $response->assertOk();
    expect($response->json('currency'))->toBe('USD');
});

test('api query param takes precedence over Accept-Language', function () {
    createMultiCurrencyPackage();

    $response = $this->getJson('/api/umrah-packages?lang=ar', ['Accept-Language' => 'en']);

    $response->assertOk();
    expect($response->json('currency'))->toBe('SAR');
});

test('api exposes all three prices in the prices object', function () {
    createMultiCurrencyPackage();

    $response = $this->getJson('/api/umrah-packages');

    $response->assertOk();
    expect($response->json('data.0.prices.idr'))->toBe('54800000.00');
    expect($response->json('data.0.prices.usd'))->toBe('3500.00');
    expect($response->json('data.0.prices.sar'))->toBe('13125.00');
});

test('api package detail also respects the locale', function () {
    createMultiCurrencyPackage();

    $response = $this->getJson('/api/umrah-packages/locale-package?lang=en');

    $response->assertOk();
    expect($response->json('data.price'))->toBe('3500.00');
    expect($response->json('data.currency'))->toBe('USD');
});

test('api returns category information in package payload', function () {
    $category = UmrahCategory::create([
        'name' => 'Umrah Private',
        'slug' => 'umrah-private',
        'is_active' => true,
        'order' => 0,
    ]);

    createMultiCurrencyPackage($category->id);

    $response = $this->getJson('/api/umrah-packages');
    $response->assertOk();

    expect($response->json('data.0.category.slug'))->toBe('umrah-private');
    expect($response->json('data.0.category.name'))->toBe('Umrah Private');
});

test('api can filter packages by category slug', function () {
    $privateCategory = UmrahCategory::create([
        'name' => 'Umrah Private',
        'slug' => 'umrah-private',
        'is_active' => true,
        'order' => 0,
    ]);

    $vipCategory = UmrahCategory::create([
        'name' => 'Umrah Private VIP',
        'slug' => 'umrah-private-vip',
        'is_active' => true,
        'order' => 1,
    ]);

    UmrahPackage::create([
        'umrah_category_id' => $privateCategory->id,
        'title' => 'Private Package',
        'slug' => 'private-package',
        'description' => 'Private',
        'image_path' => 'packages/p.jpg',
        'departure' => 'Jakarta',
        'duration' => '9 days',
        'departure_schedule' => 'Weekly',
        'price_idr' => 1000,
        'is_active' => true,
        'order' => 0,
    ]);

    UmrahPackage::create([
        'umrah_category_id' => $vipCategory->id,
        'title' => 'VIP Package',
        'slug' => 'vip-package',
        'description' => 'VIP',
        'image_path' => 'packages/vip.jpg',
        'departure' => 'Jakarta',
        'duration' => '9 days',
        'departure_schedule' => 'Weekly',
        'price_idr' => 2000,
        'is_active' => true,
        'order' => 1,
    ]);

    $response = $this->getJson('/api/umrah-packages?category=umrah-private');
    $response->assertOk();
    $response->assertJsonFragment(['slug' => 'private-package']);
    $response->assertJsonMissing(['slug' => 'vip-package']);
});

test('public api lists active categories with package counts', function () {
    $active = UmrahCategory::create([
        'name' => 'Active Category',
        'slug' => 'active-category',
        'is_active' => true,
        'order' => 0,
    ]);

    UmrahCategory::create([
        'name' => 'Inactive Category',
        'slug' => 'inactive-category',
        'is_active' => false,
        'order' => 1,
    ]);

    createMultiCurrencyPackage($active->id);

    $response = $this->getJson('/api/umrah-categories');

    $response->assertOk();
    $response->assertJsonFragment(['slug' => 'active-category', 'packages_count' => 1]);
    $response->assertJsonMissing(['slug' => 'inactive-category']);
});
