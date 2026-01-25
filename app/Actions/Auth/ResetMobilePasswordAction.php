<?php

namespace App\Actions\Auth;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class ResetMobilePasswordAction
{
    public function execute(string $email, string $token, string $password): array
    {
        try {
            // Find user
            $user = User::where('email', $email)->first();

            if (!$user) {
                return [
                    'success' => false,
                    'message' => 'Invalid reset token or email address.',
                ];
            }

            // Check if user is a mobile user
            if ($user->isAdmin() || $user->isSpecialist()) {
                return [
                    'success' => false,
                    'message' => 'Invalid reset token or email address.',
                ];
            }

            // Get the password reset record
            $passwordReset = DB::table('password_reset_tokens')
                ->where('email', $email)
                ->first();

            if (!$passwordReset) {
                return [
                    'success' => false,
                    'message' => 'Invalid or expired reset token.',
                ];
            }

            // Check if token is valid (Laravel stores hashed tokens)
            if (!Hash::check($token, $passwordReset->token)) {
                return [
                    'success' => false,
                    'message' => 'Invalid or expired reset token.',
                ];
            }

            // Check if token is expired (24 hours)
            $tokenAge = now()->diffInMinutes($passwordReset->created_at);
            if ($tokenAge > 1440) { // 24 hours = 1440 minutes
                // Delete expired token
                DB::table('password_reset_tokens')->where('email', $email)->delete();
                
                return [
                    'success' => false,
                    'message' => 'Reset token has expired. Please request a new password reset.',
                ];
            }

            // Update user password
            $user->update([
                'password' => Hash::make($password),
            ]);

            // Delete the used token
            DB::table('password_reset_tokens')->where('email', $email)->delete();

            return [
                'success' => true,
                'message' => 'Password has been reset successfully.',
            ];
        } catch (\Exception $e) {
            \Log::error('Password reset failed', [
                'email' => $email,
                'error' => $e->getMessage(),
            ]);

            return [
                'success' => false,
                'message' => 'Failed to reset password. Please try again later.',
            ];
        }
    }
}
