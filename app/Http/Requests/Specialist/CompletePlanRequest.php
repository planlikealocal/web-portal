<?php

namespace App\Http\Requests\Specialist;

use Illuminate\Foundation\Http\FormRequest;

class CompletePlanRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        return [
            'comment' => 'required|string|min:5|max:1000',
        ];
    }

    public function messages(): array
    {
        return [
            'comment.required' => 'Please provide a completion summary.',
        ];
    }
}

