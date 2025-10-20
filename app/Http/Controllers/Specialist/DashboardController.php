<?php

namespace App\Http\Controllers\Specialist;

use App\Http\Controllers\Controller;
use App\Models\Specialist;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Show the specialist dashboard
     */
    public function index()
    {
        $user = auth()->user();
        
        // Get specialist data if user has specialist role
        $specialist = null;
        if ($user->isSpecialist()) {
            $specialist = Specialist::where('email', $user->email)->first();
        }
        
        return Inertia::render('Specialist/Dashboard', [
            'user' => $user,
            'specialist' => $specialist,
        ]);
    }
}
