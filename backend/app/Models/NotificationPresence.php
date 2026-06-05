<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NotificationPresence extends Model
{
    protected $table = 'notifications_presence';

    protected $fillable = ['eleve_id', 'session_id', 'destinataire_email', 'type', 'statut'];

    public function eleve()
    {
        return $this->belongsTo(Eleve::class);
    }

    public function session()
    {
        return $this->belongsTo(SessionPresence::class, 'session_id');
    }
}
