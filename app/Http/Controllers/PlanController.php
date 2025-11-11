<?php

namespace App\Http\Controllers;

use App\Actions\Plan\CreatePlanAction;
use App\Actions\Plan\UpdatePlanAction;
use App\Actions\Plan\GetPlanAvailabilityAction;
use App\Actions\Plan\ConfirmAppointmentAction;
use App\Actions\Plan\CancelAppointmentAction;
use App\Actions\Plan\CreateCheckoutSessionAction;
use App\Actions\Plan\HandlePaymentSuccessAction;
use App\Actions\Plan\SendPaymentSuccessEmailAction;
use App\Actions\Plan\HandleStripeWebhookAction;
use App\Actions\Plan\DownloadCalendarAction;
use App\Actions\Plan\DownloadInvoiceAction;
use App\Actions\Plan\GetPlanDataAction;
use App\Actions\Plan\CheckPaymentStatusAction;
use App\Http\Requests\StorePlanRequest;
use App\Http\Requests\UpdatePlanRequest;
use App\Http\Requests\GetPlanAvailabilityRequest;
use App\Models\Plan;
use App\Services\GoogleCalendarService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

class PlanController extends Controller
{
    public function __construct(
        private GoogleCalendarService $googleCalendarService,
        private CreatePlanAction $createPlanAction,
        private UpdatePlanAction $updatePlanAction,
        private GetPlanAvailabilityAction $getPlanAvailabilityAction,
        private ConfirmAppointmentAction $confirmAppointmentAction,
        private CancelAppointmentAction $cancelAppointmentAction,
        private CreateCheckoutSessionAction $createCheckoutSessionAction,
        private HandlePaymentSuccessAction $handlePaymentSuccessAction,
        private HandleStripeWebhookAction $handleStripeWebhookAction,
        private DownloadCalendarAction $downloadCalendarAction,
        private DownloadInvoiceAction $downloadInvoiceAction,
        private GetPlanDataAction $getPlanDataAction,
        private CheckPaymentStatusAction $checkPaymentStatusAction,
    ) {}
    /**
     * Create a new empty plan with specialist
     */
    public function store(StorePlanRequest $request)
    {
        $plan = $this->createPlanAction->execute($request->validated());

        return redirect()->route('plans.show', $plan->id);
    }

    /**
     * Show the plan creation stepper
     */
    public function show(Request $request, $id)
    {
        $plan = Plan::with(['specialist.country', 'destination.activities'])->findOrFail($id);
        
        // Check for payment success/cancel query parameters
        $paymentStatus = $request->get('payment');
        
        if ($paymentStatus === 'success') {
            // Refresh plan to get latest payment status
            $plan->refresh();
            
            // Check payment status and update if needed
            $isPaid = $this->checkPaymentStatusAction->execute($plan);
            
            if ($isPaid) {
                // Payment was successful - show success page
                session()->flash('payment_success', 'Payment completed successfully!');
            }
        } elseif ($paymentStatus === 'cancelled') {
            // Cancel appointment and delete Google Calendar event
            $this->cancelAppointmentAction->execute($plan);
            session()->flash('payment_cancelled', 'Payment was cancelled. Appointment has been cancelled.');
        }

        // Get plan data using action
        $data = $this->getPlanDataAction->execute($plan, $paymentStatus);

        return Inertia::render('Web/Plan/PlanStepper', $data);
    }

    /**
     * Update plan data (for stepper steps)
     */
    public function update(UpdatePlanRequest $request, $id)
    {
        try {
            $plan = Plan::findOrFail($id);

            $plan = $this->updatePlanAction->execute($plan, $request->validated());

            // If Inertia request, return back with success
            if ($request->header('X-Inertia')) {
                return back()->with('success', 'Plan updated successfully');
            }

            // Otherwise return JSON for API calls
            return response()->json([
                'success' => true,
                'plan' => [
                    'id' => $plan->id,
                    'status' => $plan->status,
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('Error updating plan', ['error' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
            if ($request->header('X-Inertia')) {
                return back()->withErrors(['error' => 'An error occurred while updating the plan.']);
            }
            throw $e;
        }
    }

    /**
     * Get availability for a plan
     */
    public function getAvailability(GetPlanAvailabilityRequest $request, $id)
    {
        try {
            $plan = Plan::with(['specialist.workingHours'])->findOrFail($id);
            $selectedDate = $request->validated()['date'];

            $result = $this->getPlanAvailabilityAction->execute($plan, $selectedDate);

            return response()->json($result);

        } catch (\Exception $e) {
            Log::error('Get plan availability error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
                'plan_id' => $id
            ]);
            $statusCode = str_contains($e->getMessage(), 'not found') ? 404 : 500;
            return response()->json(['error' => $e->getMessage()], $statusCode);
        }
    }


    /**
     * Create Stripe checkout session
     */
    public function createCheckoutSession(Request $request, $id)
    {
        try {
            $plan = Plan::findOrFail($id);

            $result = $this->createCheckoutSessionAction->execute($plan);

            return response()->json($result);

        } catch (\Exception $e) {
            Log::error('Failed to create Stripe checkout session', [
                'plan_id' => $id,
                'error' => $e->getMessage(),
            ]);
            $statusCode = str_contains($e->getMessage(), 'already') ? 400 : 500;
            return response()->json(['error' => $e->getMessage()], $statusCode);
        }
    }

    /**
     * Handle Stripe webhook
     */
    public function handleStripeWebhook(Request $request)
    {
        try {
            $payload = $request->getContent();
            $sigHeader = $request->header('Stripe-Signature');
            $endpointSecret = config('services.stripe.webhook_secret');

            $result = $this->handleStripeWebhookAction->execute($payload, $sigHeader, $endpointSecret);

            return response()->json($result);

        } catch (\Exception $e) {
            Log::error('Stripe webhook error', [
                'error' => $e->getMessage(),
            ]);
            return response()->json(['error' => 'Webhook handling failed'], 400);
        }
    }


    /**
     * Download calendar file (.ics) for appointment
     */
    public function downloadCalendar($id)
    {
        try {
            $plan = Plan::with('specialist.country')->findOrFail($id);

            $icsContent = $this->downloadCalendarAction->execute($plan);

            // Generate filename
            $startTime = \Carbon\Carbon::parse($plan->appointment_start);
            $filename = 'appointment-' . $plan->id . '-' . $startTime->format('Y-m-d') . '.ics';

            return response($icsContent)
                ->header('Content-Type', 'text/calendar; charset=utf-8')
                ->header('Content-Disposition', 'attachment; filename="' . $filename . '"')
                ->header('Content-Length', strlen($icsContent));

        } catch (\Exception $e) {
            Log::error('Failed to generate calendar file', [
                'plan_id' => $id,
                'error' => $e->getMessage(),
            ]);
            $statusCode = str_contains($e->getMessage(), 'not found') ? 404 : 500;
            return response()->json(['error' => $e->getMessage()], $statusCode);
        }
    }

    /**
     * Download Stripe invoice PDF
     */
    public function downloadInvoice($id)
    {
        try {
            $plan = Plan::findOrFail($id);

            $invoiceUrl = $this->downloadInvoiceAction->execute($plan);

            return redirect($invoiceUrl);

        } catch (\Exception $e) {
            Log::error('Failed to download Stripe invoice', [
                'plan_id' => $id,
                'error' => $e->getMessage(),
            ]);
            $statusCode = str_contains($e->getMessage(), 'not found') || str_contains($e->getMessage(), 'not available') ? 404 : 500;
            return response()->json(['error' => $e->getMessage()], $statusCode);
        }
    }

}
