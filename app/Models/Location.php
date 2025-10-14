<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Location extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'country',
        'state_province',
        'city',
    ];

    /**
     * Get the destinations for the location.
     */
    public function destinations(): HasMany
    {
        return $this->hasMany(Destination::class);
    }
}