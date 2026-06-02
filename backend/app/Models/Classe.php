<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Classe extends Model
{
    protected $fillable = ['nom'];

    public function eleves() {
        return $this->hasMany(Eleve::class);
    }

    public function cours() {
        return $this->hasMany(Cours::class);
    }
}
