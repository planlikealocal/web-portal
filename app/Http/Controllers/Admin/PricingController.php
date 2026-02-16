<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePricingRequest;
use App\Http\Requests\UpdatePricingRequest;
use App\Models\PricingPlan;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PricingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $pricingPlans = PricingPlan::orderBy('order')->orderBy('created_at', 'desc')->get();

        return Inertia::render('Admin/Pricing/List', [
            'pricingPlans' => $pricingPlans->map(function ($plan) {
                return [
                    'id' => $plan->id,
                    'name' => $plan->name,
                    'price' => $plan->price,
                    'price_description' => $plan->price_description,
                    'time_in_minutes' => $plan->time_in_minutes,
                    'features' => $plan->features ?? [],
                    'background_color' => $plan->background_color,
                    'order' => $plan->order,
                    'is_active' => $plan->is_active,
                    'created_at' => $plan->created_at->format('Y-m-d H:i:s'),
                    'updated_at' => $plan->updated_at->format('Y-m-d H:i:s'),
                ];
            }),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('Admin/Pricing/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePricingRequest $request)
    {
        $data = $request->validated();

        // Set default order if not provided
        if (!isset($data['order'])) {
            $maxOrder = PricingPlan::max('order') ?? 0;
            $data['order'] = $maxOrder + 1;
        }

        // Set default is_active if not provided
        if (!isset($data['is_active'])) {
            $data['is_active'] = true;
        }

        PricingPlan::create($data);

        return redirect()->route('admin.pricing.index')
            ->with('success', 'Pricing plan created successfully.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(PricingPlan $pricingPlan): Response
    {
        return Inertia::render('Admin/Pricing/Edit', [
            'pricingPlan' => [
                'id' => $pricingPlan->id,
                'name' => $pricingPlan->name,
                'price' => $pricingPlan->price,
                'price_description' => $pricingPlan->price_description,
                'time_in_minutes' => $pricingPlan->time_in_minutes,
                'features' => $pricingPlan->features ?? [],
                'background_color' => $pricingPlan->background_color,
                'order' => $pricingPlan->order,
                'is_active' => $pricingPlan->is_active,
            ],
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePricingRequest $request, PricingPlan $pricingPlan)
    {
        $data = $request->validated();
        $pricingPlan->update($data);

        return redirect()->route('admin.pricing.index')
            ->with('success', 'Pricing plan updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PricingPlan $pricingPlan)
    {
        $pricingPlan->delete();

        return redirect()->route('admin.pricing.index')
            ->with('success', 'Pricing plan deleted successfully.');
    }
}
