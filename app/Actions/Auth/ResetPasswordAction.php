<?php

namespace App\Actions\Auth;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ResetPasswordAction
{
    public function execute(string $token, string $password): array
    {
        try {
            // Find password reset record
            $passwordReset = DB::table('password_resets')
                ->where('token', $token)
                ->where('created_at', '>', Carbon::now()->subHours(24)) // Token expires after 24 hours
                ->first();

            if (!$passwordReset) {
                return [
                    'success' => false,
                    'message' => 'Invalid or expired reset token.',
                ];
            }

            // Find user by email
            $user = User::where('email', $passwordReset->email)
                       ->where('role', 'specialist')
                       ->first();

            if (!$user) {
                return [
                    'success' => false,
                    'message' => 'No specialist account found with that email address.',
                ];
            }

            // Update password and clear token
            $user->update([
                'password' => Hash::make($password),
            ]);

            // Remove the password reset record
            DB::table('password_resets')->where('token', $token)->delete();

            return [
                'success' => true,
                'message' => 'Password has been reset successfully. You can now log in with your new password.',
            ];
        } catch (\Illuminate\Database\QueryException $e) {
            // Handle database connection errors
            \Log::error('Database connection error during password reset', [
                'token' => substr($token, 0, 20) . '...',
                'error' => $e->getMessage(),
            ]);

            return [
                'success' => false,
                'message' => 'Unable to process password reset at this time. Please try again later or contact support.',
            ];
        } catch (\Exception $e) {
            // Handle any other unexpected errors
            \Log::error('Unexpected error during password reset', [
                'token' => substr($token, 0, 20) . '...',
                'error' => $e->getMessage(),
            ]);

            return [
                'success' => false,
                'message' => 'An unexpected error occurred. Please try again later or contact support.',
            ];
        }
    }
}
