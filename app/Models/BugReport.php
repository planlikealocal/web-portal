<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BugReport extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'issue_type',
        'title',
        'description',
        'screenshot',
        'status',
        'admin_notes',
    ];

    protected $attributes = [
        'status' => 'new',
    ];

    /**
     * Get the user that submitted the bug report.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
