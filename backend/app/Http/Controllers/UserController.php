<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $query = User::query();

        if ($request->filled('role')) {
            $query->where('role', $request->role);
        }

        $users = $query->latest()->get()->map(fn (User $user) => [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
        ]);

        return ApiResponse::success($users);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string'],
            'email' => ['required', 'email', 'unique:users,email'],
            'role' => ['required', 'in:professeur,parent'],
            'password' => ['nullable', 'string', 'min:8'],
        ]);

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'role' => $data['role'],
            'password' => Hash::make($data['password'] ?? 'password'),
        ]);

        return ApiResponse::success([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
        ], 'Utilisateur cree', 201);
    }

    public function destroy(User $user)
    {
        if (in_array($user->role, ['admin', 'eleve'], true)) {
            return ApiResponse::error('Suppression non autorisee pour ce role', 403);
        }

        $user->delete();

        return ApiResponse::success(null, 'Utilisateur supprime');
    }
}
