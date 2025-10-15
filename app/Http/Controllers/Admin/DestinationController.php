<?php

namespace App\Http\Controllers\Admin;

use App\Actions\Destination\CreateDestinationAction;
use App\Actions\Destination\DeleteDestinationAction;
use App\Actions\Destination\GetDestinationsAction;
use App\Actions\Destination\UpdateDestinationAction;
use App\Http\Controllers\Controller;
use App\Http\Resources\DestinationResource;
use App\Http\Requests\StoreDestinationRequest;
use App\Http\Requests\UpdateDestinationRequest;
use App\Models\Destination;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DestinationController extends Controller
{
    public function __construct(
        private GetDestinationsAction       $getDestinationsAction,
        private CreateDestinationAction     $createDestinationAction,
        private UpdateDestinationAction     $updateDestinationAction,
        private DeleteDestinationAction     $deleteDestinationAction,
    )
    {
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $filters = $request->only(['status', 'search']);
        $destinations = $this->getDestinationsAction->executePaginated($filters);

        return Inertia::render('Admin/Destinations/List', [
            'destinations' => DestinationResource::collection($destinations->items()),
            'pagination' => [
                'current_page' => $destinations->currentPage(),
                'last_page' => $destinations->lastPage(),
                'per_page' => $destinations->perPage(),
                'total' => $destinations->total(),
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('Admin/Destinations/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreDestinationRequest $request)
    {
        $data = $request->validated();
        
        // Set default values for required fields not in the create form
        $data['overview_title'] = $data['name']; // Use name as overview title
        $data['overview'] = $data['description']; // Use description as overview
        $data['country'] = 'TBD'; // To be filled in manage page
        $data['state_province'] = 'TBD'; // To be filled in manage page
        $data['city'] = 'TBD'; // To be filled in manage page
        $data['status'] = 'draft'; // Always create as draft initially

        $destination = $this->createDestinationAction->execute($data);

        return redirect()->route('admin.destinations.manage', $destination->id)
            ->with('success', 'Destination created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Destination $destination): Response
    {
        $destination->load(['location', 'images', 'seasons', 'activities', 'itineraries']);
        
        return Inertia::render('Admin/Destinations/Show', [
            'destination' => new DestinationResource($destination),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Destination $destination): Response
    {
        $destination->load(['images', 'seasons', 'activities', 'itineraries']);
        
        return Inertia::render('Admin/Destinations/Edit', [
            'destination' => new DestinationResource($destination),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateDestinationRequest $request, Destination $destination)
    {
        $data = $request->validated();

        $destination = $this->updateDestinationAction->execute($destination, $data);

        return redirect()->route('admin.destinations.manage', $destination->id)
            ->with('success', 'Destination updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Destination $destination)
    {
        $this->deleteDestinationAction->execute($destination);

        return redirect()->route('admin.destinations.index')
            ->with('success', 'Destination deleted successfully.');
    }

    /**
     * Show the destination management page
     */
    public function manage(Destination $destination): Response
    {
        $destination->load(['images', 'seasons', 'activities', 'itineraries']);
        
        return Inertia::render('Admin/Destinations/Manage', [
            'destination' => new DestinationResource($destination),
        ]);
    }

    /**
     * Toggle destination status
     */
    public function toggleStatus(Destination $destination)
    {
        $destination->status = $destination->status === 'active' ? 'inactive' : 'active';
        $destination->save();

        return redirect()->back()
            ->with('success', 'Destination status updated successfully.');
    }
}