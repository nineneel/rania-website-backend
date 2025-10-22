<?php

use App\Models\User;

test('admin users can view users index', function () {
    $user = User::factory()->admin()->create();

    $response = $this->actingAs($user)->get(route('users.index'));

    $response->assertOk();
});

test('guests cannot view users index', function () {
    $response = $this->get(route('users.index'));

    $response->assertRedirect(route('login'));
});

test('editors cannot view users index', function () {
    $user = User::factory()->editor()->create();

    $response = $this->actingAs($user)->get(route('users.index'));

    $response->assertStatus(403);
});

test('admin users can view create user page', function () {
    $user = User::factory()->admin()->create();

    $response = $this->actingAs($user)->get(route('users.create'));

    $response->assertOk();
});

test('admin users can create a new user', function () {
    $user = User::factory()->superAdmin()->create();

    $response = $this->actingAs($user)->post(route('users.store'), [
        'name' => 'New User',
        'email' => 'newuser@example.com',
        'password' => 'password123',
        'password_confirmation' => 'password123',
        'role' => 'editor',
    ]);

    $response->assertRedirect(route('users.index'));
    $response->assertSessionHas('success');

    $this->assertDatabaseHas('users', [
        'name' => 'New User',
        'email' => 'newuser@example.com',
        'role' => 'editor',
    ]);
});

test('user creation requires name', function () {
    $user = User::factory()->admin()->create();

    $response = $this->actingAs($user)->post(route('users.store'), [
        'email' => 'newuser@example.com',
        'password' => 'password123',
        'password_confirmation' => 'password123',
        'role' => 'editor',
    ]);

    $response->assertSessionHasErrors('name');
});

test('user creation requires email', function () {
    $user = User::factory()->admin()->create();

    $response = $this->actingAs($user)->post(route('users.store'), [
        'name' => 'New User',
        'password' => 'password123',
        'password_confirmation' => 'password123',
        'role' => 'editor',
    ]);

    $response->assertSessionHasErrors('email');
});

test('user creation requires valid email', function () {
    $user = User::factory()->admin()->create();

    $response = $this->actingAs($user)->post(route('users.store'), [
        'name' => 'New User',
        'email' => 'not-an-email',
        'password' => 'password123',
        'password_confirmation' => 'password123',
        'role' => 'editor',
    ]);

    $response->assertSessionHasErrors('email');
});

test('user creation requires unique email', function () {
    $existingUser = User::factory()->create(['email' => 'existing@example.com']);
    $user = User::factory()->admin()->create();

    $response = $this->actingAs($user)->post(route('users.store'), [
        'name' => 'New User',
        'email' => 'existing@example.com',
        'password' => 'password123',
        'password_confirmation' => 'password123',
        'role' => 'editor',
    ]);

    $response->assertSessionHasErrors('email');
});

test('user creation requires password', function () {
    $user = User::factory()->admin()->create();

    $response = $this->actingAs($user)->post(route('users.store'), [
        'name' => 'New User',
        'email' => 'newuser@example.com',
        'role' => 'editor',
    ]);

    $response->assertSessionHasErrors('password');
});

test('user creation password must be confirmed', function () {
    $user = User::factory()->admin()->create();

    $response = $this->actingAs($user)->post(route('users.store'), [
        'name' => 'New User',
        'email' => 'newuser@example.com',
        'password' => 'password123',
        'password_confirmation' => 'different-password',
        'role' => 'editor',
    ]);

    $response->assertSessionHasErrors('password');
});

test('user creation requires role', function () {
    $user = User::factory()->admin()->create();

    $response = $this->actingAs($user)->post(route('users.store'), [
        'name' => 'New User',
        'email' => 'newuser@example.com',
        'password' => 'password123',
        'password_confirmation' => 'password123',
    ]);

    $response->assertSessionHasErrors('role');
});

test('admin users can view edit user page', function () {
    $authUser = User::factory()->admin()->create();
    $targetUser = User::factory()->create();

    $response = $this->actingAs($authUser)->get(route('users.edit', $targetUser));

    $response->assertOk();
});

test('admin users can update a user', function () {
    $authUser = User::factory()->superAdmin()->create();
    $targetUser = User::factory()->create(['role' => 'editor']);

    $response = $this->actingAs($authUser)->put(route('users.update', $targetUser), [
        'name' => 'Updated Name',
        'email' => $targetUser->email,
        'role' => 'admin',
    ]);

    $response->assertRedirect(route('users.index'));
    $response->assertSessionHas('success');

    $this->assertDatabaseHas('users', [
        'id' => $targetUser->id,
        'name' => 'Updated Name',
        'role' => 'admin',
    ]);
});

test('user update can change password', function () {
    $authUser = User::factory()->superAdmin()->create();
    $targetUser = User::factory()->create();

    $response = $this->actingAs($authUser)->put(route('users.update', $targetUser), [
        'name' => $targetUser->name,
        'email' => $targetUser->email,
        'role' => $targetUser->role,
        'password' => 'newpassword123',
        'password_confirmation' => 'newpassword123',
    ]);

    $response->assertRedirect(route('users.index'));

    $targetUser->refresh();
    expect(password_verify('newpassword123', $targetUser->password))->toBeTrue();
});

test('admin users can delete a user', function () {
    $authUser = User::factory()->superAdmin()->create();
    $targetUser = User::factory()->create();

    $response = $this->actingAs($authUser)->delete(route('users.destroy', $targetUser));

    $response->assertRedirect(route('users.index'));
    $response->assertSessionHas('success');

    $this->assertDatabaseMissing('users', [
        'id' => $targetUser->id,
    ]);
});
