<?php

namespace App\Http\Controllers\Specialist;

use App\Http\Controllers\Controller;
use App\Models\Plan;
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
                
                // Match appointments with plans by google_calendar_event_id
                foreach ($appointments as &$appointment) {
                    $plan = Plan::where('google_calendar_event_id', $appointment['id'])
                        ->where('specialist_id', $specialist->id)
                        ->first();
                    
                    if ($plan) {
                        $appointment['plan_id'] = $plan->id;
                    }
                }
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

    /**
     * Get plan details for an appointment
     */
    public function getPlanDetails($planId)
    {
        $user = auth()->user();
        
        // Get specialist data
        $specialist = Specialist::where('email', $user->email)->first();
        
        if (!$specialist) {
            return response()->json(['error' => 'Specialist profile not found.'], 404);
        }

        // Get plan and verify it belongs to this specialist
        $plan = Plan::with(['specialist.country', 'destination.activities'])
            ->where('id', $planId)
            ->where('specialist_id', $specialist->id)
            ->first();

        if (!$plan) {
            return response()->json(['error' => 'Plan not found.'], 404);
        }

        // Format plan data for frontend
        $planData = [
            'id' => $plan->id,
            'first_name' => $plan->first_name,
            'last_name' => $plan->last_name,
            'email' => $plan->email,
            'phone' => $plan->phone,
            'destination' => $plan->destination,
            'travel_dates' => $plan->travel_dates,
            'travelers' => $plan->travelers,
            'interests' => $plan->interests ?? [],
            'other_interests' => $plan->other_interests,
            'plan_type' => $plan->plan_type ?? null,
            'selected_plan' => $plan->selected_plan ?? $plan->plan_type ?? null,
            'status' => $plan->status,
            'payment_status' => $plan->payment_status ?? 'pending',
            'appointment_start' => $plan->appointment_start,
            'appointment_end' => $plan->appointment_end,
            'amount' => $plan->amount,
            'paid_at' => $plan->paid_at,
        ];

        return response()->json($planData);
    }
}
