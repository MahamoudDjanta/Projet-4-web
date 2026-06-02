<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Presence;
use App\Models\SessionPresence;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PresenceController extends Controller
{
    public function dashboard()
    {
        // Logique pour les statistiques du dashboard
        return response()->json([
            'stats' => [
                'presents' => Presence::where('statut', 'present')->count(),
                'absences' => Presence::where('statut', 'absent')->count(),
                'taux_presence' => 95,
            ]
        ]);
    }

    public function store(Request $request)
    {
        $request->validate(['cours_id' => 'required|exists:cours,id']);

        $session = SessionPresence::create([
            'cours_id' => $request->cours_id,
            'date' => now()->toDateString(),
            'qr_token' => Str::random(32),
            'statut' => 'ouvert'
        ]);

        return response()->json($session, 201);
    }

    public function scanQr(Request $request)
    {
        $request->validate(['token' => 'required']);

        $session = SessionPresence::where('qr_token', $request->token)
            ->where('statut', 'ouvert')
            ->firstOrFail();

        // Récupérer l'élève lié à l'utilisateur connecté
        $eleve = auth()->user()->eleve;

        if (!$eleve) {
            return response()->json(['message' => 'Utilisateur n\'est pas un élève'], 403);
        }

        $presence = Presence::updateOrCreate(
            ['session_id' => $session->id, 'eleve_id' => $eleve->id],
            ['statut' => 'present', 'methode' => 'qr', 'heure_marquage' => now()]
        );

        return response()->json(['message' => 'Présence validée', 'presence' => $presence]);
    }

    public function close($id)
    {
        $session = SessionPresence::findOrFail($id);
        $session->update(['statut' => 'ferme']);
        return response()->json(['message' => 'Session fermée']);
    }
}
