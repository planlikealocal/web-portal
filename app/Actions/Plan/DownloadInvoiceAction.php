<?php

namespace App\Actions\Plan;

use App\Models\Plan;
use Stripe\Stripe;
use Illuminate\Support\Facades\Log;
use Stripe\Checkout\Session;
use Stripe\Invoice;
use Stripe\PaymentIntent;

class DownloadInvoiceAction extends AbstractPlanAction
{
    public function execute(...$args): string
    {
        $plan = $args[0];
        $documentPreference = $args[1] ?? 'invoice';

        // Check if payment is completed
        if ($plan->payment_status !== 'paid') {
            throw new \Exception('Payment not completed');
        }

        // Check if we have a payment intent ID
        if (!$plan->stripe_payment_intent_id && !$plan->stripe_session_id) {
            throw new \Exception('Payment information not found');
        }

        Stripe::setApiKey(config('services.stripe.secret'));

        $invoiceUrl = null;
        if ($documentPreference !== 'receipt') {
            $invoiceUrl = $this->getInvoicePdfUrl($plan);
            if ($invoiceUrl) {
                return $invoiceUrl;
            }
        }

        $receiptUrl = $this->getReceiptUrl($plan);
        if ($receiptUrl) {
            return $receiptUrl;
        }

        if ($documentPreference === 'receipt') {
            $invoiceUrl = $invoiceUrl ?? $this->getInvoicePdfUrl($plan);
            if ($invoiceUrl) {
                return $invoiceUrl;
            }
        }

        throw new \Exception('Requested payment document is not available yet. Please try again in a few moments.');
    }

    private function getInvoicePdfUrl(Plan $plan): ?string
    {
        $invoice = $this->retrieveInvoice($plan);

        if ($invoice && isset($invoice->invoice_pdf) && $invoice->invoice_pdf) {
            return $invoice->invoice_pdf;
        }

        return null;
    }

    private function retrieveInvoice(Plan $plan): ?Invoice
    {
        $invoice = null;

        if ($plan->stripe_payment_intent_id) {
            try {
                $paymentIntent = PaymentIntent::retrieve($plan->stripe_payment_intent_id);

                if (isset($paymentIntent->invoice) && $paymentIntent->invoice) {
                    $invoice = Invoice::retrieve($paymentIntent->invoice);
                } elseif ($plan->stripe_session_id) {
                    $session = Session::retrieve($plan->stripe_session_id);
                    if (isset($session->invoice) && $session->invoice) {
                        $invoice = Invoice::retrieve($session->invoice);
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

        if (!$invoice && $plan->stripe_session_id) {
            try {
                $session = Session::retrieve($plan->stripe_session_id);
                if (isset($session->invoice) && $session->invoice) {
                    $invoice = Invoice::retrieve($session->invoice);
                }
            } catch (\Exception $e) {
                Log::warning('Failed to get invoice from session', [
                    'plan_id' => $plan->id,
                    'session_id' => $plan->stripe_session_id,
                    'error' => $e->getMessage(),
                ]);
            }
        }

        return $invoice;
    }

    private function getReceiptUrl(Plan $plan): ?string
    {
        $receiptUrl = $this->getReceiptUrlFromSession($plan);

        if ($receiptUrl) {
            return $receiptUrl;
        }

        if ($plan->stripe_payment_intent_id) {
            return $this->getReceiptUrlFromPaymentIntentId($plan);
        }

        return null;
    }

    private function getReceiptUrlFromSession(Plan $plan): ?string
    {
        if (!$plan->stripe_session_id) {
            return null;
        }

        try {
            $session = Session::retrieve($plan->stripe_session_id, [
                'expand' => ['payment_intent.charges.data'],
            ]);

            if (isset($session->payment_status) && $session->payment_status === 'paid') {
                $paymentIntent = $session->payment_intent;

                if (is_string($paymentIntent)) {
                    $paymentIntent = PaymentIntent::retrieve($paymentIntent, ['expand' => ['charges.data']]);
                }

                if ($paymentIntent && isset($paymentIntent->charges->data) && count($paymentIntent->charges->data) > 0) {
                    $charge = $paymentIntent->charges->data[0];
                    if (isset($charge->receipt_url) && $charge->receipt_url) {
                        return $charge->receipt_url;
                    }
                }
            }
        } catch (\Exception $e) {
            Log::warning('Failed to get receipt URL from session', [
                'plan_id' => $plan->id,
                'error' => $e->getMessage(),
            ]);
        }

        return null;
    }

    private function getReceiptUrlFromPaymentIntentId(Plan $plan): ?string
    {
        try {
            $paymentIntent = PaymentIntent::retrieve($plan->stripe_payment_intent_id, ['expand' => ['charges.data']]);

            if ($paymentIntent && isset($paymentIntent->charges->data) && count($paymentIntent->charges->data) > 0) {
                $charge = $paymentIntent->charges->data[0];
                if (isset($charge->receipt_url) && $charge->receipt_url) {
                    return $charge->receipt_url;
                }
            }
        } catch (\Exception $e) {
            Log::warning('Failed to get receipt URL from payment intent', [
                'plan_id' => $plan->id,
                'payment_intent_id' => $plan->stripe_payment_intent_id,
                'error' => $e->getMessage(),
            ]);
        }

        return null;
    }
}

