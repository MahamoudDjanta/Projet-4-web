<?php

namespace App\Jobs;

use App\Mail\AlerteAbsenceMail;
use App\Models\Eleve;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Mail;

class EnvoyerAlerteAbsencesSuccessivesJob implements ShouldQueue
{
    use Queueable;

    public function __construct(public string $parentEmail, public Eleve $eleve, public int $totalAbsences) {}

    public function handle(): void
    {
        Mail::to($this->parentEmail)->send(new AlerteAbsenceMail($this->eleve, $this->totalAbsences));
    }
}
