<?php

namespace App\Actions\Specialist;

use App\Actions\AbstractSpecialistAction;
use Illuminate\Database\Eloquent\Collection;

class GetSpecialistsAction extends AbstractSpecialistAction
{
    public function execute(...$args): Collection
    {
        $filters = $args[0] ?? [];
        $this->logAction('get_specialists', $filters);

        return $this->specialistRepository->getAll($filters);
    }

    public function executePaginated(array $filters = [], int $perPage = 15): \Illuminate\Pagination\LengthAwarePaginator
    {
        $this->logAction('get_specialists_paginated', array_merge($filters, ['per_page' => $perPage]));

        return $this->specialistRepository->getAllPaginated($filters, $perPage);
    }
}
