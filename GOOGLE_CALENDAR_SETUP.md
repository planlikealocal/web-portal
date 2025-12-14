# Google Calendar Integration Setup Guide

This guide will help you set up Google Calendar integration for your Laravel + Inertia + React application.

## 🔒 **MANDATORY GOOGLE CALENDAR INTEGRATION**

**IMPORTANT:** All specialists are **REQUIRED** to connect their Google Calendar before accessing any part of the specialist portal. This is enforced at the middleware level and cannot be bypassed.

### **Enforcement Features:**
- ✅ **Global Route Protection**: Every specialist route requires Google Calendar connection
- ✅ **Non-Dismissible Modal**: Cannot access portal until Google Calendar is connected
- ✅ **Automatic Redirects**: Redirected to Google Calendar settings if not connected
- ✅ **Visual Indicators**: Status chips and alerts throughout the interface
- ✅ **Smart Routing**: Returns to original destination after successful connection

## Prerequisites

- Laravel application with Inertia.js and React
- Google Cloud Console account
- Google Calendar API enabled

## Step 1: Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Calendar API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Calendar API"
   - Click on it and press "Enable"

4. Create OAuth 2.0 credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Choose "Web application"
   - Add authorized redirect URIs:
     - For development: `http://localhost:8000/google/callback`
     - For production: `https://yourdomain.com/google/callback`

5. Download the credentials JSON file and note down:
   - Client ID
   - Client Secret

## Step 2: Environment Configuration

Add these variables to your `.env` file:

```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_REDIRECT_URI=http://localhost:8000/google/callback

# For production, update the redirect URI:
# GOOGLE_REDIRECT_URI=https://yourdomain.com/google/callback
```

## Step 3: Database Migration

The migration has already been run, but if you need to run it manually:

```bash
php artisan migrate
```

This adds the following fields to the `users` table:
- `google_access_token` (text, nullable)
- `google_refresh_token` (text, nullable)
- `google_token_expires` (timestamp, nullable)
- `google_calendar_id` (string, nullable)

## Step 4: Package Installation

The Google API PHP client has been installed:

```bash
composer require google/apiclient
```

## Step 5: Service Configuration

The Google service configuration has been added to `config/services.php`:

```php
'google' => [
    'client_id' => env('GOOGLE_CLIENT_ID'),
    'client_secret' => env('GOOGLE_CLIENT_SECRET'),
    'redirect' => env('GOOGLE_REDIRECT_URI'),
],
```

## Step 6: Routes

The following routes have been added:

### OAuth Routes (Protected by auth middleware)
- `GET /google/redirect` - Redirects to Google OAuth
- `GET /google/callback` - Handles OAuth callback
- `POST /google/disconnect` - Disconnects Google Calendar

### Public API Routes
- `GET /api/availability/{user}` - Get user's available time slots
- `POST /api/appointments` - Create a new appointment

### Frontend Routes
- `GET /book-appointment` - Public appointment booking page
- `GET /specialist/google-calendar-settings` - Specialist Google Calendar settings

### 🔒 **Route Protection System**

**ALL specialist routes are protected by Google Calendar requirement:**

```php
// ALL specialist routes require Google Calendar connection
Route::middleware(['specialist', 'specialist.google.calendar'])->group(function () {
    Route::get('/', [SpecialistDashboardController::class, 'index'])->name('dashboard');
    Route::get('/appointments', [AppointmentController::class, 'index'])->name('appointments.index');
    // ... all other specialist routes
});

// ONLY these routes are exempt from Google Calendar requirement
Route::middleware(['specialist'])->group(function () {
    Route::get('/google-calendar-settings', [AppointmentBookingController::class, 'googleCalendarSettings'])->name('google-calendar.settings');
});
```

**What happens when a specialist tries to access any route without Google Calendar:**
1. **Middleware Check**: `RequireGoogleCalendarForSpecialists` middleware runs
2. **Route Validation**: Checks if route is in allowed list (only Google Calendar settings)
3. **Redirect**: If not allowed and no Google Calendar → redirect to settings page
4. **Modal Display**: Non-dismissible modal appears explaining requirement
5. **Connection Flow**: Must complete Google OAuth to proceed
6. **Return**: After connection, returns to original destination

## Step 7: Usage

### For Specialists

1. **Connect Google Calendar:**
   - Log in as a specialist
   - Go to `/specialist/google-calendar-settings`
   - Click "Connect Google Calendar"
   - Complete the OAuth flow

2. **Manage Settings:**
   - View connection status
   - Disconnect if needed
   - Monitor token expiration

### For Public Users

1. **Book Appointments:**
   - Visit `/book-appointment`
   - Select a specialist
   - Choose available time slot
   - Fill in contact details
   - Confirm booking

## Step 8: Automatic Token Refresh

