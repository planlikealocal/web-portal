<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class WhoWeAre extends Model
{
    use HasFactory;

    protected $table = 'who_we_are';

    protected $fillable = [
        'name',
        'designation',
        'description',
        'picture',
        'order',
    ];

    protected $casts = [
        'order' => 'integer',
    ];

    /**
     * Get the picture URL attribute
     */
    public function getPictureUrlAttribute(): ?string
    {
        return $this->picture ? asset('storage/' . $this->picture) : null;
    }
}
