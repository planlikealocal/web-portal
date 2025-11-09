<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateSpecialistProfileRequest extends FormRequest
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
        $user = auth()->user();
        $specialist = \App\Models\Specialist::where('email', $user->email)->first();
        $specialistId = $specialist ? $specialist->id : null;

        return [
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => [
                'required',
                'email',
                $specialistId ? Rule::unique('specialists', 'email')->ignore($specialistId) : 'unique:specialists,email',
            ],
            'profile_pic' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'bio' => 'nullable|string|max:1000',
            'contact_no' => 'required|string|max:255',
            'country_id' => 'required|exists:countries,id',
            'state_province' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'address' => 'required|string',
            'postal_code' => 'required|string|max:255',
            'timezone' => 'nullable|string|max:255',
            'working_hours' => 'nullable',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'email.unique' => 'This email address is already registered.',
            'working_hours.*.start_time.required' => 'Start time is required for each working hour block.',
            'working_hours.*.end_time.required' => 'End time is required for each working hour block.',
            'working_hours.*.end_time.after' => 'End time must be after start time.',
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
            'profile_pic' => 'profile picture',
            'bio' => 'biography',
            'contact_no' => 'contact number',
            'state_province' => 'state/province',
            'postal_code' => 'postal code',
            'working_hours' => 'working hours',
        ];
    }
}
