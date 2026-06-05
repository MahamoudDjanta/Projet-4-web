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
    $suffix = now()->format('YmdHis');

    $classe = Classe::create([
        'nom' => "Terminale A {$suffix}",
        'niveau' => 'Terminale',
    ]);

    $prof = User::create([
        'name' => "Prof {$suffix}",
        'email' => "prof.demo.{$suffix}@test.com",
        'password' => 'password',
        'role' => 'professeur',
    ]);

    $parent = User::create([
        'name' => "Parent {$suffix}",
        'email' => "parent.demo.{$suffix}@test.com",
        'password' => 'password',
        'role' => 'parent',
    ]);

    $eleveUser = User::create([
        'name' => "Eleve {$suffix}",
        'email' => "eleve.demo.{$suffix}@test.com",
        'password' => 'password',
        'role' => 'eleve',
    ]);

    $eleve = Eleve::create([
        'user_id' => $eleveUser->id,
        'classe_id' => $classe->id,
        'matricule' => "MAT-{$suffix}",
    ]);

    $eleve->parents()->syncWithoutDetaching([$parent->id]);

    $cours = Cours::create([
        'nom' => "Mathematiques {$suffix}",
        'classe_id' => $classe->id,
        'professeur_id' => $prof->id,
        'jour' => 'mardi',
        'heure_debut' => '08:00',
        'heure_fin' => '10:00',
    ]);

    $session = SessionPresence::create([
        'cours_id' => $cours->id,
        'date' => now()->toDateString(),
        'qr_token' => 'demo_' . Str::random(32),
        'statut' => 'ouverte',
        'ouverte_le' => now(),
    ]);

    $presence = Presence::create([
        'session_id' => $session->id,
        'eleve_id' => $eleve->id,
        'statut' => 'present',
        'methode' => 'manuel',
        'marque_le' => now(),
    ]);

    $notification = NotificationPresence::create([
        'eleve_id' => $eleve->id,
        'session_id' => $session->id,
        'destinataire_email' => $parent->email,
        'type' => 'absence',
        'statut' => 'envoye',
    ]);

    $requete = RequetePresence::create([
        'eleve_id' => $eleve->id,
        'session_id' => $session->id,
        'demandeur_id' => $parent->id,
        'motif' => 'Demande de verification creee depuis le terminal.',
        'statut' => 'en_attente',
    ]);

    $permission = PermissionAbsence::create([
        'eleve_id' => $eleve->id,
        'demandeur_id' => $parent->id,
        'date_debut' => now()->addDay()->toDateString(),
        'date_fin' => now()->addDays(2)->toDateString(),
        'motif' => 'Permission de demonstration envoyee depuis Laravel.',
        'statut' => 'soumis',
    ]);

    return [
        'suffix' => $suffix,
        'classe_id' => $classe->id,
        'prof_email' => $prof->email,
        'parent_email' => $parent->email,
        'eleve_email' => $eleveUser->email,
        'eleve_id' => $eleve->id,
        'cours_id' => $cours->id,
        'session_id' => $session->id,
        'presence_id' => $presence->id,
        'notification_id' => $notification->id,
        'requete_id' => $requete->id,
        'permission_id' => $permission->id,
    ];
});

echo json_encode($result, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . PHP_EOL;
