<?php

namespace App\Actions\Destination;

use App\Contracts\Repositories\DestinationRepositoryInterface;
use App\Models\Destination;
use Illuminate\Support\Facades\Log;

abstract class AbstractDestinationAction
{
    protected DestinationRepositoryInterface $destinationRepository;

    public function __construct(DestinationRepositoryInterface $destinationRepository)
    {
        $this->destinationRepository = $destinationRepository;
    }

    protected function logAction(string $action, array $data = []): void
    {
        Log::info("Destination Action: {$action}", $data);
    }

    protected function validateData(array $data): array
    {
        // Basic validation - can be extended
        return $data;
    }

    protected function prepareData(array $data): array
    {
        // Data preparation logic
        return $data;
    }
}
