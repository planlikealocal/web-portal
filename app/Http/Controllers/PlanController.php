<?php

namespace App\Http\Controllers;

use App\Models\Plan;
use App\Models\Specialist;
use App\Models\Destination;
use App\Models\User;
use App\Services\GoogleCalendarService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Log;

class PlanController extends Controller
{
    protected $googleCalendarService;

    public function __construct(GoogleCalendarService $googleCalendarService)
    {
        $this->googleCalendarService = $googleCalendarService;
    }
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
            $destinationResource = new \App\Http\Resources\DestinationResource($destination);
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
                'destination_data' => $destinationData, // This is the destination object with activities and specialists
                'travel_dates' => $plan->travel_dates,
                'travelers' => $plan->travelers,
                'interests' => $plan->interests ?? [],
                'other_interests' => $plan->other_interests,
                'plan_type' => $plan->plan_type ?? null,
                'selected_plan' => $plan->selected_plan ?? $plan->plan_type ?? null,
                'status' => $plan->status,
                'specialist' => $plan->specialist ? [
                    'id' => $plan->specialist->id,
                    'full_name' => $plan->specialist->full_name,
                    'avatar_url' => $plan->specialist->profile_pic ? asset('storage/' . $plan->specialist->profile_pic) : null,
                    'bio' => $plan->specialist->bio,
                ] : null,
                'activities' => $activities,
            ],
            'destinations' => $allDestinations,
        ]);
    }

    /**
     * Update plan data (for stepper steps)
     */
    public function update(Request $request, $id)
    {
        try {
            $plan = Plan::findOrFail($id);

            $validated = $request->validate([
                'first_name' => 'nullable|string|max:255',
                'last_name' => 'nullable|string|max:255',
                'email' => 'nullable|email|max:255',
                'phone' => 'nullable|string|max:255',
                'destination' => 'nullable|string|max:255',
                'destination_id' => 'nullable|exists:destinations,id',
                'travel_dates' => 'nullable|string|max:255',
                'travelers' => 'nullable|string|max:255',
                'interests' => 'nullable|array',
                'other_interests' => 'nullable|string',
                'plan_type' => 'nullable|string|max:255',
                'selected_plan' => 'nullable|string|max:255',
                'status' => 'nullable|in:draft,in_progress,completed',
            ]);

            // Filter out plan_type and selected_plan if they're empty to avoid errors if columns don't exist yet
            $updateData = [];
            foreach ($validated as $key => $value) {
                // Skip plan_type and selected_plan if they're empty or if columns don't exist
                if (in_array($key, ['plan_type', 'selected_plan'])) {
                    // Only include if not empty AND if the column exists in the database
                    if (!empty($value)) {
                        try {
                            // Check if column exists by trying to access it
                            $columnExists = Schema::hasColumn('plans', $key);
                            if ($columnExists) {
                                $updateData[$key] = $value;
                            }
                        } catch (\Exception $e) {
                            // If we can't check, skip it to be safe
                            \Log::info("Skipping column {$key} - column check failed: " . $e->getMessage());
                            continue;
                        }
                    }
                } else {
                    $updateData[$key] = $value;
                }
            }

            \Log::info('Updating plan', ['plan_id' => $plan->id, 'data' => $updateData]);
            $plan->update($updateData);
            \Log::info('Plan updated successfully', ['plan_id' => $plan->id]);

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
        } catch (\Illuminate\Validation\ValidationException $e) {
            \Log::error('Validation error updating plan', ['errors' => $e->errors()]);
            if ($request->header('X-Inertia')) {
                return back()->withErrors($e->errors());
            }
            throw $e;
        } catch (\Exception $e) {
            \Log::error('Error updating plan', ['error' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
            if ($request->header('X-Inertia')) {
                return back()->withErrors(['error' => 'An error occurred while updating the plan.']);
            }
            throw $e;
        }
    }

    /**
     * Get availability for a plan
     */
    public function getAvailability($id)
    {
        try {
            $plan = Plan::with(['specialist.workingHours'])->findOrFail($id);

            if (!$plan->specialist_id) {
                return response()->json(['error' => 'Plan does not have a specialist'], 400);
            }

            $specialist = $plan->specialist;
            if (!$specialist) {
                return response()->json(['error' => 'Specialist not found'], 404);
            }

            // Get User model for the specialist (linked by email)
            $user = User::where('email', $specialist->email)->first();
            if (!$user) {
                return response()->json(['error' => 'User not found for specialist'], 404);
            }

            if (!$user->google_access_token) {
                return response()->json(['error' => 'Specialist Google Calendar not connected'], 400);
            }

            // Get plan duration based on selected plan
            $planType = $plan->selected_plan ?? $plan->plan_type ?? 'pathfinder';
            $durationMap = [
                'explore' => 60,
                'pathfinder' => 80,
                'premium' => 105,
            ];
            $durationMinutes = $durationMap[$planType] ?? 80;

            // Get working hours
            $workingHours = $specialist->workingHours->map(function ($wh) {
                return [
                    'start_time' => substr($wh->start_time, 0, 5), // Format as HH:MM
                    'end_time' => substr($wh->end_time, 0, 5), // Format as HH:MM
                ];
            })->toArray();

            if (empty($workingHours)) {
                return response()->json(['error' => 'Specialist has no working hours configured'], 400);
            }

            // Get specialist timezone (default to UTC for now, can be enhanced later)
            $timezone = 'UTC'; // TODO: Get from specialist's country or profile

            // Set user for Google Calendar service
            $this->googleCalendarService->setUser($user);

            // Calculate availability
            $availability = $this->googleCalendarService->calculateAvailability(
                $workingHours,
                $durationMinutes,
                $timezone
            );

            return response()->json([
                'success' => true,
                'plan_id' => $plan->id,
                'specialist_id' => $specialist->id,
                'plan_type' => $planType,
                'duration_minutes' => $durationMinutes,
                'working_hours' => $workingHours,
                'timezone' => $timezone,
                'availability' => $availability,
            ]);

        } catch (\Exception $e) {
            Log::error('Get plan availability error: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to get availability'], 500);
        }
    }
}
