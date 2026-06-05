<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Eleve;
use App\Models\Classe;
use Illuminate\Support\Facades\Hash;

class AddTenElevesSeeder extends Seeder
{
    public function run(): void
    {
        $classes = Classe::pluck('id')->toArray();

        if (empty($classes)) {
            $this->command->info('Aucune classe trouvée. Exécutez d\'abord ClasseCoursSeeder.');
            return;
        }

        $names = [
            'Aisha Traoré',
            'Mohamed Diallo',
            'Fatoumata Coulibaly',
            'Ibrahim Koné',
            'Mariama Sow',
            'Youssef Camara',
            'Kadiatou Cissé',
            'Ousmane Sy',
            'Seynabou Ba',
            'Mamadou Keita',
        ];

        foreach ($names as $index => $name) {
            $email = 'eleve' . ($index + 1) . '@test.com';

            // Eviter de dupliquer si l'utilisateur existe
            $user = User::firstWhere('email', $email);
            if (! $user) {
                $user = User::create([
                    'name' => $name,
                    'email' => $email,
                    'password' => Hash::make('password'),
                    'role' => 'eleve',
                ]);
            }

            // Créer l'entité Eleve si elle n'existe pas
            $exists = Eleve::where('user_id', $user->id)->exists();
            if (! $exists) {
                $classeId = $classes[$index % count($classes)];
                Eleve::create([
                    'user_id' => $user->id,
                    'classe_id' => $classeId,
                    'matricule' => sprintf('ELV-%04d', $user->id),
                ]);
            }

            $this->command->info("Ajout/OK : {$name} <{$email}>");
        }

        $this->command->info('Seeder AddTenElevesSeeder terminé.');
    }
}
