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
            $table->string('nom')->unique();
            $table->timestamps();
        });

        Schema::create('eleves', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('classe_id')->constrained()->onDelete('cascade');
            $table->string('matricule')->unique();
            $table->timestamps();
        });

        Schema::create('cours', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->foreignId('professeur_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('classe_id')->constrained()->onDelete('cascade');
            $table->timestamps();
        });

        Schema::create('sessions_presence', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cours_id')->constrained('cours')->onDelete('cascade');
            $table->date('date');
            $table->string('qr_token')->unique()->nullable();
            $table->enum('statut', ['ouvert', 'ferme'])->default('ouvert');
            $table->timestamps();
        });

        Schema::create('presences', function (Blueprint $table) {
            $table->id();
            $table->foreignId('session_id')->constrained('sessions_presence')->onDelete('cascade');
            $table->foreignId('eleve_id')->constrained('eleves')->onDelete('cascade');
            $table->enum('statut', ['present', 'absent', 'retard'])->default('absent');
            $table->enum('methode', ['manuel', 'qr'])->default('manuel');
            $table->timestamp('heure_marquage')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('presences');
        Schema::dropIfExists('sessions_presence');
        Schema::dropIfExists('cours');
        Schema::dropIfExists('eleves');
        Schema::dropIfExists('classes');
    }
};
