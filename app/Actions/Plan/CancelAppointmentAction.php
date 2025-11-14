<?php

namespace App\Actions\Plan;

use App\Models\Plan;
use App\Models\User;
use Illuminate\Support\Facades\Log;

class CancelAppointmentAction extends AbstractPlanAction
{
    public function execute(...$args): void
    {
        $plan = $args[0];

        // Check if appointment is confirmed
        if ($plan->status !== 'completed') {
            $this->logAction('appointment_not_confirmed_skip_cancellation', [
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

                        $this->logAction('google_calendar_event_deleted', [
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
            'appointment_status' => 'draft',
            'google_calendar_event_id' => null,
            'meeting_link' => null,
            'payment_status' => 'pending',
            'stripe_session_id' => null,
            'stripe_payment_intent_id' => null,
            'cancellation_comment' => null,
            'canceled_by_type' => null,
            'canceled_by_id' => null,
            'canceled_at' => null,
            'completion_comment' => null,
            'completed_at' => null,
        ]);

        $this->logAction('appointment_cancelled', [
            'plan_id' => $plan->id,
        ]);
    }
}

