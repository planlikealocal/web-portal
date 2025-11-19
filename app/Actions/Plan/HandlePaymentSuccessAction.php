<?php

namespace App\Actions\Plan;

use App\Models\Plan;
use Illuminate\Support\Facades\Log;

class HandlePaymentSuccessAction extends AbstractPlanAction
{
    public function execute(...$args): void
    {
        $session = $args[0];

        $planId = $session->metadata->plan_id ?? null;
        if (!$planId) {
            Log::warning('Payment session missing plan_id', ['session_id' => $session->id]);
            return;
        }

        $plan = Plan::with('specialist.country', 'destination')->find($planId);
        if (!$plan) {
            Log::warning('Plan not found for payment', ['plan_id' => $planId]);
            return;
        }

        $plan->update([
            'payment_status' => 'paid',
            'appointment_status' => 'active',
            'stripe_payment_intent_id' => $session->payment_intent ?? null,
            'paid_at' => now(),
        ]);

        // Refresh plan to get updated data
        $plan->refresh();

        // Automatically create Google Calendar appointment if appointment times are set
        // and appointment hasn't been created yet
        if ($plan->appointment_start && $plan->appointment_end && !$plan->google_calendar_event_id) {
            try {
                $confirmAppointmentAction = new ConfirmAppointmentAction($this->googleCalendarService);
                $confirmAppointmentAction->execute($plan);
                Log::info('Google Calendar appointment created automatically after payment', [
                    'plan_id' => $plan->id,
                ]);
            } catch (\Exception $e) {
                $errorMessage = $e->getMessage();
                $isTokenRevoked = str_contains($errorMessage, 'Token expired or revoked') ||
                                str_contains($errorMessage, 'invalid_grant') ||
                                str_contains($errorMessage, 'reconnect your Google Calendar');
                
                if ($isTokenRevoked) {
                    Log::error('Google Calendar appointment creation failed due to revoked/expired token', [
                        'plan_id' => $plan->id,
                        'specialist_id' => $plan->specialist_id,
                        'error' => $errorMessage,
                        'action_required' => 'Specialist needs to reconnect Google Calendar at /specialist/google-calendar-settings',
                    ]);
                    
                    // TODO: Send notification email to specialist about reconnection requirement
                    // For now, we log it clearly so it can be addressed
                } else {
                    Log::error('Failed to create Google Calendar appointment after payment', [
                        'plan_id' => $plan->id,
                        'error' => $errorMessage,
                        'trace' => $e->getTraceAsString(),
                    ]);
                }
                // Don't fail the payment process if Google Calendar event creation fails
                // The payment is still successful, just without the calendar event
            }
        } else {
            if (!$plan->appointment_start || !$plan->appointment_end) {
                Log::info('Payment completed but appointment times not set yet', [
                    'plan_id' => $plan->id,
                ]);
            } elseif ($plan->google_calendar_event_id) {
                Log::info('Payment completed but appointment already exists', [
                    'plan_id' => $plan->id,
                    'event_id' => $plan->google_calendar_event_id,
                ]);
            }
        }

        // Send payment success email
        $sendEmailAction = new SendPaymentSuccessEmailAction($this->googleCalendarService);
        $sendEmailAction->execute($plan);

        $this->logAction('payment_completed', [
            'plan_id' => $plan->id,
            'session_id' => $session->id,
        ]);
    }
}

