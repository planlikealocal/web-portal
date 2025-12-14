<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SpecialistApplication;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SpecialistApplicationController extends Controller
{
    /**
     * Display a listing of specialist applications.
     */
    public function index(Request $request): Response
    {
        $query = SpecialistApplication::query();

        // Apply filters
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('city_state', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }

        if ($request->has('date_from') && $request->date_from) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->has('date_to') && $request->date_to) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        // Order by created_at desc
        $applications = $query->orderBy('created_at', 'desc')->get();

        return Inertia::render('Admin/SpecialistApplications/List', [
            'applications' => $applications,
            'filters' => $request->only([
                'search',
                'status',
                'date_from',
                'date_to',
            ]),
        ]);
    }

    /**
     * Display the specified specialist application.
     */
    public function show(SpecialistApplication $application): Response
    {
        return Inertia::render('Admin/SpecialistApplications/Show', [
            'application' => $application,
        ]);
    }

    /**
     * Update the status of a specialist application.
     */
    public function updateStatus(Request $request, SpecialistApplication $application)
    {
        $validated = $request->validate([
            'status' => 'required|string|in:new,reviewed,approved,rejected',
            'notes' => 'nullable|string|max:1000',
        ]);

        $application->update([
            'status' => $validated['status'],
            'notes' => $validated['notes'] ?? $application->notes,
        ]);

        return redirect()->back()->with('success', 'Application status updated successfully.');
    }
}

