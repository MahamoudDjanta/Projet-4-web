<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('classes', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->string('niveau')->nullable();
            $table->timestamps();
        });

        Schema::create('eleves', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('classe_id')->constrained('classes')->cascadeOnDelete();
            $table->string('matricule')->unique();
            $table->timestamps();
        });

        Schema::create('parents_eleves', function (Blueprint $table) {
            $table->id();
            $table->foreignId('parent_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('eleve_id')->constrained('eleves')->cascadeOnDelete();
            $table->timestamps();
            $table->unique(['parent_id', 'eleve_id']);
        });

        Schema::create('cours', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->foreignId('classe_id')->constrained('classes')->cascadeOnDelete();
            $table->foreignId('professeur_id')->constrained('users')->cascadeOnDelete();
            $table->enum('jour', ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi']);
            $table->time('heure_debut');
            $table->time('heure_fin');
            $table->timestamps();
        });

        Schema::create('sessions_presence', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cours_id')->constrained('cours')->cascadeOnDelete();
            $table->date('date');
            $table->string('qr_token')->unique()->nullable();
            $table->enum('statut', ['ouverte', 'cloturee'])->default('ouverte');
            $table->timestamp('ouverte_le')->nullable();
            $table->timestamp('cloturee_le')->nullable();
            $table->timestamps();
        });

        Schema::create('presences', function (Blueprint $table) {
            $table->id();
            $table->foreignId('session_id')->constrained('sessions_presence')->cascadeOnDelete();
            $table->foreignId('eleve_id')->constrained('eleves')->cascadeOnDelete();
            $table->enum('statut', ['present', 'absent', 'retard'])->default('absent');
            $table->enum('methode', ['qr', 'manuel'])->default('manuel');
            $table->timestamp('marque_le')->nullable();
            $table->timestamps();
            $table->unique(['session_id', 'eleve_id']);
        });

        Schema::create('notifications_presence', function (Blueprint $table) {
            $table->id();
            $table->foreignId('eleve_id')->constrained('eleves')->cascadeOnDelete();
            $table->foreignId('session_id')->constrained('sessions_presence')->cascadeOnDelete();
            $table->string('destinataire_email');
            $table->enum('type', ['absence', 'alerte_successive']);
            $table->enum('statut', ['envoye', 'echec'])->default('envoye');
            $table->timestamps();
        });

        Schema::create('requetes_presence', function (Blueprint $table) {
            $table->id();
            $table->foreignId('eleve_id')->constrained('eleves')->cascadeOnDelete();
            $table->foreignId('session_id')->nullable()->constrained('sessions_presence')->nullOnDelete();
            $table->foreignId('demandeur_id')->constrained('users')->cascadeOnDelete();
            $table->text('motif');
            $table->enum('statut', ['en_attente', 'approuvee', 'rejetee'])->default('en_attente');
            $table->text('commentaire_admin')->nullable();
            $table->timestamps();
        });

        Schema::create('permissions_absence', function (Blueprint $table) {
            $table->id();
            $table->foreignId('eleve_id')->constrained('eleves')->cascadeOnDelete();
            $table->foreignId('demandeur_id')->constrained('users')->cascadeOnDelete();
            $table->date('date_debut');
            $table->date('date_fin');
            $table->text('motif');
            $table->string('piece_jointe')->nullable();
            $table->enum('statut', ['soumis', 'examine', 'accorde', 'refuse'])->default('soumis');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('permissions_absence');
        Schema::dropIfExists('requetes_presence');
        Schema::dropIfExists('notifications_presence');
        Schema::dropIfExists('presences');
        Schema::dropIfExists('sessions_presence');
        Schema::dropIfExists('cours');
        Schema::dropIfExists('parents_eleves');
        Schema::dropIfExists('eleves');
        Schema::dropIfExists('classes');
    }
};
