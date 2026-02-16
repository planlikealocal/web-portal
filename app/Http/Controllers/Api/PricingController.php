<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PricingPlan;
use Illuminate\Http\JsonResponse;

class PricingController extends Controller
{
    /**
     * Get all active pricing plans for mobile app
     */
    public function index(): JsonResponse
    {
        $plans = PricingPlan::where('is_active', true)
            ->orderBy('order')
            ->orderBy('created_at', 'asc')
            ->get(['id', 'name', 'price', 'price_description', 'time_in_minutes', 'features', 'background_color', 'order']);

        $data = $plans->map(function ($plan) {
            return [
                'id' => $plan->id,
                'name' => $plan->name,
                'price' => number_format($plan->price, 2, '.', ''),
                'price_description' => $plan->price_description,
                'time_in_minutes' => $plan->time_in_minutes,
                'features' => $plan->features ?? [],
                'background_color' => $plan->background_color,
                'order' => $plan->order,
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $data,
        ]);
    }
}
