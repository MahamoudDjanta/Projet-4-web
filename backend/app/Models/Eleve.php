<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Eleve extends Model
{
    protected $fillable = ['user_id', 'classe_id', 'matricule'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function classe()
    {
        return $this->belongsTo(Classe::class);
    }

    public function parents()
    {
        return $this->belongsToMany(User::class, 'parents_eleves', 'eleve_id', 'parent_id')->withTimestamps();
    }

    public function presences()
    {
        return $this->hasMany(Presence::class);
    }
}
