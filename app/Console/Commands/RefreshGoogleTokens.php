<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Services\GoogleCalendarService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class RefreshGoogleTokens extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'google:tokens:refresh {--user= : Refresh tokens for a specific user ID}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Refresh Google Calendar access tokens for users';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $googleCalendarService = new GoogleCalendarService();
        
        if ($userId = $this->option('user')) {
            // Refresh tokens for a specific user
            $user = User::find($userId);
            
            if (!$user) {
                $this->error("User with ID {$userId} not found.");
                return 1;
            }
            
            if (!$user->hasGoogleCalendarConnected()) {
                $this->error("User {$user->name} does not have Google Calendar connected.");
                return 1;
            }
            
            $this->refreshUserTokens($user, $googleCalendarService);
        } else {
            // Refresh tokens for all users with expired or soon-to-expire tokens
            $users = User::where('role', 'specialist')
                ->whereNotNull('google_access_token')
                ->whereNotNull('google_refresh_token')
                ->get();
            
            $refreshedCount = 0;
            $failedCount = 0;
            
            foreach ($users as $user) {
                if ($user->isGoogleTokenExpired() || $this->isTokenExpiringSoon($user)) {
                    if ($this->refreshUserTokens($user, $googleCalendarService)) {
                        $refreshedCount++;
                    } else {
                        $failedCount++;
                    }
                }
            }
            
            $this->info("Token refresh completed:");
            $this->info("- Refreshed: {$refreshedCount}");
            $this->info("- Failed: {$failedCount}");
        }
        
        return 0;
    }
    
    /**
     * Refresh tokens for a specific user
     */
    protected function refreshUserTokens(User $user, GoogleCalendarService $googleCalendarService): bool
    {
        try {
            $googleCalendarService->setUser($user);
            
            // The service will automatically refresh the token if needed
            if ($googleCalendarService->isConnected()) {
                $this->info("✓ Tokens refreshed for {$user->name} ({$user->email})");
                return true;
            } else {
                $this->error("✗ Failed to refresh tokens for {$user->name} ({$user->email})");
                Log::error("Failed to refresh Google tokens for user {$user->id}");
                return false;
            }
        } catch (\Exception $e) {
            $this->error("✗ Error refreshing tokens for {$user->name}: " . $e->getMessage());
            Log::error("Error refreshing Google tokens for user {$user->id}: " . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Check if token is expiring within the next hour
     */
    protected function isTokenExpiringSoon(User $user): bool
    {
        if (!$user->google_token_expires) {
            return true;
        }
        
        return now()->addHour()->isAfter($user->google_token_expires);
    }
}