<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;

class AppointmentBookingController extends Controller
{
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
                'hasPermanentGoogleCalendarConnection' => $user->hasPermanentGoogleCalendarConnection(),
                'isGoogleTokenExpired' => $user->isGoogleTokenExpired(),
                'google_calendar_id' => $user->google_calendar_id,
                'google_token_expires' => $user->google_token_expires,
            ]
        ]);
    }
}