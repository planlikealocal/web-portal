<?php

namespace App\Http\Controllers\Admin;

use App\Actions\Specialist\CreateSpecialistAction;
use App\Actions\Specialist\DeleteSpecialistAction;
use App\Actions\Specialist\GetSpecialistsAction;
use App\Actions\Specialist\UpdateSpecialistAction;
use App\Http\Controllers\Controller;
use App\Http\Resources\SpecialistListResource;
use App\Http\Resources\SpecialistResource;
use App\Http\Requests\StoreSpecialistRequest;
use App\Http\Requests\UpdateSpecialistRequest;
use App\Models\Specialist;
use App\Models\Country;
use App\Services\SpecialistOperationService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SpecialistController extends Controller
{
    public function __construct(
        private GetSpecialistsAction       $getSpecialistsAction,
        private CreateSpecialistAction     $createSpecialistAction,
        private UpdateSpecialistAction     $updateSpecialistAction,
        private DeleteSpecialistAction     $deleteSpecialistAction,
        private SpecialistOperationService $operationService,
    )
    {
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request, bool $reSetForm = false): Response
    {
        $filters = $request->only(['status', 'search']);
        $specialists = $this->getSpecialistsAction->execute($filters);
        $countries = Country::orderBy('name')->get(['id', 'name', 'code', 'flag_url']);

        return Inertia::render('Admin/Specialists/List', [
            'specialists' => SpecialistListResource::collection($specialists),
            'countries' => $countries,
            'resetForm' => $reSetForm,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('Admin/Specialists/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreSpecialistRequest $request)
    {
        $data = $request->validated();
        if ($request->hasFile('profile_pic')) {
            $data['profile_pic'] = $request->file('profile_pic');
        }

        $this->createSpecialistAction->execute($data);

        return redirect()->route('admin.specialists.create')
            ->with('success', 'Specialist created successfully.')
            ->with('reSetForm', true);
    }

    /**
     * Display the specified resource.
     */
    public function show(Specialist $specialist)
    {
        return Inertia::render('Admin/Specialists/Show', [
            'specialist' => new SpecialistResource($specialist),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Specialist $specialist)
    {
        return Inertia::render('Admin/Specialists/Edit', [
            'specialist' => new SpecialistResource($specialist),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateSpecialistRequest $request, Specialist $specialist)
    {
        $data = $request->validated();

        // Pass uploaded file to action (action handles storage)
        if ($request->hasFile('profile_pic')) {
            $data['profile_pic'] = $request->file('profile_pic');
        }

        $specialist = $this->updateSpecialistAction->execute($specialist, $data);

        return redirect()->route('admin.specialists.index')
            ->with('success', 'Specialist updated successfully')
            ->with('reSetForm', true);

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Specialist $specialist)
    {
        $this->deleteSpecialistAction->execute($specialist);

        return redirect()->route('admin.specialists.index')
            ->with('success', 'Specialist deleted successfully.');
    }

    /**
     * Toggle specialist status using strategy pattern
     */
    public function toggleStatus(Specialist $specialist)
    {
        $updatedSpecialist = $this->operationService->executeOperation('toggle_status', $specialist);

        return redirect()->route('admin.specialists.index')
            ->with('success', 'Specialist status updated successfully.');
    }

    /**
     * Increment trip count using strategy pattern
     */
    public function incrementTrips(Specialist $specialist, Request $request)
    {
        $incrementBy = $request->input('increment_by', 1);

        $updatedSpecialist = $this->operationService->executeOperation('increment_trips', $specialist, [
            'increment_by' => $incrementBy
        ]);

        return redirect()->route('admin.specialists.show', $updatedSpecialist)
            ->with('success', 'Trip count updated successfully.');
    }
}
