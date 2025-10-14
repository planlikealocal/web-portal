<?php

namespace App\Actions\Destination;

use App\Models\Destination;

class DeleteDestinationAction extends AbstractDestinationAction
{
    public function execute(Destination $destination): bool
    {
        $this->logAction('delete_destination', ['id' => $destination->id]);

        $result = $this->destinationRepository->delete($destination);

        $this->logAction('destination_deleted', ['id' => $destination->id]);

        return $result;
    }
}
