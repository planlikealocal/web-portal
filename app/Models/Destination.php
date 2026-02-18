<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Destination extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'overview_title',
        'overview',
        'status',
        'home_page',
        'state_province',
        'city',
        'home_image',
        'grid_image',
        'banner_image',
        'specialist_ids',
        'country_id',
    ];

    protected function casts(): array
    {
        return [
            'status' => 'string',
            'specialist_ids' => 'array',
            'home_page' => 'boolean',
        ];
    }

    protected $attributes = [
        'status' => 'draft',
    ];

    public function Plan(): HasMany
    {
        return $this->hasMany(Plan::class);
    }
    /**
     * Get the images for the destination.
     */
    public function images(): HasMany
    {
        return $this->hasMany(DestinationImage::class);
    }

    /**
     * Get the seasons for the destination.
     */
    public function seasons(): HasMany
    {
        return $this->hasMany(DestinationSeason::class);
    }

    /**
     * Get the activities for the destination.
     */
    public function activities(): HasMany
    {
        return $this->hasMany(DestinationActivity::class);
    }

    /**
     * Get the itineraries for the destination.
     */
    public function itineraries(): HasMany
    {
        return $this->hasMany(DestinationItinerary::class);
    }

    /**
     * Get the country for the destination.
     */
    public function country(): BelongsTo
    {
        return $this->belongsTo(Country::class);
    }

    /**
     * Get users who wishlisted this destination.
     */
    public function wishlistedByUsers(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'destination_wishlist')
                    ->withTimestamps();
    }

    /**
     * Scope for active destinations
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    /**
     * Scope for draft destinations
     */
    public function scopeDraft($query)
    {
        return $query->where('status', 'draft');
    }

    /**
     * Get the main image for the destination
     */
    public function getMainImageAttribute()
    {
        return $this->images()->where('image_type', 'banner')->first();
    }

    /**
     * Get the full location string
     */
    public function getFullLocationAttribute(): string
    {
        $parts = array_filter([$this->city, $this->state_province, $this->country]);
        return implode(', ', $parts);
    }

    /**
     * Get the specialist count for this destination
     */
    public function getSpecialistCountAttribute(): int
    {
        if (!$this->specialist_ids || !is_array($this->specialist_ids)) {
            return 0;
        }

        return count($this->specialist_ids);
    }
}
