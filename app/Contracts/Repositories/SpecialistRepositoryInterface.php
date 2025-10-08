<?php

namespace App\Contracts\Repositories;

use App\Models\Specialist;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

interface SpecialistRepositoryInterface
{
    public function create(array $data): Specialist;
    public function update(Specialist $specialist, array $data): Specialist;
    public function delete(Specialist $specialist): bool;
    public function find(int $id): ?Specialist;
    public function findByEmail(string $email): ?Specialist;
    public function getAll(array $filters = []): Collection;
    public function getAllPaginated(array $filters = [], int $perPage = 15): LengthAwarePaginator;
    public function getActive(): Collection;
    public function getInactive(): Collection;
    public function search(string $query): Collection;
    public function getStatistics(): array;
    public function incrementTripCount(Specialist $specialist): Specialist;
    public function toggleStatus(Specialist $specialist): Specialist;
}
