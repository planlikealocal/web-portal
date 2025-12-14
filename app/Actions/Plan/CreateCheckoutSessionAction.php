<?php

namespace App\Actions\Plan;

use App\Models\Plan;
use Stripe\Stripe;
use Stripe\Checkout\Session as StripeSession;
use Illuminate\Support\Facades\Log;

class CreateCheckoutSessionAction extends AbstractPlanAction
{
    public function execute(...$args): array
    {
        $plan = $args[0];

        // Check if plan is completed
        if ($plan->status !== 'completed') {
            throw new \Exception('Appointment must be confirmed before payment');
        }

        // Check if already paid
        if ($plan->payment_status === 'paid') {
            throw new \Exception('Payment already completed');
        }

        // Calculate plan price
        $planType = $plan->selected_plan ?? $plan->plan_type ?? config('plans.default');
        $prices = config('plans.prices');
        $price = $prices[$planType] ?? $prices[config('plans.default')];
        $total = $price * 100; // Convert to cents

        // Initialize Stripe
        Stripe::setApiKey(config('services.stripe.secret'));

        // Create checkout session for custom embedded payment form
        $session = StripeSession::create([
            'ui_mode' => 'custom',
            'payment_method_types' => ['card'],
            'line_items' => [[
                'price_data' => [
                    'currency' => 'usd',
                    'product_data' => [
                        'name' => ucfirst($planType) . ' Plan Appointment',
                        'description' => 'Appointment with ' . ($plan->first_name . ' ' . $plan->last_name),
                    ],
                    'unit_amount' => $total,
                ],
                'quantity' => 1,
            ]],
            'mode' => 'payment',
            'invoice_creation' => [
                'enabled' => true,
            ],
            'return_url' => url("/plans/{$plan->id}?payment=success"),
            'metadata' => [
                'plan_id' => $plan->id,
            ],
        ]);

        // Save session ID to plan
        $plan->update([
            'stripe_session_id' => $session->id,
            'amount' => $price,
        ]);

        $this->logAction('stripe_checkout_session_created', [
            'plan_id' => $plan->id,
            'session_id' => $session->id,
        ]);

        return [
            'clientSecret' => $session->client_secret,
            'sessionId' => $session->id, // Keep for backward compatibility if needed
        ];
    }
}

