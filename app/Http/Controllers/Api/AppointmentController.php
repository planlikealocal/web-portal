<?php

namespace App\Http\Controllers\Api;

use App\Actions\Plan\ConfirmAppointmentAction;
use App\Actions\Plan\CancelAppointmentAction;
use App\Http\Resources\Api\PlanResource;
use App\Models\Plan;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AppointmentController extends BaseApiController
{
    public function __construct(
        private ConfirmAppointmentAction $confirmAppointmentAction,
        private CancelAppointmentAction $cancelAppointmentAction,
    ) {}

    /**
     * List user's appointments
     */
    public function list(Request $request): JsonResponse
    {
        try {
            $user = $request->user();
            
            $appointments = Plan::where('email', $user->email)
                ->where('appointment_status', 'active')
                ->with(['specialist', 'destination'])
                ->orderBy('appointment_start', 'asc')
                ->get();

            return $this->success([
                'appointments' => PlanResource::collection($appointments),
            ], 'Appointments retrieved successfully');
        } catch (\Exception $e) {
            return $this->error('Failed to retrieve appointments: ' . $e->getMessage());
        }
    }

    /**
     * Book an appointment
     */
    public function book(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'plan_id' => 'required|exists:plans,id',
                'appointment_start' => 'required|date',
                'appointment_end' => 'required|date|after:appointment_start',
            ]);

            $user = $request->user();
            $plan = Plan::where('id', $request->plan_id)
                ->where('email', $user->email)
                ->firstOrFail();

            // Update plan with appointment details
            $plan->update([
                'appointment_start' => $request->appointment_start,
                'appointment_end' => $request->appointment_end,
                'selected_time_slot' => $request->appointment_start . ' - ' . $request->appointment_end,
            ]);

            // Confirm appointment (creates Google Calendar event)
            try {
                $this->confirmAppointmentAction->execute($plan);
            } catch (\Exception $e) {
                // Log error but don't fail the booking if Google Calendar fails
                \Log::warning('Failed to create Google Calendar event for appointment', [
                    'plan_id' => $plan->id,
                    'error' => $e->getMessage(),
                ]);
            }

            return $this->success([
                'appointment' => new PlanResource($plan->load(['specialist', 'destination'])),
            ], 'Appointment booked successfully');
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationError($e->errors(), 'Validation failed');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFound('Plan not found');
        } catch (\Exception $e) {
            return $this->error('Failed to book appointment: ' . $e->getMessage());
        }
    }

    /**
     * Cancel an appointment
     */
    public function cancel(Request $request, $id): JsonResponse
    {
        try {
            $user = $request->user();
            $plan = Plan::where('id', $id)
                ->where('email', $user->email)
                ->firstOrFail();

            if (!$plan->canCancelAppointment()) {
                return $this->error('This appointment cannot be cancelled', null, 400);
            }

            $this->cancelAppointmentAction->execute($plan, [
                'cancellation_comment' => $request->get('cancellation_comment'),
                'canceled_by_type' => 'user',
                'canceled_by_id' => $user->id,
            ]);

            return $this->success([
                'appointment' => new PlanResource($plan->load(['specialist', 'destination'])),
            ], 'Appointment cancelled successfully');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFound('Appointment not found');
        } catch (\Exception $e) {
            return $this->error('Failed to cancel appointment: ' . $e->getMessage());
        }
    }
}
