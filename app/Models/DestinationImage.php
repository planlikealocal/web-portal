<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DestinationImage extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'image_type',
        'url',
        'destination_id',
    ];

    /**
     * Get the destination that owns the image.
     */
    public function destination(): BelongsTo
    {
        return $this->belongsTo(Destination::class);
    }
}