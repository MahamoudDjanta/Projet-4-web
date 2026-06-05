<?php

namespace App\Services;

use App\Models\Cours;
use App\Models\Eleve;
use App\Models\NotificationPresence;
use App\Models\PermissionAbsence;
use App\Models\Presence;
use App\Models\RequetePresence;
use App\Models\SessionPresence;
use Carbon\Carbon;

class PresenceService
{
    public function dashboardStats(): array
    {
        $today = today();
        $sessions = SessionPresence::query()->whereDate('date', $today)->pluck('id');
        $presents = Presence::whereIn('session_id', $sessions)->where('statut', 'present')->count();
        $absences = Presence::whereIn('session_id', $sessions)->where('statut', 'absent')->count();
        $total = max(1, $presents + $absences);

        return [
            'stats' => [
                'presents' => $presents,
                'absences' => $absences,
                'cours_en_cours' => SessionPresence::whereDate('date', $today)->where('statut', 'ouverte')->count(),
                'taux_presence' => round(($presents / $total) * 100, 2),
            ],
            'presents_aujourd_hui' => $presents,
            'absences_aujourd_hui' => $absences,
            'cours_en_cours' => SessionPresence::whereDate('date', $today)->where('statut', 'ouverte')->count(),
            'taux_presence' => round(($presents / $total) * 100, 2),
            'eleves_a_risque' => $this->elevesARisque(),
            'alertes' => $this->elevesARisque(),
            'presences_semaine' => $this->presencesSemaine(),
            'weekly' => $this->presencesSemaine(),
            'cours_du_jour' => Cours::with('classe')->latest()->limit(8)->get()->map(fn ($cours) => [
                'id' => $cours->id,
                'classe' => $cours->classe?->nom,
                'cours' => $cours->nom,
                'heure' => substr((string) $cours->heure_debut, 0, 5),
                'statut' => 'ouvert',
            ]),
            'dernieres_donnees' => [
                'cours' => Cours::with('classe', 'professeur')->latest()->limit(5)->get()->map(fn ($cours) => [
                    'id' => $cours->id,
                    'type' => 'Cours',
                    'titre' => $cours->nom,
                    'detail' => trim(($cours->classe?->nom ?: 'Classe inconnue').' - '.substr((string) $cours->heure_debut, 0, 5)),
                    'date' => $cours->created_at?->format('Y-m-d H:i'),
                ]),
                'requetes' => RequetePresence::with('eleve.user')->latest()->limit(5)->get()->map(fn ($requete) => [
                    'id' => $requete->id,
                    'type' => 'Requete',
                    'titre' => $requete->eleve?->user?->name ?: 'Eleve inconnu',
                    'detail' => $requete->motif,
                    'date' => $requete->created_at?->format('Y-m-d H:i'),
                ]),
                'permissions' => PermissionAbsence::with('eleve.user')->latest()->limit(5)->get()->map(fn ($permission) => [
                    'id' => $permission->id,
                    'type' => 'Permission',
                    'titre' => $permission->eleve?->user?->name ?: 'Eleve inconnu',
                    'detail' => $permission->motif,
                    'date' => $permission->created_at?->format('Y-m-d H:i'),
                ]),
            ],
            'parent' => [
                'status' => $presents > 0 ? 'Present' : 'Aucune presence marquee',
                'absences' => Presence::with('session.cours')
                    ->where('statut', 'absent')
                    ->latest()
                    ->limit(5)
                    ->get()
                    ->map(fn ($presence) => [
                        'id' => $presence->id,
                        'date' => $presence->session?->date?->toDateString(),
                        'cours' => $presence->session?->cours?->nom,
                        'motif' => 'Absence non justifiee',
                    ]),
            ],
        ];
    }

    public function ouvrirSession(Cours $cours, ?string $date, QRCodeService $qrCodeService): SessionPresence
    {
        $session = SessionPresence::create([
            'cours_id' => $cours->id,
            'date' => $date ?: today()->toDateString(),
            'qr_token' => $qrCodeService->token(),
            'statut' => 'ouverte',
            'ouverte_le' => now(),
        ]);

        $cours->classe->eleves()->each(function (Eleve $eleve) use ($session) {
            Presence::firstOrCreate(
                ['session_id' => $session->id, 'eleve_id' => $eleve->id],
                ['statut' => 'absent', 'methode' => 'manuel']
            );
        });

        return $session->load('cours.classe');
    }

    public function marquerListe(int $sessionId, array $presences): void
    {
        foreach ($presences as $presence) {
            Presence::updateOrCreate(
                ['session_id' => $sessionId, 'eleve_id' => $presence['eleve_id']],
                ['statut' => $presence['statut'], 'methode' => 'manuel', 'marque_le' => now()]
            );
        }
    }

    public function scanQr(string $qrToken, int $eleveId): Presence
    {
        $session = SessionPresence::where('qr_token', $qrToken)->where('statut', 'ouverte')->firstOrFail();

        return Presence::updateOrCreate(
            ['session_id' => $session->id, 'eleve_id' => $eleveId],
            ['statut' => 'present', 'methode' => 'qr', 'marque_le' => now()]
        );
    }

    public function cloturer(SessionPresence $session): void
    {
        $session->update(['statut' => 'cloturee', 'cloturee_le' => now()]);

        $session->presences()->with('eleve.parents')->where('statut', 'absent')->get()->each(function (Presence $presence) use ($session) {
            $parent = $presence->eleve->parents->first();
            if ($parent) {
                NotificationPresence::create([
                    'eleve_id' => $presence->eleve_id,
                    'session_id' => $session->id,
                    'destinataire_email' => $parent->email,
                    'type' => 'absence',
                    'statut' => 'envoye',
                ]);
            }
        });
    }

    private function elevesARisque()
    {
        return Eleve::with('user')->limit(5)->get()->map(fn ($eleve) => [
            'id' => $eleve->id,
            'name' => $eleve->user->name,
            'absences_consecutives' => min(5, Presence::where('eleve_id', $eleve->id)->where('statut', 'absent')->count()),
        ])->filter(fn ($eleve) => $eleve['absences_consecutives'] >= 3)->values();
    }

    private function presencesSemaine(): array
    {
        return collect(['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'])->map(function ($jour, $index) {
            $date = Carbon::now()->startOfWeek()->addDays($index);
            $sessions = SessionPresence::whereDate('date', $date)->pluck('id');
            $total = max(1, Presence::whereIn('session_id', $sessions)->count());
            $presents = Presence::whereIn('session_id', $sessions)->where('statut', 'present')->count();

            return ['jour' => $jour, 'taux' => round(($presents / $total) * 100)];
        })->all();
    }
}
