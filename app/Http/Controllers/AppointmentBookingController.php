<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;

class AppointmentBookingController extends Controller
{
    /**
     * Show the appointment booking page
     */
    public function index()
    {
        // Get all specialists who have Google Calendar connected
        $specialists = User::where('role', 'specialist')
            ->whereNotNull('google_access_token')
            ->select(['id', 'name', 'email'])
            ->get();

        return Inertia::render('AppointmentBooking', [
            'specialists' => $specialists
        ]);
    }

    /**
     * Show Google Calendar settings for specialists
     */
    public function googleCalendarSettings()
    {
        $user = auth()->user();
        
        return Inertia::render('GoogleCalendarSettings', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'hasGoogleCalendarConnected' => $user->hasGoogleCalendarConnected(),
                'isGoogleTokenExpired' => $user->isGoogleTokenExpired(),
                'google_calendar_id' => $user->google_calendar_id,
                'google_token_expires' => $user->google_token_expires,
            ]
        ]);
    }
}