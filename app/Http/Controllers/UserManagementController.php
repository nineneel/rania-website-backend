<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class UserManagementController extends Controller
{
    /**
     * Display a listing of users.
     */
    public function index()
    {
        // Check if user can manage users
        if (!auth()->user()->canManageUsers()) {
            return Inertia::render('errors/403', [
                'message' => 'You do not have permission to manage users.',
            ])->toResponse(request())->setStatusCode(403);
        }

        $users = User::select('id', 'name', 'email', 'role', 'created_at')
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return Inertia::render('users/index', [
            'users' => $users,
            'assignableRoles' => auth()->user()->getAssignableRoles(),
        ]);
    }

    /**
     * Show the form for creating a new user.
     */
    public function create()
    {
        if (!auth()->user()->canManageUsers()) {
            return Inertia::render('errors/403', [
                'message' => 'You do not have permission to manage users.',
            ])->toResponse(request())->setStatusCode(403);
        }

        return Inertia::render('users/create', [
            'assignableRoles' => auth()->user()->getAssignableRoles(),
        ]);
    }

    /**
     * Store a newly created user in storage.
     */
    public function store(Request $request)
    {
        if (!auth()->user()->canManageUsers()) {
            return Inertia::render('errors/403', [
                'message' => 'You do not have permission to manage users.',
            ])->toResponse(request())->setStatusCode(403);
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'role' => ['required', Rule::in(auth()->user()->getAssignableRoles())],
        ]);

        // Check if user can assign this role
        if (!auth()->user()->canAssignRole($validated['role'])) {
            return Inertia::render('errors/403', [
                'message' => 'You do not have permission to assign this role.',
            ])->toResponse(request())->setStatusCode(403);
        }

        User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
        ]);

        return redirect()->route('users.index')->with('success', 'User created successfully.');
    }

    /**
     * Show the form for editing the specified user.
     */
    public function edit(User $user)
    {
        if (!auth()->user()->canManageUsers()) {
            return Inertia::render('errors/403', [
                'message' => 'You do not have permission to manage users.',
            ])->toResponse(request())->setStatusCode(403);
        }

        // Super admins can edit anyone
        // Admins cannot edit super admins or other admins
        if (auth()->user()->role === User::ROLE_ADMIN &&
            in_array($user->role, [User::ROLE_SUPER_ADMIN, User::ROLE_ADMIN])) {
            return Inertia::render('errors/403', [
                'message' => 'You cannot edit users with admin or super admin roles.',
            ])->toResponse(request())->setStatusCode(403);
        }

        return Inertia::render('users/edit', [
            'user' => $user->only(['id', 'name', 'email', 'role']),
            'assignableRoles' => auth()->user()->getAssignableRoles(),
        ]);
    }

    /**
     * Update the specified user in storage.
     */
    public function update(Request $request, User $user)
    {
        if (!auth()->user()->canManageUsers()) {
            return Inertia::render('errors/403', [
                'message' => 'You do not have permission to manage users.',
            ])->toResponse(request())->setStatusCode(403);
        }

        // Prevent editing users with higher or equal privileges
        if (auth()->user()->role === User::ROLE_ADMIN &&
            in_array($user->role, [User::ROLE_SUPER_ADMIN, User::ROLE_ADMIN])) {
            return Inertia::render('errors/403', [
                'message' => 'You cannot edit users with admin or super admin roles.',
            ])->toResponse(request())->setStatusCode(403);
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'role' => ['required', Rule::in(auth()->user()->getAssignableRoles())],
            'password' => ['nullable', 'string', 'min:8', 'confirmed'],
        ]);

        // Check if user can assign this role
        if (!auth()->user()->canAssignRole($validated['role'])) {
            return Inertia::render('errors/403', [
                'message' => 'You do not have permission to assign this role.',
            ])->toResponse(request())->setStatusCode(403);
        }

        $user->name = $validated['name'];
        $user->email = $validated['email'];
        $user->role = $validated['role'];

        if (!empty($validated['password'])) {
            $user->password = Hash::make($validated['password']);
        }

        $user->save();

        return redirect()->route('users.index')->with('success', 'User updated successfully.');
    }

    /**
     * Remove the specified user from storage.
     */
    public function destroy(User $user)
    {
        if (!auth()->user()->canManageUsers()) {
            return Inertia::render('errors/403', [
                'message' => 'You do not have permission to manage users.',
            ])->toResponse(request())->setStatusCode(403);
        }

        // Prevent deleting yourself
        if ($user->id === auth()->id()) {
            return Inertia::render('errors/403', [
                'message' => 'You cannot delete your own account.',
            ])->toResponse(request())->setStatusCode(403);
        }

        // Prevent admins from deleting super admins or other admins
        if (auth()->user()->role === User::ROLE_ADMIN &&
            in_array($user->role, [User::ROLE_SUPER_ADMIN, User::ROLE_ADMIN])) {
            return Inertia::render('errors/403', [
                'message' => 'You cannot delete users with admin or super admin roles.',
            ])->toResponse(request())->setStatusCode(403);
        }

        $user->delete();

        return redirect()->route('users.index')->with('success', 'User deleted successfully.');
    }
}
