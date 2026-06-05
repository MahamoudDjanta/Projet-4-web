<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        foreach ([
            ['name' => 'Admin Test', 'email' => 'admin@test.com', 'role' => 'admin'],
            ['name' => 'Prof Dupont', 'email' => 'prof@test.com', 'role' => 'professeur'],
            ['name' => 'Parent Martin', 'email' => 'parent@test.com', 'role' => 'parent'],
            ['name' => 'Eleve Kouassi', 'email' => 'eleve@test.com', 'role' => 'eleve'],
        ] as $user) {
            User::updateOrCreate(
                ['email' => $user['email']],
                [...$user, 'password' => Hash::make('password')]
            );
        }
    }
}
