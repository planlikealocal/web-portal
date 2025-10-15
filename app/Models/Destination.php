<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Destination extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'overview_title',
        'overview',
        'status',
        'country',
        'state_province',
        'city',
        'home_image',
        'grid_image',
    ];

    protected function casts(): array
    {
        return [
            'status' => 'string',
        ];
    }

    protected $attributes = [
        'status' => 'draft',
    ];


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
}