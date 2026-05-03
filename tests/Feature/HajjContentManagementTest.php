<?php

use App\Models\HajjPackage;
use App\Models\UmrahAdditionalService;
use App\Models\UmrahAirline;
use App\Models\UmrahHotel;
use App\Models\UmrahItinerary;
use App\Models\UmrahTransportation;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

test('admin users can create hajj package with shared umrah relationships', function () {
    Storage::fake('public');
    $user = User::factory()->admin()->create();

    $hotel = UmrahHotel::create([
        'name' => 'Fairmont',
        'stars' => 5,
        'location' => 'Makkah',
        'is_active' => true,
    ]);

    $airline = UmrahAirline::create([
        'name' => 'Garuda',
        'logo_path' => 'umrah/airlines/garuda.png',
        'is_active' => true,
    ]);

    $transportation = UmrahTransportation::create([
        'name' => 'GMC',
        'is_active' => true,
        'order' => 0,
    ]);

    $itinerary = UmrahItinerary::create([
        'title' => 'Arrival',
        'description' => 'Arrival at Madinah',
        'is_active' => true,
        'order' => 0,
    ]);

    $additionalService = UmrahAdditionalService::create([
        'title' => 'Insurance',
        'description' => 'Travel insurance',
        'is_active' => true,
        'order' => 0,
    ]);

    $response = $this->actingAs($user)->post(route('hajj-content.packages.store'), [
        'title' => 'Haji Plus Luxury',
        'subtitle' => 'Discover Your Sacred Hajj Journey',
        'description' => 'Premium hajj experience',
        'image' => UploadedFile::fake()->image('package.jpg'),
        'color' => '#d4af37',
        'gallery_images' => [
            UploadedFile::fake()->image('g1.jpg'),
            UploadedFile::fake()->image('g2.jpg'),
            UploadedFile::fake()->image('g3.jpg'),
            UploadedFile::fake()->image('g4.jpg'),
        ],
        'departure' => 'Soekarno-Hatta Airport',
        'duration' => '21 Days',
        'departure_schedule' => '1 Pax',
        'date' => '15 Jun 2026',
        'price_idr' => '180000000',
        'price_quad_idr' => '180000000',
        'price_triple_idr' => '200000000',
        'price_double_idr' => '215000000',
        'is_active' => true,
        'hotel_ids' => [$hotel->id],
        'hotel_nights' => [$hotel->id => 7],
        'airline_ids' => [$airline->id],
        'airline_classes' => [$airline->id => 'business'],
        'transportation_ids' => [$transportation->id],
        'itinerary_ids' => [$itinerary->id],
        'additional_service_ids' => [$additionalService->id],
        'package_services' => [
            ['title' => 'Visa', 'is_included' => true],
            ['title' => 'Air Travel', 'is_included' => false],
        ],
        'package_beds' => [
            ['type' => 'Quad', 'bed_count' => 4],
            ['type' => 'Triple', 'bed_count' => 3],
            ['type' => 'Double', 'bed_count' => 2],
        ],
    ]);

    $response->assertRedirect(route('hajj-content.packages.index'));

    $package = HajjPackage::first();
    expect($package)->not->toBeNull();
    expect($package->title)->toBe('Haji Plus Luxury');
    expect($package->color)->toBe('#d4af37');
    expect($package->hotels)->toHaveCount(1);
    expect($package->hotels->first()->id)->toBe($hotel->id);
    expect($package->airlines)->toHaveCount(1);
    expect($package->airlines->first()->id)->toBe($airline->id);
    expect($package->airlines->first()->pivot->class)->toBe('business');
    expect($package->transportations)->toHaveCount(1);
    expect($package->itineraries)->toHaveCount(1);
    expect($package->additionalServices)->toHaveCount(1);
    expect($package->services)->toHaveCount(2);
    expect($package->beds)->toHaveCount(3);
});

test('non admin users cannot access hajj content', function () {
    $user = User::factory()->create(['role' => 'editor']);

    $response = $this->actingAs($user)->get(route('hajj-content.index'));

    $response->assertForbidden();
});

test('hajj packages can be reordered', function () {
    $user = User::factory()->admin()->create();

    $package1 = HajjPackage::create([
        'title' => 'Package 1',
        'slug' => 'package-1',
        'description' => 'desc',
        'image_path' => 'hajj/packages/1.jpg',
        'departure' => 'Jakarta',
        'duration' => '21 Days',
        'departure_schedule' => '1 Pax',
        'price_idr' => 100,
        'is_active' => true,
        'order' => 0,
    ]);
    $package2 = HajjPackage::create([
        'title' => 'Package 2',
        'slug' => 'package-2',
        'description' => 'desc',
        'image_path' => 'hajj/packages/2.jpg',
        'departure' => 'Jakarta',
        'duration' => '21 Days',
        'departure_schedule' => '1 Pax',
        'price_idr' => 200,
        'is_active' => true,
        'order' => 1,
    ]);

    $response = $this->actingAs($user)->post(route('hajj-content.packages.reorder'), [
        'items' => [
            ['id' => $package1->id, 'order' => 1],
            ['id' => $package2->id, 'order' => 0],
        ],
    ]);

    $response->assertRedirect();

    expect($package1->fresh()->order)->toBe(1);
    expect($package2->fresh()->order)->toBe(0);
});
