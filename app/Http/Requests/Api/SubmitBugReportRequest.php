<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class SubmitBugReportRequest extends FormRequest
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
            'issue_type' => 'required|string|in:ui_issue,crash,performance,feature_request,other',
            'title' => 'required|string|max:255',
            'description' => 'required|string|max:5000',
            'screenshot' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'issue_type.required' => 'Issue type is required.',
            'issue_type.in' => 'Please select a valid issue type.',
            'title.required' => 'Title is required.',
            'title.max' => 'Title must not exceed 255 characters.',
            'description.required' => 'Description is required.',
            'description.max' => 'Description must not exceed 5000 characters.',
            'screenshot.image' => 'Screenshot must be an image file.',
            'screenshot.mimes' => 'Screenshot must be a JPEG, PNG, JPG, or GIF file.',
            'screenshot.max' => 'Screenshot must not exceed 5MB.',
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
