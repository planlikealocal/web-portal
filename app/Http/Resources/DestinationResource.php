<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Models\Specialist;
use Illuminate\Support\Facades\Storage;

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
            'specialists' => $this->when($this->specialist_ids, function () {
                $ids = is_array($this->specialist_ids) ? $this->specialist_ids : [];
                if (empty($ids)) {
                    return [];
                }
                $specialists = Specialist::with('country')->whereIn('id', $ids)->active()->get();
                return $specialists->map(function ($s) {
                    return [
                        'id' => $s->id,
                        'full_name' => $s->full_name,
                        'avatar_url' => $s->profile_pic ? Storage::url($s->profile_pic) : null,
                        'bio' => $s->bio,
                        'location' => trim(implode(', ', array_filter([$s->city, $s->state_province, optional($s->country)->name]))),
                    ];
                });
            }),
            'images' => $this->whenLoaded('images', function () {
                return $this->images->map(function ($image) {
                    if ($image->image_type === 'gallery') {
                        return [
                            'id' => $image->id,
                            'name' => $image->name,
                            'description' => $image->description,
                            'image_type' => $image->image_type,
                            'url' => $image->url,
                        ];
                    }
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
                        'description' => $activity->description,
                        'image_url' => $activity->image_url,
                        'status' => $activity->status,
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
