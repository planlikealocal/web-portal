<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateDestinationRequest extends FormRequest
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
            'name' => 'required|string|max:255',
            'overview_title' => 'required|string|max:255',
            'overview' => 'nullable|string',
            'description' => 'nullable|string',
            'country' => 'nullable|string|max:255',
            'state_province' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:255',
            'home_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'grid_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'status' => 'nullable|in:draft,active,inactive',
            'specialist_ids' => 'nullable|string',
        ];
    }
}
