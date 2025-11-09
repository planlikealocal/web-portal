<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Plan extends Model
{
    protected $fillable = [
        'specialist_id',
        'destination_id',
        'first_name',
        'last_name',
        'email',
        'phone',
        'destination',
        'travel_dates',
        'travelers',
        'interests',
        'other_interests',
        'plan_type',
        'selected_plan',
        'status',
        'selected_time_slot',
        'appointment_start',
        'appointment_end',
        'google_calendar_event_id',
        'payment_status',
        'stripe_payment_intent_id',
        'stripe_session_id',
        'amount',
        'paid_at',
    ];

    protected function casts(): array
    {
        return [
            'interests' => 'array',
            'status' => 'string',
            'appointment_start' => 'datetime',
            'appointment_end' => 'datetime',
            'amount' => 'decimal:2',
            'paid_at' => 'datetime',
        ];
    }

    protected $attributes = [
        'status' => 'draft',
    ];

    /**
     * Get the specialist for the plan.
     */
    public function specialist(): BelongsTo
    {
        return $this->belongsTo(Specialist::class);
    }

    /**
     * Get the destination for the plan.
     */
    public function destination(): BelongsTo
    {
        return $this->belongsTo(Destination::class);
    }
}
