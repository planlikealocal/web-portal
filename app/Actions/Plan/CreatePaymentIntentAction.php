<?php

namespace App\Actions\Plan;

use App\Models\Plan;
use App\Models\User;
use Stripe\Stripe;
use Stripe\Customer;
use Stripe\EphemeralKey;
use Stripe\PaymentIntent;
use Illuminate\Support\Facades\Log;

class CreatePaymentIntentAction extends AbstractPlanAction
{
    public function execute(...$args): array
    {
        $data = $args[0];

        $planType = strtolower($data['plan_type'] ?? config('plans.default'));
        $prices = config('plans.prices');
        $price = $prices[$planType] ?? $prices[config('plans.default')];
        $amountInCents = (int) round($price * 100);

        Stripe::setApiKey(config('services.stripe.secret'));

        // Look up or create a Stripe Customer for the user
        $user = User::where('email', $data['email'])->first();
        $customerId = $user?->stripe_customer_id;

        if (!$customerId) {
            $customer = Customer::create([
                'email' => $data['email'],
                'name'  => $user ? trim(($user->first_name ?? '') . ' ' . ($user->last_name ?? '')) : null,
            ]);
            $customerId = $customer->id;

            if ($user) {
                $user->update(['stripe_customer_id' => $customerId]);
            }
        }

        // Create an EphemeralKey for the customer (needed by Payment Sheet)
        $ephemeralKey = EphemeralKey::create(
            ['customer' => $customerId],
            ['stripe_version' => '2024-06-20']
        );

        // Create the plan record
        $plan = Plan::create([
            'specialist_id'    => $data['specialist_id'],
            'destination_id'   => $data['destination_id'] ?? null,
            'email'            => $data['email'],
            'selected_plan'    => $planType,
            'status'           => 'pending',
            'appointment_status' => 'pending_payment',
            'amount'           => $price,
            'travel_dates'     => isset($data['start_date'], $data['end_date'])
                                    ? $data['start_date'] . ' - ' . $data['end_date']
                                    : null,
            'travelers'        => $data['travel_companions'] ?? null,
            'interests'        => isset($data['selected_activities'])
                                    ? (is_array($data['selected_activities'])
                                        ? $data['selected_activities']
                                        : json_decode($data['selected_activities'], true))
                                    : null,
        ]);

        // Create Stripe PaymentIntent attached to the customer
        $paymentIntent = PaymentIntent::create([
            'amount'   => $amountInCents,
            'currency' => 'usd',
            'customer' => $customerId,
            'metadata' => [
                'plan_id'   => $plan->id,
                'plan_type' => $planType,
                'email'     => $data['email'],
                'source'    => 'mobile',
            ],
            'description'                  => ucfirst($planType) . ' Plan – Mobile App',
            'automatic_payment_methods'    => ['enabled' => true],
        ]);

        $plan->update(['stripe_payment_intent_id' => $paymentIntent->id]);

        $this->logAction('payment_intent_created', [
            'plan_id'           => $plan->id,
            'payment_intent_id' => $paymentIntent->id,
        ]);

        return [
            'clientSecret'  => $paymentIntent->client_secret,
            'customerId'    => $customerId,
            'ephemeralKey'  => $ephemeralKey->secret,
            'planId'        => $plan->id,
        ];
    }
}
