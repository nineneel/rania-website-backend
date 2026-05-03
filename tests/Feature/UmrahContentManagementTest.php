<?php

use App\Models\UmrahAdditionalService;
use App\Models\UmrahAirline;
use App\Models\UmrahHotel;
use App\Models\UmrahItinerary;
use App\Models\UmrahPackage;
use App\Models\UmrahTransportation;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

test('admin users can create transportation', function () {
    Storage::fake('public');
    $user = User::factory()->admin()->create();

    $response = $this->actingAs($user)->post(route('umrah-content.transportations.store'), [
        'name' => 'Private Car',
        'description' => 'Private transport service',
        'icon' => UploadedFile::fake()->image('private-car.png'),
        'is_active' => true,
    ]);

    $response->assertRedirect(route('umrah-content.transportations.index'));
    $response->assertSessionHas('success');

    $this->assertDatabaseHas('umrah_transportations', [
        'name' => 'Private Car',
        'description' => 'Private transport service',
        'is_active' => true,
    ]);
});

test('transportation creation requires name', function () {
    $user = User::factory()->admin()->create();

    $response = $this->actingAs($user)->post(route('umrah-content.transportations.store'), [
        'description' => 'Description only',
    ]);

    $response->assertSessionHasErrors('name');
});

test('admin users can update and delete transportation', function () {
    Storage::fake('public');
    $user = User::factory()->admin()->create();

    $transportation = UmrahTransportation::create([
        'name' => 'Old Transport',
        'description' => 'Old',
        'icon_path' => 'umrah/transportations/old.png',
        'is_active' => true,
        'order' => 0,
    ]);

    Storage::disk('public')->put('umrah/transportations/old.png', 'old');

    $updateResponse = $this->actingAs($user)->put(route('umrah-content.transportations.update', $transportation), [
        'name' => 'Updated Transport',
        'description' => 'Updated description',
        'is_active' => false,
    ]);

    $updateResponse->assertRedirect(route('umrah-content.transportations.index'));

    $this->assertDatabaseHas('umrah_transportations', [
        'id' => $transportation->id,
        'name' => 'Updated Transport',
        'is_active' => false,
    ]);

    $deleteResponse = $this->actingAs($user)->delete(route('umrah-content.transportations.destroy', $transportation));

    $deleteResponse->assertRedirect(route('umrah-content.transportations.index'));

    $this->assertDatabaseMissing('umrah_transportations', [
        'id' => $transportation->id,
    ]);
});

test('admin users can create update and delete itinerary', function () {
    Storage::fake('public');
    $user = User::factory()->admin()->create();

    $createResponse = $this->actingAs($user)->post(route('umrah-content.itineraries.store'), [
        'title' => 'Masjid Nabawi',
        'location' => 'Madinah',
        'description' => 'Visit the mosque',
        'image' => UploadedFile::fake()->image('masjid.jpg'),
        'is_active' => true,
    ]);

    $createResponse->assertRedirect(route('umrah-content.itineraries.index'));

    $itinerary = UmrahItinerary::first();

    expect($itinerary)->not->toBeNull();

    $updateResponse = $this->actingAs($user)->put(route('umrah-content.itineraries.update', $itinerary), [
        'title' => 'Masjid Nabawi Updated',
        'location' => 'Madinah',
        'description' => 'Updated description',
        'is_active' => false,
    ]);

    $updateResponse->assertRedirect(route('umrah-content.itineraries.index'));

    $this->assertDatabaseHas('umrah_itineraries', [
        'id' => $itinerary->id,
        'title' => 'Masjid Nabawi Updated',
        'is_active' => false,
    ]);

    $deleteResponse = $this->actingAs($user)->delete(route('umrah-content.itineraries.destroy', $itinerary));

    $deleteResponse->assertRedirect(route('umrah-content.itineraries.index'));

    $this->assertDatabaseMissing('umrah_itineraries', [
        'id' => $itinerary->id,
    ]);
});

