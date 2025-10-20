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
        $user = User::where('email', $specialist->email)
                   ->where('role', 'specialist')
                   ->first();

        if (!$user) {
            return [
                'success' => false,
                'message' => 'No user account found for this specialist.',
            ];
        }

        // Generate a new random password
        $newPassword = Str::random(12);

        // Update the user's password
        $user->update([
            'password' => Hash::make($newPassword),
        ]);

        // Send email with new password
        try {
            Mail::send('emails.specialist-password-reset', [
                'specialist' => $specialist,
                'newPassword' => $newPassword,
            ], function ($message) use ($specialist) {
                $message->to($specialist->email, $specialist->full_name)
                        ->subject('Password Reset - Your New Login Credentials');
            });

            return [
                'success' => true,
                'message' => 'Password reset successfully. New password has been sent to ' . $specialist->email,
            ];
        } catch (\Exception $e) {
            // If email fails, still return success but log the error
            \Log::error('Failed to send password reset email to specialist: ' . $specialist->email, [
                'error' => $e->getMessage(),
                'specialist_id' => $specialist->id,
            ]);

            return [
                'success' => true,
                'message' => 'Password reset successfully, but failed to send email. Please contact the specialist directly.',
                'newPassword' => $newPassword, // Include password in response for manual delivery
            ];
        }
    }
}
