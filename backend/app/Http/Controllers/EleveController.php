<?php

namespace App\Http\Controllers;

use App\Models\Eleve;
use App\Models\User;
use App\Services\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class EleveController extends Controller
{
    public function index(Request $request)
    {
        $query = Eleve::with('user', 'classe');
        if ($request->filled('classe_id')) {
            $query->where('classe_id', $request->classe_id);
        }

        return ApiResponse::success($query->latest()->get()->map(fn ($eleve) => $this->format($eleve)));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'nom' => ['required', 'string'],
            'email' => ['nullable', 'email', 'unique:users,email'],
            'classe_id' => ['required', 'exists:classes,id'],
            'matricule' => ['nullable', 'unique:eleves,matricule'],
        ]);

        $user = User::create([
            'name' => $data['nom'],
            'email' => $data['email'] ?: 'eleve'.time().'@presence.local',
            'password' => Hash::make('password'),
            'role' => 'eleve',
        ]);

        $eleve = Eleve::create([
            'user_id' => $user->id,
            'classe_id' => $data['classe_id'],
            'matricule' => $data['matricule'] ?? 'ELV-'.str_pad((string) $user->id, 4, '0', STR_PAD_LEFT),
        ]);

        return ApiResponse::success($this->format($eleve->load('user', 'classe')), 'Eleve cree', 201);
    }

    public function show(Eleve $eleve)
    {
        return ApiResponse::success($this->format($eleve->load('user', 'classe', 'parents')));
    }

    public function update(Request $request, Eleve $eleve)
    {
        $eleve->update($request->only('classe_id', 'matricule'));
        $eleve->user->update(['name' => $request->input('nom', $eleve->user->name)]);

        return ApiResponse::success($this->format($eleve->load('user', 'classe')), 'Eleve mis a jour');
    }

    public function destroy(Eleve $eleve)
    {
        $eleve->user()->delete();

        return ApiResponse::success(null, 'Eleve supprime');
    }

    private function format(Eleve $eleve): array
    {
        return [
            'id' => $eleve->id,
            'nom' => $eleve->user?->name,
            'email' => $eleve->user?->email,
            'classe_id' => $eleve->classe_id,
            'classe' => $eleve->classe?->nom,
            'matricule' => $eleve->matricule,
        ];
    }
}
