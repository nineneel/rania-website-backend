<?php

use App\Models\FAQ;
use App\Models\SocialMedia;
use App\Models\Testimonial;
use App\Models\HeroSlide;
use App\Models\Event;
use App\Models\UmrahPackage;

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
            'description' => "Description $i",
            'price' => 1000 * $i,
            'currency' => 'USD',
            'duration' => "$i days",
            'departure' => '2025-12-01',
            'frequency' => 'monthly',
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
        'description' => 'Description',
        'price' => 1000,
        'currency' => 'USD',
        'duration' => '10 days',
        'departure' => '2025-12-01',
        'frequency' => 'monthly',
        'image_path' => 'packages/active.jpg',
        'is_active' => true,
        'order' => 1,
    ]);
    UmrahPackage::create([
        'title' => 'Inactive Package',
        'description' => 'Description',
        'price' => 2000,
        'currency' => 'USD',
        'duration' => '15 days',
        'departure' => '2025-12-15',
        'frequency' => 'weekly',
        'image_path' => 'packages/inactive.jpg',
        'is_active' => false,
        'order' => 2,
    ]);

    $response = $this->getJson('/api/umrah-packages');

    $response->assertOk();
    $response->assertJsonFragment(['title' => 'Active Package']);
    $response->assertJsonMissing(['title' => 'Inactive Package']);
});
