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
        $filters = $request->only(['status', 'search', 'country_id', 'page']);
        $page = $filters['page'] ?? 1;
        $destinations = $this->getDestinationsAction->executePaginated($filters, 6, $page);

         
        $countries = Country::withCount('destinations')
            ->orderBy('name')
            ->get(['id', 'name', 'code', 'flag_url', 'destinations_count']);

        return Inertia::render('Web/Destinations', [
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
        ]);
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
}
