<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class MarquerListeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'session_id' => ['required', 'exists:sessions_presence,id'],
            'presences' => ['required', 'array'],
            'presences.*.eleve_id' => ['required', 'exists:eleves,id'],
            'presences.*.statut' => ['required', 'in:present,absent,retard'],
        ];
    }
}
