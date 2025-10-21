<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create a Super Admin user
        User::firstOrCreate(
            ['email' => 'superadmin@email.com'],
            [
                'name' => 'Super Admin',
                'password' => 'password',
                'role' => User::ROLE_SUPER_ADMIN,
            ]
        );

        // Create an Admin user
        User::firstOrCreate(
            ['email' => 'admin@email.com'],
            [
                'name' => 'Admin User',
                'password' => 'password',
                'role' => User::ROLE_ADMIN,
            ]
        );

        // Create an Editor user
        User::firstOrCreate(
            ['email' => 'editor@email.com'],
            [
                'name' => 'Editor User',
                'password' => 'password',
                'role' => User::ROLE_EDITOR,
            ]
        );
    }
}
