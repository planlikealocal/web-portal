<?php

namespace App\Http\Controllers;

use App\Models\Plan;
use App\Models\Specialist;
use App\Models\Destination;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Validator;

class PlanController extends Controller
{
    /**
     * Create a new empty plan with specialist
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'specialist_id' => 'required|exists:specialists,id',
            'destination_id' => 'nullable|exists:destinations,id',
        ]);

        $plan = Plan::create([
            'specialist_id' => $validated['specialist_id'],
            'destination_id' => $validated['destination_id'] ?? null,
            'status' => 'draft',
        ]);

        return redirect()->route('plans.show', $plan->id);
    }

    /**
     * Show the plan creation stepper
     */
    public function show($id)
    {
        $plan = Plan::with(['specialist', 'destination.activities'])->findOrFail($id);

        // Get active activities from the destination
        // Note: We access the relationship via getRelation() because there's also a 'destination' attribute
        $activities = [];
        if ($plan->relationLoaded('destination') && $plan->getRelation('destination')) {
            $destination = $plan->getRelation('destination');
            if ($destination && $destination->relationLoaded('activities') && $destination->activities) {
                $activities = $destination->activities
                    ->where('status', 'active')
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

        // Get destination data if loaded
        $destinationData = null;
        if ($plan->relationLoaded('destination') && $plan->getRelation('destination')) {
            $destination = $plan->getRelation('destination');
            $destinationData = [
                'id' => $destination->id,
                'name' => $destination->name,
                'activities' => $activities, // Include activities in destination object as well
            ];
        }

        return Inertia::render('Web/Plan/PlanStepper', [
            'plan' => [
                'id' => $plan->id,
                'specialist_id' => $plan->specialist_id,
                'destination_id' => $plan->destination_id,
                'first_name' => $plan->first_name,
                'last_name' => $plan->last_name,
                'email' => $plan->email,
                'phone' => $plan->phone,
                'destination' => $plan->destination, // This is the string field (destination name)
                'destination_data' => $destinationData, // This is the destination object with activities
                'travel_dates' => $plan->travel_dates,
                'travelers' => $plan->travelers,
                'interests' => $plan->interests ?? [],
                'other_interests' => $plan->other_interests,
                'status' => $plan->status,
                'specialist' => $plan->specialist ? [
                    'id' => $plan->specialist->id,
                    'full_name' => $plan->specialist->full_name,
                    'avatar_url' => $plan->specialist->profile_pic ? asset('storage/' . $plan->specialist->profile_pic) : null,
                    'bio' => $plan->specialist->bio,
                ] : null,
                'activities' => $activities,
            ],
        ]);
    }

    /**
     * Update plan data (for stepper steps)
     */
    public function update(Request $request, $id)
    {
        $plan = Plan::findOrFail($id);

        $validated = $request->validate([
            'first_name' => 'nullable|string|max:255',
            'last_name' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:255',
            'destination' => 'nullable|string|max:255',
            'travel_dates' => 'nullable|string|max:255',
            'travelers' => 'nullable|string|max:255',
            'interests' => 'nullable|array',
            'other_interests' => 'nullable|string',
            'status' => 'nullable|in:draft,in_progress,completed',
        ]);

        $plan->update($validated);

        // If Inertia request, return back with success
        if ($request->header('X-Inertia')) {
            return back()->with('success', 'Plan updated successfully');
        }

        // Otherwise return JSON for API calls
        return response()->json([
            'success' => true,
            'plan' => [
                'id' => $plan->id,
                'status' => $plan->status,
            ],
        ]);
    }
}
