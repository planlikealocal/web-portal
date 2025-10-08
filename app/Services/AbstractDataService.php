<?php

namespace App\Services;

use App\Contracts\Services\DataPreparationServiceInterface;

abstract class AbstractDataService implements DataPreparationServiceInterface
{
    /**
     * Prepare specialist data
     */
    public function prepareSpecialistData(array $data): array
    {
        // Format phone number
        if (isset($data['contact_no'])) {
            $data['contact_no'] = $this->formatPhoneNumber($data['contact_no']);
        }

        // Normalize email
        if (isset($data['email'])) {
            $data['email'] = $this->normalizeEmail($data['email']);
        }

        // Validate and set status
        if (isset($data['status'])) {
            $data['status'] = $this->validateStatus($data['status']);
        }

        return $data;
    }

    /**
     * Format phone number
     */
    public function formatPhoneNumber(string $phoneNumber): string
    {
        // Remove all non-numeric characters
        return preg_replace('/[^0-9]/', '', $phoneNumber);
    }

    /**
     * Normalize email
     */
    public function normalizeEmail(string $email): string
    {
        return strtolower(trim($email));
    }

    /**
     * Validate status
     */
    public function validateStatus(string $status): string
    {
        return in_array($status, ['active', 'inactive']) ? $status : 'active';
    }
}