test('admin users can create update and delete additional service', function () {
    Storage::fake('public');
    $user = User::factory()->admin()->create();

    $createResponse = $this->actingAs($user)->post(route('umrah-content.additional-services.store'), [
        'title' => 'Airport Assistance',
        'description' => 'Global airport service',
        'image' => UploadedFile::fake()->image('airport.jpg'),
        'is_active' => true,
    ]);

    $createResponse->assertRedirect(route('umrah-content.additional-services.index'));

    $additionalService = UmrahAdditionalService::first();

    expect($additionalService)->not->toBeNull();

    $updateResponse = $this->actingAs($user)->put(route('umrah-content.additional-services.update', $additionalService), [
        'title' => 'Airport Assistance Updated',
        'description' => 'Updated service',
        'is_active' => false,
    ]);

    $updateResponse->assertRedirect(route('umrah-content.additional-services.index'));

    $this->assertDatabaseHas('umrah_additional_services', [
        'id' => $additionalService->id,
        'title' => 'Airport Assistance Updated',
        'is_active' => false,
    ]);

    $deleteResponse = $this->actingAs($user)->delete(route('umrah-content.additional-services.destroy', $additionalService));

    $deleteResponse->assertRedirect(route('umrah-content.additional-services.index'));

    $this->assertDatabaseMissing('umrah_additional_services', [
        'id' => $additionalService->id,
    ]);
});

test('admin users can create package with slug relations and package services', function () {
    Storage::fake('public');
    $user = User::factory()->admin()->create();

    $hotel = UmrahHotel::create([
        'name' => 'Hotel A',
        'stars' => 5,
        'location' => 'Madinah',
        'is_active' => true,
    ]);

    $airline = UmrahAirline::create([
        'name' => 'Airline A',
        'logo_path' => 'umrah/airlines/a.png',
        'is_active' => true,
    ]);

    $transportation = UmrahTransportation::create([
        'name' => 'Private Car',
        'is_active' => true,
        'order' => 0,
    ]);

    $itinerary = UmrahItinerary::create([
        'title' => 'Masjid Nabawi',
        'description' => 'Visit',
        'is_active' => true,
        'order' => 0,
    ]);

    $response = $this->actingAs($user)->post(route('umrah-content.packages.store'), [
        'title' => 'Royal Hilton Signature',
        'slug' => 'Royal Hilton Signature',
        'subtitle' => 'Low Season',
        'description' => 'Package description',
        'image' => UploadedFile::fake()->image('package.jpg'),
        'gallery_images' => [
            UploadedFile::fake()->image('gallery-1.jpg'),
            UploadedFile::fake()->image('gallery-2.jpg'),
            UploadedFile::fake()->image('gallery-3.jpg'),
            UploadedFile::fake()->image('gallery-4.jpg'),
        ],
        'departure' => 'Jakarta',
        'duration' => '9 days',
        'departure_schedule' => 'Weekly',
        'price_idr' => 5000,
        'price_usd' => 500,
        'price_sar' => 1800,
        'link' => 'https://example.com/packages/royal-hilton',
        'is_active' => true,
        'hotel_ids' => [$hotel->id],
        'airline_ids' => [$airline->id],
        'transportation_ids' => [$transportation->id],
        'itinerary_ids' => [$itinerary->id],
        'package_services' => [
            ['title' => 'Visa Processing', 'description' => 'Handled by team'],
            ['title' => 'Mutawif Support', 'description' => '24/7 support'],
        ],
    ]);

    $response->assertRedirect(route('umrah-content.packages.index'));

    $package = UmrahPackage::first();

    expect($package)->not->toBeNull();
    expect($package->slug)->toBe('royal-hilton-signature');
    expect($package->hotels()->count())->toBe(1);
    expect($package->airlines()->count())->toBe(1);
    expect($package->transportations()->count())->toBe(1);
    expect($package->itineraries()->count())->toBe(1);
    expect($package->services()->count())->toBe(2);
    expect($package->images()->count())->toBe(4);
});

