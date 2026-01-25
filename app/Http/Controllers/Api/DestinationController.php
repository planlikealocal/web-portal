<?php

namespace App\Http\Controllers\Api;

use App\Actions\Destination\GetDestinationsAction;
use App\Http\Resources\Api\DestinationResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DestinationController extends BaseApiController
{
    public function __construct(
        private GetDestinationsAction $getDestinationsAction
    ) {}

    /**
     * List all destinations (paginated)
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $filters = [
                'status' => $request->get('status', 'active'),
                'country_id' => $request->get('country_id'),
                'home_page' => $request->get('home_page'),
            ];

            $perPage = $request->get('per_page', 15);
            $page = $request->get('page', 1);

            $destinations = $this->getDestinationsAction->executePaginated($filters, $perPage, $page);

            return $this->success([
                'destinations' => DestinationResource::collection($destinations->items()),
                'pagination' => [
                    'current_page' => $destinations->currentPage(),
                    'last_page' => $destinations->lastPage(),
                    'per_page' => $destinations->perPage(),
                    'total' => $destinations->total(),
                ],
            ], 'Destinations retrieved successfully');
        } catch (\Exception $e) {
            return $this->error('Failed to retrieve destinations: ' . $e->getMessage());
        }
    }

    /**
     * Get single destination details
     */
    public function show($id): JsonResponse
    {
        try {
            $destination = \App\Models\Destination::with([
                'country',
                'images',
                'activities',
                'seasons',
                'itineraries',
            ])->findOrFail($id);

            return $this->success([
                'destination' => new DestinationResource($destination),
            ], 'Destination retrieved successfully');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFound('Destination not found');
        } catch (\Exception $e) {
            return $this->error('Failed to retrieve destination: ' . $e->getMessage());
        }
    }

    /**
     * Get destinations by country
     */
    public function getByCountry(Request $request, $country): JsonResponse
    {
        try {
            $filters = [
                'status' => 'active',
                'country' => $country,
            ];

            $destinations = $this->getDestinationsAction->execute($filters);

            return $this->success([
                'destinations' => DestinationResource::collection($destinations),
            ], 'Destinations retrieved successfully');
        } catch (\Exception $e) {
            return $this->error('Failed to retrieve destinations: ' . $e->getMessage());
        }
    }

    /**
     * Get destinations by region
     */
    public function getByRegion(Request $request, $region): JsonResponse
    {
        try {
            $filters = [
                'status' => 'active',
                'state_province' => $region,
            ];

            $destinations = $this->getDestinationsAction->execute($filters);

            return $this->success([
                'destinations' => DestinationResource::collection($destinations),
            ], 'Destinations retrieved successfully');
        } catch (\Exception $e) {
            return $this->error('Failed to retrieve destinations: ' . $e->getMessage());
        }
    }
}
