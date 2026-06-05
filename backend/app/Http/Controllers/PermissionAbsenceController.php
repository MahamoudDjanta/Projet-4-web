<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePermissionRequest;
use App\Models\PermissionAbsence;
use App\Services\ApiResponse;
use Illuminate\Http\Request;

class PermissionAbsenceController extends Controller
{
    public function index()
    {
        return ApiResponse::success(PermissionAbsence::with('eleve.user', 'demandeur')->latest()->get()->map(fn ($permission) => [
            'id' => $permission->id,
            'eleve' => $permission->eleve?->user?->name,
            'eleve_id' => $permission->eleve_id,
            'date_debut' => $permission->date_debut?->toDateString(),
            'date_fin' => $permission->date_fin?->toDateString(),
            'motif' => $permission->motif,
            'piece_jointe' => $permission->piece_jointe,
            'statut' => $permission->statut,
        ]));
    }

    public function store(StorePermissionRequest $request)
    {
        $path = $request->file('piece_jointe')?->store('permissions', 'public');

        $permission = PermissionAbsence::create([
            ...$request->safe()->except('piece_jointe'),
            'demandeur_id' => $request->user()->id,
            'piece_jointe' => $path,
        ]);

        return ApiResponse::success($permission, 'Permission soumise', 201);
    }

    public function updateStatut(Request $request, int $id)
    {
        $data = $request->validate(['statut' => ['required', 'in:soumis,examine,accorde,refuse']]);
        $permission = PermissionAbsence::findOrFail($id);
        $permission->update($data);

        return ApiResponse::success($permission, 'Statut mis a jour');
    }
}
