<?php

namespace App\Repositories;

use App\Contracts\Repositories\SpecialistRepositoryInterface;
use App\Models\Specialist;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class SpecialistRepository implements SpecialistRepositoryInterface
{
    public function create(array $data): Specialist
    {
        return Specialist::create($data);
    }

    public function update(Specialist $specialist, array $data): Specialist
    {
        $specialist->update($data);
        return $specialist->fresh();
    }

    public function delete(Specialist $specialist): bool
    {
        return $specialist->delete();
    }

    public function find(int $id): ?Specialist
    {
        return Specialist::find($id);
    }

    public function findByEmail(string $email): ?Specialist
    {
        return Specialist::where('email', $email)->first();
    }

    public function getAll(array $filters = []): Collection
    {
        $query = Specialist::query();

        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (isset($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('contact_no', 'like', "%{$search}%");
            });
        }

        return $query->orderBy('created_at', 'desc')->get();
    }

    public function getAllPaginated(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = Specialist::query();

        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (isset($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('contact_no', 'like', "%{$search}%");
            });
        }

        return $query->orderBy('created_at', 'desc')->paginate($perPage);
    }

    public function getActive(): Collection
    {
        return Specialist::active()->get();
    }

    public function getInactive(): Collection
    {
        return Specialist::inactive()->get();
    }

    public function search(string $query): Collection
    {
        return Specialist::where(function ($q) use ($query) {
            $q->where('first_name', 'like', "%{$query}%")
              ->orWhere('last_name', 'like', "%{$query}%")
              ->orWhere('email', 'like', "%{$query}%")
              ->orWhere('contact_no', 'like', "%{$query}%");
        })->get();
    }

    public function getStatistics(): array
    {
        return [
            'total' => Specialist::count(),
            'active' => Specialist::active()->count(),
            'inactive' => Specialist::inactive()->count(),
            'total_trips' => Specialist::sum('no_of_trips'),
        ];
    }

    public function incrementTripCount(Specialist $specialist): Specialist
    {
        $specialist->increment('no_of_trips');
        return $specialist->fresh();
    }

    public function toggleStatus(Specialist $specialist): Specialist
    {
        $specialist->update([
            'status' => $specialist->status === 'active' ? 'inactive' : 'active'
        ]);
        return $specialist->fresh();
    }
}