The system automatically refreshes Google tokens:

1. **Scheduled Command:** Runs every hour via Laravel scheduler
2. **Manual Command:** `php artisan google:tokens:refresh`
3. **Service-Level:** Automatic refresh when tokens are expired

## Step 9: Features

### Available Features

- ✅ Google OAuth 2.0 integration
- ✅ Automatic token refresh
- ✅ Real-time availability checking
- ✅ Automatic event creation
- ✅ Email notifications to clients
- ✅ Conflict prevention
- ✅ Working hours configuration (9 AM - 5 PM)
- ✅ Weekend filtering (configurable)
- ✅ Duration-based slot generation

### Customization Options

1. **Working Hours:** Modify in `GoogleCalendarService::generateDaySlots()`
2. **Weekend Filtering:** Toggle in `GoogleCalendarService::getAvailableTimeSlots()`
3. **Slot Duration:** Configurable via API parameter
4. **Calendar Selection:** Uses primary calendar by default

## Step 10: Testing

### Test the Integration

1. **Connect a Specialist:**
   ```bash
   # Create a specialist user
   php artisan make:specialist-user
   
   # Or manually create one in the database
   ```

2. **Test OAuth Flow:**
   - Visit `/google/redirect` while logged in
   - Complete Google authorization
   - Verify tokens are stored

3. **Test Availability API:**
   ```bash
   curl "http://localhost:8000/api/availability/1?duration=60"
   ```

4. **Test Appointment Booking:**
   - Visit `/book-appointment`
   - Complete the booking flow

### Manual Token Refresh

```bash
# Refresh all tokens
php artisan google:tokens:refresh

# Refresh specific user
php artisan google:tokens:refresh --user=1
```

## Step 11: Production Considerations

### Security

1. **Environment Variables:** Never commit `.env` files
2. **HTTPS:** Use HTTPS in production
3. **Token Storage:** Tokens are encrypted in database
4. **CORS:** Configure CORS for API endpoints

### Performance

1. **Caching:** Consider caching availability data
2. **Rate Limiting:** Implement rate limiting for API endpoints
3. **Queue Jobs:** Use queues for heavy operations

### Monitoring

1. **Logging:** All errors are logged
2. **Health Checks:** Monitor token expiration
3. **Alerts:** Set up alerts for failed token refreshes

## Troubleshooting

### Common Issues

1. **"Google Calendar not connected"**
   - Check if user has completed OAuth flow
   - Verify tokens are stored in database

2. **"Token expired"**
   - Run `php artisan google:tokens:refresh`
   - Check if refresh token is valid

3. **"No available slots"**
   - Verify specialist has Google Calendar connected
   - Check working hours configuration
   - Ensure calendar has free time

4. **OAuth Errors**
   - Verify redirect URI matches exactly
   - Check Google Cloud Console settings
   - Ensure API is enabled

### Debug Commands

```bash
# Check user's Google Calendar status
php artisan tinker
>>> $user = App\Models\User::find(1);
>>> $user->hasGoogleCalendarConnected();
>>> $user->isGoogleTokenExpired();

# Test Google Calendar service
php artisan tinker
>>> $service = new App\Services\GoogleCalendarService();
>>> $service->setUser($user);
>>> $service->isConnected();
```

## API Documentation

### Get Availability

```http
GET /api/availability/{user_id}?duration=60&start_date=2024-01-01&end_date=2024-01-31
```

**Response:**
```json
{
  "specialist": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  },
  "available_slots": [
    {
      "start": "2024-01-01T09:00:00.000Z",
      "end": "2024-01-01T10:00:00.000Z",
      "date": "2024-01-01",
      "time": "09:00",
      "duration_minutes": 60
    }
  ],
  "date_range": {
    "start": "2024-01-01",
    "end": "2024-01-31"
  },
  "duration_minutes": 60
}
```

### Create Appointment

```http
POST /api/appointments
Content-Type: application/json

{
  "specialist_id": 1,
  "start_time": "2024-01-01T09:00:00.000Z",
  "duration": 60,
  "client_name": "Jane Smith",
  "client_email": "jane@example.com",
  "client_phone": "+1234567890",
  "notes": "Initial consultation"
}
```

**Response:**
```json
{
  "success": true,
  "event": {
    "id": "event_id_123",
    "summary": "Appointment with Jane Smith",
    "start": "2024-01-01T09:00:00.000Z",
    "end": "2024-01-01T10:00:00.000Z",
    "htmlLink": "https://calendar.google.com/event?eid=..."
  },
  "message": "Appointment booked successfully!"
}
```

## Support

For issues or questions:

1. Check the logs: `storage/logs/laravel.log`
2. Run debug commands
3. Verify Google Cloud Console settings
4. Test with a fresh OAuth flow

The integration is now complete and ready for use!
