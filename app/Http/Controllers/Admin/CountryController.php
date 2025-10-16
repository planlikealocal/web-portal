<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Country;
use Illuminate\Http\Request;
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
}