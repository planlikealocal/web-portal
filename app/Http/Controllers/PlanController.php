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
use Carbon\Carbon;
use Stripe\Stripe;
use Stripe\Checkout\Session as StripeSession;

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
    public function show(Request $request, $id)
    {
        $plan = Plan::with(['specialist.country', 'destination.activities'])->findOrFail($id);
        
        // Check for payment success/cancel query parameters
        $paymentStatus = $request->get('payment');
        if ($paymentStatus === 'success') {
            // Refresh plan to get latest payment status
            $plan->refresh();
            if ($plan->payment_status === 'paid') {
                // Payment was successful
                session()->flash('payment_success', 'Payment completed successfully!');
            }
        } elseif ($paymentStatus === 'cancelled') {
            // Cancel appointment and delete Google Calendar event
            $this->cancelAppointment($plan);
            session()->flash('payment_cancelled', 'Payment was cancelled. Appointment has been cancelled.');
        }

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
                'selected_time_slot' => 'nullable',
                'appointment_start' => 'nullable|date',
                'appointment_end' => 'nullable|date',
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

            // If status is being set to 'completed' and appointment details are provided, create Google Calendar event
            if (isset($updateData['status']) && $updateData['status'] === 'completed') {
                // Handle selected_time_slot if it's a JSON string (from frontend)
                if (isset($updateData['selected_time_slot']) && is_string($updateData['selected_time_slot'])) {
                    $slotData = json_decode($updateData['selected_time_slot'], true);
                    if ($slotData && isset($slotData['start']) && isset($slotData['end'])) {
                        $updateData['appointment_start'] = $slotData['start'];
                        $updateData['appointment_end'] = $slotData['end'];
                    }
                }
                
                // Check if appointment details are available
                if (!empty($updateData['appointment_start']) && !empty($updateData['appointment_end'])) {
                    try {
                        // Refresh plan to get latest data
                        $plan->refresh();
                        $this->confirmAppointment($plan);
                    } catch (\Exception $e) {
                        Log::error('Failed to create Google Calendar event', [
                            'plan_id' => $plan->id,
                            'error' => $e->getMessage()
                        ]);
                        // Don't fail the request if Google Calendar event creation fails
                        // The plan is still saved, just without the calendar event
                    }
                } else {
                    Log::warning('Plan marked as completed but no appointment details provided', [
                        'plan_id' => $plan->id,
                        'update_data' => $updateData
                    ]);
                }
            }

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
    public function getAvailability(Request $request, $id)
    {
        try {
            $plan = Plan::with(['specialist.workingHours'])->findOrFail($id);

            // Get optional date parameter from request
            $selectedDate = $request->get('date');

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
            $timezone = $specialist->timezone; // TODO: Get from specialist's country or profile
            if (!$timezone) {
                return response()->json(['error' => 'Specialist has no timezone configured'], 400);
            }
            if (!$selectedDate) {
                return response()->json(['error' => 'No date selected'], 400);
            }
            if (!$workingHours) {
                return response()->json(['error' => 'Specialist has no working hours configured'], 400);
            }
            if (!$durationMinutes) {
                return response()->json(['error' => 'No duration selected'], 400);
            }
            if (!$user) {
                return response()->json(['error' => 'User not found'], 404);
            }
            if (!$user->hasGoogleCalendarConnected()) {
                return response()->json(['error' => 'Google Calendar not connected'], 400);
            }

            // Calculate availability using Google Calendar (excludes allocated times)
            $availability = [];

            if ($user->hasGoogleCalendarConnected()) {
                Log::info('Google Calendar connected for specialist', [
                    'user_id' => $user->id,
                    'selected_date' => $selectedDate,
                    'working_hours' => $workingHours,
                ]);
                // Use Google Calendar to get availability (excludes Google Calendar events)
                // Pass selected date to only check that specific date for better performance
                $this->googleCalendarService->setUser($user);
                $availability = $this->googleCalendarService->calculateAvailability(
                    $workingHours,
                    $durationMinutes,
                    $timezone,
                    $selectedDate // Only check the selected date
                );
                Log::info('Google Calendar availability', [
                    'availability_count' => count($availability),
                    'selected_date' => $selectedDate
                ]);
            } else {
                // Fallback to local calculation if Google Calendar is not connected
                $availability = $this->calculateLocalAvailability(
                    $workingHours,
                    $durationMinutes,
                    $timezone,
                    $selectedDate
                );
            }

            return response()->json([
                'success' => true,
                'plan_id' => $plan->id,
                'specialist_id' => $specialist->id,
                'plan_type' => $planType,
                'duration_minutes' => $durationMinutes,
                'working_hours' => $workingHours,
                'timezone' => $timezone,
                'selected_date' => $selectedDate,
                'availability' => $availability,
            ]);

        } catch (\Exception $e) {
            Log::error('Get plan availability error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
                'plan_id' => $id
            ]);
            return response()->json(['error' => 'Failed to get availability'], 500);
        }
    }

    /**
     * Calculate availability locally based on working hours only (for testing without Google Calendar)
     *
     * @param array $workingHours Array of ['start_time' => 'HH:MM', 'end_time' => 'HH:MM']
     * @param int $durationMinutes Duration in minutes (60, 80, or 105)
     * @param string $timezone Timezone for the specialist
     * @param string|null $selectedDate Optional date filter (YYYY-MM-DD format)
     * @return array Array of available time slots
     */
    private function calculateLocalAvailability(array $workingHours, int $durationMinutes, string $timezone = 'UTC', ?string $selectedDate = null): array
    {
        try {
            // Get today in specialist's timezone
            $today = Carbon::now($timezone)->startOfDay();
            $tomorrow = $today->copy()->addDay();
            $dayAfterTomorrow = $tomorrow->copy()->addDay();

            $availabilityArray = [];

            // If a specific date is provided, only calculate for that date
            if ($selectedDate) {
                try {
                    $targetDate = Carbon::createFromFormat('Y-m-d', $selectedDate, $timezone)->startOfDay();
                    // Ensure the date is at least day after tomorrow
                    if ($targetDate->lt($dayAfterTomorrow)) {
                        return []; // Date is too soon
                    }
                    $datesToProcess = [$targetDate];
                } catch (\Exception $e) {
                    Log::error('Invalid date format provided: ' . $selectedDate);
                    return [];
                }
            } else {
                // Default: Process each day from day after tomorrow to t + 14 days
                $endDate = $today->copy()->addDays(14);
                $datesToProcess = [];
                $currentDate = $dayAfterTomorrow->copy();
                while ($currentDate->lte($endDate)) {
                    $datesToProcess[] = $currentDate->copy();
                    $currentDate->addDay();
                }
            }

            // Process each date
            foreach ($datesToProcess as $currentDate) {
                // Get working hours for this day (assuming same hours every day, could be enhanced later)
                foreach ($workingHours as $wh) {
                    // Parse working hours - handle both 'H:i:s' and 'H:i' formats
                    $startTimeStr = $wh['start_time'];
                    $endTimeStr = $wh['end_time'];

                    // Ensure format is H:i:s
                    if (strlen($startTimeStr) === 5) {
                        $startTimeStr .= ':00';
                    }
                    if (strlen($endTimeStr) === 5) {
                        $endTimeStr .= ':00';
                    }

                    $startTime = Carbon::createFromFormat('H:i:s', $startTimeStr, $timezone)
                        ->setDate($currentDate->year, $currentDate->month, $currentDate->day);
                    $endTime = Carbon::createFromFormat('H:i:s', $endTimeStr, $timezone)
                        ->setDate($currentDate->year, $currentDate->month, $currentDate->day);

                    // If end_time is earlier than start_time, it means it spans midnight - adjust
                    if ($endTime->lt($startTime)) {
                        $endTime->addDay();
                    }

                    // Generate slots starting at the top of every hour within working hours
                    // Start from the first hour that's >= startTime
                    $slotStart = $startTime->copy()->startOfHour();
                    if ($slotStart->lt($startTime)) {
                        $slotStart->addHour();
                    }

                    // Continue until we can't fit a full duration slot
                    while ($slotStart->copy()->addMinutes($durationMinutes)->lte($endTime)) {
                        $slotEnd = $slotStart->copy()->addMinutes($durationMinutes);

                        // Check if slot fits within working hours
                        if ($slotStart->gte($startTime) && $slotEnd->lte($endTime)) {
                            // For local testing, all slots within working hours are available
                            // (no Google Calendar conflict checking)
                            $availabilityArray[] = [
                                'start' => $slotStart->toISOString(),
                                'end' => $slotEnd->toISOString(),
                                'date' => $slotStart->toDateString(),
                                'time' => $slotStart->format('H:i'),
                                'time_end' => $slotEnd->format('H:i'),
                                'duration_minutes' => $durationMinutes,
                            ];
                        }

                        // Move to next hour
                        $slotStart->addHour();
                    }
                }
            }

            return $availabilityArray;
        } catch (\Exception $e) {
            Log::error('Local availability calculation error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);
            return [];
        }
    }

    /**
     * Confirm appointment and create Google Calendar event
     */
    private function confirmAppointment(Plan $plan)
    {
        try {
            // Get specialist
            $specialist = $plan->specialist;
            if (!$specialist) {
                throw new \Exception('Specialist not found for plan');
            }

            // Get User model for the specialist
            $user = User::where('email', $specialist->email)->first();
            if (!$user) {
                throw new \Exception('User not found for specialist');
            }

            // Check if Google Calendar is connected
            if (!$user->hasGoogleCalendarConnected()) {
                throw new \Exception('Specialist Google Calendar not connected');
            }

            // Check if appointment details are available
            if (!$plan->appointment_start || !$plan->appointment_end) {
                throw new \Exception('Appointment start and end times are required');
            }

            // Calculate duration in minutes
            $startTime = Carbon::parse($plan->appointment_start);
            $endTime = Carbon::parse($plan->appointment_end);
            $durationMinutes = $startTime->diffInMinutes($endTime);

            // Prepare event data
            $eventData = [
                'start_time' => $plan->appointment_start,
                'duration' => $durationMinutes,
                'client_name' => trim(($plan->first_name ?? '') . ' ' . ($plan->last_name ?? '')),
                'client_email' => $plan->email ?? '',
                'client_phone' => $plan->phone ?? '',
                'notes' => $this->buildAppointmentNotes($plan),
            ];

            // Create Google Calendar event
            $this->googleCalendarService->setUser($user);
            $event = $this->googleCalendarService->createEvent($eventData);

            // Update plan with Google Calendar event ID
            $plan->update([
                'google_calendar_event_id' => $event['id'],
            ]);

            Log::info('Appointment confirmed and Google Calendar event created', [
                'plan_id' => $plan->id,
                'event_id' => $event['id'],
                'specialist_id' => $specialist->id,
            ]);

            return $event;

        } catch (\Exception $e) {
            Log::error('Failed to confirm appointment', [
                'plan_id' => $plan->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            throw $e;
        }
    }

    /**
     * Build appointment notes from plan data
     */
    private function buildAppointmentNotes(Plan $plan): string
    {
        $notes = [];

        if ($plan->destination) {
            $notes[] = "Destination: {$plan->destination}";
        }

        if ($plan->travel_dates) {
            $notes[] = "Travel Dates: {$plan->travel_dates}";
        }

        if ($plan->travelers) {
            $notes[] = "Travelers: {$plan->travelers}";
        }

        if ($plan->interests && is_array($plan->interests) && count($plan->interests) > 0) {
            $notes[] = "Interests: " . implode(', ', $plan->interests);
        }

        if ($plan->other_interests) {
            $notes[] = "Other Interests: {$plan->other_interests}";
        }

        if ($plan->selected_plan || $plan->plan_type) {
            $planType = $plan->selected_plan ?? $plan->plan_type;
            $notes[] = "Plan Type: " . ucfirst($planType);
        }

        return implode("\n", $notes);
    }

    /**
     * Cancel appointment and delete Google Calendar event
     */
    private function cancelAppointment(Plan $plan)
    {
        try {
            // Check if appointment is confirmed
            if ($plan->status !== 'completed') {
                Log::info('Appointment not confirmed, skipping cancellation', [
                    'plan_id' => $plan->id,
                    'status' => $plan->status,
                ]);
                return;
            }

            // Delete Google Calendar event if it exists
            if ($plan->google_calendar_event_id) {
                try {
                    // Get specialist
                    $specialist = $plan->specialist;
                    if ($specialist) {
                        // Get User model for the specialist
                        $user = User::where('email', $specialist->email)->first();
                        if ($user && $user->hasGoogleCalendarConnected()) {
                            // Delete Google Calendar event
                            $this->googleCalendarService->setUser($user);
                            $this->googleCalendarService->deleteEvent($plan->google_calendar_event_id);

                            Log::info('Google Calendar event deleted on appointment cancellation', [
                                'plan_id' => $plan->id,
                                'event_id' => $plan->google_calendar_event_id,
                            ]);
                        }
                    }
                } catch (\Exception $e) {
                    Log::error('Failed to delete Google Calendar event on cancellation', [
                        'plan_id' => $plan->id,
                        'event_id' => $plan->google_calendar_event_id,
                        'error' => $e->getMessage(),
                    ]);
                    // Continue with cancellation even if event deletion fails
                }
            }

            // Update plan status back to draft
            $plan->update([
                'status' => 'draft',
                'google_calendar_event_id' => null,
                'payment_status' => 'pending',
                'stripe_session_id' => null,
                'stripe_payment_intent_id' => null,
            ]);

            Log::info('Appointment cancelled successfully', [
                'plan_id' => $plan->id,
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to cancel appointment', [
                'plan_id' => $plan->id,
                'error' => $e->getMessage(),
            ]);
            throw $e;
        }
    }

    /**
     * Create Stripe checkout session
     */
    public function createCheckoutSession(Request $request, $id)
    {
        try {
            $plan = Plan::findOrFail($id);

            // Check if plan is completed
            if ($plan->status !== 'completed') {
                return response()->json(['error' => 'Appointment must be confirmed before payment'], 400);
            }

            // Check if already paid
            if ($plan->payment_status === 'paid') {
                return response()->json(['error' => 'Payment already completed'], 400);
            }

            // Calculate plan price
            $planType = $plan->selected_plan ?? $plan->plan_type ?? config('plans.default');
            $prices = config('plans.prices');
            $price = $prices[$planType] ?? $prices[config('plans.default')];
            $total = $price * 100; // Convert to cents

            // Initialize Stripe
            Stripe::setApiKey(config('services.stripe.secret'));

            // Create checkout session
            $session = StripeSession::create([
                'payment_method_types' => ['card'],
                'line_items' => [[
                    'price_data' => [
                        'currency' => 'usd',
                        'product_data' => [
                            'name' => ucfirst($planType) . ' Plan Appointment',
                            'description' => 'Appointment with ' . ($plan->first_name . ' ' . $plan->last_name),
                        ],
                        'unit_amount' => $total,
                    ],
                    'quantity' => 1,
                ]],
                'mode' => 'payment',
                'success_url' => url("/plans/{$plan->id}?payment=success"),
                'cancel_url' => url("/plans/{$plan->id}?payment=cancelled"),
                'metadata' => [
                    'plan_id' => $plan->id,
                ],
            ]);

            // Save session ID to plan
            $plan->update([
                'stripe_session_id' => $session->id,
                'amount' => $price,
            ]);

            Log::info('Stripe checkout session created', [
                'plan_id' => $plan->id,
                'session_id' => $session->id,
            ]);

            return response()->json([
                'sessionId' => $session->id,
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to create Stripe checkout session', [
                'plan_id' => $id,
                'error' => $e->getMessage(),
            ]);
            return response()->json(['error' => 'Failed to create checkout session'], 500);
        }
    }

    /**
     * Handle Stripe webhook
     */
    public function handleStripeWebhook(Request $request)
    {
        try {
            $payload = $request->getContent();
            $sigHeader = $request->header('Stripe-Signature');
            $endpointSecret = config('services.stripe.webhook_secret');

            Stripe::setApiKey(config('services.stripe.secret'));
            
            $event = \Stripe\Webhook::constructEvent(
                $payload,
                $sigHeader,
                $endpointSecret
            );

            // Handle the event
            switch ($event->type) {
                case 'checkout.session.completed':
                    $session = $event->data->object;
                    $this->handlePaymentSuccess($session);
                    break;
                case 'payment_intent.succeeded':
                    $paymentIntent = $event->data->object;
                    Log::info('Payment intent succeeded', ['payment_intent_id' => $paymentIntent->id]);
                    break;
                default:
                    Log::info('Unhandled event type', ['type' => $event->type]);
            }

            return response()->json(['received' => true]);

        } catch (\Exception $e) {
            Log::error('Stripe webhook error', [
                'error' => $e->getMessage(),
            ]);
            return response()->json(['error' => 'Webhook handling failed'], 400);
        }
    }

    /**
     * Handle successful payment
     */
    private function handlePaymentSuccess($session)
    {
        try {
            $planId = $session->metadata->plan_id ?? null;
            if (!$planId) {
                Log::warning('Payment session missing plan_id', ['session_id' => $session->id]);
                return;
            }

            $plan = Plan::find($planId);
            if (!$plan) {
                Log::warning('Plan not found for payment', ['plan_id' => $planId]);
                return;
            }

            $plan->update([
                'payment_status' => 'paid',
                'stripe_payment_intent_id' => $session->payment_intent ?? null,
                'paid_at' => now(),
            ]);

            Log::info('Payment completed successfully', [
                'plan_id' => $plan->id,
                'session_id' => $session->id,
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to handle payment success', [
                'error' => $e->getMessage(),
            ]);
        }
    }
}
