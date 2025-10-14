<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DestinationItinerary extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'image_url',
        'status',
        'destination_id',
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
     * Get the destination that owns the itinerary.
     */
    public function destination(): BelongsTo
    {
        return $this->belongsTo(Destination::class);
    }
}