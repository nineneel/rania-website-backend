<?php

use App\Models\HajjPackage;
use App\Models\UmrahHotel;

function createHajjPackage(): HajjPackage
{
    return HajjPackage::create([
        'title' => 'Haji Plus Luxury',
        'slug' => 'haji-plus-luxury',
        'subtitle' => 'Discover Your Sacred Hajj Journey',
        'description' => 'Premium hajj experience',
        'image_path' => 'hajj/packages/luxury.jpg',
        'color' => '#d4af37',
        'departure' => 'Jakarta',
        'duration' => '21 Days',
        'departure_schedule' => '1 Pax',
        'price_idr' => 180000000,
        'price_usd' => 18000,
        'price_sar' => 67500,
        'price_quad_idr' => 180000000,
        'price_triple_idr' => 200000000,
        'price_double_idr' => 215000000,
        'price_quad_usd' => 18000,
        'price_triple_usd' => 20000,
        'price_double_usd' => 21500,
        'price_quad_sar' => 67500,
        'price_triple_sar' => 75000,
        'price_double_sar' => 80625,
        'is_active' => true,
        'order' => 0,
    ]);
}

test('hajj packages api returns IDR room prices when lang=id', function () {
    createHajjPackage();

    $response = $this->getJson('/api/hajj-packages?lang=id');

    $response->assertOk();
    expect($response->json('locale'))->toBe('id');
    expect($response->json('currency'))->toBe('IDR');
    expect($response->json('data.0.color'))->toBe('#d4af37');
    expect($response->json('data.0.room_prices.quad'))->toBe('180000000.00');
    expect($response->json('data.0.room_prices.triple'))->toBe('200000000.00');
    expect($response->json('data.0.room_prices.double'))->toBe('215000000.00');
});

test('hajj packages api returns USD room prices when lang=en', function () {
    createHajjPackage();

    $response = $this->getJson('/api/hajj-packages?lang=en');

    $response->assertOk();
    expect($response->json('currency'))->toBe('USD');
    expect($response->json('data.0.room_prices.quad'))->toBe('18000.00');
    expect($response->json('data.0.room_prices.double'))->toBe('21500.00');
});

test('hajj packages api returns all room prices in room_prices_all', function () {
    createHajjPackage();

    $response = $this->getJson('/api/hajj-packages?lang=ar');

    $response->assertOk();
    expect($response->json('data.0.room_prices_all.idr.quad'))->toBe('180000000.00');
    expect($response->json('data.0.room_prices_all.usd.triple'))->toBe('20000.00');
    expect($response->json('data.0.room_prices_all.sar.double'))->toBe('80625.00');
});

test('hajj package detail returns full payload', function () {
    $package = createHajjPackage();
    $package->beds()->create(['type' => 'Quad', 'bed_count' => 4, 'order' => 0]);
    $package->services()->create(['title' => 'Visa', 'is_included' => true, 'order' => 0]);
    $package->images()->create(['image_path' => 'hajj/packages/gallery/1.jpg', 'order' => 0]);

    $response = $this->getJson('/api/hajj-packages/haji-plus-luxury');

    $response->assertOk();
    expect($response->json('data.color'))->toBe('#d4af37');
    expect($response->json('data.beds.0.type'))->toBe('Quad');
    expect($response->json('data.beds.0.bed_count'))->toBe(4);
    expect($response->json('data.package_services.0.title'))->toBe('Visa');
    expect($response->json('data.package_services.0.is_included'))->toBe(true);
});

test('hajj package detail returns 404 for unknown slug', function () {
    $response = $this->getJson('/api/hajj-packages/does-not-exist');

    $response->assertNotFound();
});

test('hajj package detail returns 404 for inactive package', function () {
    $package = createHajjPackage();
    $package->update(['is_active' => false]);

    $response = $this->getJson('/api/hajj-packages/haji-plus-luxury');

    $response->assertNotFound();
});

test('hajj package response includes shared umrah hotel', function () {
    $package = createHajjPackage();
    $hotel = UmrahHotel::create([
        'name' => 'Fairmont',
        'stars' => 5,
        'location' => 'Makkah',
        'is_active' => true,
    ]);
    $package->hotels()->attach($hotel->id, ['order' => 0, 'total_nights' => 7]);

    $response = $this->getJson('/api/hajj-packages?lang=id');

    $response->assertOk();
    expect($response->json('data.0.hotels.0.name'))->toBe('Fairmont');
    expect($response->json('data.0.hotels.0.total_nights'))->toBe(7);
});
