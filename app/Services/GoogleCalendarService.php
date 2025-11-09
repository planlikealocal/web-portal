<?php

namespace App\Services;

use App\Models\User;
use Google\Client;
use Google\Service\Calendar;
use Google\Service\Calendar\Event;
use Google\Service\Calendar\EventDateTime;
use Google\Service\Calendar\FreeBusyRequest;
use Google\Service\Calendar\FreeBusyRequestItem;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class GoogleCalendarService
{
    protected $user;
    protected $client;
    protected $calendarService;

    public function __construct()
    {
        $this->client = new Client();
        $this->client->setClientId(config('services.google.client_id'));
        $this->client->setClientSecret(config('services.google.client_secret'));
        $this->client->setScopes([
            'https://www.googleapis.com/auth/calendar',
            'https://www.googleapis.com/auth/calendar.events'
        ]);
    }

    /**
     * Set the user for this service instance
     */
    public function setUser(User $user): self
    {
        $this->user = $user;
        
        if ($user->google_access_token) {
            // Set redirect URI if configured
            if (config('services.google.redirect')) {
                $this->client->setRedirectUri(config('services.google.redirect'));
            }
            
            $this->client->setAccessToken($user->google_access_token);
            
            // Check if token is expired and refresh if needed
            if ($this->isTokenExpired()) {
                // Only refresh if we have a refresh token
                if ($user->google_refresh_token) {
                    $refreshed = $this->refreshToken();
                    if (!$refreshed) {
                        Log::warning('Failed to refresh token for user: ' . $user->id . '. Token may need to be re-authenticated.');
                    }
                } else {
                    Log::warning('Token expired but no refresh token available for user: ' . $user->id);
                }
            }
            
            $this->calendarService = new Calendar($this->client);
        }
        
        return $this;
    }

    /**
     * Check if the access token is expired
     */
    protected function isTokenExpired(): bool
    {
        if (!$this->user->google_token_expires) {
            return true;
        }
        
        return Carbon::now()->isAfter($this->user->google_token_expires);
    }

    /**
     * Refresh the access token using refresh token
     */
    public function refreshToken(User $user = null): bool
    {
        try {
            $targetUser = $user ?: $this->user;
            
            if (!$targetUser) {
                Log::error('No user provided for token refresh');
                return false;
            }
            
            if (!$targetUser->google_refresh_token) {
                Log::error('No refresh token available for user: ' . $targetUser->id);
                return false;
            }

            // Set redirect URI if configured (required for token refresh)
            if (config('services.google.redirect')) {
                $this->client->setRedirectUri(config('services.google.redirect'));
            }

            // Create a token array with the refresh token
            // The Google Client library expects the refresh token to be part of the access token array
            $tokenArray = [
                'access_token' => $targetUser->google_access_token,
                'refresh_token' => $targetUser->google_refresh_token,
                'expires_in' => $targetUser->google_token_expires ? 
                    Carbon::now()->diffInSeconds($targetUser->google_token_expires) : 0,
            ];
            
            // Set the token array on the client
            $this->client->setAccessToken($tokenArray);
            
            // Fetch new access token using the refresh token
            $accessToken = $this->client->fetchAccessTokenWithRefreshToken();

            if (isset($accessToken['error'])) {
                Log::error('Token refresh failed: ' . json_encode($accessToken));
                return false;
            }

            // Preserve refresh token if Google doesn't return a new one
            $refreshToken = $accessToken['refresh_token'] ?? $targetUser->google_refresh_token;

            // Update user with new tokens
            $targetUser->update([
                'google_access_token' => $accessToken['access_token'],
                'google_refresh_token' => $refreshToken,
                'google_token_expires' => Carbon::now()->addSeconds($accessToken['expires_in'] ?? 3600),
            ]);

            // Update the service's user reference if it's the same user
            if ($this->user && $this->user->id === $targetUser->id) {
                $this->user = $targetUser->fresh();
                // Set the full token array (the client already has it from fetchAccessTokenWithRefreshToken, but set it again for consistency)
                $this->client->setAccessToken($accessToken);
                $this->calendarService = new Calendar($this->client);
            }

            Log::info('Token refreshed successfully for user: ' . $targetUser->id);
            return true;

        } catch (\Exception $e) {
            Log::error('Token refresh error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);
            return false;
        }
    }

    /**
     * Get the primary calendar ID for the user
     */
    public function getPrimaryCalendarId(): ?string
    {
        try {
            if (!$this->calendarService) {
                return null;
            }

            $calendarList = $this->calendarService->calendarList->listCalendarList();
            
            foreach ($calendarList->getItems() as $calendar) {
                if ($calendar->getPrimary()) {
                    return $calendar->getId();
                }
            }

            // If no primary calendar found, return the first calendar
            $items = $calendarList->getItems();
            return $items ? $items[0]->getId() : null;

        } catch (\Exception $e) {
            Log::error('Get primary calendar ID error: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Get available time slots for a date range
     */
    public function getAvailableTimeSlots(string $startDate, string $endDate, int $durationMinutes = 60): array
    {
        try {
            if (!$this->calendarService) {
                return [];
            }

            $calendarId = $this->user->google_calendar_id ?: $this->getPrimaryCalendarId();
            
            if (!$calendarId) {
                return [];
            }

            $startDateTime = Carbon::parse($startDate)->startOfDay();
            $endDateTime = Carbon::parse($endDate)->endOfDay();

            // Create free/busy request
            $freeBusyRequest = new FreeBusyRequest();
            $freeBusyRequest->setTimeMin($startDateTime->toRfc3339String());
            $freeBusyRequest->setTimeMax($endDateTime->toRfc3339String());
            
            $freeBusyRequestItem = new FreeBusyRequestItem();
            $freeBusyRequestItem->setId($calendarId);
            $freeBusyRequest->setItems([$freeBusyRequestItem]);

            $freeBusyResponse = $this->calendarService->freebusy->query($freeBusyRequest);
            $busyTimes = $freeBusyResponse->getCalendars()[$calendarId]->getBusy() ?? [];

            // Generate available slots
            $availableSlots = [];
            $currentDate = $startDateTime->copy();

            while ($currentDate->lte($endDateTime)) {
                // Skip past dates
                if ($currentDate->isPast()) {
                    $currentDate->addDay();
                    continue;
                }

                // Skip weekends (optional - customize as needed)
                if ($currentDate->isWeekend()) {
                    $currentDate->addDay();
                    continue;
                }

                $daySlots = $this->generateDaySlots($currentDate, $busyTimes, $durationMinutes);
                $availableSlots = array_merge($availableSlots, $daySlots);
                
                $currentDate->addDay();
            }

            return $availableSlots;

        } catch (\Exception $e) {
            Log::error('Get available time slots error: ' . $e->getMessage());
            return [];
        }
    }

    /**
     * Generate available slots for a specific day
     */
    protected function generateDaySlots(Carbon $date, array $busyTimes, int $durationMinutes): array
    {
        $slots = [];
        
        // Define working hours (9 AM to 5 PM - customize as needed)
        $startHour = 9;
        $endHour = 17;
        
        $dayStart = $date->copy()->setHour($startHour)->setMinute(0)->setSecond(0);
        $dayEnd = $date->copy()->setHour($endHour)->setMinute(0)->setSecond(0);
        
        $currentSlot = $dayStart->copy();
        
        while ($currentSlot->addMinutes($durationMinutes)->lte($dayEnd)) {
            $slotStart = $currentSlot->copy()->subMinutes($durationMinutes);
            $slotEnd = $currentSlot->copy();
            
            // Check if this slot conflicts with busy times
            if (!$this->isSlotBusy($slotStart, $slotEnd, $busyTimes)) {
                $slots[] = [
                    'start' => $slotStart->toISOString(),
                    'end' => $slotEnd->toISOString(),
                    'date' => $slotStart->toDateString(),
                    'time' => $slotStart->format('H:i'),
                    'duration_minutes' => $durationMinutes,
                ];
            }
        }
        
        return $slots;
    }

    /**
     * Check if a time slot conflicts with busy times
     */
    protected function isSlotBusy(Carbon $slotStart, Carbon $slotEnd, array $busyTimes): bool
    {
        foreach ($busyTimes as $busyTime) {
            $busyStart = Carbon::parse($busyTime->getStart());
            $busyEnd = Carbon::parse($busyTime->getEnd());
            
            // Check for overlap
            if ($slotStart->lt($busyEnd) && $slotEnd->gt($busyStart)) {
                return true;
            }
        }
        
        return false;
    }

    /**
     * Create a calendar event
     */
    public function createEvent(array $eventData): array
    {
        try {
            if (!$this->calendarService) {
                throw new \Exception('Calendar service not initialized');
            }

            $calendarId = $this->user->google_calendar_id ?: $this->getPrimaryCalendarId();
            
            if (!$calendarId) {
                throw new \Exception('No calendar ID available');
            }

            $startTime = Carbon::parse($eventData['start_time']);
            $endTime = $startTime->copy()->addMinutes($eventData['duration']);

            $event = new Event();
            $event->setSummary('Appointment with ' . $eventData['client_name']);
            
            $description = "Client: {$eventData['client_name']}\n";
            $description .= "Email: {$eventData['client_email']}\n";
            if (!empty($eventData['client_phone'])) {
                $description .= "Phone: {$eventData['client_phone']}\n";
            }
            if (!empty($eventData['notes'])) {
                $description .= "Notes: {$eventData['notes']}\n";
            }
            $event->setDescription($description);

            $start = new EventDateTime();
            $start->setDateTime($startTime->toRfc3339String());
            $start->setTimeZone($startTime->timezone->getName());
            $event->setStart($start);

            $end = new EventDateTime();
            $end->setDateTime($endTime->toRfc3339String());
            $end->setTimeZone($endTime->timezone->getName());
            $event->setEnd($end);

            // Add attendees
            $attendees = [
                [
                    'email' => $eventData['client_email'],
                    'displayName' => $eventData['client_name'],
                ],
                [
                    'email' => $this->user->email,
                    'displayName' => $this->user->name,
                ]
            ];
            $event->setAttendees($attendees);

            // Set event as confirmed
            $event->setStatus('confirmed');

            $createdEvent = $this->calendarService->events->insert($calendarId, $event);

            return [
                'id' => $createdEvent->getId(),
                'summary' => $createdEvent->getSummary(),
                'start' => $createdEvent->getStart()->getDateTime(),
                'end' => $createdEvent->getEnd()->getDateTime(),
                'htmlLink' => $createdEvent->getHtmlLink(),
            ];

        } catch (\Exception $e) {
            Log::error('Create event error: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Check if user has valid Google Calendar connection
     */
    public function isConnected(): bool
    {
        return $this->user && 
               $this->user->google_access_token && 
               $this->calendarService !== null;
    }

    /**
     * Get calendar events for a date range (used for availability calculation)
     */
    public function getCalendarEvents(string $startDate, string $endDate, string $timezone = 'UTC'): array
    {
        try {
            if (!$this->calendarService) {
                return [];
            }

            $calendarId = $this->user->google_calendar_id ?: $this->getPrimaryCalendarId();
            
            if (!$calendarId) {
                return [];
            }

            $startDateTime = Carbon::parse($startDate)->setTimezone($timezone)->startOfDay();
            $endDateTime = Carbon::parse($endDate)->setTimezone($timezone)->endOfDay();

            // Create free/busy request
            $freeBusyRequest = new FreeBusyRequest();
            $freeBusyRequest->setTimeMin($startDateTime->toRfc3339String());
            $freeBusyRequest->setTimeMax($endDateTime->toRfc3339String());
            
            $freeBusyRequestItem = new FreeBusyRequestItem();
            $freeBusyRequestItem->setId($calendarId);
            $freeBusyRequest->setItems([$freeBusyRequestItem]);

            $freeBusyResponse = $this->calendarService->freebusy->query($freeBusyRequest);
            $busyTimes = $freeBusyResponse->getCalendars()[$calendarId]->getBusy() ?? [];

            // Convert busy times to array format
            $events = [];
            foreach ($busyTimes as $busyTime) {
                $events[] = [
                    'start' => Carbon::parse($busyTime->getStart())->setTimezone($timezone),
                    'end' => Carbon::parse($busyTime->getEnd())->setTimezone($timezone),
                ];
            }

            return $events;

        } catch (\Exception $e) {
            Log::error('Get calendar events error: ' . $e->getMessage());
            return [];
        }
    }

    /**
     * Calculate available time slots based on working hours, calendar, and duration
     * 
     * @param array $workingHours Array of ['start_time' => 'HH:MM', 'end_time' => 'HH:MM']
     * @param int $durationMinutes Duration in minutes (60, 80, or 105)
     * @param string $timezone Timezone for the specialist
     * @param string|null $selectedDate Optional specific date to check (YYYY-MM-DD format). If provided, only checks this date
     * @return array Array of available time slots
     */
    public function calculateAvailability(array $workingHours, int $durationMinutes, string $timezone = 'UTC', ?string $selectedDate = null): array
    {
        try {
            // Get today in specialist's timezone
            $today = Carbon::now($timezone)->startOfDay();
            $tomorrow = $today->copy()->addDay();
            $dayAfterTomorrow = $tomorrow->copy()->addDay();
            
            // If a specific date is provided, only check that date
            if ($selectedDate) {
                $targetDate = Carbon::parse($selectedDate, $timezone)->startOfDay();
                
                // Validate that the date is at least day after tomorrow
                if ($targetDate->lt($dayAfterTomorrow)) {
                    Log::warning('Selected date is before day after tomorrow', ['date' => $selectedDate]);
                    return [];
                }
                
                $startDate = $targetDate;
                $endDate = $targetDate->copy()->endOfDay();
            } else {
                // Default: check from day after tomorrow to t + 14 days
                $startDate = $dayAfterTomorrow->copy();
                $endDate = $today->copy()->addDays(14); // t + 14 days
            }

            // Get calendar events for the date range (only for the selected date if provided)
            $calendarEvents = $this->getCalendarEvents($startDate->toDateString(), $endDate->toDateString(), $timezone);

            // Filter out events that are today or tomorrow (t + 48 hours)
            // Keep only events that start on or after day after tomorrow
            $validCalendarEvents = [];
            foreach ($calendarEvents as $event) {
                $eventStart = $event['start']->setTimezone($timezone);
                // Only include events that start on or after day after tomorrow
                if ($eventStart->gte($dayAfterTomorrow->startOfDay())) {
                    // If a specific date is provided, only include events for that date
                    if ($selectedDate) {
                        // Compare dates (not times) to ensure we only get events for the selected date
                        if ($eventStart->toDateString() === Carbon::parse($selectedDate)->toDateString()) {
                            $validCalendarEvents[] = $event;
                        }
                    } else {
                        $validCalendarEvents[] = $event;
                    }
                }
            }

            $availabilityArray = [];

            // Process each day (or just the selected date)
            $currentDate = $startDate->copy();
            $endDateForLoop = $selectedDate ? $startDate->copy() : $endDate;
            
            while ($currentDate->lte($endDateForLoop)) {
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
                            // Check if slot is available on calendar
                            $isAvailable = true;
                            foreach ($validCalendarEvents as $event) {
                                $eventStart = $event['start']->setTimezone($timezone);
                                $eventEnd = $event['end']->setTimezone($timezone);
                                
                                // Check for overlap
                                if ($slotStart->lt($eventEnd) && $slotEnd->gt($eventStart)) {
                                    $isAvailable = false;
                                    break;
                                }
                            }

                            if ($isAvailable) {
                                $availabilityArray[] = [
                                    'start' => $slotStart->toISOString(),
                                    'end' => $slotEnd->toISOString(),
                                    'date' => $slotStart->toDateString(),
                                    'time' => $slotStart->format('H:i'),
                                    'time_end' => $slotEnd->format('H:i'),
                                    'duration_minutes' => $durationMinutes,
                                ];
                            }
                        }

                        // Move to next hour
                        $slotStart->addHour();
                    }
                }

                $currentDate->addDay();
            }

            return $availabilityArray;

        } catch (\Exception $e) {
            Log::error('Calculate availability error: ' . $e->getMessage());
            return [];
        }
    }
}
