<?php

namespace App\Strategies;

use App\Contracts\Strategies\SpecialistOperationStrategyInterface;
use App\Models\Specialist;

class SpecialistStatusStrategy implements SpecialistOperationStrategyInterface
{
    public function execute(Specialist $specialist, array $data = []): Specialist
    {
        $newStatus = $specialist->status === 'active' ? 'inactive' : 'active';
        
        $specialist->update(['status' => $newStatus]);
        
        return $specialist->fresh();
    }

    public function canHandle(string $operation): bool
    {
        return $operation === 'toggle_status';
    }
}
