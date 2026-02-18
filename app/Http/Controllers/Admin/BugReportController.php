<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BugReport;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BugReportController extends Controller
{
    /**
     * Display a listing of bug reports.
     */
    public function index(Request $request): Response
    {
        $query = BugReport::with('user');

        // Apply filters
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($userQuery) use ($search) {
                        $userQuery->where('name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%");
                    });
            });
        }

        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }

        if ($request->has('issue_type') && $request->issue_type) {
            $query->where('issue_type', $request->issue_type);
        }

        if ($request->has('date_from') && $request->date_from) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->has('date_to') && $request->date_to) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        $bugReports = $query->orderBy('created_at', 'desc')->get();

        return Inertia::render('Admin/BugReports/List', [
            'bugReports' => $bugReports,
            'filters' => $request->only([
                'search',
                'status',
                'issue_type',
                'date_from',
                'date_to',
            ]),
        ]);
    }

    /**
     * Display the specified bug report.
     */
    public function show(BugReport $bugReport): Response
    {
        $bugReport->load('user');

        $screenshotUrl = null;
        if ($bugReport->screenshot) {
            $screenshotUrl = asset('storage/' . $bugReport->screenshot);
        }

        return Inertia::render('Admin/BugReports/Show', [
            'bugReport' => $bugReport,
            'screenshotUrl' => $screenshotUrl,
        ]);
    }

    /**
     * Update the status of a bug report.
     */
    public function updateStatus(Request $request, BugReport $bugReport)
    {
        $validated = $request->validate([
            'status' => 'required|string|in:new,in_review,resolved,closed',
            'admin_notes' => 'nullable|string|max:5000',
        ]);

        $bugReport->update([
            'status' => $validated['status'],
            'admin_notes' => $validated['admin_notes'] ?? $bugReport->admin_notes,
        ]);

        return redirect()->back()->with('success', 'Bug report status updated successfully.');
    }
}
