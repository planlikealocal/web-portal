<?php

namespace App\Actions\Plan;

use App\Models\Plan;
use Illuminate\Support\Facades\Log;
use Stripe\Stripe;

class HandleStripeWebhookAction extends AbstractPlanAction
{
    public function execute(...$args): array
    {
        $payload = $args[0];
        $sigHeader = $args[1];
        $endpointSecret = $args[2];

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
                $handlePaymentSuccessAction = new HandlePaymentSuccessAction($this->googleCalendarService);
                $handlePaymentSuccessAction->execute($session);
                break;
            case 'payment_intent.succeeded':
                $paymentIntent = $event->data->object;
                Log::info('Payment intent succeeded', ['payment_intent_id' => $paymentIntent->id]);
                $this->handlePaymentIntentSucceeded($paymentIntent);
                break;
            default:
                Log::info('Unhandled event type', ['type' => $event->type]);
        }

        return ['received' => true];
    }

    private function handlePaymentIntentSucceeded($paymentIntent): void
    {
        $planId = $paymentIntent->metadata['plan_id'] ?? null;

        if (!$planId) {
            Log::warning('payment_intent.succeeded – no plan_id in metadata', [
                'payment_intent_id' => $paymentIntent->id,
            ]);
            return;
        }

        $plan = Plan::find($planId);

        if (!$plan) {
            Log::warning('payment_intent.succeeded – plan not found', ['plan_id' => $planId]);
            return;
        }

        $plan->update([
            'payment_status' => 'paid',
            'status'         => 'completed',
            'paid_at'        => now(),
        ]);

        $this->logAction('payment_intent_fulfilled', [
            'plan_id'           => $plan->id,
            'payment_intent_id' => $paymentIntent->id,
        ]);
    }
}

