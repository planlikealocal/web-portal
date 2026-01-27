<?php

namespace App\Http\Resources\Api;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => (string) $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'account_type' => $this->account_type ?? 'Standard',
            'avatar_url' => $this->getFullImageUrl($this->avatar_url ?? $this->profile_image),
            'profile_image' => $this->getFullImageUrl($this->profile_image ?? $this->avatar_url),
            'role' => $this->role,
            'date_of_birth' => $this->date_of_birth?->format('Y-m-d'),
            'country_id' => $this->country_id,
            'email_verified_at' => $this->email_verified_at?->toIso8601String(),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }

    /**
     * Convert relative image URL to full URL
     *
     * @param string|null $url
     * @return string|null
     */
    private function getFullImageUrl(?string $url): ?string
    {
        if (!$url) {
            return null;
        }

        // If already a full URL (starts with http:// or https://), return as is
        if (preg_match('/^https?:\/\//', $url)) {
            return $url;
        }

        // If it's a relative path starting with /storage/, convert to full URL
        if (str_starts_with($url, '/storage/')) {
            return rtrim(config('app.url'), '/') . $url;
        }

        // If it's a storage path without leading slash, add /storage/ prefix
        if (!str_starts_with($url, '/')) {
            return rtrim(config('app.url'), '/') . '/storage/' . ltrim($url, '/');
        }

        // For any other relative path, prepend app URL
        return rtrim(config('app.url'), '/') . '/' . ltrim($url, '/');
    }
}
