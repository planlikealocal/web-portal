<?php

namespace App\Actions\Plan;

use App\Models\Plan;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class SendPaymentSuccessEmailAction extends AbstractPlanAction
{
    public function execute(...$args): void
    {
        $plan = $args[0];

        try {
            // Reload plan with relationships
            $plan->load('specialist.country', 'destination');

            // Calculate plan price
            $planType = $plan->selected_plan ?? $plan->plan_type ?? config('plans.default');
            $prices = config('plans.prices');
            $planPrice = $prices[$planType] ?? $prices[config('plans.default')] ?? 149;

            // Format appointment date and time
            $appointmentDate = 'N/A';
            $appointmentDuration = 'N/A';
            if ($plan->appointment_start && $plan->appointment_end) {
                $startTime = Carbon::parse($plan->appointment_start);
                $endTime = Carbon::parse($plan->appointment_end);
                $appointmentDate = $startTime->format('l, F j, Y \a\t g:i A');
                $durationMinutes = $startTime->diffInMinutes($endTime);
                $appointmentDuration = $durationMinutes . ' minutes';
            }

            // Generate download URLs
            $calendarDownloadUrl = url("/plans/{$plan->id}/download-calendar");
            $invoiceDownloadUrl = url("/plans/{$plan->id}/download-invoice");

            Mail::send('emails.payment-success', [
                'plan' => $plan,
                'appointmentDate' => $appointmentDate,
                'appointmentDuration' => $appointmentDuration,
                'planPrice' => $planPrice,
                'calendarDownloadUrl' => $calendarDownloadUrl,
                'invoiceDownloadUrl' => $invoiceDownloadUrl,
                'meetingLink' => $plan->meeting_link,
            ], function ($message) use ($plan) {
                $message->to($plan->email, $plan->first_name . ' ' . $plan->last_name)
                        ->subject('✅ Payment Successful - Your Appointment is Confirmed!');
            });

            $this->logAction('payment_success_email_sent', [
                'plan_id' => $plan->id,
                'email' => $plan->email,
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to send payment success email', [
                'plan_id' => $plan->id,
                'email' => $plan->email ?? 'unknown',
                'error' => $e->getMessage(),
            ]);
            // Don't throw exception - email failure shouldn't break the payment flow
        }
    }
}

