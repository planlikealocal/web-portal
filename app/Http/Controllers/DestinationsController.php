<?php

namespace App\Http\Controllers;

use App\Actions\Destination\GetDestinationsAction;
use App\Http\Resources\DestinationListResource;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DestinationsController extends Controller
{

    public function __construct(private GetDestinationsAction  $getDestinationsAction){}

    public function index(Request $request)
    {
        $filters = $request->only(['status', 'search']);
        $destinations = $this->getDestinationsAction->executePaginated($filters, 6);

        return Inertia::render('Web/Destinations', [
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

    public function loadMore(Request $request)
    {
        $filters = $request->only(['status', 'search']);
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
