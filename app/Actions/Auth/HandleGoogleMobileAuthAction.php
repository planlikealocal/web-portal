<?php

namespace App\Actions\Auth;

use App\Models\User;
use Google\Client;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class HandleGoogleMobileAuthAction
{
    /**
     * Verify Google ID token and create/update user
     */
    public function execute(string $idToken): array
    {
        try {
            $client = new Client([
                'client_id' => config('services.google_mobile.client_id'),
            ]);

            // Verify the ID token
            $payload = $client->verifyIdToken($idToken);

            if (!$payload) {
                return [
                    'success' => false,
                    'message' => 'Invalid Google ID token',
                ];
            }

            $googleId = $payload['sub'];
            $email = $payload['email'];
            $name = $payload['name'] ?? ($payload['given_name'] . ' ' . $payload['family_name'] ?? '');
            $emailVerified = $payload['email_verified'] ?? false;

            // Find user by google_id or email
            $user = User::where('google_id', $googleId)
                ->orWhere('email', $email)
                ->first();

            if ($user) {
                // Update existing user
                $user->update([
                    'google_id' => $googleId,
                    'name' => $name,
                    'email' => $email,
                    'email_verified_at' => $emailVerified ? now() : $user->email_verified_at,
                    'role' => $user->role ?? 'user', // Preserve existing role or set to 'user'
                ]);
            } else {
                // Create new user
                $user = User::create([
                    'google_id' => $googleId,
                    'name' => $name,
                    'email' => $email,
                    'password' => bcrypt(Str::random(32)), // Random password since they use Google auth
                    'role' => 'user',
                    'email_verified_at' => $emailVerified ? now() : null,
                ]);
            }

            Log::info('Google mobile authentication successful', [
                'user_id' => $user->id,
                'email' => $user->email,
            ]);

            return [
                'success' => true,
                'user' => $user,
            ];
        } catch (\Exception $e) {
            Log::error('Google mobile authentication failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return [
                'success' => false,
                'message' => 'Failed to authenticate with Google: ' . $e->getMessage(),
            ];
        }
    }
}
