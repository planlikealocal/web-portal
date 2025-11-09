<?php

namespace App\Http\Controllers\Specialist;

use App\Http\Controllers\Controller;
use App\Models\Specialist;
use App\Models\User;
use App\Services\GoogleCalendarService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

class AppointmentController extends Controller
{
    protected $googleCalendarService;

    public function __construct(GoogleCalendarService $googleCalendarService)
    {
        $this->googleCalendarService = $googleCalendarService;
    }

    /**
     * Display a listing of appointments
     */
    public function index()
    {
        $user = auth()->user();
        
        // Get specialist data
        $specialist = Specialist::where('email', $user->email)->first();
        
        if (!$specialist) {
            return Inertia::render('Specialist/Appointments/Index', [
                'appointments' => [],
                'error' => 'Specialist profile not found.',
            ]);
        }

        $appointments = [];
        
        // Get appointments from Google Calendar if connected
        if ($user->hasGoogleCalendarConnected()) {
            try {
                $this->googleCalendarService->setUser($user);
                $timezone = $specialist->timezone ?? 'UTC';
                $appointments = $this->googleCalendarService->listEvents(null, null, $timezone);
            } catch (\Exception $e) {
                Log::error('Error fetching appointments: ' . $e->getMessage());
                $appointments = [];
            }
        }
        
        return Inertia::render('Specialist/Appointments/Index', [
            'appointments' => $appointments,
            'hasGoogleCalendar' => $user->hasGoogleCalendarConnected(),
        ]);
    }

    /**
     * Show the form for creating a new appointment
     */
    public function create()
    {
        return Inertia::render('Specialist/Appointments/Create');
    }

    /**
     * Store a newly created appointment
     */
    public function store(Request $request)
    {
        // TODO: Implement appointment creation
        return redirect()->route('specialist.appointments.index')
            ->with('success', 'Appointment created successfully.');
    }
}
