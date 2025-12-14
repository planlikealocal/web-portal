<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactedUser;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ContactRequestController extends Controller
{
    /**
     * Display a listing of contact requests.
     */
    public function index(Request $request): Response
    {
        $query = ContactedUser::query();

        // Apply filters
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('message', 'like', "%{$search}%");
            });
        }

        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }

        if ($request->has('topic') && $request->topic) {
            $query->where('topic', $request->topic);
        }

        if ($request->has('date_from') && $request->date_from) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->has('date_to') && $request->date_to) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        // Order by created_at desc
        $contactRequests = $query->orderBy('created_at', 'desc')->get();

        return Inertia::render('Admin/ContactRequests/List', [
            'contactRequests' => $contactRequests,
            'filters' => $request->only([
                'search',
                'status',
                'topic',
                'date_from',
                'date_to',
            ]),
        ]);
    }

    /**
     * Display the specified contact request.
     */
    public function show(ContactedUser $contactRequest): Response
    {
        return Inertia::render('Admin/ContactRequests/Show', [
            'contactRequest' => $contactRequest,
        ]);
    }

    /**
     * Update the status of a contact request.
     */
    public function updateStatus(Request $request, ContactedUser $contactRequest)
    {
        $validated = $request->validate([
            'status' => 'required|string|in:new,contacted,resolved',
            'notes' => 'nullable|string|max:1000',
        ]);

        $contactRequest->update([
            'status' => $validated['status'],
            'notes' => $validated['notes'] ?? $contactRequest->notes,
        ]);

        return redirect()->back()->with('success', 'Contact request status updated successfully.');
    }
}

