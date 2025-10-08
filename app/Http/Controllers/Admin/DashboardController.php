<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Specialist;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Show the admin dashboard
     */
    public function index()
    {
        $specialistsCount = Specialist::count();
        
        return Inertia::render('Admin/Dashboard', [
            'specialistsCount' => $specialistsCount,
        ]);
    }
}