test('package creation requires at least 4 gallery images', function () {
    Storage::fake('public');
    $user = User::factory()->admin()->create();

    $hotel = UmrahHotel::create([
        'name' => 'Hotel A',
        'stars' => 5,
        'location' => 'Madinah',
        'is_active' => true,
    ]);

    $airline = UmrahAirline::create([
        'name' => 'Airline A',
        'logo_path' => 'umrah/airlines/a.png',
        'is_active' => true,
    ]);

    $response = $this->actingAs($user)->post(route('umrah-content.packages.store'), [
        'title' => 'Invalid Gallery Package',
        'slug' => 'invalid-gallery-package',
        'description' => 'Package description',
        'image' => UploadedFile::fake()->image('package.jpg'),
        'gallery_images' => [
            UploadedFile::fake()->image('gallery-1.jpg'),
            UploadedFile::fake()->image('gallery-2.jpg'),
            UploadedFile::fake()->image('gallery-3.jpg'),
        ],
        'departure' => 'Jakarta',
        'duration' => '9 days',
        'departure_schedule' => 'Weekly',
        'price_idr' => 5000,
        'is_active' => true,
        'hotel_ids' => [$hotel->id],
        'airline_ids' => [$airline->id],
    ]);

    $response->assertSessionHasErrors('gallery_images');
});

test('admin users can update package relation sync and package services', function () {
    Storage::fake('public');
    $user = User::factory()->admin()->create();

    $hotelA = UmrahHotel::create([
        'name' => 'Hotel A',
        'stars' => 5,
        'location' => 'Madinah',
        'is_active' => true,
    ]);

    $hotelB = UmrahHotel::create([
        'name' => 'Hotel B',
        'stars' => 4,
        'location' => 'Makkah',
        'is_active' => true,
    ]);

    $airlineA = UmrahAirline::create([
        'name' => 'Airline A',
        'logo_path' => 'umrah/airlines/a.png',
        'is_active' => true,
    ]);

    $airlineB = UmrahAirline::create([
        'name' => 'Airline B',
        'logo_path' => 'umrah/airlines/b.png',
        'is_active' => true,
    ]);

    $transportationA = UmrahTransportation::create([
        'name' => 'Transport A',
        'is_active' => true,
        'order' => 0,
    ]);

    $transportationB = UmrahTransportation::create([
        'name' => 'Transport B',
        'is_active' => true,
        'order' => 1,
    ]);

    $itineraryA = UmrahItinerary::create([
        'title' => 'Itinerary A',
        'description' => 'A',
        'is_active' => true,
        'order' => 0,
    ]);

    $itineraryB = UmrahItinerary::create([
        'title' => 'Itinerary B',
        'description' => 'B',
        'is_active' => true,
        'order' => 1,
    ]);

    $package = UmrahPackage::create([
        'title' => 'Package A',
        'slug' => 'package-a',
        'description' => 'Description',
        'image_path' => 'umrah/packages/a.jpg',
        'departure' => 'Jakarta',
        'duration' => '9 days',
        'departure_schedule' => 'Weekly',
        'price_idr' => 5000,
        'is_active' => true,
        'order' => 0,
    ]);

    $package->hotels()->attach([$hotelA->id => ['order' => 0]]);
    $package->airlines()->attach([$airlineA->id]);
    $package->transportations()->attach([$transportationA->id => ['order' => 0]]);
    $package->itineraries()->attach([$itineraryA->id => ['order' => 0]]);
    $package->services()->create([
        'title' => 'Initial Service',
        'description' => 'Initial',
        'order' => 0,
    ]);
    $package->images()->createMany([
        ['image_path' => 'umrah/packages/gallery/package-a-1.jpg', 'order' => 0],
        ['image_path' => 'umrah/packages/gallery/package-a-2.jpg', 'order' => 1],
        ['image_path' => 'umrah/packages/gallery/package-a-3.jpg', 'order' => 2],
        ['image_path' => 'umrah/packages/gallery/package-a-4.jpg', 'order' => 3],
    ]);

    $existingGalleryImageIds = $package->images()->pluck('id')->all();

    $response = $this->actingAs($user)->put(route('umrah-content.packages.update', $package), [
        'title' => 'Package Updated',
        'slug' => 'Package Updated',
        'subtitle' => 'Updated subtitle',
        'description' => 'Updated description',
        'gallery_images' => [UploadedFile::fake()->image('gallery-new-1.jpg')],
        'existing_gallery_image_ids' => array_slice($existingGalleryImageIds, 0, 3),
        'departure' => 'Surabaya',
        'duration' => '12 days',
        'departure_schedule' => 'Monthly',
        'price_idr' => 7000,
        'link' => 'https://example.com/package-updated',
        'is_active' => true,
        'hotel_ids' => [$hotelB->id],
        'airline_ids' => [$airlineB->id],
        'transportation_ids' => [$transportationB->id],
        'itinerary_ids' => [$itineraryB->id],
        'package_services' => [
            ['title' => 'Updated Service 1', 'description' => 'Desc 1'],
            ['title' => 'Updated Service 2', 'description' => 'Desc 2'],
        ],
    ]);

    $response->assertRedirect(route('umrah-content.packages.index'));

    $package->refresh();

    expect($package->title)->toBe('Package Updated');
    expect($package->slug)->toBe('package-updated');
    expect($package->hotels()->pluck('umrah_hotels.id')->all())->toBe([$hotelB->id]);
    expect($package->airlines()->pluck('umrah_airlines.id')->all())->toBe([$airlineB->id]);
    expect($package->transportations()->pluck('umrah_transportations.id')->all())->toBe([$transportationB->id]);
    expect($package->itineraries()->pluck('umrah_itineraries.id')->all())->toBe([$itineraryB->id]);
    expect($package->services()->count())->toBe(2);
    expect($package->services()->first()->title)->toBe('Updated Service 1');
    expect($package->images()->count())->toBe(4);
});

