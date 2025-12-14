<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Country;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Inertia\Inertia;

class CountryController extends Controller
{
    /**
     * Display a listing of countries
     */
    public function index()
    {
        $countries = Country::withCount('destinations')->orderBy('name')->get();
        
        return Inertia::render('Admin/Countries', [
            'countries' => $countries,
        ]);
    }

    /**
     * Get countries for autocomplete
     */
    public function autocomplete(Request $request): JsonResponse
    {
        $search = $request->get('search', '');
        
        $countries = Country::when($search, function ($query, $search) {
            return $query->where('name', 'like', "%{$search}%");
        })
        ->orderBy('name')
        ->limit(20)
        ->get(['id', 'name', 'code', 'flag_url']);
        
        return response()->json($countries);
    }

    /**
     * Get all countries with destinations count for public API
     */
    public function list(Request $request): JsonResponse
    {
        $countries = Country::withCount('destinations')
            ->orderBy('name')
            ->get(['id', 'name', 'code', 'flag_url', 'destinations_count']);
        
        return response()->json($countries);
    }
}