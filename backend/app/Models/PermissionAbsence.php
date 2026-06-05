<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PermissionAbsence extends Model
{
    protected $table = 'permissions_absence';

    protected $fillable = ['eleve_id', 'demandeur_id', 'date_debut', 'date_fin', 'motif', 'piece_jointe', 'statut'];

    protected $casts = [
        'date_debut' => 'date',
        'date_fin' => 'date',
    ];

    public function eleve()
    {
        return $this->belongsTo(Eleve::class);
    }

    public function demandeur()
    {
        return $this->belongsTo(User::class, 'demandeur_id');
    }
}
