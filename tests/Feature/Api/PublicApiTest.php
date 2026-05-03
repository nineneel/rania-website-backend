<?php

use App\Models\Event;
use App\Models\FAQ;
use App\Models\HeroSlide;
use App\Models\SocialMedia;
use App\Models\Testimonial;
use App\Models\UmrahAdditionalService;
use App\Models\UmrahAirline;
use App\Models\UmrahHotel;
use App\Models\UmrahItinerary;
use App\Models\UmrahPackage;
use App\Models\UmrahTransportation;

test('public api can retrieve active testimonials', function () {
    Testimonial::create([
        'name' => 'John Doe',
        'subtitle' => 'Customer',
        'text' => 'Great service!',
        'is_active' => true,
        'order' => 1,
    ]);
    Testimonial::create([
        'name' => 'Jane Smith',
        'subtitle' => 'Client',
        'text' => 'Excellent!',
        'is_active' => false, // This should not appear
        'order' => 2,
    ]);

    $response = $this->getJson('/api/testimonials');

    $response->assertOk();
    $response->assertJsonCount(1, 'data');
    $response->assertJsonFragment(['name' => 'John Doe']);
    $response->assertJsonMissing(['name' => 'Jane Smith']);
});

test('public api returns testimonials ordered correctly', function () {
    Testimonial::create([
        'name' => 'Second',
        'text' => 'Second testimonial',
        'is_active' => true,
        'order' => 2,
    ]);
    Testimonial::create([
        'name' => 'First',
        'text' => 'First testimonial',
        'is_active' => true,
        'order' => 1,
    ]);

    $response = $this->getJson('/api/testimonials');

    $response->assertOk();
    $data = $response->json('data');
    expect($data[0]['name'])->toBe('First');
    expect($data[1]['name'])->toBe('Second');
});

test('public api can retrieve active faqs', function () {
    FAQ::create([
        'question' => 'Active Question?',
        'answer' => 'Active Answer.',
        'is_active' => true,
        'order' => 1,
    ]);
    FAQ::create([
        'question' => 'Inactive Question?',
        'answer' => 'Inactive Answer.',
        'is_active' => false,
        'order' => 2,
    ]);

    $response = $this->getJson('/api/faqs');

    $response->assertOk();
    $response->assertJsonCount(1, 'data');
    $response->assertJsonFragment(['question' => 'Active Question?']);
    $response->assertJsonMissing(['question' => 'Inactive Question?']);
});

test('public api returns faqs ordered correctly', function () {
    FAQ::create([
        'question' => 'Second Question?',
        'answer' => 'Second Answer.',
        'is_active' => true,
        'order' => 2,
    ]);
    FAQ::create([
        'question' => 'First Question?',
        'answer' => 'First Answer.',
        'is_active' => true,
        'order' => 1,
    ]);

    $response = $this->getJson('/api/faqs');

    $response->assertOk();
    $data = $response->json('data');
    expect($data[0]['question'])->toBe('First Question?');
    expect($data[1]['question'])->toBe('Second Question?');
});

test('public api can retrieve active social media', function () {
    SocialMedia::create([
        'name' => 'Facebook',
        'url' => 'https://facebook.com',
        'is_active' => true,
        'order' => 1,
    ]);
    SocialMedia::create([
        'name' => 'Twitter',
        'url' => 'https://twitter.com',
        'is_active' => false,
        'order' => 2,
    ]);

    $response = $this->getJson('/api/social-media');

    $response->assertOk();
    $response->assertJsonCount(1, 'data');
    $response->assertJsonFragment(['name' => 'Facebook']);
    $response->assertJsonMissing(['name' => 'Twitter']);
});

test('public api returns social media ordered correctly', function () {
    SocialMedia::create([
        'name' => 'Second',
        'url' => 'https://second.com',
        'is_active' => true,
        'order' => 2,
    ]);
    SocialMedia::create([
        'name' => 'First',
        'url' => 'https://first.com',
        'is_active' => true,
        'order' => 1,
    ]);

    $response = $this->getJson('/api/social-media');

    $response->assertOk();
    $data = $response->json('data');
    expect($data[0]['name'])->toBe('First');
    expect($data[1]['name'])->toBe('Second');
});

test('public api can retrieve active hero slides', function () {
    HeroSlide::create([
        'title' => 'Active Slide',
        'subtitle' => 'Subtitle',
        'cta_text' => 'Click',
        'cta_link' => '#',
        'image_path' => 'hero-slides/test.jpg',
        'is_active' => true,
        'order' => 1,
    ]);
    HeroSlide::create([
        'title' => 'Inactive Slide',
        'subtitle' => 'Subtitle',
        'cta_text' => 'Click',
        'cta_link' => '#',
        'image_path' => 'hero-slides/test2.jpg',
        'is_active' => false,
        'order' => 2,
    ]);

    $response = $this->getJson('/api/hero-slides');

    $response->assertOk();
    $response->assertJsonCount(1, 'data');
    $response->assertJsonFragment(['title' => 'Active Slide']);
    $response->assertJsonMissing(['title' => 'Inactive Slide']);
});

