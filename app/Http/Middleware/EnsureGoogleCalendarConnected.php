<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureGoogleCalendarConnected
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();
        
        if (!$user || !$user->hasGoogleCalendarConnected()) {
            if ($request->expectsJson()) {
                return response()->json([
                    'error' => 'Google Calendar not connected',
                    'message' => 'Please connect your Google Calendar to access this feature.'
                ], 403);
            }
            
            return redirect('/specialist/google-calendar-settings')
                ->with('error', 'Please connect your Google Calendar to access this feature.');
        }
        
        return $next($request);
    }
}