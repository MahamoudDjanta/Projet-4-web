<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cours extends Model
{
    protected $fillable = ['nom', 'professeur_id', 'classe_id'];

    public function professeur() {
        return $this->belongsTo(User::class, 'professeur_id');
    }

    public function classe() {
        return $this->belongsTo(Classe::class);
    }
}
