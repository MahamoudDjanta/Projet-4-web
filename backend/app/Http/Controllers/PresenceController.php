<?php

namespace App\Http\Controllers;

use App\Http\Requests\MarquerListeRequest;
use App\Models\Presence;
use App\Services\ApiResponse;
use App\Services\PresenceService;
use Illuminate\Http\Request;

class PresenceController extends Controller
{
    public function index()
    {
        return ApiResponse::success(Presence::with('eleve.user', 'session.cours')->latest()->get());
    }

    public function clearMarked()
    {
        Presence::query()->delete();

        return ApiResponse::success(null, 'Toutes les presences marquees ont ete effacees');
    }

    public function marquer(Request $request, PresenceService $presenceService)
    {
        $data = $request->validate([
            'session_id' => ['required', 'exists:sessions_presence,id'],
            'eleve_id' => ['required', 'exists:eleves,id'],
            'statut' => ['required', 'in:present,absent,retard'],
        ]);

        $presenceService->marquerListe($data['session_id'], [$data]);

        return ApiResponse::success(null, 'Presence marquee');
    }

    public function marquerListe(MarquerListeRequest $request, PresenceService $presenceService)
    {
        $presenceService->marquerListe($request->session_id, $request->presences);

        return ApiResponse::success(null, 'Liste marquee');
    }

    public function scanQR(Request $request, PresenceService $presenceService)
    {
        $data = $request->validate([
            'qr_token' => ['required', 'string'],
            'eleve_id' => ['required', 'exists:eleves,id'],
        ]);

        return ApiResponse::success($presenceService->scanQr($data['qr_token'], $data['eleve_id']), 'Presence enregistree');
    }
}
