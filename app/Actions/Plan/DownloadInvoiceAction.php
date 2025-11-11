<?php

namespace App\Actions\Plan;

use App\Models\Plan;
use Stripe\Stripe;
use Illuminate\Support\Facades\Log;

class DownloadInvoiceAction extends AbstractPlanAction
{
    public function execute(...$args): string
    {
        $plan = $args[0];

        // Check if payment is completed
        if ($plan->payment_status !== 'paid') {
            throw new \Exception('Payment not completed');
        }

        // Check if we have a payment intent ID
        if (!$plan->stripe_payment_intent_id && !$plan->stripe_session_id) {
            throw new \Exception('Payment information not found');
        }

        Stripe::setApiKey(config('services.stripe.secret'));

        $invoice = null;

        // Try to get invoice from payment intent
        if ($plan->stripe_payment_intent_id) {
            try {
                $paymentIntent = \Stripe\PaymentIntent::retrieve($plan->stripe_payment_intent_id);
                
                // Get the invoice from the payment intent
                if (isset($paymentIntent->invoice) && $paymentIntent->invoice) {
                    $invoice = \Stripe\Invoice::retrieve($paymentIntent->invoice);
                } else {
                    // If no invoice exists, try to get it from the latest invoice for this customer
                    // For checkout sessions, we might need to create an invoice or get it from the session
                    if ($plan->stripe_session_id) {
                        $session = \Stripe\Checkout\Session::retrieve($plan->stripe_session_id);
                        if (isset($session->invoice) && $session->invoice) {
                            $invoice = \Stripe\Invoice::retrieve($session->invoice);
                        }
                    }
                }
            } catch (\Exception $e) {
                Log::warning('Failed to get invoice from payment intent', [
                    'plan_id' => $plan->id,
                    'payment_intent_id' => $plan->stripe_payment_intent_id,
                    'error' => $e->getMessage(),
                ]);
            }
        }

        // If still no invoice, try to get from session
        if (!$invoice && $plan->stripe_session_id) {
            try {
                $session = \Stripe\Checkout\Session::retrieve($plan->stripe_session_id);
                if (isset($session->invoice) && $session->invoice) {
                    $invoice = \Stripe\Invoice::retrieve($session->invoice);
                }
            } catch (\Exception $e) {
                Log::warning('Failed to get invoice from session', [
                    'plan_id' => $plan->id,
                    'session_id' => $plan->stripe_session_id,
                    'error' => $e->getMessage(),
                ]);
            }
        }

        // If invoice exists and has PDF, return the URL
        if ($invoice && isset($invoice->invoice_pdf) && $invoice->invoice_pdf) {
            return $invoice->invoice_pdf;
        }

        // Fallback: Try to get receipt URL from session (always available for completed payments)
        if ($plan->stripe_session_id) {
            try {
                $session = \Stripe\Checkout\Session::retrieve($plan->stripe_session_id, [
                    'expand' => ['payment_intent.charges.data'],
                ]);
                if (isset($session->payment_status) && $session->payment_status === 'paid') {
                    // Get the receipt URL from the payment intent
                    if (isset($session->payment_intent) && $session->payment_intent) {
                        $paymentIntent = is_string($session->payment_intent) 
                            ? \Stripe\PaymentIntent::retrieve($session->payment_intent, ['expand' => ['charges.data']])
                            : $session->payment_intent;
                        
                        if (isset($paymentIntent->charges) && isset($paymentIntent->charges->data) && count($paymentIntent->charges->data) > 0) {
                            $charge = $paymentIntent->charges->data[0];
                            if (isset($charge->receipt_url) && $charge->receipt_url) {
                                return $charge->receipt_url;
                            }
                        }
                    }
                }
            } catch (\Exception $e) {
                Log::warning('Failed to get receipt URL from session', [
                    'plan_id' => $plan->id,
                    'error' => $e->getMessage(),
                ]);
            }
        }

        // If no invoice PDF or receipt is available, throw exception
        throw new \Exception('Invoice PDF not available. Invoice may not have been generated yet. Please try again in a few moments.');
    }
}

