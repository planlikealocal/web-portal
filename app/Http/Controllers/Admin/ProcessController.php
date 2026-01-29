<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProcessRequest;
use App\Http\Requests\UpdateProcessRequest;
use App\Models\ProcessStep;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProcessController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $processSteps = ProcessStep::orderBy('order')->orderBy('created_at', 'desc')->get();

        return Inertia::render('Admin/Process/List', [
            'processSteps' => $processSteps->map(function ($step) {
                return [
                    'id' => $step->id,
                    'title' => $step->title,
                    'description' => $step->description,
                    'icon' => $step->icon,
                    'background_color' => $step->background_color,
                    'order' => $step->order,
                    'is_active' => $step->is_active,
                    'created_at' => $step->created_at->format('Y-m-d H:i:s'),
                    'updated_at' => $step->updated_at->format('Y-m-d H:i:s'),
                ];
            }),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('Admin/Process/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProcessRequest $request)
    {
        $data = $request->validated();

        // Set default order if not provided
        if (!isset($data['order'])) {
            $maxOrder = ProcessStep::max('order') ?? 0;
            $data['order'] = $maxOrder + 1;
        }

        // Set default is_active if not provided
        if (!isset($data['is_active'])) {
            $data['is_active'] = true;
        }

        ProcessStep::create($data);

        return redirect()->route('admin.process.index')
            ->with('success', 'Process step created successfully.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ProcessStep $processStep): Response
    {
        return Inertia::render('Admin/Process/Edit', [
            'processStep' => [
                'id' => $processStep->id,
                'title' => $processStep->title,
                'description' => $processStep->description,
                'icon' => $processStep->icon,
                'background_color' => $processStep->background_color,
                'order' => $processStep->order,
                'is_active' => $processStep->is_active,
            ],
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProcessRequest $request, ProcessStep $processStep)
    {
        $data = $request->validated();
        $processStep->update($data);

        return redirect()->route('admin.process.index')
            ->with('success', 'Process step updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ProcessStep $processStep)
    {
        $processStep->delete();

        return redirect()->route('admin.process.index')
            ->with('success', 'Process step deleted successfully.');
    }
}
