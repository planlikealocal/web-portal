<?php

namespace App\Actions\Auth;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class SendPasswordResetLinkAction
{
    public function execute(string $email): array
    {
        try {
            // Find user with specialist role
            $user = User::where('email', $email)
                       ->where('role', 'specialist')
                       ->first();

            if (!$user) {
                return [
                    'success' => false,
                    'message' => 'No specialist account found with that email address.',
                ];
            }

            // Generate reset token
            $token = Str::random(64);
            
            // Store token in password_resets table
            DB::table('password_resets')->updateOrInsert(
                ['email' => $email],
                [
                    'email' => $email,
                    'token' => $token,
                    'created_at' => now(),
                ]
            );

            // Send reset email
            try {
                Mail::send('emails.specialist-password-reset-link', [
                    'user' => $user,
                    'token' => $token,
                    'resetUrl' => url("/specialist/reset-password/{$token}"),
                ], function ($message) use ($user) {
                    $message->to($user->email, $user->name)
                            ->subject('Reset Your Specialist Password');
                });

                return [
                    'success' => true,
                    'message' => 'Password reset link has been sent to your email address.',
                ];
            } catch (\Exception $e) {
                \Log::error('Failed to send password reset email', [
                    'email' => $email,
                    'error' => $e->getMessage(),
                ]);

                return [
                    'success' => false,
                    'message' => 'Failed to send reset email. Please try again later.',
                ];
            }
        } catch (\Illuminate\Database\QueryException $e) {
            // Handle database connection errors
            \Log::error('Database connection error during password reset request', [
                'email' => $email,
                'error' => $e->getMessage(),
            ]);

            return [
                'success' => false,
                'message' => 'Unable to process password reset request at this time. Please try again later or contact support.',
            ];
        } catch (\Exception $e) {
            // Handle any other unexpected errors
            \Log::error('Unexpected error during password reset request', [
                'email' => $email,
                'error' => $e->getMessage(),
            ]);

            return [
                'success' => false,
                'message' => 'An unexpected error occurred. Please try again later or contact support.',
            ];
        }
    }
}
