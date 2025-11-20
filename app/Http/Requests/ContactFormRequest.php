<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Http;
use Illuminate\Validation\ValidationException;

class ContactFormRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'topic' => 'required|string|in:Scheduling,Specialist Service,Billing,Other',
            'message' => 'required|string|max:5000',
            'recaptcha_token' => 'required|string',
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
            'recaptcha_token.required' => 'Please complete the reCAPTCHA verification.',
        ];
    }

    /**
     * Get custom attributes for validator errors.
     */
    public function attributes(): array
    {
        return [
            'first_name' => 'first name',
            'last_name' => 'last name',
            'email' => 'email address',
            'topic' => 'topic',
            'message' => 'message',
            'recaptcha_token' => 'reCAPTCHA',
        ];
    }

    /**
     * Configure the validator instance.
     */
    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            // Verify reCAPTCHA
            $recaptchaSecret = config('services.recaptcha.secret_key');
            if ($recaptchaSecret && $this->has('recaptcha_token')) {
                $recaptchaResponse = Http::asForm()->post('https://www.google.com/recaptcha/api/siteverify', [
                    'secret' => $recaptchaSecret,
                    'response' => $this->input('recaptcha_token'),
                    'remoteip' => $this->ip(),
                ]);

                $recaptchaResult = $recaptchaResponse->json();

                if (!isset($recaptchaResult['success']) || !$recaptchaResult['success']) {
                    $validator->errors()->add('recaptcha', 'reCAPTCHA verification failed. Please try again.');
                }
            }
        });
    }
}

