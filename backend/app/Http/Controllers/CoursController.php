<?php

namespace App\Http\Controllers;

use App\Models\Cours;
use App\Models\User;
use App\Services\ApiResponse;
use Illuminate\Http\Request;

class CoursController extends Controller
{
    public function index(Request $request)
    {
        $query = Cours::with('classe', 'professeur');
        if ($request->filled('classe_id')) {
            $query->where('classe_id', $request->classe_id);
        }

        return ApiResponse::success($query->latest()->get()->map(fn ($cours) => $this->format($cours)));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'nom' => ['required'],
            'classe_id' => ['required', 'exists:classes,id'],
            'professeur_id' => ['nullable', 'exists:users,id'],
            'jour' => ['nullable', 'in:lundi,mardi,mercredi,jeudi,vendredi,samedi'],
            'heure_debut' => ['nullable', 'date_format:H:i'],
            'heure_fin' => ['nullable', 'date_format:H:i'],
        ]);

        $data['professeur_id'] ??= User::where('role', 'professeur')->value('id') ?: $request->user()->id;
        $data['jour'] ??= 'lundi';
        $data['heure_debut'] ??= '08:00';
        $data['heure_fin'] ??= '10:00';

        return ApiResponse::success($this->format(Cours::create($data)->load('classe', 'professeur')), 'Cours cree', 201);
    }

    public function show(Cours $cour)
    {
        return ApiResponse::success($this->format($cour->load('classe', 'professeur')));
    }

    public function update(Request $request, Cours $cour)
    {
        $cour->update($request->only('nom', 'classe_id', 'professeur_id', 'jour', 'heure_debut', 'heure_fin'));

        return ApiResponse::success($this->format($cour->load('classe', 'professeur')), 'Cours mis a jour');
    }

    public function destroy(Cours $cour)
    {
        $cour->delete();

        return ApiResponse::success(null, 'Cours supprime');
    }

    public function programme(int $classeId)
    {
        return ApiResponse::success(Cours::with('classe')->where('classe_id', $classeId)->orderBy('jour')->orderBy('heure_debut')->get()->map(fn ($cours) => [
            'id' => $cours->id,
            'jour' => $cours->jour,
            'heure_debut' => substr((string) $cours->heure_debut, 0, 5),
            'heure_fin' => substr((string) $cours->heure_fin, 0, 5),
            'cours' => $cours->nom,
            'salle' => 'Salle '.$cours->id,
        ]));
    }

    private function format(Cours $cours): array
    {
        return [
            'id' => $cours->id,
            'nom' => $cours->nom,
            'classe_id' => $cours->classe_id,
            'classe' => $cours->classe?->nom,
            'professeur_id' => $cours->professeur_id,
            'professeur' => $cours->professeur?->name,
            'jour' => $cours->jour,
            'heure_debut' => substr((string) $cours->heure_debut, 0, 5),
            'heure_fin' => substr((string) $cours->heure_fin, 0, 5),
        ];
    }
}
