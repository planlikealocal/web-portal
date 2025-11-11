<?php

namespace App\Actions\Plan;

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
                break;
            default:
                Log::info('Unhandled event type', ['type' => $event->type]);
        }

        return ['received' => true];
    }
}

