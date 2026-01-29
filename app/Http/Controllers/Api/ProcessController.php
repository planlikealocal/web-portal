<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ProcessStep;
use Illuminate\Http\JsonResponse;

class ProcessController extends Controller
{
    /**
     * Get all active process steps for mobile app
     */
    public function index(): JsonResponse
    {
        $steps = ProcessStep::where('is_active', true)
            ->orderBy('order')
            ->orderBy('created_at', 'asc')
            ->get(['id', 'title', 'description', 'icon', 'background_color', 'order']);

        $data = $steps->map(function ($step) {
            return [
                'id' => $step->id,
                'title' => $step->title,
                'description' => $step->description,
                'icon' => $step->icon,
                'background_color' => $step->background_color,
                'order' => $step->order,
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $data,
        ]);
    }
}
