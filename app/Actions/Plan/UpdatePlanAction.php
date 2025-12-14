<?php

namespace App\Actions\Plan;

use App\Models\Plan;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Log;

class UpdatePlanAction extends AbstractPlanAction
{
    public function execute(...$args): Plan
    {
        $plan = $args[0];
        $data = $args[1];
        
        $this->logAction('update_plan', ['plan_id' => $plan->id, 'data' => array_keys($data)]);

        // Filter out plan_type and selected_plan if they're empty to avoid errors if columns don't exist yet
        $updateData = [];
        foreach ($data as $key => $value) {
            // Skip plan_type and selected_plan if they're empty or if columns don't exist
            if (in_array($key, ['plan_type', 'selected_plan'])) {
                // Only include if not empty AND if the column exists in the database
                if (!empty($value)) {
                    try {
                        // Check if column exists by trying to access it
                        $columnExists = Schema::hasColumn('plans', $key);
                        if ($columnExists) {
                            $updateData[$key] = $value;
                        }
                    } catch (\Exception $e) {
                        // If we can't check, skip it to be safe
                        Log::info("Skipping column {$key} - column check failed: " . $e->getMessage());
                        continue;
                    }
                }
            } else {
                $updateData[$key] = $value;
            }
        }

        Log::info('Updating plan', ['plan_id' => $plan->id, 'data' => $updateData]);
        $plan->update($updateData);
        Log::info('Plan updated successfully', ['plan_id' => $plan->id]);

        // Handle selected_time_slot if it's a JSON string (from frontend)
        if (isset($updateData['selected_time_slot']) && is_string($updateData['selected_time_slot'])) {
            $slotData = json_decode($updateData['selected_time_slot'], true);
            if ($slotData && isset($slotData['start']) && isset($slotData['end'])) {
                $updateData['appointment_start'] = $slotData['start'];
                $updateData['appointment_end'] = $slotData['end'];
            }
        }

        // Refresh plan to get latest data including payment status
        $plan->refresh();

        // Automatically create Google Calendar appointment if:
        // 1. Appointment times are set (either in updateData or already on plan)
        // 2. Payment is already paid
        // 3. Appointment hasn't been created yet
        $hasAppointmentTimes = (!empty($updateData['appointment_start']) && !empty($updateData['appointment_end'])) ||
                                ($plan->appointment_start && $plan->appointment_end);
        
        if ($hasAppointmentTimes && $plan->payment_status === 'paid' && !$plan->google_calendar_event_id) {
            try {
                $confirmAppointmentAction = new ConfirmAppointmentAction($this->googleCalendarService);
                $confirmAppointmentAction->execute($plan);
                Log::info('Google Calendar appointment created automatically after plan update', [
                    'plan_id' => $plan->id,
                ]);
            } catch (\Exception $e) {
                $errorMessage = $e->getMessage();
                $isTokenRevoked = str_contains($errorMessage, 'Token expired or revoked') ||
                                str_contains($errorMessage, 'invalid_grant') ||
                                str_contains($errorMessage, 'reconnect your Google Calendar');
                
                if ($isTokenRevoked) {
                    Log::error('Google Calendar appointment creation failed due to revoked/expired token', [
                        'plan_id' => $plan->id,
                        'specialist_id' => $plan->specialist_id,
                        'error' => $errorMessage,
                        'action_required' => 'Specialist needs to reconnect Google Calendar at /specialist/google-calendar-settings',
                    ]);
                } else {
                    Log::error('Failed to create Google Calendar event automatically', [
                        'plan_id' => $plan->id,
                        'error' => $errorMessage,
                        'trace' => $e->getTraceAsString(),
                    ]);
                }
                // Don't fail the request if Google Calendar event creation fails
            }
        }

        // If status is being set to 'completed' and appointment details are provided, create Google Calendar event
        // (This is a fallback for the old flow where status is set to 'completed')
        if (isset($updateData['status']) && $updateData['status'] === 'completed') {
            // Check if appointment details are available
            if (!empty($updateData['appointment_start']) && !empty($updateData['appointment_end'])) {
                // Only create if not already created above
                if (!$plan->google_calendar_event_id) {
                    try {
                        $confirmAppointmentAction = new ConfirmAppointmentAction($this->googleCalendarService);
                        $confirmAppointmentAction->execute($plan);
                    } catch (\Exception $e) {
                        Log::error('Failed to create Google Calendar event', [
                            'plan_id' => $plan->id,
                            'error' => $e->getMessage()
                        ]);
                        // Don't fail the request if Google Calendar event creation fails
                    }
                }
            } else {
                Log::warning('Plan marked as completed but no appointment details provided', [
                    'plan_id' => $plan->id,
                    'update_data' => $updateData
                ]);
            }
        }

        return $plan;
    }
}

