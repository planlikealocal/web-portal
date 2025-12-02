<?php

namespace App\Actions\Specialist;

use App\Models\Specialist;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class ResetSpecialistPasswordAction
{
    public function execute(Specialist $specialist): array
    {
        // Find the user account associated with this specialist
        // First try by email (current specialist email)
        $user = User::where('email', $specialist->email)
                   ->where('role', 'specialist')
                   ->first();

        // If not found by email, try to find by name (fallback for legacy cases where email was changed but user wasn't synced)
        $foundByEmail = true;
        if (!$user) {
            $foundByEmail = false;
            $specialistFullName = $specialist->first_name . ' ' . $specialist->last_name;
            $user = User::where('name', $specialistFullName)
                       ->where('role', 'specialist')
                       ->first();
        }

        if (!$user) {
            return [
                'success' => false,
                'message' => 'No user account found for this specialist. The user account may need to be synced with the specialist record. Please update the specialist to sync the email address.',
            ];
        }

        // If user was found by name but email doesn't match, sync the email
        if (!$foundByEmail && $user->email !== $specialist->email) {
            $oldUserEmail = $user->email;
            $user->update(['email' => $specialist->email]);
            \Log::info('Synced user email during password reset', [
                'user_id' => $user->id,
                'specialist_id' => $specialist->id,
                'old_email' => $oldUserEmail,
                'new_email' => $specialist->email,
            ]);
        }

        // Generate a new random password
        $newPassword = Str::random(12);

        // Update the user's password
        $user->update([
            'password' => Hash::make($newPassword),
        ]);

        // Send email with new password
        try {
            // Explicitly use the configured mailer
            $mailer = config('mail.default', 'smtp');
            
            \Log::info('Attempting to send password reset email', [
                'specialist_id' => $specialist->id,
                'email' => $specialist->email,
                'mailer' => $mailer,
            ]);

            Mail::mailer($mailer)->send('emails.specialist-password-reset', [
                'specialist' => $specialist,
                'newPassword' => $newPassword,
            ], function ($message) use ($specialist) {
                $message->to($specialist->email, $specialist->full_name)
                        ->subject('Password Reset - Your New Login Credentials');
            });

            \Log::info('Password reset email sent successfully', [
                'specialist_id' => $specialist->id,
                'email' => $specialist->email,
            ]);

            return [
                'success' => true,
                'message' => 'Password reset successfully. New password has been sent to ' . $specialist->email,
            ];
        } catch (\Exception $e) {
            // Log the full error details
            \Log::error('Failed to send password reset email to specialist', [
                'specialist_id' => $specialist->id,
                'email' => $specialist->email,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'mailer' => config('mail.default'),
            ]);

            return [
                'success' => true,
                'message' => 'Password reset successfully, but failed to send email. Please contact the specialist directly.',
                'newPassword' => $newPassword, // Include password in response for manual delivery
                'error' => $e->getMessage(), // Include error for debugging
            ];
        }
    }
}
