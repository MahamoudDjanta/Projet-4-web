<?php

namespace App\Http\Controllers;

use App\Models\RequetePresence;
use App\Services\ApiResponse;
use Illuminate\Http\Request;

class RequetePresenceController extends Controller
{
    public function index()
    {
        return ApiResponse::success(RequetePresence::with('eleve.user', 'demandeur')->latest()->get()->map(fn ($requete) => [
            'id' => $requete->id,
            'eleve' => $requete->eleve?->user?->name,
            'date' => $requete->created_at?->toDateString(),
            'motif' => $requete->motif,
            'statut' => $requete->statut,
            'commentaire_admin' => $requete->commentaire_admin,
        ]));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'eleve_id' => ['required', 'exists:eleves,id'],
            'session_id' => ['nullable', 'exists:sessions_presence,id'],
            'motif' => ['required', 'string'],
        ]);

        $data['demandeur_id'] = $request->user()->id;

        return ApiResponse::success(RequetePresence::create($data), 'Requete creee', 201);
    }

    public function traiter(Request $request, int $id)
    {
        $data = $request->validate([
            'statut' => ['required', 'in:approuvee,rejetee,approved,rejected'],
            'commentaire_admin' => ['nullable', 'string'],
        ]);

        $requete = RequetePresence::findOrFail($id);
        $requete->update([
            'statut' => match ($data['statut']) {
                'approved' => 'approuvee',
                'rejected' => 'rejetee',
                default => $data['statut'],
            },
            'commentaire_admin' => $data['commentaire_admin'] ?? null,
        ]);

        return ApiResponse::success($requete, 'Requete traitee');
    }
}
