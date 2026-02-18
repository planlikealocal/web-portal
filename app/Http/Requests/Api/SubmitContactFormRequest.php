<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class SubmitContactFormRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Authorization handled by middleware
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'topic' => 'required|string|in:Scheduling,Specialist Service,Billing,Other',
            'message' => 'required|string|max:5000',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'first_name.required' => 'First name is required.',
            'last_name.required' => 'Last name is required.',
            'email.required' => 'Email address is required.',
            'email.email' => 'Please enter a valid email address.',
            'topic.required' => 'Please select a topic.',
            'topic.in' => 'Please select a valid topic.',
            'message.required' => 'Message is required.',
            'message.max' => 'Message cannot exceed 5000 characters.',
        ];
    }

    /**
     * Handle a failed validation attempt.
     */
    protected function failedValidation(Validator $validator)
    {
        $errors = $validator->errors()->toArray();

        $formattedErrors = [];
        foreach ($errors as $field => $messages) {
            $formattedErrors[$field] = is_array($messages) ? $messages : [$messages];
        }

        throw new HttpResponseException(
            response()->json([
                'success' => false,
                'error' => 'Validation failed',
                'errors' => $formattedErrors,
            ], 422)
        );
    }
}
