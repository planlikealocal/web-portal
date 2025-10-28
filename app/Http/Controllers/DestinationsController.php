<?php

namespace App\Http\Controllers;

use App\Actions\Destination\GetDestinationsAction;
use App\Http\Resources\DestinationListResource;
use App\Models\Country;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DestinationsController extends Controller
{

    public function __construct(private GetDestinationsAction  $getDestinationsAction){}

    public function index(Request $request)
    {
        $filters = $request->only(['status', 'search', 'country_id', 'region', 'activity', 'page']);
        $page = $filters['page'] ?? 1;
        // Remove page from filters for the action
        $actionFilters = $filters;
        unset($actionFilters['page']);
        $destinations = $this->getDestinationsAction->executePaginated($actionFilters, 6, $page);

         
        $countries = Country::withCount('destinations')
            ->orderBy('name')
            ->get(['id', 'name', 'code', 'flag_url', 'destinations_count']);

        $response = [
            'destinations' => DestinationListResource::collection($destinations->items()),
            'pagination' => [
                'current_page' => $destinations->currentPage(),
                'last_page' => $destinations->lastPage(),
                'per_page' => $destinations->perPage(),
                'total' => $destinations->total(),
                'has_more_pages' => $destinations->hasMorePages(),
            ],
            'filters' => $filters,
            'countries' => $countries
        ];

        // Add regions to response if country_id is provided
        $regions = [];
        if (!empty($filters['country_id'])) {
            $regions = \App\Models\Destination::where('country_id', $filters['country_id'])
                ->whereNotNull('state_province')
                ->distinct()
                ->pluck('state_province')
                ->map(function ($region) {
                    return [
                        'id' => strtolower(str_replace(' ', '_', $region)),
                        'name' => $region
                    ];
                })
                ->values()
                ->sortBy('name')
                ->values()
                ->toArray();
        }
        $response['regions'] = $regions;

        // Add activities to response if country_id is provided
        $activities = [];
        if (!empty($filters['country_id'])) {
            $activities = \App\Models\DestinationActivity::whereHas('destination', function ($query) use ($filters) {
                $query->where('country_id', $filters['country_id']);
            })
                ->where('status', 'active')
                ->distinct()
                ->pluck('name')
                ->map(function ($activity) {
                    return [
                        'id' => strtolower(str_replace(' ', '_', $activity)),
                        'name' => $activity
                    ];
                })
                ->values()
                ->sortBy('name')
                ->values()
                ->toArray();
        }
        $response['activities'] = $activities;

        return Inertia::render('Web/Destinations', $response);
    }

    public function loadMore(Request $request)
    {
        $filters = $request->only(['status', 'search', 'country_id']);
        $page = $request->get('page', 1);

        $destinations = $this->getDestinationsAction->executePaginated($filters, 6, $page);

        return response()->json([
            'destinations' => DestinationListResource::collection($destinations->items()),
            'pagination' => [
                'current_page' => $destinations->currentPage(),
                'last_page' => $destinations->lastPage(),
                'per_page' => $destinations->perPage(),
                'total' => $destinations->total(),
                'has_more_pages' => $destinations->hasMorePages(),
            ]
        ]);
    }

    public function getRegionsByCountry(Request $request)
    {
        $countryId = $request->get('country_id');
        
        if (!$countryId) {
            return response()->json(['regions' => []]);
        }

        $regions = \App\Models\Destination::where('country_id', $countryId)
            ->whereNotNull('state_province')
            ->distinct()
            ->pluck('state_province')
            ->map(function ($region) {
                return [
                    'id' => strtolower(str_replace(' ', '_', $region)),
                    'name' => $region
                ];
            })
            ->values()
            ->sortBy('name')
            ->values();

        // Return JSON response for AJAX calls, or Inertia response
        if ($request->expectsJson() || $request->header('X-Inertia')) {
            return response()->json(['regions' => $regions]);
        }

        return Inertia::render('Web/Destinations', ['regions' => $regions->toArray()]);
    }
}
