<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\PlanResource;
use App\Models\Plan;
use App\Models\Specialist;
use App\Models\Destination;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PlanController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $query = Plan::with(['specialist', 'destination']);

        // Apply filters
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }

        if ($request->has('appointment_status') && $request->appointment_status) {
            $query->where('appointment_status', $request->appointment_status);
        }

        if ($request->has('payment_status') && $request->payment_status) {
            $query->where('payment_status', $request->payment_status);
        }

        if ($request->has('plan_type') && $request->plan_type) {
            $query->where('plan_type', $request->plan_type);
        }

        if ($request->has('specialist_id') && $request->specialist_id) {
            $query->where('specialist_id', $request->specialist_id);
        }

        if ($request->has('destination_id') && $request->destination_id) {
            $query->where('destination_id', $request->destination_id);
        }

        if ($request->has('date_from') && $request->date_from) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->has('date_to') && $request->date_to) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        if ($request->has('appointment_date_from') && $request->appointment_date_from) {
            $query->whereDate('appointment_start', '>=', $request->appointment_date_from);
        }

        if ($request->has('appointment_date_to') && $request->appointment_date_to) {
            $query->whereDate('appointment_start', '<=', $request->appointment_date_to);
        }

        // Order by created_at desc
        $plans = $query->orderBy('created_at', 'desc')->get();

        // Get filter options
        $specialists = Specialist::orderBy('first_name')->get(['id', 'first_name', 'last_name']);
        $destinations = Destination::orderBy('name')->get(['id', 'name']);

        return Inertia::render('Admin/Plans/List', [
            'plans' => PlanResource::collection($plans),
            'specialists' => $specialists,
            'destinations' => $destinations,
            'filters' => $request->only([
                'search',
                'status',
                'appointment_status',
                'payment_status',
                'plan_type',
                'specialist_id',
                'destination_id',
                'date_from',
                'date_to',
                'appointment_date_from',
                'appointment_date_to',
            ]),
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Plan $plan): Response
    {
        $plan->load(['specialist.country', 'destination']);

        return Inertia::render('Admin/Plans/Show', [
            'plan' => new PlanResource($plan),
        ]);
    }
}

