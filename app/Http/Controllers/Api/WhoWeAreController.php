<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\WhoWeAre;
use Illuminate\Http\JsonResponse;

class WhoWeAreController extends Controller
{
    /**
     * Get all Who We Are entries for mobile app
     */
    public function index(): JsonResponse
    {
        $whoWeAre = WhoWeAre::orderBy('order')
            ->orderBy('created_at', 'asc')
            ->get(['id', 'name', 'designation', 'description', 'picture', 'order']);

        $data = $whoWeAre->map(function ($item) {
            return [
                'id' => $item->id,
                'name' => $item->name,
                'designation' => $item->designation,
                'description' => $item->description,
                'picture_url' => $item->picture_url,
                'order' => $item->order,
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $data,
        ]);
    }
}
