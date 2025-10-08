<?php

namespace App\Services;

use App\Contracts\Services\ValidationServiceInterface;
use App\Models\Specialist;

class SpecialistValidationService implements ValidationServiceInterface
{
    public function validateSpecialistData(array $data): array
    {
        $validated = [];

        // Validate required fields
        $requiredFields = ['first_name', 'last_name', 'email', 'contact_no', 'country', 'state_province', 'city', 'address', 'postal_code', 'status'];
        
        foreach ($requiredFields as $field) {
            if (!isset($data[$field]) || empty($data[$field])) {
                throw new \InvalidArgumentException("Field {$field} is required");
            }
            $validated[$field] = $data[$field];
        }

        // Validate email format
        if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            throw new \InvalidArgumentException("Invalid email format");
        }

        // Validate status
        if (!$this->validateStatus($data['status'])) {
            throw new \InvalidArgumentException("Invalid status. Must be 'active' or 'inactive'");
        }

        // Preserve optional fields when present
        if (array_key_exists('bio', $data)) {
            $validated['bio'] = $data['bio'];
        }

        if (array_key_exists('profile_pic', $data)) {
            $validated['profile_pic'] = $data['profile_pic'];
        }

        return $validated;
    }

    public function validateEmailUniqueness(string $email, ?Specialist $excludeSpecialist = null): bool
    {
        $query = Specialist::where('email', $email);
        
        if ($excludeSpecialist) {
            $query->where('id', '!=', $excludeSpecialist->id);
        }
        
        return $query->count() === 0;
    }

    public function validatePhoneNumber(string $phoneNumber): bool
    {
        // Remove non-numeric characters
        $cleanNumber = preg_replace('/[^0-9]/', '', $phoneNumber);
        
        // Check if it's a valid length (adjust based on your requirements)
        return strlen($cleanNumber) >= 10 && strlen($cleanNumber) <= 15;
    }

    public function validateStatus(string $status): bool
    {
        return in_array($status, ['active', 'inactive']);
    }
}
