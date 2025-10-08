<?php

namespace App\Contracts\Services;

use App\Models\Specialist;

interface ValidationServiceInterface
{
    public function validateSpecialistData(array $data): array;
    public function validateEmailUniqueness(string $email, ?Specialist $excludeSpecialist = null): bool;
    public function validatePhoneNumber(string $phoneNumber): bool;
    public function validateStatus(string $status): bool;
}
