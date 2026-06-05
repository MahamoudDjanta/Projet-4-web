<?php

use App\Models\Classe;
use App\Models\Cours;
use App\Models\Eleve;
use App\Models\NotificationPresence;
use App\Models\PermissionAbsence;
use App\Models\Presence;
use App\Models\RequetePresence;
use App\Models\SessionPresence;
use App\Models\User;
use Illuminate\Contracts\Console\Kernel;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

require __DIR__ . '/../vendor/autoload.php';

$app = require __DIR__ . '/../bootstrap/app.php';
$app->make(Kernel::class)->bootstrap();

$result = DB::transaction(function () {
    $classes = collect([
        ['nom' => '6eme A', 'niveau' => 'College'],
        ['nom' => '5eme B', 'niveau' => 'College'],
        ['nom' => '4eme C', 'niveau' => 'College'],
        ['nom' => '3eme A', 'niveau' => 'College'],
        ['nom' => 'Seconde C', 'niveau' => 'Lycee'],
        ['nom' => 'Premiere D', 'niveau' => 'Lycee'],
        ['nom' => 'Terminale A', 'niveau' => 'Lycee'],
    ])->map(fn ($classe) => Classe::firstOrCreate(['nom' => $classe['nom']], $classe));

    $professeurs = collect([
        ['name' => 'M. Adama Kone', 'email' => 'adama.kone@presence.local'],
        ['name' => 'Mme Mariam Toure', 'email' => 'mariam.toure@presence.local'],
        ['name' => 'M. Serge Mensah', 'email' => 'serge.mensah@presence.local'],
        ['name' => 'Mme Aicha Traore', 'email' => 'aicha.traore@presence.local'],
        ['name' => 'M. David Kouassi', 'email' => 'david.kouassi@presence.local'],
        ['name' => 'Mme Fatou Ndiaye', 'email' => 'fatou.ndiaye@presence.local'],
    ])->map(fn ($prof) => User::firstOrCreate(
        ['email' => $prof['email']],
        ['name' => $prof['name'], 'password' => 'password', 'role' => 'professeur']
    ))->values();

    $parents = collect(range(1, 18))->map(function ($index) {
        return User::firstOrCreate(
            ['email' => "parent{$index}@presence.local"],
            ['name' => "Parent {$index}", 'password' => 'password', 'role' => 'parent']
        );
    });

    $prenoms = [
        'Aminata Diallo', 'Yann Kouassi', 'Sarah Mensah', 'Noah Traore',
        'Ines Bakayoko', 'Moussa Diop', 'Aya Nguessan', 'Samuel Koffi',
        'Nadia Soro', 'Ibrahim Camara', 'Leila Bamba', 'Kevin Yao',
        'Mariam Cisse', 'Junior Tano', 'Fatoumata Sy', 'Ethan Zadi',
        'Ruth Ndao', 'Karim Ouattara', 'Awa Keita', 'Daniel Assi',
        'Grace Konan', 'Ousmane Faye', 'Lina Coulibaly', 'Hugo Aka',
        'Nora Bah', 'Ismael Sangare', 'Eva Guei', 'Malick Sow',
    ];

    $eleves = collect($prenoms)->map(function ($nom, $index) use ($classes, $parents) {
        $emailSlug = Str::slug($nom, '.');
        $user = User::firstOrCreate(
            ['email' => "{$emailSlug}@presence.local"],
            ['name' => $nom, 'password' => 'password', 'role' => 'eleve']
        );

        $classe = $classes[$index % $classes->count()];
        $matricule = 'ELV-' . str_pad((string) ($index + 1), 4, '0', STR_PAD_LEFT);

        $eleve = Eleve::firstOrCreate(
            ['matricule' => $matricule],
            ['user_id' => $user->id, 'classe_id' => $classe->id]
        );

        $eleve->update(['user_id' => $user->id, 'classe_id' => $classe->id]);
        $eleve->parents()->syncWithoutDetaching([$parents[$index % $parents->count()]->id]);

        return $eleve->load('user', 'classe', 'parents');
    });

    $subjects = [
        ['nom' => 'Mathematiques', 'jour' => 'lundi', 'heure_debut' => '08:00', 'heure_fin' => '10:00'],
        ['nom' => 'Francais', 'jour' => 'mardi', 'heure_debut' => '10:00', 'heure_fin' => '12:00'],
        ['nom' => 'Physique', 'jour' => 'mercredi', 'heure_debut' => '08:00', 'heure_fin' => '10:00'],
        ['nom' => 'Histoire-Geographie', 'jour' => 'jeudi', 'heure_debut' => '14:00', 'heure_fin' => '16:00'],
        ['nom' => 'Anglais', 'jour' => 'vendredi', 'heure_debut' => '09:00', 'heure_fin' => '11:00'],
    ];

    $cours = collect();
    foreach ($classes as $classeIndex => $classe) {
        foreach ($subjects as $subjectIndex => $subject) {
            $prof = $professeurs[($classeIndex + $subjectIndex) % $professeurs->count()];
            $cours->push(Cours::firstOrCreate(
                ['nom' => $subject['nom'], 'classe_id' => $classe->id],
                [
                    'professeur_id' => $prof->id,
                    'jour' => $subject['jour'],
                    'heure_debut' => $subject['heure_debut'],
                    'heure_fin' => $subject['heure_fin'],
                ]
            ));
        }
    }

    $schoolDays = collect(range(0, 9))->map(fn ($daysAgo) => now()->subDays($daysAgo))
        ->filter(fn ($date) => $date->isWeekday())
        ->take(7)
        ->values();

    $sessions = collect();
    foreach ($schoolDays as $dateIndex => $date) {
        foreach ($cours->take(28) as $coursIndex => $course) {
            if (($coursIndex + $dateIndex) % 2 !== 0) {
                continue;
            }

            $session = SessionPresence::firstOrCreate(
                ['cours_id' => $course->id, 'date' => $date->toDateString()],
                [
                    'qr_token' => 'presence_' . Str::random(32),
                    'statut' => $date->isToday() ? 'ouverte' : 'cloturee',
                    'ouverte_le' => $date->copy()->setTime(8, 0),
                    'cloturee_le' => $date->isToday() ? null : $date->copy()->setTime(10, 0),
                ]
            );

            $sessions->push($session);
            $classeEleves = $eleves->where('classe_id', $course->classe_id)->values();

            foreach ($classeEleves as $studentIndex => $eleve) {
                $statusRoll = ($studentIndex + $coursIndex + $dateIndex) % 10;
                $statut = $statusRoll <= 6 ? 'present' : ($statusRoll <= 8 ? 'absent' : 'retard');

                Presence::updateOrCreate(
                    ['session_id' => $session->id, 'eleve_id' => $eleve->id],
                    [
                        'statut' => $statut,
                        'methode' => $statusRoll % 2 === 0 ? 'qr' : 'manuel',
                        'marque_le' => $statut === 'absent' ? null : $date->copy()->setTime(8, 12),
                    ]
                );

                if ($statut === 'absent') {
                    $parent = $eleve->parents->first();
                    if ($parent) {
                        NotificationPresence::firstOrCreate(
                            ['eleve_id' => $eleve->id, 'session_id' => $session->id],
                            ['destinataire_email' => $parent->email, 'type' => 'absence', 'statut' => 'envoye']
                        );
                    }
                }
            }
        }
    }

    foreach ($eleves->take(10) as $index => $eleve) {
        $session = $sessions[$index % max(1, $sessions->count())] ?? null;
        $parent = $eleve->parents->first();

        if ($session && $parent) {
            RequetePresence::firstOrCreate(
                ['eleve_id' => $eleve->id, 'session_id' => $session->id, 'demandeur_id' => $parent->id],
                [
                    'motif' => $index % 2 === 0 ? 'Justification apres rendez-vous medical.' : 'Signalement d une erreur de pointage.',
                    'statut' => $index % 3 === 0 ? 'approuvee' : 'en_attente',
                    'commentaire_admin' => $index % 3 === 0 ? 'Piece acceptee.' : null,
                ]
            );
        }

        if ($parent) {
            PermissionAbsence::firstOrCreate(
                ['eleve_id' => $eleve->id, 'demandeur_id' => $parent->id, 'date_debut' => now()->addDays($index + 1)->toDateString()],
                [
                    'date_fin' => now()->addDays($index + 2)->toDateString(),
                    'motif' => $index % 2 === 0 ? 'Absence prevue pour raison familiale.' : 'Participation a une activite externe.',
                    'statut' => ['soumis', 'examine', 'accorde', 'refuse'][$index % 4],
                ]
            );
        }
    }

    return [
        'classes' => Classe::count(),
        'professeurs' => User::where('role', 'professeur')->count(),
        'parents' => User::where('role', 'parent')->count(),
        'eleves' => Eleve::count(),
        'cours' => Cours::count(),
        'sessions' => SessionPresence::count(),
        'presences' => Presence::count(),
        'notifications' => NotificationPresence::count(),
        'requetes' => RequetePresence::count(),
        'permissions' => PermissionAbsence::count(),
    ];
});

echo json_encode($result, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . PHP_EOL;
