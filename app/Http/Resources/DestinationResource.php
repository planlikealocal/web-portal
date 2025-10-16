<?php

namespace App\Http\Resources;

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
            'country' => $this->country,
            'country_id' => $this->country?->id,
            'state_province' => $this->state_province,
            'city' => $this->city,
            'full_location' => $this->full_location,
            'home_image' => $this->home_image,
            'grid_image' => $this->grid_image,
            'banner_image' => $this->banner_image,
            'specialist_ids' => $this->specialist_ids,
            'images' => $this->whenLoaded('images', function () {
                return $this->images->map(function ($image) {
                    return [
                        'id' => $image->id,
                        'name' => $image->name,
                        'description' => $image->description,
                        'image_type' => $image->image_type,
                        'url' => $image->url,
                    ];
                });
            }),
            'seasons' => $this->whenLoaded('seasons', function () {
                return $this->seasons->map(function ($season) {
                    return [
                        'id' => $season->id,
                        'name' => $season->name,
                        'duration' => $season->duration,
                        'description' => $season->description,
                        'status' => $season->status,
                    ];
                });
            }),
            'activities' => $this->whenLoaded('activities', function () {
                return $this->activities->map(function ($activity) {
                    return [
                        'id' => $activity->id,
                        'name' => $activity->name,
                        'image_url' => $activity->image_url,
                    ];
                });
            }),
            'itineraries' => $this->whenLoaded('itineraries', function () {
                return $this->itineraries->map(function ($itinerary) {
                    return [
                        'id' => $itinerary->id,
                        'title' => $itinerary->title,
                        'description' => $itinerary->description,
                        'image_url' => $itinerary->image_url,
                        'status' => $itinerary->status,
                    ];
                });
            }),
            'main_image' => $this->main_image?->url,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
