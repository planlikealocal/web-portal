<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Mail;

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
     * Show the contact page
     */
    public function contact()
    {
        return Inertia::render('Contact');
    }

    /**
     * Handle contact form submission
     */
    public function contactSubmit(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'message' => 'required|string|max:1000',
        ]);

        // Send email using Mailpit
        Mail::raw($validated['message'], function ($message) use ($validated) {
            $message->to('admin@example.com')
                   ->subject('New Contact Form Submission from ' . $validated['name'])
                   ->replyTo($validated['email']);
        });

        return redirect()->back()->with('success', 'Thank you for your message! We will get back to you soon.');
    }
}
