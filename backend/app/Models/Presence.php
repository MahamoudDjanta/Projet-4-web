<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Presence extends Model
{
    protected $fillable = ['session_id', 'eleve_id', 'statut', 'methode', 'heure_marquage'];

    public function session() {
        return $this->belongsTo(SessionPresence::class, 'session_id');
    }

    public function eleve() {
        return $this->belongsTo(Eleve::class);
    }
}
