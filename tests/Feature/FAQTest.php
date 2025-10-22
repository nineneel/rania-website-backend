<?php

use App\Models\FAQ;
use App\Models\User;

test('admin users can view faqs index', function () {
    $user = User::factory()->admin()->create();

    $response = $this->actingAs($user)->get(route('faqs.index'));

    $response->assertOk();
});

test('guests cannot view faqs index', function () {
    $response = $this->get(route('faqs.index'));

    $response->assertRedirect(route('login'));
});

test('admin users can view create faq page', function () {
    $user = User::factory()->admin()->create();

    $response = $this->actingAs($user)->get(route('faqs.create'));

    $response->assertOk();
});

test('admin users can create a faq', function () {
    $user = User::factory()->admin()->create();

    $response = $this->actingAs($user)->post(route('faqs.store'), [
        'question' => 'What is your refund policy?',
        'answer' => 'We offer full refunds within 30 days.',
        'is_active' => true,
    ]);

    $response->assertRedirect(route('faqs.index'));
    $response->assertSessionHas('success');

    $this->assertDatabaseHas('faqs', [
        'question' => 'What is your refund policy?',
        'answer' => 'We offer full refunds within 30 days.',
        'is_active' => true,
    ]);
});

test('faq creation requires question', function () {
    $user = User::factory()->admin()->create();

    $response = $this->actingAs($user)->post(route('faqs.store'), [
        'answer' => 'We offer full refunds within 30 days.',
    ]);

    $response->assertSessionHasErrors('question');
});

test('faq creation requires answer', function () {
    $user = User::factory()->admin()->create();

    $response = $this->actingAs($user)->post(route('faqs.store'), [
        'question' => 'What is your refund policy?',
    ]);

    $response->assertSessionHasErrors('answer');
});

test('admin users can view edit faq page', function () {
    $user = User::factory()->admin()->create();
    $faq = FAQ::create([
        'question' => 'Question?',
        'answer' => 'Answer.',
        'is_active' => true,
        'order' => 1,
    ]);

    $response = $this->actingAs($user)->get(route('faqs.edit', $faq));

    $response->assertOk();
});

test('admin users can update a faq', function () {
    $user = User::factory()->admin()->create();
    $faq = FAQ::create([
        'question' => 'Old Question?',
        'answer' => 'Old Answer.',
        'is_active' => true,
        'order' => 1,
    ]);

    $response = $this->actingAs($user)->put(route('faqs.update', $faq), [
        'question' => 'Updated Question?',
        'answer' => 'Updated Answer.',
        'is_active' => false,
    ]);

    $response->assertRedirect(route('faqs.index'));
    $response->assertSessionHas('success');

    $this->assertDatabaseHas('faqs', [
        'id' => $faq->id,
        'question' => 'Updated Question?',
        'answer' => 'Updated Answer.',
        'is_active' => false,
    ]);
});

test('admin users can delete a faq', function () {
    $user = User::factory()->admin()->create();
    $faq = FAQ::create([
        'question' => 'Question?',
        'answer' => 'Answer.',
        'is_active' => true,
        'order' => 1,
    ]);

    $response = $this->actingAs($user)->delete(route('faqs.destroy', $faq));

    $response->assertRedirect(route('faqs.index'));
    $response->assertSessionHas('success');

    $this->assertDatabaseMissing('faqs', [
        'id' => $faq->id,
    ]);
});

test('admin users can reorder faqs', function () {
    $user = User::factory()->admin()->create();
    $faq1 = FAQ::create([
        'question' => 'First Question?',
        'answer' => 'First Answer.',
        'is_active' => true,
        'order' => 1,
    ]);
    $faq2 = FAQ::create([
        'question' => 'Second Question?',
        'answer' => 'Second Answer.',
        'is_active' => true,
        'order' => 2,
    ]);

    $response = $this->actingAs($user)->postJson(route('faqs.reorder'), [
        'items' => [
            ['id' => $faq2->id, 'order' => 1],
            ['id' => $faq1->id, 'order' => 2],
        ],
    ]);

    $response->assertOk();

    $this->assertDatabaseHas('faqs', [
        'id' => $faq1->id,
        'order' => 2,
    ]);
    $this->assertDatabaseHas('faqs', [
        'id' => $faq2->id,
        'order' => 1,
    ]);
});
