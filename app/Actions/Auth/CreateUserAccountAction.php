<?php

namespace App\Actions\Auth;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class CreateUserAccountAction
{
    public function execute(array $userData, bool $sendWelcomeEmail = true): array
    {
        try {
            // Generate a random password if not provided
            $password = $userData['password'] ?? Str::random(12);

            // Create user account
            $user = User::create([
                'name' => $userData['name'],
                'email' => $userData['email'],
                'password' => Hash::make($password),
                'role' => $userData['role'] ?? 'specialist',
            ]);

            // Send welcome email if requested
            if ($sendWelcomeEmail && $userData['role'] === 'specialist') {
                $this->sendWelcomeEmail($user, $password);
            }

            return [
                'success' => true,
                'user' => $user,
                'password' => $password,
                'message' => 'User account created successfully.',
            ];
        } catch (\Illuminate\Database\QueryException $e) {
            \Log::error('Database error during user account creation', [
                'email' => $userData['email'] ?? 'unknown',
                'error' => $e->getMessage(),
            ]);

            return [
                'success' => false,
                'message' => 'Unable to create user account at this time. Please try again later.',
            ];
        } catch (\Exception $e) {
            \Log::error('Unexpected error during user account creation', [
                'email' => $userData['email'] ?? 'unknown',
                'error' => $e->getMessage(),
            ]);

            return [
                'success' => false,
                'message' => 'An unexpected error occurred while creating the user account.',
            ];
        }
    }

    /**
     * Send welcome email to the user
     */
    private function sendWelcomeEmail(User $user, string $password): void
    {
        try {
            // Get specialist data if available
            $specialist = \App\Models\Specialist::where('email', $user->email)->first();

            Mail::send('emails.specialist-welcome', [
                'specialist' => $specialist ?? (object) [
                    'first_name' => explode(' ', $user->name)[0],
                    'last_name' => explode(' ', $user->name)[1] ?? '',
                    'email' => $user->email,
                    'full_name' => $user->name,
                ],
                'password' => $password,
            ], function ($message) use ($user) {
                $message->to($user->email, $user->name)
                        ->subject('🎉 Congratulations! Welcome to Our Travel Specialist Team');
            });

            \Log::info('Welcome email sent successfully', [
                'user_id' => $user->id,
                'email' => $user->email,
            ]);
        } catch (\Exception $e) {
            \Log::error('Failed to send welcome email', [
                'user_id' => $user->id,
                'email' => $user->email,
                'error' => $e->getMessage(),
            ]);
        }
    }
}
