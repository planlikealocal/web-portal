<?php

namespace App\Http\Controllers\Specialist;

use App\Http\Controllers\Controller;
use App\Http\Resources\AppointmentResource;
use App\Models\Plan;
use App\Models\Specialist;
use App\Services\GoogleCalendarService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

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
    public function index(Request $request)
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

        // Set default filters: appointment_status = 'active', dates = today
        $today = Carbon::today();

        $filters = [
            'appointment_status' => $request->query('appointment_status') ?: 'active',
            'start_date' => $request->query('start_date') ?: $today->format('Y-m-d'),
            'end_date' => $request->query('end_date') ?: $today->addDays(7)->format('Y-m-d'),
        ];

        $statusFilter = strtolower($filters['appointment_status']);

        $appointments = [];

        // Get appointments from Google Calendar if connected
        if ($user->hasGoogleCalendarConnected()) {
            try {
                $this->googleCalendarService->setUser($user);
                $timezone = $specialist->timezone ?? 'UTC';
                $rawAppointments = $this->googleCalendarService->listEvents(null, null, $timezone);

                // Match appointments with plans by google_calendar_event_id
                foreach ($rawAppointments as &$appointment) {
                    $plan = Plan::with('destination')
                        ->where('google_calendar_event_id', $appointment['id'])
                        ->where('specialist_id', $specialist->id)
                        ->where('payment_status', 'paid')
                        ->where('appointment_status', '!=', 'draft')
                        ->first();

                    if ($plan) {
                        $appointment['plan_id'] = $plan->id;
                        $appointment['plan'] = $plan;
                    }
                }

                $filteredAppointments = collect($rawAppointments)
                    ->filter(function ($appointment) use ($statusFilter, $filters, $timezone) {
                        // Get appointment status from plan if available, otherwise use appointment status or empty
                        $planStatus = '';
                        if (!empty($appointment['plan']) && is_object($appointment['plan'])) {
                            $planStatus = strtolower($appointment['plan']->appointment_status ?? '');
                        } else {
                            $planStatus = strtolower($appointment['appointment_status'] ?? '');
                        }

                        // Apply status filter: if status filter is empty, show all appointments
                        // If status filter is set, show appointments that match the status
                        // For 'active' filter, also include appointments without a status (treat as active)
                        if ($statusFilter) {
                            // If appointment has no status
                            if (!$planStatus) {
                                // Only show if filter is 'active' (treat no-status as active)
                                // or if filter is empty (show all)
                                return $statusFilter === 'active';
                            }
                            // If appointment has status, it must match the filter
                            if ($planStatus !== $statusFilter) {
                                return false;
                            }
                        }

                        $startDateTime = null;
                        if (!empty($appointment['start'])) {
                            try {
                                $startDateTime = Carbon::parse($appointment['start'], $timezone);
                            } catch (\Exception $e) {
                                $startDateTime = null;
                            }
                        } elseif (!empty($appointment['start_date'])) {
                            try {
                                $startTime = $appointment['start_time'] ?? '00:00';
                                $startDateTime = Carbon::parse($appointment['start_date'] . ' ' . $startTime, $timezone);
                            } catch (\Exception $e) {
                                $startDateTime = null;
                            }
                        }

                        if ($startDateTime) {
                            if (!empty($filters['start_date'])) {
                                $startBoundary = Carbon::parse($filters['start_date'], $timezone)->startOfDay();
                                if ($startDateTime->lt($startBoundary)) {
                                    return false;
                                }
                            }

                            if (!empty($filters['end_date'])) {
                                $endBoundary = Carbon::parse($filters['end_date'], $timezone)->endOfDay();
                                if ($startDateTime->gt($endBoundary)) {
                                    return false;
                                }
                            }
                        }

                        return true;
                    })
                    ->values()
                    ->all();

                // Transform appointments using resource
                $appointments = AppointmentResource::collection($filteredAppointments)->resolve();
            } catch (\Exception $e) {
                Log::error('Error fetching appointments: ' . $e->getMessage());
                $appointments = [];
            }
        }

        return Inertia::render('Specialist/Appointments/Index', [
            'appointments' => $appointments,
            'hasGoogleCalendar' => $user->hasGoogleCalendarConnected(),
            'filters' => $filters,
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
