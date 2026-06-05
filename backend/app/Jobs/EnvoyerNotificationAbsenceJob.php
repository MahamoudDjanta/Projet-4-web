<?php

namespace App\Jobs;

use App\Mail\AbsenceNotificationMail;
use App\Models\Eleve;
use App\Models\SessionPresence;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Mail;

class EnvoyerNotificationAbsenceJob implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public string $parentEmail,
        public Eleve $eleve,
        public SessionPresence $session
    ) {}

    public function handle(): void
    {
        Mail::to($this->parentEmail)->send(new AbsenceNotificationMail($this->eleve, $this->session));
    }
}
