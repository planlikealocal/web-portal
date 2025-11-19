<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'google_access_token',
        'google_refresh_token',
        'google_token_expires',
        'google_calendar_id',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'google_access_token',
        'google_refresh_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'google_token_expires' => 'datetime',
        ];
    }

    /**
     * Check if user is admin
     */
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    /**
     * Check if user is specialist
     */
    public function isSpecialist(): bool
    {
        return $this->role === 'specialist';
    }

    /**
     * Check if user has Google Calendar connected
     */
    public function hasGoogleCalendarConnected(): bool
    {
        return !empty($this->google_access_token);
    }

    /**
     * Check if Google Calendar connection is permanent (has refresh token)
     * A permanent connection means the token can be refreshed automatically
     */
    public function hasPermanentGoogleCalendarConnection(): bool
    {
        return !empty($this->google_access_token) && !empty($this->google_refresh_token);
    }

    /**
     * Check if Google access token is expired
     * 
     * Note: If the user has a refresh token (permanent connection),
     * the token is never considered expired because it can be automatically refreshed.
     */
    public function isGoogleTokenExpired(): bool
    {
        // If user has a refresh token, the connection is permanent
        // and the access token can be automatically refreshed, so it's never expired
        if (!empty($this->google_refresh_token)) {
            return false;
        }
        
        // If no expiration date is set, consider it expired (unless they have refresh token, which we already checked)
        if (!$this->google_token_expires) {
            return true;
        }
        
        // Check if the access token has expired
        return now()->isAfter($this->google_token_expires);
    }

    /**
     * Disconnect Google Calendar
     */
    public function disconnectGoogleCalendar(): void
    {
        $this->update([
            'google_access_token' => null,
            'google_refresh_token' => null,
            'google_token_expires' => null,
            'google_calendar_id' => null,
        ]);
    }
}
