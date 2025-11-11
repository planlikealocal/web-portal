<?php

namespace App\Actions\Plan;

use App\Models\Plan;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class ConfirmAppointmentAction extends AbstractPlanAction
{
    public function execute(...$args): array
    {
        $plan = $args[0];

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

        $this->logAction('appointment_confirmed', [
            'plan_id' => $plan->id,
            'event_id' => $event['id'],
            'specialist_id' => $specialist->id,
        ]);

        return $event;
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
}

