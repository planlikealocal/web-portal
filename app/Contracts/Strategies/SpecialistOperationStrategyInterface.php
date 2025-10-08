<?php

namespace App\Contracts\Strategies;

use App\Models\Specialist;

interface SpecialistOperationStrategyInterface
{
    public function execute(Specialist $specialist, array $data = []): mixed;
    public function canHandle(string $operation): bool;
}
