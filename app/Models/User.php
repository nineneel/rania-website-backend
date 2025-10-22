<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * Role constants
     */
    public const ROLE_SUPER_ADMIN = 'super-admin';
    public const ROLE_ADMIN = 'admin';
    public const ROLE_EDITOR = 'editor';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'password' => 'hashed',
        ];
    }

    /**
     * Check if user is super admin
     */
    public function isSuperAdmin(): bool
    {
        return $this->role === self::ROLE_SUPER_ADMIN;
    }

    /**
     * Check if user is admin or higher
     */
    public function isAdmin(): bool
    {
        return in_array($this->role, [self::ROLE_SUPER_ADMIN, self::ROLE_ADMIN]);
    }

    /**
     * Check if user is editor
     */
    public function isEditor(): bool
    {
        return $this->role === self::ROLE_EDITOR;
    }

    /**
     * Check if user can manage users
     */
    public function canManageUsers(): bool
    {
        return $this->isAdmin() || $this->isSuperAdmin();
    }

    /**
     * Check if user can manage home content
     */
    public function canManageHomeContent(): bool
    {
        return $this->isAdmin() || $this->isSuperAdmin();
    }

    /**
     * Get roles that this user can assign to others
     */
    public function getAssignableRoles(): array
    {
        if ($this->isSuperAdmin()) {
            return [self::ROLE_SUPER_ADMIN, self::ROLE_ADMIN, self::ROLE_EDITOR];
        }

        if ($this->role === self::ROLE_ADMIN) {
            return [self::ROLE_EDITOR];
        }

        return [];
    }

    /**
     * Check if user can assign a specific role
     */
    public function canAssignRole(string $role): bool
    {
        return in_array($role, $this->getAssignableRoles());
    }
}
