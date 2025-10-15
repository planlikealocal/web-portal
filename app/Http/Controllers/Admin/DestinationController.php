<?php

namespace App\Http\Controllers\Admin;

use App\Actions\Destination\CreateDestinationAction;
use App\Actions\Destination\DeleteDestinationAction;
use App\Actions\Destination\GetDestinationsAction;
use App\Actions\Destination\UpdateDestinationAction;
use App\Actions\Specialist\GetSpecialistsAction;
use App\Http\Controllers\Controller;
use App\Http\Resources\DestinationResource;
use App\Http\Resources\SpecialistResource;
use App\Http\Requests\StoreDestinationRequest;
use App\Http\Requests\UpdateDestinationRequest;
use App\Models\Destination;
use App\Models\DestinationImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class DestinationController extends Controller
{
    public function __construct(
        private GetDestinationsAction       $getDestinationsAction,
        private CreateDestinationAction     $createDestinationAction,
        private UpdateDestinationAction     $updateDestinationAction,
        private DeleteDestinationAction     $deleteDestinationAction,
        private GetSpecialistsAction        $getSpecialistsAction,
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
        
        // Handle image upload
        if ($request->hasFile('home_image')) {
            $file = $request->file('home_image');
            $path = $file->store('destinations', 'public');
            $data['home_image'] = Storage::disk('public')->url($path);
        }
        
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
        
        // Handle specialist_ids - convert JSON string to array
        if (isset($data['specialist_ids']) && is_string($data['specialist_ids'])) {
            $data['specialist_ids'] = json_decode($data['specialist_ids'], true) ?? [];
        }
        
        // Handle image uploads
        if ($request->hasFile('home_image')) {
            $file = $request->file('home_image');
            $path = $file->store('destinations', 'public');
            $data['home_image'] = Storage::disk('public')->url($path);
        }
        
        if ($request->hasFile('grid_image')) {
            $file = $request->file('grid_image');
            $path = $file->store('destinations', 'public');
            $data['grid_image'] = Storage::disk('public')->url($path);
        }

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
        
        // Load all active specialists for the multi-select
        $specialists = $this->getSpecialistsAction->execute(['status' => 'active']);
        
        return Inertia::render('Admin/Destinations/Manage', [
            'destination' => new DestinationResource($destination),
            'specialists' => SpecialistResource::collection($specialists),
        ]);
    }

    /**
     * Store a new destination image
     */
    public function storeImage(Request $request, Destination $destination)
    {
        // Log the request for debugging
        \Log::info('Store image request', [
            'destination_id' => $destination->id,
            'request_data' => $request->all()
        ]);

        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif',
        ]);

        $data = $request->only(['name', 'description']);
        $data['image_type'] = 'gallery'; // Always gallery
        
        // Handle image upload
        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $path = $file->store('destination-images', 'public');
            $data['url'] = Storage::disk('public')->url($path);
        }

        $data['destination_id'] = $destination->id;
        
        DestinationImage::create($data);

        return redirect()->route('admin.destinations.manage', $destination->id)
            ->with('success', 'Image added successfully.');
    }

    /**
     * Update a destination image
     */
    public function updateImage(Request $request, Destination $destination, DestinationImage $image)
    {
        // Log the request for debugging
        \Log::info('Update image request', [
            'destination_id' => $destination->id,
            'image_id' => $image->id,
            'request_data' => $request->all()
        ]);

        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif',
        ]);

        $data = $request->only(['name', 'description']);
        $data['image_type'] = 'gallery'; // Always gallery
        
        // Handle image upload if new image provided
        if ($request->hasFile('image')) {
            // Delete old image
            if ($image->url) {
                $oldPath = str_replace(Storage::disk('public')->url(''), '', $image->url);
                Storage::disk('public')->delete($oldPath);
            }
            
            $file = $request->file('image');
            $path = $file->store('destination-images', 'public');
            $data['url'] = Storage::disk('public')->url($path);
        }

        $image->update($data);

        return redirect()->route('admin.destinations.manage', $destination->id)
            ->with('success', 'Image updated successfully.');
    }

    /**
     * Delete a destination image
     */
    public function destroyImage(Destination $destination, DestinationImage $image)
    {
        // Delete image file
        if ($image->url) {
            $path = str_replace(Storage::disk('public')->url(''), '', $image->url);
            Storage::disk('public')->delete($path);
        }

        $image->delete();

        return redirect()->route('admin.destinations.manage', $destination->id)
            ->with('success', 'Image deleted successfully.');
    }

}