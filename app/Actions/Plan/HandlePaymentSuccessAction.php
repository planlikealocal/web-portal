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
            'stripe_payment_intent_id' => $session->payment_intent ?? null,
            'paid_at' => now(),
        ]);

        // Refresh plan to get updated data
        $plan->refresh();

        // Send payment success email
        $sendEmailAction = new SendPaymentSuccessEmailAction($this->googleCalendarService);
        $sendEmailAction->execute($plan);

        $this->logAction('payment_completed', [
            'plan_id' => $plan->id,
            'session_id' => $session->id,
        ]);
    }
}

