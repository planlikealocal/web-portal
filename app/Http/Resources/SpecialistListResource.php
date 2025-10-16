<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class SpecialistListResource extends JsonResource
{
    static $wrap = false;
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'full_name' => $this->full_name,
            'email' => $this->email,
            'profile_pic_url' => $this->profile_pic ? Storage::url($this->profile_pic) : null,
            'bio' => $this->bio,
            'contact_no' => $this->contact_no,
            'country_id' => $this->country_id,
            'country' => $this->country?->name,
            'state_province' => $this->state_province,
            'city' => $this->city,
            'address' => $this->address,
            'postal_code' => $this->postal_code,
            'status' => $this->status,
            'no_of_trips' => $this->no_of_trips,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}


