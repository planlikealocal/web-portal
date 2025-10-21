<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RequireGoogleCalendarForSpecialists
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();
        
        // Only apply to specialists
        if ($user && $user->isSpecialist()) {
            // Define routes that are always allowed (even without Google Calendar)
            $allowedRoutes = [
                'specialist.google-calendar.settings',
                'google.redirect',
                'google.callback',
                'google.disconnect',
                'specialist.logout', // Allow logout
            ];
            
            $currentRoute = $request->route()?->getName();
            
            // If not on an allowed route and Google Calendar is not connected
            if (!in_array($currentRoute, $allowedRoutes) && !$user->hasGoogleCalendarConnected()) {
                if ($request->expectsJson()) {
                    return response()->json([
                        'error' => 'Google Calendar connection required',
                        'message' => 'Please connect your Google Calendar to access the specialist portal.',
                        'redirect_to' => route('specialist.google-calendar.settings'),
                        'requires_google_calendar' => true
                    ], 403);
                }
                
                // For any other route, redirect to Google Calendar settings
                return redirect('/specialist/google-calendar-settings')
                    ->with('error', 'Google Calendar connection is required to access the specialist portal.')
                    ->with('redirect_after_connect', $request->url());
            }
        }
        
        return $next($request);
    }
}