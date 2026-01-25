<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePlanRequest extends FormRequest
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
            'first_name' => 'nullable|string|max:255',
            'last_name' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:255',
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
}
