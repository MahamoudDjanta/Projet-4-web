<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SessionPresence extends Model
{
    protected $table = 'sessions_presence';

    protected $fillable = ['cours_id', 'date', 'qr_token', 'statut', 'ouverte_le', 'cloturee_le'];

    protected $casts = [
        'date' => 'date',
        'ouverte_le' => 'datetime',
        'cloturee_le' => 'datetime',
    ];

    public function cours()
    {
        return $this->belongsTo(Cours::class);
    }

    public function presences()
    {
        return $this->hasMany(Presence::class, 'session_id');
    }
}
