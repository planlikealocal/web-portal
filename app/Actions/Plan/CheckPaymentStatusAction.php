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
                        'stripe_payment_intent_id' => $session->payment_intent ?? null,
                        'paid_at' => now(),
                    ]);
                    // Reload plan with relationships for email
                    $plan->load('specialist.country', 'destination');
                    $plan->refresh();
                    
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

