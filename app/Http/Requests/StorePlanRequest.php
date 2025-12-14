<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePlanRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Authorization logic can be moved here if needed
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'specialist_id' => 'required|exists:specialists,id',
            'destination_id' => 'nullable|exists:destinations,id',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'specialist_id.required' => 'A specialist must be selected.',
            'specialist_id.exists' => 'The selected specialist does not exist.',
            'destination_id.exists' => 'The selected destination does not exist.',
        ];
    }

    /**
     * Get custom attributes for validator errors.
     */
    public function attributes(): array
    {
        return [
            'specialist_id' => 'specialist',
            'destination_id' => 'destination',
        ];
    }
}

