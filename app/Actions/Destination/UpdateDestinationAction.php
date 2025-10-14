<?php

namespace App\Actions\Destination;

use App\Models\Destination;

class UpdateDestinationAction extends AbstractDestinationAction
{
    public function execute(Destination $destination, ...$args): Destination
    {
        $data = $args[0];
        $this->logAction('update_destination', ['id' => $destination->id]);

        // Validate data
        $validatedData = $this->validateData($data);

        // Prepare data
        $preparedData = $this->prepareData($validatedData);

        // Update destination
        $destination = $this->destinationRepository->update($destination, $preparedData);

        $this->logAction('destination_updated', ['id' => $destination->id]);

        return $destination;
    }
}
