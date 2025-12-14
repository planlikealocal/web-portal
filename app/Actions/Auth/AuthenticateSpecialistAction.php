<?php

namespace App\Actions\Auth;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthenticateSpecialistAction
{
    public function execute(array $credentials, Request $request): array
    {
        if (Auth::attempt($credentials)) {
            $user = Auth::user();
            
            if (!$user->isSpecialist()) {
                Auth::logout();
                return [
                    'success' => false,
                    'message' => 'Access denied. Specialist privileges required.',
                ];
            }

            $request->session()->regenerate();
            
            return [
                'success' => true,
                'user' => $user,
                'redirect' => '/specialist',
            ];
        }

        return [
            'success' => false,
            'message' => 'The provided credentials do not match our records.',
        ];
    }
}
