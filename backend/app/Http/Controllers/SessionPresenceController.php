<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSessionRequest;
use App\Models\Cours;
use App\Models\SessionPresence;
use App\Services\ApiResponse;
use App\Services\PresenceService;
use App\Services\QRCodeService;

class SessionPresenceController extends Controller
{
    public function index()
    {
        return ApiResponse::success(SessionPresence::with('cours.classe')->latest()->get());
    }

    public function store(StoreSessionRequest $request, PresenceService $presenceService, QRCodeService $qrCodeService)
    {
        $session = $presenceService->ouvrirSession(Cours::with('classe.eleves')->findOrFail($request->cours_id), $request->date, $qrCodeService);

        return ApiResponse::success($session, 'Session ouverte', 201);
    }

    public function show(int $id)
    {
        return ApiResponse::success(SessionPresence::with('cours.classe', 'presences.eleve.user')->findOrFail($id));
    }

    public function cloturer(int $id, PresenceService $presenceService)
    {
        $presenceService->cloturer(SessionPresence::findOrFail($id));

        return ApiResponse::success(null, 'Session cloturee');
    }

    public function getQRToken(int $id)
    {
        $session = SessionPresence::with('cours.classe')->findOrFail($id);

        return ApiResponse::success([
            'qr_token' => $session->qr_token,
            'expires_at' => null,
            'cours' => $session->cours?->nom,
            'classe' => $session->cours?->classe?->nom,
        ]);
    }
}