test('package hotels store with custom total nights and default to 3 when missing', function () {
    Storage::fake('public');
    $user = User::factory()->admin()->create();

    $hotelWithNights = UmrahHotel::create([
        'name' => 'Hotel Custom',
        'stars' => 5,
        'location' => 'Madinah',
        'is_active' => true,
    ]);

    $hotelDefault = UmrahHotel::create([
        'name' => 'Hotel Default',
        'stars' => 4,
        'location' => 'Makkah',
        'is_active' => true,
    ]);

    $airline = UmrahAirline::create([
        'name' => 'Airline A',
        'logo_path' => 'umrah/airlines/a.png',
        'is_active' => true,
    ]);

    $response = $this->actingAs($user)->post(route('umrah-content.packages.store'), [
        'title' => 'Hotel Nights Package',
        'slug' => 'hotel-nights-package',
        'description' => 'Package description',
        'image' => UploadedFile::fake()->image('package.jpg'),
        'gallery_images' => [
            UploadedFile::fake()->image('gallery-1.jpg'),
            UploadedFile::fake()->image('gallery-2.jpg'),
            UploadedFile::fake()->image('gallery-3.jpg'),
            UploadedFile::fake()->image('gallery-4.jpg'),
        ],
        'departure' => 'Jakarta',
        'duration' => '9 days',
        'departure_schedule' => 'Weekly',
        'price_idr' => 5000,
        'is_active' => true,
        'hotel_ids' => [$hotelWithNights->id, $hotelDefault->id],
        'hotel_nights' => [$hotelWithNights->id => 5],
        'airline_ids' => [$airline->id],
    ]);

    $response->assertRedirect(route('umrah-content.packages.index'));

    $package = UmrahPackage::first();

    expect($package->hotels()->where('umrah_hotels.id', $hotelWithNights->id)->first()->pivot->total_nights)
        ->toBe(5);
    expect($package->hotels()->where('umrah_hotels.id', $hotelDefault->id)->first()->pivot->total_nights)
        ->toBe(3);
});

