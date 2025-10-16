<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Country extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'code',
        'flag_url',
    ];

    protected function casts(): array
    {
        return [
            // No special casting needed for simplified model
        ];
    }

    /**
     * Get the specialists for the country.
     */
    public function specialists(): HasMany
    {
        return $this->hasMany(Specialist::class);
    }

    /**
     * Get the destinations for the country.
     */
    public function destinations(): HasMany
    {
        return $this->hasMany(Destination::class);
    }

}