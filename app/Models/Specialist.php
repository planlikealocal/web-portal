<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Specialist extends Model
{
    use HasFactory;

    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'profile_pic',
        'bio',
        'contact_no',
        'country_id',
        'state_province',
        'city',
        'address',
        'postal_code',
        'status',
        'no_of_trips',
    ];

    protected function casts(): array
    {
        return [
            'no_of_trips' => 'integer',
        ];
    }

    protected $attributes = [
        'no_of_trips' => 0,
    ];

    /**
     * Get the full name attribute
     */
    public function getFullNameAttribute(): string
    {
        return $this->first_name . ' ' . $this->last_name;
    }

    /**
     * Scope for active specialists
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    /**
     * Get the country for the specialist.
     */
    public function country(): BelongsTo
    {
        return $this->belongsTo(Country::class);
    }

    /**
     * Scope for inactive specialists
     */
    public function scopeInactive($query)
    {
        return $query->where('status', 'inactive');
    }
}
