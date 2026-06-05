<?php

namespace App\Http\Controllers;

use App\Models\NotificationPresence;
use App\Services\ApiResponse;

class NotificationController extends Controller
{
    public function index()
    {
        return ApiResponse::success(NotificationPresence::with('eleve.user', 'session.cours')->latest()->get()->map(fn ($notification) => [
            'id' => $notification->id,
            'eleve' => $notification->eleve?->user?->name,
            'cours' => $notification->session?->cours?->nom,
            'date' => $notification->created_at?->toDateString(),
            'type' => $notification->type,
            'statut' => $notification->statut,
        ]));
    }
}
