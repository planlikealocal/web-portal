<?php

namespace App\Actions\Plan;

use App\Models\Plan;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class GetPlanAvailabilityAction extends AbstractPlanAction
{
    public function execute(...$args): array
    {
        $plan = $args[0];
        $selectedDate = $args[1] ?? null;

        if (!$plan->specialist_id) {
            throw new \Exception('Plan does not have a specialist');
        }

        $specialist = $plan->specialist;
        if (!$specialist) {
            throw new \Exception('Specialist not found');
        }

        // Get User model for the specialist (linked by email)
        $user = User::where('email', $specialist->email)->first();

        if (!$user) {
            throw new \Exception('User not found for specialist');
        }

        // Get plan duration based on selected plan
        $planType = $plan->selected_plan ?? $plan->plan_type ?? 'pathfinder';
        $durationMap = [
            'explore' => 60,
            'pathfinder' => 80,
            'premium' => 105,
        ];
        $durationMinutes = $durationMap[$planType] ?? 80;

        // Get working hours
        $workingHours = $specialist->workingHours->map(function ($wh) {
            return [
                'start_time' => substr($wh->start_time, 0, 5), // Format as HH:MM
                'end_time' => substr($wh->end_time, 0, 5), // Format as HH:MM
            ];
        })->toArray();

        if (empty($workingHours)) {
            throw new \Exception('Specialist has no working hours configured');
        }

        // Get specialist timezone
        $timezone = $specialist->timezone;
        if (!$timezone) {
            throw new \Exception('Specialist has no timezone configured');
        }

        if (!$selectedDate) {
            throw new \Exception('No date selected');
        }

        if (!$user->hasGoogleCalendarConnected()) {
            throw new \Exception('Google Calendar not connected');
        }

        // Calculate availability using Google Calendar (excludes allocated times)
        $availability = [];

        if ($user->hasGoogleCalendarConnected()) {
            Log::info('Google Calendar connected for specialist', [
                'user_id' => $user->id,
                'selected_date' => $selectedDate,
                'working_hours' => $workingHours,
            ]);
            // Use Google Calendar to get availability (excludes Google Calendar events)
            // Pass selected date to only check that specific date for better performance
            $this->googleCalendarService->setUser($user);
            $availability = $this->googleCalendarService->calculateAvailability(
                $workingHours,
                $durationMinutes,
                $timezone,
                $selectedDate // Only check the selected date
            );
            Log::info('Google Calendar availability', [
                'availability_count' => count($availability),
                'selected_date' => $selectedDate
            ]);
        } else {
            // Fallback to local calculation if Google Calendar is not connected
            $availability = $this->calculateLocalAvailability(
                $workingHours,
                $durationMinutes,
                $timezone,
                $selectedDate
            );
        }

        return [
            'success' => true,
            'plan_id' => $plan->id,
            'specialist_id' => $specialist->id,
            'plan_type' => $planType,
            'duration_minutes' => $durationMinutes,
            'working_hours' => $workingHours,
            'timezone' => $timezone,
            'selected_date' => $selectedDate,
            'availability' => $availability,
        ];
    }

    /**
     * Calculate availability locally based on working hours only (for testing without Google Calendar)
     *
     * @param array $workingHours Array of ['start_time' => 'HH:MM', 'end_time' => 'HH:MM']
     * @param int $durationMinutes Duration in minutes (60, 80, or 105)
     * @param string $timezone Timezone for the specialist
     * @param string|null $selectedDate Optional date filter (YYYY-MM-DD format)
     * @return array Array of available time slots
     */
    private function calculateLocalAvailability(array $workingHours, int $durationMinutes, string $timezone = 'UTC', ?string $selectedDate = null): array
    {
        try {
            // Get today in specialist's timezone
            $today = Carbon::now($timezone)->startOfDay();
            $tomorrow = $today->copy()->addDay();
            $dayAfterTomorrow = $tomorrow->copy()->addDay();

            $availabilityArray = [];

            // If a specific date is provided, only calculate for that date
            if ($selectedDate) {
                try {
                    $targetDate = Carbon::createFromFormat('Y-m-d', $selectedDate, $timezone)->startOfDay();
                    // Ensure the date is at least day after tomorrow
                    if ($targetDate->lt($dayAfterTomorrow)) {
                        return []; // Date is too soon
                    }
                    $datesToProcess = [$targetDate];
                } catch (\Exception $e) {
                    Log::error('Invalid date format provided: ' . $selectedDate);
                    return [];
                }
            } else {
                // Default: Process each day from day after tomorrow to t + 14 days
                $endDate = $today->copy()->addDays(14);
                $datesToProcess = [];
                $currentDate = $dayAfterTomorrow->copy();
                while ($currentDate->lte($endDate)) {
                    $datesToProcess[] = $currentDate->copy();
                    $currentDate->addDay();
                }
            }

            // Process each date
            foreach ($datesToProcess as $currentDate) {
                // Get working hours for this day (assuming same hours every day, could be enhanced later)
                foreach ($workingHours as $wh) {
                    // Parse working hours - handle both 'H:i:s' and 'H:i' formats
                    $startTimeStr = $wh['start_time'];
                    $endTimeStr = $wh['end_time'];

                    // Ensure format is H:i:s
                    if (strlen($startTimeStr) === 5) {
                        $startTimeStr .= ':00';
                    }
                    if (strlen($endTimeStr) === 5) {
                        $endTimeStr .= ':00';
                    }

                    $startTime = Carbon::createFromFormat('H:i:s', $startTimeStr, $timezone)
                        ->setDate($currentDate->year, $currentDate->month, $currentDate->day);
                    $endTime = Carbon::createFromFormat('H:i:s', $endTimeStr, $timezone)
                        ->setDate($currentDate->year, $currentDate->month, $currentDate->day);

                    // If end_time is earlier than start_time, it means it spans midnight - adjust
                    if ($endTime->lt($startTime)) {
                        $endTime->addDay();
                    }

                    // Generate slots starting at the top of every hour within working hours
                    // Start from the first hour that's >= startTime
                    $slotStart = $startTime->copy()->startOfHour();
                    if ($slotStart->lt($startTime)) {
                        $slotStart->addHour();
                    }

                    // Continue until we can't fit a full duration slot
                    while ($slotStart->copy()->addMinutes($durationMinutes)->lte($endTime)) {
                        $slotEnd = $slotStart->copy()->addMinutes($durationMinutes);

                        // Check if slot fits within working hours
                        if ($slotStart->gte($startTime) && $slotEnd->lte($endTime)) {
                            // For local testing, all slots within working hours are available
                            // (no Google Calendar conflict checking)
                            $availabilityArray[] = [
                                'start' => $slotStart->toISOString(),
                                'end' => $slotEnd->toISOString(),
                                'date' => $slotStart->toDateString(),
                                'time' => $slotStart->format('H:i'),
                                'time_end' => $slotEnd->format('H:i'),
                                'duration_minutes' => $durationMinutes,
                            ];
                        }

                        // Move to next hour
                        $slotStart->addHour();
                    }
                }
            }

            return $availabilityArray;
        } catch (\Exception $e) {
            Log::error('Local availability calculation error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);
            return [];
        }
    }
}

