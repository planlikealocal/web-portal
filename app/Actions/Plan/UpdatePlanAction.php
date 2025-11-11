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

        // If status is being set to 'completed' and appointment details are provided, create Google Calendar event
        if (isset($updateData['status']) && $updateData['status'] === 'completed') {
            // Handle selected_time_slot if it's a JSON string (from frontend)
            if (isset($updateData['selected_time_slot']) && is_string($updateData['selected_time_slot'])) {
                $slotData = json_decode($updateData['selected_time_slot'], true);
                if ($slotData && isset($slotData['start']) && isset($slotData['end'])) {
                    $updateData['appointment_start'] = $slotData['start'];
                    $updateData['appointment_end'] = $slotData['end'];
                }
            }
            
            // Check if appointment details are available
            if (!empty($updateData['appointment_start']) && !empty($updateData['appointment_end'])) {
                try {
                    // Refresh plan to get latest data
                    $plan->refresh();
                    $confirmAppointmentAction = new ConfirmAppointmentAction($this->googleCalendarService);
                    $confirmAppointmentAction->execute($plan);
                } catch (\Exception $e) {
                    Log::error('Failed to create Google Calendar event', [
                        'plan_id' => $plan->id,
                        'error' => $e->getMessage()
                    ]);
                    // Don't fail the request if Google Calendar event creation fails
                    // The plan is still saved, just without the calendar event
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

