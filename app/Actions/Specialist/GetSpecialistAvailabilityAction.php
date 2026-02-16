<?php

namespace App\Actions\Specialist;

use App\Actions\Plan\AbstractPlanAction;
use App\Models\Specialist;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class GetSpecialistAvailabilityAction extends AbstractPlanAction
{
    public function execute(...$args): array
    {
        $specialist = $args[0];
        $selectedDate = $args[1];
        $durationMinutes = (int) $args[2];

        // Get working hours
        $workingHours = $specialist->workingHours->map(function ($wh) {
            return [
                'start_time' => substr($wh->start_time, 0, 5),
                'end_time' => substr($wh->end_time, 0, 5),
            ];
        })->toArray();

        if (empty($workingHours)) {
            throw new \Exception('Specialist has no working hours configured');
        }

        $timezone = $specialist->timezone;
        if (!$timezone) {
            throw new \Exception('Specialist has no timezone configured');
        }

        // Get User model for the specialist (linked by email)
        $user = User::where('email', $specialist->email)->first();

        if (!$user) {
            throw new \Exception('User not found for specialist');
        }

        $availability = [];

        if ($user->hasGoogleCalendarConnected()) {
            $this->googleCalendarService->setUser($user);
            $availability = $this->googleCalendarService->calculateAvailability(
                $workingHours,
                $durationMinutes,
                $timezone,
                $selectedDate
            );
        } else {
            $availability = $this->calculateLocalAvailability(
                $workingHours,
                $durationMinutes,
                $timezone,
                $selectedDate
            );
        }

        return [
            'specialist_id' => $specialist->id,
            'duration_minutes' => $durationMinutes,
            'timezone' => $timezone,
            'selected_date' => $selectedDate,
            'availability' => $availability,
        ];
    }

    private function calculateLocalAvailability(array $workingHours, int $durationMinutes, string $timezone = 'UTC', ?string $selectedDate = null): array
    {
        try {
            $today = Carbon::now($timezone)->startOfDay();
            $dayAfterTomorrow = $today->copy()->addDays(2);

            $availabilityArray = [];

            if ($selectedDate) {
                try {
                    $targetDate = Carbon::createFromFormat('Y-m-d', $selectedDate, $timezone)->startOfDay();
                    if ($targetDate->lt($dayAfterTomorrow)) {
                        return [];
                    }
                    $datesToProcess = [$targetDate];
                } catch (\Exception $e) {
                    Log::error('Invalid date format provided: ' . $selectedDate);
                    return [];
                }
            } else {
                $endDate = $today->copy()->addDays(14);
                $datesToProcess = [];
                $currentDate = $dayAfterTomorrow->copy();
                while ($currentDate->lte($endDate)) {
                    $datesToProcess[] = $currentDate->copy();
                    $currentDate->addDay();
                }
            }

            foreach ($datesToProcess as $currentDate) {
                foreach ($workingHours as $wh) {
                    $startTimeStr = $wh['start_time'];
                    $endTimeStr = $wh['end_time'];

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

                    if ($endTime->lt($startTime)) {
                        $endTime->addDay();
                    }

                    $slotStart = $startTime->copy()->startOfHour();
                    if ($slotStart->lt($startTime)) {
                        $slotStart->addHour();
                    }

                    while ($slotStart->copy()->addMinutes($durationMinutes)->lte($endTime)) {
                        $slotEnd = $slotStart->copy()->addMinutes($durationMinutes);

                        if ($slotStart->gte($startTime) && $slotEnd->lte($endTime)) {
                            $availabilityArray[] = [
                                'start' => $slotStart->toISOString(),
                                'end' => $slotEnd->toISOString(),
                                'date' => $slotStart->toDateString(),
                                'time' => $slotStart->format('H:i'),
                                'time_end' => $slotEnd->format('H:i'),
                                'duration_minutes' => $durationMinutes,
                            ];
                        }

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
