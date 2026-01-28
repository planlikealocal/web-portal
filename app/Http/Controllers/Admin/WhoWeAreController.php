<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreWhoWeAreRequest;
use App\Http\Requests\UpdateWhoWeAreRequest;
use App\Models\WhoWeAre;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class WhoWeAreController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $whoWeAre = WhoWeAre::orderBy('order')->orderBy('created_at', 'desc')->get();

        return Inertia::render('Admin/WhoWeAre/List', [
            'whoWeAre' => $whoWeAre->map(function ($item) {
                return [
                    'id' => $item->id,
                    'name' => $item->name,
                    'designation' => $item->designation,
                    'description' => $item->description,
                    'picture_url' => $item->picture_url,
                    'order' => $item->order,
                    'created_at' => $item->created_at->format('Y-m-d H:i:s'),
                    'updated_at' => $item->updated_at->format('Y-m-d H:i:s'),
                ];
            }),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('Admin/WhoWeAre/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreWhoWeAreRequest $request)
    {
        $data = $request->validated();

        // Handle image upload
        if ($request->hasFile('picture')) {
            $file = $request->file('picture');
            $path = $file->store('who-we-are', 'public');
            $data['picture'] = $path;
        }

        // Set default order if not provided
        if (!isset($data['order'])) {
            $maxOrder = WhoWeAre::max('order') ?? 0;
            $data['order'] = $maxOrder + 1;
        }

        WhoWeAre::create($data);

        return redirect()->route('admin.who-we-are.index')
            ->with('success', 'Who We Are entry created successfully.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(WhoWeAre $whoWeAre): Response
    {
        return Inertia::render('Admin/WhoWeAre/Edit', [
            'whoWeAre' => [
                'id' => $whoWeAre->id,
                'name' => $whoWeAre->name,
                'designation' => $whoWeAre->designation,
                'description' => $whoWeAre->description,
                'picture_url' => $whoWeAre->picture_url,
                'order' => $whoWeAre->order,
            ],
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateWhoWeAreRequest $request, WhoWeAre $whoWeAre)
    {
        $data = $request->validated();

        // Handle image upload
        if ($request->hasFile('picture')) {
            // Delete old image if exists
            if ($whoWeAre->picture && Storage::disk('public')->exists($whoWeAre->picture)) {
                Storage::disk('public')->delete($whoWeAre->picture);
            }

            $file = $request->file('picture');
            $path = $file->store('who-we-are', 'public');
            $data['picture'] = $path;
        } else {
            // Don't update picture if not provided
            unset($data['picture']);
        }

        $whoWeAre->update($data);

        return redirect()->route('admin.who-we-are.index')
            ->with('success', 'Who We Are entry updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(WhoWeAre $whoWeAre)
    {
        // Delete image if exists
        if ($whoWeAre->picture && Storage::disk('public')->exists($whoWeAre->picture)) {
            Storage::disk('public')->delete($whoWeAre->picture);
        }

        $whoWeAre->delete();

        return redirect()->route('admin.who-we-are.index')
            ->with('success', 'Who We Are entry deleted successfully.');
    }
}
