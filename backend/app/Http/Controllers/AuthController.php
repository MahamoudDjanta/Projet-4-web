<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Models\User;
use App\Services\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(LoginRequest $request)
    {
        $user = User::with('eleve.classe', 'enfants.user', 'enfants.classe')->where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            return ApiResponse::error('Identifiants invalides', 401);
        }

        return ApiResponse::success([
            'token' => $user->createToken('frontend')->plainTextToken,
            'user' => $this->serializeUser($user),
        ]);
    }

    public function register(RegisterRequest $request)
    {
        $data = $request->validated();
        $data['name'] = trim(sprintf('%s %s', $data['prenom'], $data['nom']));
        unset($data['prenom'], $data['nom'], $data['password_confirmation']);

        $user = User::create($data);

        return ApiResponse::success([
            'token' => $user->createToken('frontend')->plainTextToken,
            'user' => $this->serializeUser($user),
        ], 'Inscription reussie', 201);
    }

    public function me(Request $request)
    {
        return ApiResponse::success($this->serializeUser($request->user()->load('eleve.classe', 'enfants.user', 'enfants.classe')));
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()?->delete();

        return ApiResponse::success(null, 'Deconnexion reussie');
    }

    private function serializeUser(User $user): array
    {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
            'eleve_id' => $user->eleve?->id,
            'classe_id' => $user->eleve?->classe_id,
            'classe' => $user->eleve?->classe?->nom,
            'enfants' => $user->enfants->map(fn ($eleve) => [
                'id' => $eleve->id,
                'nom' => $eleve->user?->name,
                'classe_id' => $eleve->classe_id,
                'classe' => $eleve->classe?->nom,
            ])->values(),
        ];
    }
}
