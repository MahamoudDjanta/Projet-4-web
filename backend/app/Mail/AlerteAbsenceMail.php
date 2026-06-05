<?php

namespace App\Mail;

use App\Models\Eleve;
use Illuminate\Mail\Mailable;

class AlerteAbsenceMail extends Mailable
{
    public function __construct(public Eleve $eleve, public int $totalAbsences) {}

    public function build()
    {
        return $this->subject('Alerte absences successives')->view('mail.alerte-absence');
    }
}
