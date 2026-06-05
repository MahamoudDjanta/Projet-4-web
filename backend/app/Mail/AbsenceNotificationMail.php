<?php

namespace App\Mail;

use App\Models\Eleve;
use App\Models\SessionPresence;
use Illuminate\Mail\Mailable;

class AbsenceNotificationMail extends Mailable
{
    public function __construct(public Eleve $eleve, public SessionPresence $session) {}

    public function build()
    {
        return $this->subject('Notification absence')->view('mail.absence');
    }
}
