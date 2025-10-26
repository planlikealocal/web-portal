<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\GoogleCalendarService;
use Google\Client;
use Google\Service\Calendar;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class GoogleController extends Controller
{
    protected $googleCalendarService;

    public function __construct(GoogleCalendarService $googleCalendarService)
    {
        $this->googleCalendarService = $googleCalendarService;
    }

    /**
     * Redirect to Google OAuth
     */
    public function redirect()
    {
        $client = new Client();
        $client->setClientId(config('services.google.client_id'));
        $client->setClientSecret(config('services.google.client_secret'));
        $client->setRedirectUri(config('services.google.redirect'));
        $client->setScopes([
            'https://www.googleapis.com/auth/calendar',
            'https://www.googleapis.com/auth/calendar.events'
        ]);
        $client->setAccessType('offline');
        $client->setPrompt('consent');

        $authUrl = $client->createAuthUrl();
        
        return redirect($authUrl);
    }

    /**
     * Handle Google OAuth callback
     */
    public function callback(Request $request)
    {
        try {
            $code = $request->get('code');
            
            if (!$code) {
                return redirect('/specialist/google-calendar-settings')->with('error', 'Authorization failed. Please try again.');
            }

            $client = new Client();
            $client->setClientId(config('services.google.client_id'));
            $client->setClientSecret(config('services.google.client_secret'));
            $client->setRedirectUri(config('services.google.redirect'));

            $accessToken = $client->fetchAccessTokenWithAuthCode($code);
            
            if (isset($accessToken['error'])) {
                Log::error('Google OAuth error: ' . $accessToken['error']);
                return redirect('/specialist/google-calendar-settings')->with('error', 'Failed to authenticate with Google.');
            }

            // Store tokens in database
            $user = Auth::user();
            $user->update([
                'google_access_token' => $accessToken['access_token'],
                'google_refresh_token' => $accessToken['refresh_token'] ?? null,
                'google_token_expires' => Carbon::now()->addSeconds($accessToken['expires_in']),
            ]);

            // Get user's primary calendar ID
            $this->googleCalendarService->setUser($user);
            $calendarId = $this->googleCalendarService->getPrimaryCalendarId();
            
            if ($calendarId) {
                $user->update(['google_calendar_id' => $calendarId]);
            }

            // Check if there's a redirect URL after connection
            $redirectAfterConnect = session('redirect_after_connect');
            if ($redirectAfterConnect) {
                session()->forget('redirect_after_connect');
                return redirect($redirectAfterConnect)->with('success', 'Google Calendar connected successfully!');
            }

            // Always redirect back to Google Calendar settings page after connection
            return redirect('/specialist/google-calendar-settings')->with('success', 'Google Calendar connected successfully!');

        } catch (\Exception $e) {
            Log::error('Google OAuth callback error: ' . $e->getMessage());
            return redirect('/specialist/google-calendar-settings')->with('error', 'Failed to connect Google Calendar.');
        }
    }

    /**
     * Get user's available time slots
     */
    public function getAvailability(Request $request, $userId)
    {
        try {
            $user = User::findOrFail($userId);
            
            if (!$user->isSpecialist()) {
                return response()->json(['error' => 'User is not a specialist'], 403);
            }

            if (!$user->google_access_token) {
                return response()->json(['error' => 'Google Calendar not connected'], 400);
            }

            $startDate = $request->get('start_date', Carbon::now()->toDateString());
            $endDate = $request->get('end_date', Carbon::now()->addDays(30)->toDateString());
            $duration = $request->get('duration', 60); // minutes

            $this->googleCalendarService->setUser($user);
            $availableSlots = $this->googleCalendarService->getAvailableTimeSlots(
                $startDate, 
                $endDate, 
                $duration
            );

            return response()->json([
                'specialist' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                ],
                'available_slots' => $availableSlots,
                'date_range' => [
                    'start' => $startDate,
                    'end' => $endDate,
                ],
                'duration_minutes' => $duration
            ]);

        } catch (\Exception $e) {
            Log::error('Get availability error: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to get availability'], 500);
        }
    }

    /**
     * Create a calendar event (appointment booking)
     */
    public function createAppointment(Request $request)
    {
        try {
            $request->validate([
                'specialist_id' => 'required|exists:users,id',
                'start_time' => 'required|date',
                'duration' => 'required|integer|min:15|max:480', // 15 minutes to 8 hours
                'client_name' => 'required|string|max:255',
                'client_email' => 'required|email|max:255',
                'client_phone' => 'nullable|string|max:20',
                'notes' => 'nullable|string|max:1000',
            ]);

            $specialist = User::findOrFail($request->specialist_id);
            
            if (!$specialist->isSpecialist()) {
                return response()->json(['error' => 'User is not a specialist'], 403);
            }

            if (!$specialist->google_access_token) {
                return response()->json(['error' => 'Specialist Google Calendar not connected'], 400);
            }

            $this->googleCalendarService->setUser($specialist);
            
            $eventData = [
                'start_time' => $request->start_time,
                'duration' => $request->duration,
                'client_name' => $request->client_name,
                'client_email' => $request->client_email,
                'client_phone' => $request->client_phone,
                'notes' => $request->notes,
            ];

            $event = $this->googleCalendarService->createEvent($eventData);

            return response()->json([
                'success' => true,
                'event' => $event,
                'message' => 'Appointment booked successfully!'
            ]);

        } catch (\Exception $e) {
            Log::error('Create appointment error: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to book appointment'], 500);
        }
    }

    /**
     * Disconnect Google Calendar
     */
    public function disconnect()
    {
        try {
            $user = Auth::user();
            $user->update([
                'google_access_token' => null,
                'google_refresh_token' => null,
                'google_token_expires' => null,
                'google_calendar_id' => null,
            ]);

            return redirect('/specialist/google-calendar-settings')->with('success', 'Google Calendar disconnected successfully!');

        } catch (\Exception $e) {
            Log::error('Disconnect Google Calendar error: ' . $e->getMessage());
            return redirect('/specialist/google-calendar-settings')->with('error', 'Failed to disconnect Google Calendar.');
        }
    }

    /**
     * Refresh Google Calendar token
     */
    public function refreshToken(Request $request)
    {
        try {
            $user = Auth::user();
            
            if (!$user->hasGoogleCalendarConnected()) {
                return response()->json(['error' => 'Google Calendar is not connected'], 400);
            }
            
            $refreshed = $this->googleCalendarService->refreshToken($user);
            
            if ($refreshed) {
                return response()->json(['success' => true, 'message' => 'Token refreshed successfully']);
            } else {
                return response()->json(['error' => 'Failed to refresh token. Please reconnect your Google Calendar.'], 400);
            }
            
        } catch (\Exception $e) {
            Log::error('Token refresh failed: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to refresh token. Please reconnect your Google Calendar.'], 500);
        }
    }
}