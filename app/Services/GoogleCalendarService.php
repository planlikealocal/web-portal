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
            $this->client->setAccessToken($user->google_access_token);
            
            // Check if token is expired and refresh if needed
            if ($this->isTokenExpired()) {
                $this->refreshToken();
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
    protected function refreshToken(): bool
    {
        try {
            if (!$this->user->google_refresh_token) {
                Log::error('No refresh token available for user: ' . $this->user->id);
                return false;
            }

            $this->client->setRefreshToken($this->user->google_refresh_token);
            $accessToken = $this->client->fetchAccessTokenWithRefreshToken();

            if (isset($accessToken['error'])) {
                Log::error('Token refresh failed: ' . $accessToken['error']);
                return false;
            }

            // Update user with new tokens
            $this->user->update([
                'google_access_token' => $accessToken['access_token'],
                'google_token_expires' => Carbon::now()->addSeconds($accessToken['expires_in']),
            ]);

            $this->client->setAccessToken($accessToken['access_token']);
            $this->calendarService = new Calendar($this->client);

            return true;

        } catch (\Exception $e) {
            Log::error('Token refresh error: ' . $e->getMessage());
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
}
