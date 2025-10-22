<?php

use App\Models\ContactMessage;
use App\Models\User;

test('authenticated users can view contact messages index', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get(route('contact-messages.index'));

    $response->assertOk();
});

test('guests cannot view contact messages index', function () {
    $response = $this->get(route('contact-messages.index'));

    $response->assertRedirect(route('login'));
});

test('authenticated users can view a contact message', function () {
    $user = User::factory()->create();
    $message = ContactMessage::create([
        'name' => 'John Doe',
        'email' => 'john@example.com',
        'phone' => '1234567890',
        'subject' => 'Inquiry',
        'message' => 'I have a question.',
        'status' => 'new',
    ]);

    $response = $this->actingAs($user)->get(route('contact-messages.show', $message));

    $response->assertOk();
});

test('authenticated users can update contact message status', function () {
    $user = User::factory()->create();
    $message = ContactMessage::create([
        'name' => 'John Doe',
        'email' => 'john@example.com',
        'phone' => '1234567890',
        'subject' => 'Inquiry',
        'message' => 'I have a question.',
        'status' => 'new',
    ]);

    $response = $this->actingAs($user)->patch(route('contact-messages.update-status', $message), [
        'status' => 'read',
    ]);

    $response->assertRedirect();
    $response->assertSessionHas('success');

    $this->assertDatabaseHas('contact_messages', [
        'id' => $message->id,
        'status' => 'read',
    ]);
});

test('contact message status can be marked as replied', function () {
    $user = User::factory()->create();
    $message = ContactMessage::create([
        'name' => 'John Doe',
        'email' => 'john@example.com',
        'phone' => '1234567890',
        'subject' => 'Inquiry',
        'message' => 'I have a question.',
        'status' => 'new',
    ]);

    $response = $this->actingAs($user)->patch(route('contact-messages.update-status', $message), [
        'status' => 'replied',
    ]);

    $response->assertRedirect();

    $this->assertDatabaseHas('contact_messages', [
        'id' => $message->id,
        'status' => 'replied',
    ]);
});

test('authenticated users can delete a contact message', function () {
    $user = User::factory()->create();
    $message = ContactMessage::create([
        'name' => 'John Doe',
        'email' => 'john@example.com',
        'phone' => '1234567890',
        'subject' => 'Inquiry',
        'message' => 'I have a question.',
        'status' => 'new',
    ]);

    $response = $this->actingAs($user)->delete(route('contact-messages.destroy', $message));

    $response->assertRedirect(route('contact-messages.index'));
    $response->assertSessionHas('success');

    $this->assertDatabaseMissing('contact_messages', [
        'id' => $message->id,
    ]);
});

test('contact message status must be valid', function () {
    $user = User::factory()->create();
    $message = ContactMessage::create([
        'name' => 'John Doe',
        'email' => 'john@example.com',
        'phone' => '1234567890',
        'subject' => 'Inquiry',
        'message' => 'I have a question.',
        'status' => 'new',
    ]);

    $response = $this->actingAs($user)->patch(route('contact-messages.update-status', $message), [
        'status' => 'invalid-status',
    ]);

    $response->assertSessionHasErrors('status');
});
