<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DestinationSeason extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'duration',
        'description',
        'status',
        'destination_id',
    ];

    protected function casts(): array
    {
        return [
            'status' => 'boolean',
        ];
    }

    protected $attributes = [
        'status' => true,
    ];

    /**
     * Get the destination that owns the season.
     */
    public function destination(): BelongsTo
    {
        return $this->belongsTo(Destination::class);
    }
}