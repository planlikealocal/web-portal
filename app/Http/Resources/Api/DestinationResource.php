<?php

namespace App\Http\Resources\Api;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DestinationResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'overview_title' => $this->overview_title,
            'overview' => $this->overview,
            'status' => $this->status,
            'country' => $this->country?->name,
            'country_id' => $this->country_id,
            'state_province' => $this->state_province,
            'city' => $this->city,
            'full_location' => $this->full_location,
            'home_image' => $this->home_image,
            'grid_image' => $this->grid_image,
            'banner_image' => $this->banner_image,
            'specialist_ids' => $this->specialist_ids,
            'specialist_count' => $this->specialist_count,
            'main_image' => $this->main_image?->url,
            'images' => $this->images->map(fn($image) => [
                'id' => $image->id,
                'url' => $image->url,
                'alt_text' => $image->alt_text,
            ]),
            'activities' => $this->activities->map(fn($activity) => [
                'id' => $activity->id,
                'name' => $activity->name,
                'description' => $activity->description,
            ]),
            'seasons' => $this->seasons->map(fn($season) => [
                'id' => $season->id,
                'name' => $season->name,
                'duration' => $season->duration,
                'description' => $season->description,
                'start_month' => $season->start_month,
                'end_month' => $season->end_month,
            ]),
            'itineraries' => $this->itineraries->map(fn($itinerary) => [
                'id' => $itinerary->id,
                'day' => $itinerary->day,
                'title' => $itinerary->title,
                'description' => $itinerary->description,
            ]),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
