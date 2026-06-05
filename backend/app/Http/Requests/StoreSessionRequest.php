<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreSessionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'cours_id' => ['required', 'exists:cours,id'],
            'date' => ['nullable', 'date'],
        ];
    }
}
