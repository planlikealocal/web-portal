<?php

namespace App\Actions\Auth;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class SendMobilePasswordResetLinkAction
{
    public function execute(string $email): array
    {
        try {
            // Find user - must be a mobile user (not admin or specialist)
            $user = User::where('email', $email)->first();

            if (!$user) {
                // For security, don't reveal if email exists or not
                return [
                    'success' => true,
                    'message' => 'If an account exists with that email, a password reset link has been sent.',
                ];
            }

            // Check if user is a mobile user
            if ($user->isAdmin() || $user->isSpecialist()) {
                // For security, don't reveal the account type
                return [
                    'success' => true,
                    'message' => 'If an account exists with that email, a password reset link has been sent.',
                ];
            }

            // Check if user has a password (Google-only users can't reset password)
            if (!$user->password) {
                // For security, still return success message
                return [
                    'success' => true,
                    'message' => 'If an account exists with that email, a password reset link has been sent.',
                ];
            }

            // Generate reset token
            $token = Str::random(64);
            
            // Store token in password_reset_tokens table (Laravel's standard table)
            DB::table('password_reset_tokens')->updateOrInsert(
                ['email' => $email],
                [
                    'email' => $email,
                    'token' => Hash::make($token),
                    'created_at' => now(),
                ]
            );

            // Generate reset URL - this will be handled by mobile app
            // We'll include the token in the email for the mobile app to use
            $resetUrl = config('app.frontend_url', config('app.url')) . '/reset-password?token=' . $token . '&email=' . urlencode($email);

            // Send reset email
            try {
                Mail::send('emails.mobile-password-reset-link', [
                    'user' => $user,
                    'token' => $token,
                    'resetUrl' => $resetUrl,
                ], function ($message) use ($user) {
                    $message->to($user->email, $user->name)
                            ->subject('Reset Your Password');
                });

                return [
                    'success' => true,
                    'message' => 'If an account exists with that email, a password reset link has been sent.',
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
                'message' => 'Unable to process password reset request at this time. Please try again later.',
            ];
        } catch (\Exception $e) {
            // Handle any other unexpected errors
            \Log::error('Unexpected error during password reset request', [
                'email' => $email,
                'error' => $e->getMessage(),
            ]);

            return [
                'success' => false,
                'message' => 'An unexpected error occurred. Please try again later.',
            ];
        }
    }
}
