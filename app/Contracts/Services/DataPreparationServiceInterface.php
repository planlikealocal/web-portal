<?php

namespace App\Contracts\Services;

interface DataPreparationServiceInterface
{
    public function prepareSpecialistData(array $data): array;
    public function formatPhoneNumber(string $phoneNumber): string;
    public function normalizeEmail(string $email): string;
    public function validateStatus(string $status): string;
}
