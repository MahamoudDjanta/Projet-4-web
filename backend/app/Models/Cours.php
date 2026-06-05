<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cours extends Model
{
    protected $table = 'cours';

    protected $fillable = ['nom', 'classe_id', 'professeur_id', 'jour', 'heure_debut', 'heure_fin'];

    public function classe()
    {
        return $this->belongsTo(Classe::class);
    }

    public function professeur()
    {
        return $this->belongsTo(User::class, 'professeur_id');
    }

    public function sessions()
    {
        return $this->hasMany(SessionPresence::class);
    }
}
