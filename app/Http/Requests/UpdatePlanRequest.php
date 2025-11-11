<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePlanRequest extends FormRequest
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
            'first_name' => 'nullable|string|max:255',
            'last_name' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:255',
            'destination' => 'nullable|string|max:255',
            'destination_id' => 'nullable|exists:destinations,id',
            'travel_dates' => 'nullable|string|max:255',
            'travelers' => 'nullable|string|max:255',
            'interests' => 'nullable|array',
            'other_interests' => 'nullable|string',
            'plan_type' => 'nullable|string|max:255',
            'selected_plan' => 'nullable|string|max:255',
            'status' => 'nullable|in:draft,in_progress,completed',
            'selected_time_slot' => 'nullable',
            'appointment_start' => 'nullable|date',
            'appointment_end' => 'nullable|date',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'email.email' => 'Please provide a valid email address.',
            'destination_id.exists' => 'The selected destination does not exist.',
            'status.in' => 'Status must be one of: draft, in_progress, or completed.',
            'appointment_start.date' => 'Appointment start time must be a valid date.',
            'appointment_end.date' => 'Appointment end time must be a valid date.',
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
            'destination_id' => 'destination',
            'travel_dates' => 'travel dates',
            'other_interests' => 'other interests',
            'plan_type' => 'plan type',
            'selected_plan' => 'selected plan',
            'selected_time_slot' => 'selected time slot',
            'appointment_start' => 'appointment start',
            'appointment_end' => 'appointment end',
        ];
    }
}

