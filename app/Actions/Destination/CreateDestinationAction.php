<?php

namespace App\Actions\Destination;

use App\Models\Destination;

class CreateDestinationAction extends AbstractDestinationAction
{
    public function execute(...$args): Destination
    {
        $data = $args[0];
        $this->logAction('create_destination', ['name' => $data['name'] ?? 'unknown']);

        // Validate data
        $validatedData = $this->validateData($data);

        // Prepare data
        $preparedData = $this->prepareData($validatedData);

        // Create destination
        $destination = $this->destinationRepository->create($preparedData);

        $this->logAction('destination_created', ['id' => $destination->id]);

        return $destination;
    }
}