test('public api can retrieve events', function () {
    Event::create([
        'title' => 'Test Event',
        'description' => 'Description',
        'date' => '2025-12-31',
        'image_path' => 'events/test.jpg',
        'is_active' => true,
        'order' => 1,
    ]);

    $response = $this->getJson('/api/events');

    $response->assertOk();
    $response->assertJsonFragment(['title' => 'Test Event']);
});

test('public api can submit contact form', function () {
    $response = $this->postJson('/api/contact', [
        'name' => 'John Doe',
        'email' => 'john@example.com',
        'phone' => '1234567890',
        'subject' => 'Test Subject',
        'message' => 'Test message content',
    ]);

    $response->assertStatus(201);
    $response->assertJsonFragment(['message' => 'Thank you for contacting us. We will get back to you soon.']);

    $this->assertDatabaseHas('contact_messages', [
        'name' => 'John Doe',
        'email' => 'john@example.com',
        'subject' => 'Test Subject',
        'message' => 'Test message content',
        'status' => 'new',
    ]);
});

test('contact form requires name', function () {
    $response = $this->postJson('/api/contact', [
        'email' => 'john@example.com',
        'message' => 'Test message',
    ]);

    $response->assertStatus(422);
    $response->assertJsonValidationErrors('name');
});

test('contact form requires valid email', function () {
    $response = $this->postJson('/api/contact', [
        'name' => 'John Doe',
        'email' => 'not-an-email',
        'message' => 'Test message',
    ]);

    $response->assertStatus(422);
    $response->assertJsonValidationErrors('email');
});

test('contact form requires message', function () {
    $response = $this->postJson('/api/contact', [
        'name' => 'John Doe',
        'email' => 'john@example.com',
    ]);

    $response->assertStatus(422);
    $response->assertJsonValidationErrors('message');
});

test('public api can retrieve umrah packages with pagination', function () {
    // Create multiple packages
    for ($i = 1; $i <= 15; $i++) {
        UmrahPackage::create([
            'title' => "Package $i",
            'slug' => "package-$i",
            'description' => "Description $i",
            'price_idr' => 1000 * $i,
            'duration' => "$i days",
            'departure' => '2025-12-01',
            'departure_schedule' => 'monthly',
            'image_path' => "packages/test$i.jpg",
            'is_active' => true,
            'order' => $i,
        ]);
    }

    $response = $this->getJson('/api/umrah-packages');

    $response->assertOk();
    $response->assertJsonStructure([
        'data',
        'meta' => ['current_page', 'last_page', 'per_page', 'total'],
        'links',
    ]);
});

test('public api returns only active umrah packages', function () {
    UmrahPackage::create([
        'title' => 'Active Package',
        'slug' => 'active-package',
        'description' => 'Description',
        'price_idr' => 1000,
        'duration' => '10 days',
        'departure' => '2025-12-01',
        'departure_schedule' => 'monthly',
        'image_path' => 'packages/active.jpg',
        'is_active' => true,
        'order' => 1,
    ]);
    UmrahPackage::create([
        'title' => 'Inactive Package',
        'slug' => 'inactive-package',
        'description' => 'Description',
        'price_idr' => 2000,
        'duration' => '15 days',
        'departure' => '2025-12-15',
        'departure_schedule' => 'weekly',
        'image_path' => 'packages/inactive.jpg',
        'is_active' => false,
        'order' => 2,
    ]);

    $response = $this->getJson('/api/umrah-packages');

    $response->assertOk();
    $response->assertJsonFragment(['title' => 'Active Package']);
    $response->assertJsonMissing(['title' => 'Inactive Package']);
});

test('public api umrah packages include subtitle field', function () {
    UmrahPackage::create([
        'title' => 'Premium Package',
        'slug' => 'premium-package',
        'subtitle' => 'Periode Low Season',
        'description' => 'Description',
        'price_idr' => 1000,
        'duration' => '10 days',
        'departure' => '2025-12-01',
        'departure_schedule' => 'monthly',
        'image_path' => 'packages/premium.jpg',
        'is_active' => true,
        'order' => 1,
    ]);

    $response = $this->getJson('/api/umrah-packages');

    $response->assertOk();
    $response->assertJsonFragment(['title' => 'Premium Package', 'subtitle' => 'Periode Low Season']);
});

