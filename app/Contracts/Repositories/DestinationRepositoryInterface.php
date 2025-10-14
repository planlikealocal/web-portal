<?php

namespace App\Contracts\Repositories;

use App\Models\Destination;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

interface DestinationRepositoryInterface
{
    public function create(array $data): Destination;
    public function update(Destination $destination, array $data): Destination;
    public function delete(Destination $destination): bool;
    public function find(int $id): ?Destination;
    public function getAll(array $filters = []): Collection;
    public function getAllPaginated(array $filters = [], int $perPage = 15): LengthAwarePaginator;
    public function getActive(): Collection;
    public function getDraft(): Collection;
    public function search(string $query): Collection;
    public function getStatistics(): array;
    public function toggleStatus(Destination $destination): Destination;
}
