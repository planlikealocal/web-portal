<?php

namespace App\Repositories;

use App\Contracts\Repositories\DestinationRepositoryInterface;
use App\Models\Destination;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class DestinationRepository implements DestinationRepositoryInterface
{
    public function create(array $data): Destination
    {
        return Destination::create($data);
    }

    public function update(Destination $destination, array $data): Destination
    {
        $destination->update($data);
        return $destination->fresh();
    }

    public function delete(Destination $destination): bool
    {
        return $destination->delete();
    }

    public function find(int $id): ?Destination
    {
        return Destination::with(['images', 'seasons', 'activities', 'itineraries', 'country'])->find($id);
    }

    public function getAll(array $filters = []): Collection
    {
        $query = Destination::with(['images', 'country']);

        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (isset($filters['home_page'])) {
            $query->where('home_page', $filters['home_page']);
        }

        if (isset($filters['country_id'])) {
            $query->where('country_id', $filters['country_id']);
        }

        if (isset($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('overview_title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        return $query->orderBy('created_at', 'desc')->get();
    }

    public function getAllPaginated(array $filters = [], int $perPage = 15, int $page = 1): LengthAwarePaginator
    {
        $query = Destination::with(['images', 'country']);

        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (isset($filters['home_page'])) {
            $query->where('home_page', $filters['home_page']);
        }

        if (isset($filters['country_id'])) {
            $query->where('country_id', $filters['country_id']);
        }

        if (isset($filters['region'])) {
            // The region filter is already the state_province value from the database
            $query->where('state_province', $filters['region']);
        }

        if (isset($filters['activity'])) {
            // Filter by activity name from destination_activities table
            $query->whereHas('activities', function ($q) use ($filters) {
                $q->where('name', $filters['activity'])
                  ->where('status', true);
            });
        }

        if (isset($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('overview_title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        return $query->orderBy('created_at', 'desc')->paginate($perPage, ['*'], 'page', $page);
    }

    public function getActive(): Collection
    {
        return Destination::with(['images'])->active()->get();
    }

    public function getDraft(): Collection
    {
        return Destination::with(['images'])->draft()->get();
    }

    public function search(string $query): Collection
    {
        return Destination::with(['images'])
            ->where('name', 'like', "%{$query}%")
            ->orWhere('overview_title', 'like', "%{$query}%")
            ->orWhere('description', 'like', "%{$query}%")
            ->get();
    }

    public function getStatistics(): array
    {
        return [
            'total' => Destination::count(),
            'active' => Destination::active()->count(),
            'draft' => Destination::draft()->count(),
            'inactive' => Destination::where('status', 'inactive')->count(),
        ];
    }

    public function toggleStatus(Destination $destination): Destination
    {
        $newStatus = $destination->status === 'active' ? 'inactive' : 'active';
        $destination->update(['status' => $newStatus]);
        return $destination->fresh();
    }
}
