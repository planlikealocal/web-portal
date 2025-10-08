<?php

namespace App\Actions\Specialist;

use App\Contracts\SpecialistRepositoryInterface;
use App\Models\Specialist;

class CreateSpecialistActionImproved
{
    public function __construct(
        private SpecialistRepositoryInterface $specialistRepository
    ) {}

    public function execute(array $data): Specialist
    {
        $data = $this->prepareData($data);
        
        return $this->specialistRepository->create($data);
    }

    private function prepareData(array $data): array
    {
        // Format phone number
        if (isset($data['contact_no'])) {
            $data['contact_no'] = $this->formatPhoneNumber($data['contact_no']);
        }

        // Normalize email
        if (isset($data['email'])) {
            $data['email'] = strtolower(trim($data['email']));
        }

        // Ensure status is valid
        if (isset($data['status']) && !in_array($data['status'], ['active', 'inactive'])) {
            $data['status'] = 'active'; // Default status
        }

        return $data;
    }

    private function formatPhoneNumber(string $phoneNumber): string
    {
        return preg_replace('/[^0-9]/', '', $phoneNumber);
    }
}
