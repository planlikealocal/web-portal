<?php

namespace App\Http\Controllers\Api;

use App\Http\Resources\Api\DestinationResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WishlistController extends BaseApiController
{
    /**
     * List all wishlisted destinations for the authenticated user.
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $user = $request->user();

            $destinations = $user->wishlistedDestinations()
                ->with(['country', 'images', 'activities', 'seasons', 'itineraries'])
                ->where('status', 'active')
                ->orderByPivot('created_at', 'desc')
                ->get();

            return $this->success([
                'destinations' => DestinationResource::collection($destinations),
                'destination_ids' => $destinations->pluck('id')->toArray(),
            ], 'Wishlist retrieved successfully');
        } catch (\Exception $e) {
            return $this->error('Failed to retrieve wishlist');
        }
    }

    /**
     * Get only the IDs of wishlisted destinations (lightweight endpoint).
     */
    public function ids(Request $request): JsonResponse
    {
        try {
            $user = $request->user();
            $ids = $user->wishlistedDestinations()->pluck('destinations.id')->toArray();

            return $this->success([
                'destination_ids' => $ids,
            ], 'Wishlist IDs retrieved successfully');
        } catch (\Exception $e) {
            return $this->error('Failed to retrieve wishlist IDs');
        }
    }

    /**
     * Toggle a destination in the user's wishlist.
     */
    public function toggle(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'destination_id' => 'required|integer|exists:destinations,id',
            ]);

            $user = $request->user();
            $destinationId = $request->input('destination_id');

            if ($user->wishlistedDestinations()->where('destination_id', $destinationId)->exists()) {
                $user->wishlistedDestinations()->detach($destinationId);
                $added = false;
            } else {
                $user->wishlistedDestinations()->attach($destinationId);
                $added = true;
            }

            return $this->success([
                'destination_id' => $destinationId,
                'wishlisted' => $added,
            ], $added ? 'Destination added to wishlist' : 'Destination removed from wishlist');
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationError($e->errors());
        } catch (\Exception $e) {
            return $this->error('Failed to update wishlist');
        }
    }

    /**
     * Remove a destination from the wishlist.
     */
    public function remove(Request $request, $destinationId): JsonResponse
    {
        try {
            $user = $request->user();
            $user->wishlistedDestinations()->detach($destinationId);

            return $this->success([
                'destination_id' => (int) $destinationId,
                'wishlisted' => false,
            ], 'Destination removed from wishlist');
        } catch (\Exception $e) {
            return $this->error('Failed to remove from wishlist');
        }
    }
}
