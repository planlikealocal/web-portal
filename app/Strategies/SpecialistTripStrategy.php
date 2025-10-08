<?php

namespace App\Strategies;

use App\Contracts\Strategies\SpecialistOperationStrategyInterface;
use App\Models\Specialist;

class SpecialistTripStrategy implements SpecialistOperationStrategyInterface
{
    public function execute(Specialist $specialist, array $data = []): Specialist
    {
        $incrementBy = $data['increment_by'] ?? 1;
        
        $specialist->increment('no_of_trips', $incrementBy);
        
        return $specialist->fresh();
    }

    public function canHandle(string $operation): bool
    {
        return $operation === 'increment_trips';
    }
}
