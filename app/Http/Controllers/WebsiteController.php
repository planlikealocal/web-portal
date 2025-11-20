<?php

namespace App\Http\Controllers;

use App\Actions\Contact\HandleContactFormSubmissionAction;
use App\Http\Requests\ContactFormRequest;
use Inertia\Inertia;

class WebsiteController extends Controller
{
    /**
     * Show the home page
     */
    public function home()
    {
        return Inertia::render('Home');
    }

    /**
     * Show the about page
     */
    public function about()
    {
        return Inertia::render('About');
    }

    /**
     * Show the what we do page
     */
    public function whatWeDo()
    {
        return Inertia::render('WhatWeDo');
    }

    /**
     * Show the contact page
     */
    public function contact()
    {
        return Inertia::render('Contact');
    }

    /**
     * Handle contact form submission
     */
    public function contactSubmit(ContactFormRequest $request, HandleContactFormSubmissionAction $action)
    {
        $action->execute($request->validated());

        return redirect()->back()->with('success', 'Thank you for your message! We will get back to you soon.');
    }
}
