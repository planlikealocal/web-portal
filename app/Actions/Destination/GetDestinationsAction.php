<?php

namespace App\Actions\Destination;

use App\Models\Destination;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class GetDestinationsAction extends AbstractDestinationAction
{
    public function execute(array $filters = []): Collection
    {
        $this->logAction('get_destinations', $filters);

        return $this->destinationRepository->getAll($filters);
    }

    public function executePaginated(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $this->logAction('get_destinations_paginated', array_merge($filters, ['per_page' => $perPage]));

        return $this->destinationRepository->getAllPaginated($filters, $perPage);
    }
}
