<?php

namespace App\Actions\Plan;

use App\Models\Plan;
use App\Models\Destination;
use App\Http\Resources\DestinationResource;

class GetPlanDataAction extends AbstractPlanAction
{
    public function execute(...$args): array
    {
        $plan = $args[0];
        $paymentStatus = $args[1] ?? null;

        // Get active activities from the destination
        $activities = [];
        if ($plan->relationLoaded('destination') && $plan->getRelation('destination')) {
            $destination = $plan->getRelation('destination');
            if ($destination && $destination->relationLoaded('activities') && $destination->activities) {
                $activities = $destination->activities
                    ->where('status', true)
                    ->map(function ($activity) {
                        return [
                            'id' => $activity->id,
                            'name' => $activity->name,
                            'description' => $activity->description,
                        ];
                    })
                    ->values()
                    ->toArray();
            }
        }

        // Get destination data with specialists if loaded
        $destinationData = null;
        if ($plan->relationLoaded('destination') && $plan->getRelation('destination')) {
            $destination = $plan->getRelation('destination');
            $destinationResource = new DestinationResource($destination);
            $destinationData = $destinationResource->toArray(request());
            $destinationData['activities'] = $activities; // Include activities in destination object as well
        }

        // Get all active destinations for autocomplete
        $allDestinations = Destination::active()
            ->orderBy('name')
            ->get(['id', 'name'])
            ->map(function ($destination) {
                return [
                    'id' => $destination->id,
                    'name' => $destination->name,
                ];
            })
            ->toArray();

        // Determine if we should show success page
        $showSuccessPage = false;
        if ($paymentStatus === 'success' && $plan->payment_status === 'paid') {
            $showSuccessPage = true;
        }

        return [
            'plan' => [
                'id' => $plan->id,
                'specialist_id' => $plan->specialist_id,
                'destination_id' => $plan->destination_id,
                'first_name' => $plan->first_name,
                'last_name' => $plan->last_name,
                'email' => $plan->email,
                'phone' => $plan->phone,
                'destination' => $plan->destination, // This is the string field (destination name)
                'destination_data' => $destinationData, // This is the destination object with activities and specialists
                'travel_dates' => $plan->travel_dates,
                'travelers' => $plan->travelers,
                'interests' => $plan->interests ?? [],
                'other_interests' => $plan->other_interests,
                'plan_type' => $plan->plan_type ?? null,
                'selected_plan' => $plan->selected_plan ?? $plan->plan_type ?? null,
                'status' => $plan->status,
                'payment_status' => $plan->payment_status ?? 'pending',
                'appointment_start' => $plan->appointment_start,
                'appointment_end' => $plan->appointment_end,
                'plan_prices' => config('plans.prices'),
                'specialist' => $plan->specialist ? [
                    'id' => $plan->specialist->id,
                    'full_name' => $plan->specialist->full_name,
                    'avatar_url' => $plan->specialist->profile_pic ? asset('storage/' . $plan->specialist->profile_pic) : null,
                    'profile_pic_url' => $plan->specialist->profile_pic ? asset('storage/' . $plan->specialist->profile_pic) : null,
                    'bio' => $plan->specialist->bio,
                    'country' => $plan->specialist->country ? $plan->specialist->country->name : null,
                    'state_province' => $plan->specialist->state_province,
                    'city' => $plan->specialist->city,
                    'location' => trim(implode(', ', array_filter([
                        $plan->specialist->city,
                        $plan->specialist->state_province,
                        $plan->specialist->country ? $plan->specialist->country->name : null
                    ]))),
                ] : null,
                'activities' => $activities,
            ],
            'destinations' => $allDestinations,
            'showSuccessPage' => $showSuccessPage,
        ];
    }
}

