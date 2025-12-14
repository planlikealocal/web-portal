<?php

namespace App\Actions\Plan;

use App\Models\Plan;
use Stripe\Stripe;
use Illuminate\Support\Facades\Log;

class CheckPaymentStatusAction extends AbstractPlanAction
{
    public function execute(...$args): bool
    {
        $plan = $args[0];

        // If payment status is not yet 'paid', check Stripe session status as fallback
        // (webhook might not have fired yet)
        if ($plan->payment_status !== 'paid' && $plan->stripe_session_id) {
            try {
                Stripe::setApiKey(config('services.stripe.secret'));
                $session = \Stripe\Checkout\Session::retrieve($plan->stripe_session_id);
                
                // If session payment status is paid, update the plan
                if ($session->payment_status === 'paid') {
                    $wasAlreadyPaid = $plan->payment_status === 'paid';
                    
                    $plan->update([
                        'payment_status' => 'paid',
                        'appointment_status' => 'active',
                        'stripe_payment_intent_id' => $session->payment_intent ?? null,
                        'paid_at' => now(),
                    ]);
                    // Reload plan with relationships for email
                    $plan->load('specialist.country', 'destination');
                    $plan->refresh();
                    
                    // Automatically create Google Calendar appointment if appointment times are set
                    // and appointment hasn't been created yet
                    if (!$wasAlreadyPaid && $plan->appointment_start && $plan->appointment_end && !$plan->google_calendar_event_id) {
                        try {
                            $confirmAppointmentAction = new ConfirmAppointmentAction($this->googleCalendarService);
                            $confirmAppointmentAction->execute($plan);
                            Log::info('Google Calendar appointment created automatically after payment status check', [
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
                                Log::error('Failed to create Google Calendar appointment after payment status check', [
                                    'plan_id' => $plan->id,
                                    'error' => $errorMessage,
                                    'trace' => $e->getTraceAsString(),
                                ]);
                            }
                            // Don't fail the payment process if Google Calendar event creation fails
                            // Payment is successful, appointment can be created manually later
                        }
                    }
                    
                    // Send email only if payment status was just updated (not already paid)
                    if (!$wasAlreadyPaid) {
                        $sendEmailAction = new SendPaymentSuccessEmailAction($this->googleCalendarService);
                        $sendEmailAction->execute($plan);
                    }
                    
                    Log::info('Payment status updated from Stripe session check', [
                        'plan_id' => $plan->id,
                        'session_id' => $session->id,
                    ]);
                }
            } catch (\Exception $e) {
                Log::warning('Failed to check Stripe session status', [
                    'plan_id' => $plan->id,
                    'error' => $e->getMessage(),
                ]);
            }
        }
        
        return $plan->payment_status === 'paid';
    }
}