test('public api umrah package list includes slug field', function () {
    UmrahPackage::create([
        'title' => 'Slug Package',
        'slug' => 'slug-package',
        'description' => 'Description',
        'price_idr' => 1000,
        'duration' => '10 days',
        'departure' => '2025-12-01',
        'departure_schedule' => 'monthly',
        'image_path' => 'packages/slug-package.jpg',
        'is_active' => true,
        'order' => 1,
    ]);

    $response = $this->getJson('/api/umrah-packages');

    $response->assertOk();
    $response->assertJsonFragment(['slug' => 'slug-package']);
});

test('public api can retrieve umrah package details by slug', function () {
    $hotel = UmrahHotel::create([
        'name' => 'Hotel Test',
        'stars' => 5,
        'location' => 'Madinah',
        'description' => 'Hotel Description',
        'is_active' => true,
    ]);

    $airline = UmrahAirline::create([
        'name' => 'Airline Test',
        'logo_path' => 'umrah/airlines/logo.png',
        'is_active' => true,
    ]);

    $transportation = UmrahTransportation::create([
        'name' => 'Private Car',
        'subtitle' => 'GMC',
        'description' => 'Private transport',
        'is_active' => true,
        'order' => 0,
    ]);

    $itinerary = UmrahItinerary::create([
        'title' => 'Masjid Nabawi',
        'location' => 'Madinah',
        'description' => 'Visit Masjid Nabawi',
        'is_active' => true,
        'order' => 0,
    ]);

    $globalAdditionalService = UmrahAdditionalService::create([
        'title' => 'Airport Assistance',
        'description' => 'Global service description',
        'is_active' => true,
        'order' => 0,
    ]);

    $package = UmrahPackage::create([
        'title' => 'Detail Package',
        'slug' => 'detail-package',
        'description' => 'Description',
        'price_idr' => 1500,
        'duration' => '10 days',
        'departure' => 'Jakarta',
        'departure_schedule' => 'monthly',
        'image_path' => 'packages/detail-package.jpg',
        'is_active' => true,
        'order' => 1,
    ]);

    $package->hotels()->attach([$hotel->id => ['order' => 0]]);
    $package->airlines()->attach([$airline->id]);
    $package->transportations()->attach([$transportation->id => ['order' => 0]]);
    $package->itineraries()->attach([$itinerary->id => ['order' => 0]]);
    $package->services()->create([
        'title' => 'Visa Processing',
        'description' => 'Package service description',
        'order' => 0,
    ]);
    $package->images()->createMany([
        ['image_path' => 'umrah/packages/gallery/detail-1.jpg', 'order' => 0],
        ['image_path' => 'umrah/packages/gallery/detail-2.jpg', 'order' => 1],
        ['image_path' => 'umrah/packages/gallery/detail-3.jpg', 'order' => 2],
        ['image_path' => 'umrah/packages/gallery/detail-4.jpg', 'order' => 3],
    ]);

    $response = $this->getJson('/api/umrah-packages/detail-package');

    $response->assertOk();
    $response->assertJsonFragment(['slug' => 'detail-package']);
    $response->assertJsonFragment(['name' => 'Private Car']);
    $response->assertJsonFragment(['subtitle' => 'GMC']);
    $response->assertJsonFragment(['title' => 'Masjid Nabawi']);
    $response->assertJsonFragment(['title' => 'Airport Assistance']);
    $response->assertJsonFragment(['title' => 'Visa Processing']);
    $response->assertJsonCount(4, 'data.gallery_images');

    expect($response->json('data.additional_services.0.id'))->toBe($globalAdditionalService->id);
});

test('public api detail uses package-level additional service overrides when available', function () {
    $globalAdditionalService = UmrahAdditionalService::create([
        'title' => 'Global Service',
        'description' => 'Global service description',
        'is_active' => true,
        'order' => 0,
    ]);

    $overrideAdditionalService = UmrahAdditionalService::create([
        'title' => 'Override Service',
        'description' => 'Override service description',
        'is_active' => true,
        'order' => 1,
    ]);

    $package = UmrahPackage::create([
        'title' => 'Override Package',
        'slug' => 'override-package',
        'description' => 'Description',
        'price_idr' => 2000,
        'duration' => '12 days',
        'departure' => 'Jakarta',
        'departure_schedule' => 'monthly',
        'image_path' => 'packages/override-package.jpg',
        'is_active' => true,
        'order' => 1,
    ]);

    $package->additionalServices()->attach([$overrideAdditionalService->id => ['order' => 0]]);

    $response = $this->getJson('/api/umrah-packages/override-package');

    $response->assertOk();
    $response->assertJsonFragment(['title' => 'Override Service']);
    $response->assertJsonMissing(['title' => $globalAdditionalService->title]);
});

