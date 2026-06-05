<?php

namespace App\Http\Controllers;

use App\Models\Classe;
use App\Models\Eleve;
use App\Models\Presence;
use App\Services\ApiResponse;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;

class RapportController extends Controller
{
    public function preview(Request $request)
    {
        $data = $this->buildReport($request);

        return ApiResponse::success($data);
    }

    public function genererPDF(Request $request)
    {
        $data = $this->buildReport($request);
        $pdf = Pdf::loadView('pdf.rapport-presence', $data);

        return $pdf->download('rapport_presence.pdf');
    }

    private function buildReport(Request $request): array
    {
        $request->validate([
            'classe_id' => ['nullable', 'exists:classes,id'],
            'date_debut' => ['nullable', 'date'],
            'date_fin' => ['nullable', 'date'],
        ]);

        $classe = $request->classe_id ? Classe::find($request->classe_id) : null;
        $eleves = Eleve::with('user', 'classe')
            ->when($request->classe_id, fn ($query) => $query->where('classe_id', $request->classe_id))
            ->get()
            ->map(function (Eleve $eleve) {
                $total = max(1, Presence::where('eleve_id', $eleve->id)->count());
                $presents = Presence::where('eleve_id', $eleve->id)->where('statut', 'present')->count();

                return [
                    'id' => $eleve->id,
                    'nom' => $eleve->user->name,
                    'presents' => $presents,
                    'absences' => Presence::where('eleve_id', $eleve->id)->where('statut', 'absent')->count(),
                    'taux' => round(($presents / $total) * 100),
                ];
            });

        return [
            'ecole' => 'Plateforme Presence',
            'classe' => $classe?->nom ?? 'Toutes les classes',
            'periode' => ($request->date_debut ?? 'debut').' - '.($request->date_fin ?? 'fin'),
            'eleves' => $eleves,
        ];
    }
}
