<?php

namespace App\Http\Controllers\Admin;

use App\Actions\Destination\CreateDestinationAction;
use App\Actions\Destination\DeleteDestinationAction;
use App\Actions\Destination\GetDestinationsAction;
use App\Actions\Destination\UpdateDestinationAction;
use App\Actions\Specialist\GetSpecialistsAction;
use App\Http\Controllers\Controller;
use App\Http\Resources\DestinationListResource;
use App\Http\Resources\DestinationResource;
use App\Http\Resources\SpecialistResource;
use App\Http\Requests\StoreDestinationRequest;
use App\Http\Requests\UpdateDestinationRequest;
use App\Models\Destination;
use App\Models\DestinationImage;
use App\Models\DestinationSeason;
use App\Models\DestinationActivity;
use App\Models\Country;
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
            'destinations' => DestinationListResource::collection($destinations->items()),
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

        // Handle country_id - convert empty string to null
        if (isset($data['country_id']) && $data['country_id'] === '') {
            $data['country_id'] = null;
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

        if ($request->hasFile('banner_image')) {
            $file = $request->file('banner_image');
            $path = $file->store('destinations', 'public');
            $data['banner_image'] = Storage::disk('public')->url($path);
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
        $destination->load(['images', 'seasons', 'activities', 'itineraries', 'country']);

        // Load specialists filtered by destination's country if available
        $filters = ['status' => 'active'];
        if ($destination->country_id) {
            $filters['country_id'] = $destination->country_id;
        }
        $specialists = $this->getSpecialistsAction->execute($filters);
        
        // Load all countries for the select box
        $countries = Country::orderBy('name')->get();
        return Inertia::render('Admin/Destinations/Manage', [
            'destination' => new DestinationResource($destination),
            'specialists' => SpecialistResource::collection($specialists),
            'countries' => $countries,
        ]);
    }

    /**
     * Get specialists filtered by country
     */
    public function getSpecialistsByCountry(Request $request)
    {
        $countryId = $request->input('country_id');
        
        $filters = ['status' => 'active'];
        if ($countryId) {
            $filters['country_id'] = $countryId;
        }
        
        $specialists = $this->getSpecialistsAction->execute($filters);
        
        return response()->json([
            'specialists' => SpecialistResource::collection($specialists)
        ]);
    }

    /**
     * Store new destination images (supports multiple images)
     */
    public function storeImage(Request $request, Destination $destination)
    {
        // Log the request for debugging
        \Log::info('Store image request', [
            'destination_id' => $destination->id,
            'request_data' => $request->all(),
            'files_count' => $request->hasFile('images') ? count($request->file('images')) : 0
        ]);

        // Check if we have multiple images or single image
        $hasMultipleImages = $request->hasFile('images') && is_array($request->file('images'));
        $hasSingleImage = $request->hasFile('image');

        if ($hasMultipleImages) {
            // Handle multiple images
            $request->validate([
                'names' => 'required|array',
                'names.*' => 'required|string|max:255',
                'descriptions' => 'nullable|array',
                'descriptions.*' => 'nullable|string',
                'images' => 'required|array',
                'images.*' => 'required|image|mimes:jpeg,png,jpg,gif',
            ]);

            $names = $request->input('names', []);
            $descriptions = $request->input('descriptions', []);
            $images = $request->file('images');

            $createdImages = [];

            foreach ($images as $index => $file) {
                $data = [
                    'name' => $names[$index] ?? "Image " . ($index + 1),
                    'description' => $descriptions[$index] ?? '',
                    'image_type' => 'gallery',
                    'destination_id' => $destination->id,
                ];

                // Handle image upload
                $path = $file->store('destination-images', 'public');
                $data['url'] = Storage::disk('public')->url($path);

                $createdImages[] = DestinationImage::create($data);
            }

            $count = count($createdImages);
            return redirect()->route('admin.destinations.manage', $destination->id)
                ->with('success', "{$count} image" . ($count > 1 ? 's' : '') . " added successfully.");

        } elseif ($hasSingleImage) {
            // Handle single image (backward compatibility)
            $request->validate([
                'name' => 'required|string|max:255',
                'description' => 'nullable|string',
                'image' => 'required|image|mimes:jpeg,png,jpg,gif',
            ]);

            $data = $request->only(['name', 'description']);
            $data['image_type'] = 'gallery'; // Always gallery

            // Handle image upload
            $file = $request->file('image');
            $path = $file->store('destination-images', 'public');
            $data['url'] = Storage::disk('public')->url($path);

            $data['destination_id'] = $destination->id;

            DestinationImage::create($data);

            return redirect()->route('admin.destinations.manage', $destination->id)
                ->with('success', 'Image added successfully.');
        } else {
            return redirect()->route('admin.destinations.manage', $destination->id)
                ->with('error', 'No images provided.');
        }
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

    /**
     * Store a new destination season
     */
    public function storeSeason(Request $request, Destination $destination)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'duration' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'boolean',
        ]);

        $data = $request->only(['name', 'duration', 'description', 'status']);
        $data['destination_id'] = $destination->id;
        $data['status'] = $request->boolean('status', true);

        DestinationSeason::create($data);

        return redirect()->route('admin.destinations.manage', $destination->id)
            ->with('success', 'Season added successfully.');
    }

    /**
     * Update a destination season
     */
    public function updateSeason(Request $request, Destination $destination, DestinationSeason $season)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'duration' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'boolean',
        ]);

        $data = $request->only(['name', 'duration', 'description']);
        $data['status'] = $request->boolean('status', true);

        $season->update($data);

        return redirect()->route('admin.destinations.manage', $destination->id)
            ->with('success', 'Season updated successfully.');
    }

    /**
     * Delete a destination season
     */
    public function destroySeason(Destination $destination, DestinationSeason $season)
    {
        $season->delete();

        return redirect()->route('admin.destinations.manage', $destination->id)
            ->with('success', 'Season deleted successfully.');
    }

    /**
     * Store a new destination activity
     */
    public function storeActivity(Request $request, Destination $destination)
    {
        // Log the request for debugging
        \Log::info('Store activity request', [
            'destination_id' => $destination->id,
            'request_data' => $request->all(),
            'files_count' => $request->hasFile('images') ? count($request->file('images')) : 0
        ]);

        // Check if we have multiple activities or single activity
        $hasMultipleActivities = $request->hasFile('images') && is_array($request->file('images'));
        $hasSingleActivity = $request->hasFile('image');

        if ($hasMultipleActivities) {
            // Handle multiple activities
            $request->validate([
                'names' => 'required|array',
                'names.*' => 'required|string|max:255',
                'images' => 'required|array',
                'images.*' => 'required|image|mimes:jpeg,png,jpg,gif',
            ]);

            $names = $request->input('names', []);
            $images = $request->file('images');

            $createdActivities = [];

            foreach ($images as $index => $file) {
                $data = [
                    'name' => $names[$index] ?? "Activity " . ($index + 1),
                    'destination_id' => $destination->id,
                ];

                // Handle image upload
                $path = $file->store('destination-activities', 'public');
                $data['image_url'] = Storage::disk('public')->url($path);

                $createdActivities[] = DestinationActivity::create($data);
            }

            $count = count($createdActivities);
            return redirect()->route('admin.destinations.manage', $destination->id)
                ->with('success', "{$count} activit" . ($count > 1 ? 'ies' : 'y') . " added successfully.");

        } elseif ($hasSingleActivity) {
            // Handle single activity (backward compatibility)
            $request->validate([
                'name' => 'required|string|max:255',
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif',
            ]);

            $data = $request->only(['name']);
            $data['destination_id'] = $destination->id;

            // Handle image upload
            if ($request->hasFile('image')) {
                $file = $request->file('image');
                $path = $file->store('destination-activities', 'public');
                $data['image_url'] = Storage::disk('public')->url($path);
            }

            DestinationActivity::create($data);

            return redirect()->route('admin.destinations.manage', $destination->id)
                ->with('success', 'Activity added successfully.');
        } else {
            return redirect()->route('admin.destinations.manage', $destination->id)
                ->with('error', 'No activities provided.');
        }
    }

    /**
     * Update a destination activity
     */
    public function updateActivity(Request $request, Destination $destination, DestinationActivity $activity)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif',
        ]);

        $data = $request->only(['name']);

        // Handle image upload if new image provided
        if ($request->hasFile('image')) {
            // Delete old image
            if ($activity->image_url) {
                $oldPath = str_replace(Storage::disk('public')->url(''), '', $activity->image_url);
                Storage::disk('public')->delete($oldPath);
            }

            $file = $request->file('image');
            $path = $file->store('destination-activities', 'public');
            $data['image_url'] = Storage::disk('public')->url($path);
        }

        $activity->update($data);

        return redirect()->route('admin.destinations.manage', $destination->id)
            ->with('success', 'Activity updated successfully.');
    }

    /**
     * Delete a destination activity
     */
    public function destroyActivity(Destination $destination, DestinationActivity $activity)
    {
        // Delete image file
        if ($activity->image_url) {
            $path = str_replace(Storage::disk('public')->url(''), '', $activity->image_url);
            Storage::disk('public')->delete($path);
        }

        $activity->delete();

        return redirect()->route('admin.destinations.manage', $destination->id)
            ->with('success', 'Activity deleted successfully.');
    }

}