test('public api umrah packages include nullable date field', function () {
    $packageWithDate = UmrahPackage::create([
        'title' => 'Dated Package',
        'slug' => 'dated-package',
        'description' => 'Description',
        'price_idr' => 1500,
        'duration' => '10 days',
        'departure' => 'Jakarta',
        'departure_schedule' => 'monthly',
        'date' => '15 Mar 2026',
        'image_path' => 'packages/dated.jpg',
        'is_active' => true,
        'order' => 1,
    ]);

    $packageWithoutDate = UmrahPackage::create([
        'title' => 'Undated Package',
        'slug' => 'undated-package',
        'description' => 'Description',
        'price_idr' => 1500,
        'duration' => '10 days',
        'departure' => 'Jakarta',
        'departure_schedule' => 'monthly',
        'image_path' => 'packages/undated.jpg',
        'is_active' => true,
        'order' => 2,
    ]);

    $listResponse = $this->getJson('/api/umrah-packages');
    $listResponse->assertOk();
    $list = collect($listResponse->json('data'))->keyBy('slug');
    expect($list['dated-package']['date'])->toBe('15 Mar 2026');
    expect($list['undated-package']['date'])->toBeNull();

    $detailResponse = $this->getJson('/api/umrah-packages/dated-package');
    $detailResponse->assertOk();
    expect($detailResponse->json('data.date'))->toBe('15 Mar 2026');

    $undatedDetail = $this->getJson('/api/umrah-packages/undated-package');
    expect($undatedDetail->json('data.date'))->toBeNull();
});

test('public api umrah packages include airline class meal and baggage', function () {
    $hotel = UmrahHotel::create([
        'name' => 'Hotel A',
        'stars' => 5,
        'location' => 'Madinah',
        'is_active' => true,
    ]);

    $airlineBusiness = UmrahAirline::create([
        'name' => 'Airline Business',
        'logo_path' => 'umrah/airlines/business.png',
        'is_active' => true,
    ]);

    $airlineDefault = UmrahAirline::create([
        'name' => 'Airline Default',
        'logo_path' => 'umrah/airlines/default.png',
        'is_active' => true,
    ]);

    $package = UmrahPackage::create([
        'title' => 'Airline Fields Package',
        'slug' => 'airline-fields-package',
        'description' => 'Description',
        'price_idr' => 1500,
        'duration' => '10 days',
        'departure' => 'Jakarta',
        'departure_schedule' => 'monthly',
        'image_path' => 'packages/airline-fields-package.jpg',
        'is_active' => true,
        'order' => 1,
    ]);

    $package->hotels()->attach([$hotel->id => ['order' => 0]]);
    $package->airlines()->attach([
        $airlineBusiness->id => [
            'class' => 'business',
            'meal' => '2× Premium meal',
            'baggage' => '30 Kg (2Pcs)',
        ],
        $airlineDefault->id => [
            'class' => 'economy',
            'meal' => null,
            'baggage' => null,
        ],
    ]);
    $package->images()->createMany([
        ['image_path' => 'umrah/packages/gallery/a-1.jpg', 'order' => 0],
        ['image_path' => 'umrah/packages/gallery/a-2.jpg', 'order' => 1],
        ['image_path' => 'umrah/packages/gallery/a-3.jpg', 'order' => 2],
        ['image_path' => 'umrah/packages/gallery/a-4.jpg', 'order' => 3],
    ]);

    $listResponse = $this->getJson('/api/umrah-packages');
    $listResponse->assertOk();
    $listAirlines = collect($listResponse->json('data.0.airlines'))->keyBy('id');
    expect($listAirlines[$airlineBusiness->id])->toMatchArray([
        'class' => 'business',
        'meal' => '2× Premium meal',
        'baggage' => '30 Kg (2Pcs)',
    ]);
    expect($listAirlines[$airlineDefault->id])->toMatchArray([
        'class' => 'economy',
        'meal' => null,
        'baggage' => null,
    ]);

    $detailResponse = $this->getJson('/api/umrah-packages/airline-fields-package');
    $detailResponse->assertOk();
    $detailAirlines = collect($detailResponse->json('data.airlines'))->keyBy('id');
    expect($detailAirlines[$airlineBusiness->id])->toMatchArray([
        'class' => 'business',
        'meal' => '2× Premium meal',
        'baggage' => '30 Kg (2Pcs)',
    ]);
    expect($detailAirlines[$airlineDefault->id])->toMatchArray([
        'class' => 'economy',
        'meal' => null,
        'baggage' => null,
    ]);
});

test('public api returns not found for inactive umrah package detail', function () {
    UmrahPackage::create([
        'title' => 'Inactive Detail Package',
        'slug' => 'inactive-detail-package',
        'description' => 'Description',
        'price_idr' => 1500,
        'duration' => '10 days',
        'departure' => 'Jakarta',
        'departure_schedule' => 'monthly',
        'image_path' => 'packages/inactive-detail-package.jpg',
        'is_active' => false,
        'order' => 1,
    ]);

    $response = $this->getJson('/api/umrah-packages/inactive-detail-package');

    $response->assertNotFound();
});
