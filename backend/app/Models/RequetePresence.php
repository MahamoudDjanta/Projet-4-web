<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RequetePresence extends Model
{
    protected $table = 'requetes_presence';

    protected $fillable = ['eleve_id', 'session_id', 'demandeur_id', 'motif', 'statut', 'commentaire_admin'];

    public function eleve()
    {
        return $this->belongsTo(Eleve::class);
    }

    public function demandeur()
    {
        return $this->belongsTo(User::class, 'demandeur_id');
    }
}
