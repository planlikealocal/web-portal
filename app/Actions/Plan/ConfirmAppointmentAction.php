<?php

namespace App\Actions\Plan;

use App\Models\Plan;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

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
            'specialist_name' => $specialist->full_name ?? trim(($specialist->first_name ?? '') . ' ' . ($specialist->last_name ?? '')),
            'specialist_email' => $specialist->email ?? $user->email,
            'specialist_phone' => $specialist->contact_no ?? null,
        ];

        // Create Google Calendar event
        $this->googleCalendarService->setUser($user);
        $event = $this->googleCalendarService->createEvent($eventData);

        // Update plan with Google Calendar event ID
        $plan->update([
            'google_calendar_event_id' => $event['id'],
            'meeting_link' => $event['meeting_link'] ?? null,
        ]);

        // Send email notification to specialist
        $this->sendSpecialistNotification($plan, $specialist, $event);

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
            $notes[] = "Destination: {$plan->destination->name}";
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
     * Send email notification to specialist about the new appointment
     */
    private function sendSpecialistNotification(Plan $plan, $specialist, array $event): void
    {
        try {
            // Reload plan with relationships
            $plan->load('specialist.country', 'destination');

            // Format appointment date and time
            $appointmentDate = 'N/A';
            $appointmentDuration = 'N/A';
            if ($plan->appointment_start && $plan->appointment_end) {
                $startTime = Carbon::parse($plan->appointment_start);
                $endTime = Carbon::parse($plan->appointment_end);
                $appointmentDate = $startTime->format('l, F j, Y \a\t g:i A');
                $durationMinutes = $startTime->diffInMinutes($endTime);
                $appointmentDuration = $durationMinutes . ' minutes';
            }

            // Generate appointments URL
            $appointmentsUrl = url('/specialist/appointments');

            Mail::send('emails.specialist-appointment-confirmed', [
                'plan' => $plan,
                'specialist' => $specialist,
                'appointmentDate' => $appointmentDate,
                'appointmentDuration' => $appointmentDuration,
                'meetingLink' => $event['meeting_link'] ?? $plan->meeting_link,
                'appointmentsUrl' => $appointmentsUrl,
            ], function ($message) use ($specialist) {
                $message->to($specialist->email, $specialist->full_name)
                        ->subject('📅 New Appointment Confirmed - You Have a New Client Booking');
            });

            Log::info('Specialist appointment notification email sent', [
                'plan_id' => $plan->id,
                'specialist_id' => $specialist->id,
                'specialist_email' => $specialist->email,
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to send specialist appointment notification email', [
                'plan_id' => $plan->id,
                'specialist_id' => $specialist->id,
                'specialist_email' => $specialist->email ?? 'unknown',
                'error' => $e->getMessage(),
            ]);
            // Don't throw exception - email failure shouldn't break the appointment confirmation flow
        }
    }
}

