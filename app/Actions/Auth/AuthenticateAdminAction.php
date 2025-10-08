<?php

namespace App\Actions\Auth;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthenticateAdminAction
{
    public function execute(array $credentials, Request $request): array
    {
        if (Auth::attempt($credentials)) {
            $user = Auth::user();
            
            if (!$user->isAdmin()) {
                Auth::logout();
                return [
                    'success' => false,
                    'message' => 'Access denied. Admin privileges required.',
                ];
            }

            $request->session()->regenerate();
            
            return [
                'success' => true,
                'user' => $user,
                'redirect' => '/admin',
            ];
        }

        return [
            'success' => false,
            'message' => 'The provided credentials do not match our records.',
        ];
    }
}
