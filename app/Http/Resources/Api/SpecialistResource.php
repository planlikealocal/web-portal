<?php

namespace App\Http\Resources\Api;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class SpecialistResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        // Handle profile_pic URL - if it's already a full URL (like from seeders), use it as-is
        // Otherwise, convert storage path to full absolute URL for mobile app
        $profilePicUrl = null;
        if ($this->profile_pic) {
            if (filter_var($this->profile_pic, FILTER_VALIDATE_URL)) {
                // Already a full URL (e.g., from seeders)
                $profilePicUrl = $this->profile_pic;
            } else {
                // Storage path - convert to full absolute URL for mobile app
                // Storage::url() returns path like '/storage/specialists/image.jpg'
                // Use config('app.url') to ensure we get the correct base URL
                $baseUrl = rtrim(config('app.url'), '/');
                $storagePath = Storage::url($this->profile_pic);
                $profilePicUrl = $baseUrl . $storagePath;
                
                // Log for debugging (remove in production if not needed)
                \Log::debug('Specialist profile_pic URL generated', [
                    'specialist_id' => $this->id,
                    'original_path' => $this->profile_pic,
                    'storage_path' => $storagePath,
                    'base_url' => $baseUrl,
                    'final_url' => $profilePicUrl,
                ]);
            }
        }

        return [
            'id' => $this->id,
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'full_name' => $this->full_name,
            'email' => $this->email,
            'profile_pic' => $profilePicUrl,
            'bio' => $this->bio,
            'country_id' => $this->country_id,
            'country' => $this->country ? [
                'id' => $this->country->id,
                'name' => $this->country->name,
                'code' => $this->country->code,
            ] : null,
        ];
    }
}
