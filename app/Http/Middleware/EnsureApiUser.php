<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureApiUser
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated',
            ], 401);
        }

        // Only allow mobile users (role='user' or null) to access mobile API
        // Prevent admin and specialist users from accessing mobile API
        if ($user->isAdmin() || $user->isSpecialist()) {
            return response()->json([
                'success' => false,
                'message' => 'Access denied. This API is for mobile app users only.',
            ], 403);
        }

        return $next($request);
    }
}
