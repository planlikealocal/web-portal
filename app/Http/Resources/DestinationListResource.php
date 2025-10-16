<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DestinationListResource extends JsonResource
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
            'state_province' => $this->state_province,
            'city' => $this->city,
            'full_location' => $this->full_location,
            'home_image' => $this->home_image,
            'grid_image' => $this->grid_image,
            'specialist_ids' => $this->specialist_ids,
            'main_image' => $this->main_image?->url,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
