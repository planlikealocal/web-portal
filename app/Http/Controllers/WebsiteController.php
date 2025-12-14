<?php

namespace App\Http\Controllers;

use App\Actions\Contact\HandleContactFormSubmissionAction;
use App\Actions\Destination\GetDestinationsAction;
use App\Actions\SpecialistApplication\HandleSpecialistApplicationAction;
use App\Http\Requests\ContactFormRequest;
use App\Http\Requests\SpecialistApplicationRequest;
use App\Http\Resources\DestinationListResource;
use Inertia\Inertia;

class WebsiteController extends Controller
{
    public function __construct(private GetDestinationsAction $getDestinationsAction) {}

    /**
     * Show the home page
     */
    public function home()
    {
        // Get featured destinations (active only, home_page = true, limit to 6)
        $destinations = $this->getDestinationsAction->executePaginated(['status' => 'active', 'home_page' => true], 6, 1);

        return Inertia::render('Home/index', [
            'destinations' => DestinationListResource::collection($destinations->items()),
        ]);
    }

    /**
     * Show the about page
     */
    public function whoWeAre()
    {
        return Inertia::render('WhoWeAre/index');
    }

    /**
     * Show the what we do page
     */
    public function whatWeDo()
    {
        return Inertia::render('WhatWeDo/index');
    }

    /**
     * Show the contact page
     */
    public function contact()
    {
        return Inertia::render('Contact/index');
    }

    /**
     * Handle contact form submission
     */
    public function contactSubmit(ContactFormRequest $request, HandleContactFormSubmissionAction $action)
    {
        $action->execute($request->validated());

        return redirect()->back()->with('success', 'Thank you for your message! We will get back to you soon.');
    }

    /**
     * Handle specialist application submission
     */
    public function specialistApplicationSubmit(SpecialistApplicationRequest $request, HandleSpecialistApplicationAction $action)
    {
        $action->execute($request->validated());

        return redirect()->back()->with('success', 'Thank you for your application! We will review it and get back to you soon.');
    }
}
