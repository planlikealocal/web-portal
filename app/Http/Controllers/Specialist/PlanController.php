<?php

namespace App\Http\Controllers\Specialist;

use App\Http\Controllers\Controller;
use App\Http\Requests\Specialist\CancelPlanRequest;
use App\Http\Requests\Specialist\CompletePlanRequest;
use App\Http\Resources\PlanResource;
use App\Models\Plan;
use App\Models\Specialist;
use App\Models\User;
use App\Services\GoogleCalendarService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

class PlanController extends Controller
{
    public function __construct(private GoogleCalendarService $googleCalendarService)
    {
    }

    /**
     * Get plan details for the authenticated specialist
     */
    public function show($planId): PlanResource|JsonResponse
    {
        $specialist = $this->getAuthenticatedSpecialist();

        $plan = $this->findPlanForSpecialist($specialist, (int) $planId);

        if (!$plan) {
            return response()->json(['error' => 'Plan not found for this specialist.'], 404);
        }

        return new PlanResource($plan);
    }

    public function cancel(CancelPlanRequest $request, $planId): PlanResource|JsonResponse
    {
        $specialist = $this->getAuthenticatedSpecialist();
        $plan = $this->findPlanForSpecialist($specialist, (int) $planId);

        if (!$plan) {
            return response()->json(['error' => 'Plan not found for this specialist.'], 404);
        }

        if ($plan->appointment_status !== 'active') {
            return response()->json(['error' => 'Only active appointments can be cancelled.'], 422);
        }

        $this->deleteGoogleEvent($plan, $specialist);

        $plan->update([
            'appointment_status' => 'cancelled',
            'cancellation_comment' => $request->validated('comment'),
            'canceled_by_type' => 'specialist',
            'canceled_by_id' => $specialist->id,
            'canceled_at' => now(),
            'completion_comment' => null,
            'completed_at' => null,
            'google_calendar_event_id' => null,
            'meeting_link' => null,
        ]);

        $plan->refresh()->loadMissing(['destination', 'specialist.country', 'destination.activities']);

        Log::info('Specialist cancelled appointment', [
            'plan_id' => $plan->id,
            'specialist_id' => $specialist->id,
        ]);

        return new PlanResource($plan);
    }

    public function complete(CompletePlanRequest $request, $planId): PlanResource|JsonResponse
    {
        $specialist = $this->getAuthenticatedSpecialist();
        $plan = $this->findPlanForSpecialist($specialist, (int) $planId);

        if (!$plan) {
            return response()->json(['error' => 'Plan not found for this specialist.'], 404);
        }

        if ($plan->appointment_status !== 'active') {
            return response()->json(['error' => 'Only active appointments can be completed.'], 422);
        }

        if (!$plan->appointment_end) {
            return response()->json(['error' => 'Appointment end time is missing.'], 422);
        }

        if (now()->lt($plan->appointment_end)) {
            return response()->json(['error' => 'Appointment can be completed only after it ends.'], 422);
        }

        $plan->update([
            'appointment_status' => 'completed',
            'completion_comment' => $request->validated('comment'),
            'completed_at' => now(),
        ]);

        $plan->refresh()->loadMissing(['destination', 'specialist.country', 'destination.activities']);

        Log::info('Specialist completed appointment', [
            'plan_id' => $plan->id,
            'specialist_id' => $specialist->id,
        ]);

        return new PlanResource($plan);
    }

    private function getAuthenticatedSpecialist(): Specialist
    {
        $user = auth()->user();
        $specialist = Specialist::where('email', $user?->email)->first();

        if (!$specialist) {
            abort(404, 'Specialist profile not found.');
        }

        return $specialist;
    }

    private function findPlanForSpecialist(Specialist $specialist, int $planId): ?Plan
    {
        return Plan::with(['destination', 'specialist.country', 'destination.activities'])
            ->where('id', $planId)
            ->where('specialist_id', $specialist->id)
            ->first();
    }

    private function deleteGoogleEvent(Plan $plan, Specialist $specialist): void
    {
        if (!$plan->google_calendar_event_id) {
            return;
        }

        $user = User::where('email', $specialist->email)->first();

        if (!$user || !$user->hasGoogleCalendarConnected()) {
            return;
        }

        try {
            $this->googleCalendarService->setUser($user);
            $this->googleCalendarService->deleteEvent($plan->google_calendar_event_id);
        } catch (\Throwable $exception) {
            Log::warning('Failed to delete Google Calendar event for cancelled plan', [
                'plan_id' => $plan->id,
                'event_id' => $plan->google_calendar_event_id,
                'error' => $exception->getMessage(),
            ]);
        }
    }
}

