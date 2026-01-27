<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Country;
use Illuminate\Http\JsonResponse;

class CountryController extends Controller
{
    /**
     * Get all countries for mobile app
     */
    public function index(): JsonResponse
    {
        $countries = Country::orderBy('name')
            ->get(['id', 'name', 'code', 'flag_url']);

        return response()->json([
            'success' => true,
            'data' => $countries,
        ]);
    }
}
