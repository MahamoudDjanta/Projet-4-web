<?php

namespace Database\Seeders;

use App\Models\Classe;
use App\Models\Cours;
use App\Models\Eleve;
use App\Models\User;
use Illuminate\Database\Seeder;

class ClasseCoursSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::where('email', 'admin@test.com')->first();
        $prof = User::where('email', 'prof@test.com')->first();
        $parent = User::where('email', 'parent@test.com')->first();
        $eleveUser = User::where('email', 'eleve@test.com')->first();

        $classes = [
            ['nom' => '6eme B', 'niveau' => 'College'],
            ['nom' => '5eme A', 'niveau' => 'College'],
            ['nom' => '4eme A', 'niveau' => 'College'],
            ['nom' => '4eme B', 'niveau' => 'College'],
            ['nom' => '3eme A', 'niveau' => 'College'],
            ['nom' => '3eme B', 'niveau' => 'College'],
            ['nom' => '2nd A/B', 'niveau' => 'Lycee'],
            ['nom' => '2nd D', 'niveau' => 'Lycee'],
            ['nom' => '1ere A/B', 'niveau' => 'Lycee'],
            ['nom' => '1ere D', 'niveau' => 'Lycee'],
            ['nom' => '1ere C', 'niveau' => 'Lycee'],
            ['nom' => 'Tle A', 'niveau' => 'Lycee'],
            ['nom' => 'Tle D/C', 'niveau' => 'Lycee'],
        ];

        foreach ($classes as $classeData) {
            Classe::updateOrCreate(['nom' => $classeData['nom']], ['niveau' => $classeData['niveau']]);
        }

        $classe = Classe::where('nom', '6eme B')->first();
        $classeB = Classe::where('nom', '5eme A')->first();

        $eleve = Eleve::updateOrCreate(
            ['user_id' => $eleveUser->id],
            ['classe_id' => $classe->id, 'matricule' => 'ELV-0001']
        );
        $eleve->parents()->syncWithoutDetaching([$parent->id]);

        Cours::updateOrCreate(
            ['nom' => 'Mathematiques', 'classe_id' => $classe->id],
            ['professeur_id' => $prof->id, 'jour' => 'lundi', 'heure_debut' => '08:00', 'heure_fin' => '10:00']
        );

        Cours::updateOrCreate(
            ['nom' => 'Francais', 'classe_id' => $classe->id],
            ['professeur_id' => $prof->id, 'jour' => 'mardi', 'heure_debut' => '10:00', 'heure_fin' => '12:00']
        );

        Cours::updateOrCreate(
            ['nom' => 'Physique', 'classe_id' => $classeB->id],
            ['professeur_id' => $prof->id, 'jour' => 'mercredi', 'heure_debut' => '14:00', 'heure_fin' => '16:00']
        );

        $admin->update(['role' => 'admin']);
    }
}