test('package update syncs hotel total nights', function () {
    Storage::fake('public');
    $user = User::factory()->admin()->create();

    $hotel = UmrahHotel::create([
        'name' => 'Hotel A',
        'stars' => 5,
        'location' => 'Madinah',
        'is_active' => true,
    ]);

    $package = UmrahPackage::create([
        'title' => 'Package A',
        'slug' => 'package-a',
        'description' => 'Description',
        'image_path' => 'umrah/packages/a.jpg',
        'departure' => 'Jakarta',
        'duration' => '9 days',
        'departure_schedule' => 'Weekly',
        'price_idr' => 5000,
        'is_active' => true,
        'order' => 0,
    ]);

    $package->hotels()->attach($hotel->id, ['order' => 0, 'total_nights' => 3]);
    $package->images()->createMany([
        ['image_path' => 'umrah/packages/gallery/a-1.jpg', 'order' => 0],
        ['image_path' => 'umrah/packages/gallery/a-2.jpg', 'order' => 1],
        ['image_path' => 'umrah/packages/gallery/a-3.jpg', 'order' => 2],
        ['image_path' => 'umrah/packages/gallery/a-4.jpg', 'order' => 3],
    ]);

    $existingGalleryImageIds = $package->images()->pluck('id')->all();

    $response = $this->actingAs($user)->put(route('umrah-content.packages.update', $package), [
        'title' => 'Package A',
        'slug' => 'package-a',
        'description' => 'Description',
        'existing_gallery_image_ids' => $existingGalleryImageIds,
        'departure' => 'Jakarta',
        'duration' => '9 days',
        'departure_schedule' => 'Weekly',
        'price_idr' => 5000,
        'is_active' => true,
        'hotel_ids' => [$hotel->id],
        'hotel_nights' => [$hotel->id => 7],
    ]);

    $response->assertRedirect(route('umrah-content.packages.index'));

    expect($package->hotels()->first()->pivot->total_nights)->toBe(7);
});

test('admin users can create a hotel with multiple images', function () {
    Storage::fake('public');
    $user = User::factory()->admin()->create();

    $response = $this->actingAs($user)->post(route('umrah-content.hotels.store'), [
        'name' => 'Carousel Hotel',
        'stars' => 5,
        'location' => 'Madinah',
        'description' => null,
        'is_active' => true,
        'images' => [
            UploadedFile::fake()->image('hotel-1.jpg'),
            UploadedFile::fake()->image('hotel-2.jpg'),
            UploadedFile::fake()->image('hotel-3.jpg'),
        ],
    ]);

    $response->assertRedirect(route('umrah-content.hotels.index'));

    $hotel = UmrahHotel::where('name', 'Carousel Hotel')->firstOrFail();
    expect($hotel->images()->count())->toBe(3);
    expect($hotel->images()->orderBy('order')->first()->order)->toBe(0);
    expect($hotel->image_url)->not->toBeNull();
});

test('hotel image upload is capped at 5', function () {
    Storage::fake('public');
    $user = User::factory()->admin()->create();

    $response = $this->actingAs($user)->post(route('umrah-content.hotels.store'), [
        'name' => 'Too Many Images Hotel',
        'stars' => 5,
        'location' => 'Makkah',
        'is_active' => true,
        'images' => array_map(
            fn ($i) => UploadedFile::fake()->image("hotel-{$i}.jpg"),
            range(1, 6),
        ),
    ]);

    $response->assertSessionHasErrors('images');
    expect(UmrahHotel::where('name', 'Too Many Images Hotel')->exists())->toBeFalse();
});

test('admin users can sync hotel images on update', function () {
    Storage::fake('public');
    $user = User::factory()->admin()->create();

    $hotel = UmrahHotel::create([
        'name' => 'Sync Hotel',
        'stars' => 4,
        'location' => 'Madinah',
        'is_active' => true,
    ]);

    $hotel->images()->createMany([
        ['image_path' => 'umrah/hotels/old-1.jpg', 'order' => 0],
        ['image_path' => 'umrah/hotels/old-2.jpg', 'order' => 1],
    ]);

    $retainedId = $hotel->images()->orderBy('order')->first()->id;

    $response = $this->actingAs($user)->put(route('umrah-content.hotels.update', $hotel), [
        'name' => 'Sync Hotel',
        'stars' => 4,
        'location' => 'Madinah',
        'is_active' => true,
        'existing_image_ids' => [$retainedId],
        'images' => [UploadedFile::fake()->image('new.jpg')],
    ]);

    $response->assertRedirect(route('umrah-content.hotels.index'));

    $hotel->refresh();
    expect($hotel->images()->count())->toBe(2);
    expect($hotel->images()->pluck('id'))->toContain($retainedId);
});
