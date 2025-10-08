<?php

namespace App\Services;

use App\Contracts\Strategies\SpecialistOperationStrategyInterface;
use App\Models\Specialist;

class SpecialistOperationService
{
    private array $strategies = [];

    public function __construct()
    {
        $this->registerStrategies();
    }

    public function executeOperation(string $operation, Specialist $specialist, array $data = []): mixed
    {
        $strategy = $this->getStrategy($operation);
        
        if (!$strategy) {
            throw new \InvalidArgumentException("No strategy found for operation: {$operation}");
        }

        return $strategy->execute($specialist, $data);
    }

    private function registerStrategies(): void
    {
        $this->strategies = [
            new \App\Strategies\SpecialistStatusStrategy(),
            new \App\Strategies\SpecialistTripStrategy(),
        ];
    }

    private function getStrategy(string $operation): ?SpecialistOperationStrategyInterface
    {
        foreach ($this->strategies as $strategy) {
            if ($strategy->canHandle($operation)) {
                return $strategy;
            }
        }

        return null;
    }
}
