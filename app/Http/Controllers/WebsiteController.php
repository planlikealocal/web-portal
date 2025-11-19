<?php

namespace App\Http\Controllers;

use App\Models\ContactedUser;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Mail;
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
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'topic' => 'required|string|in:Scheduling,Specialist Service,Billing,Other',
            'message' => 'required|string|max:5000',
            'recaptcha_token' => 'required|string',
        ]);

        // Verify reCAPTCHA
        $recaptchaSecret = config('services.recaptcha.secret_key');
        if ($recaptchaSecret) {
            $recaptchaResponse = Http::asForm()->post('https://www.google.com/recaptcha/api/siteverify', [
                'secret' => $recaptchaSecret,
                'response' => $validated['recaptcha_token'],
                'remoteip' => $request->ip(),
            ]);

            $recaptchaResult = $recaptchaResponse->json();

            if (!isset($recaptchaResult['success']) || !$recaptchaResult['success']) {
                return back()->withErrors([
                    'recaptcha' => 'reCAPTCHA verification failed. Please try again.',
                ])->withInput();
            }
        }

        // Save to database
        $contactedUser = ContactedUser::create([
            'first_name' => $validated['first_name'],
            'last_name' => $validated['last_name'],
            'email' => $validated['email'],
            'topic' => $validated['topic'],
            'message' => $validated['message'],
            'status' => 'new',
        ]);

        // Send email notification
        try {
            Mail::raw(
                "New Contact Form Submission\n\n" .
                "Name: {$validated['first_name']} {$validated['last_name']}\n" .
                "Email: {$validated['email']}\n" .
                "Topic: {$validated['topic']}\n\n" .
                "Message:\n{$validated['message']}",
                function ($message) use ($validated) {
                    $message->to(config('mail.from.address', 'admin@example.com'))
                           ->subject('New Contact Form Submission: ' . $validated['topic'])
                           ->replyTo($validated['email']);
                }
            );
        } catch (\Exception $e) {
            // Log error but don't fail the request
            \Log::error('Failed to send contact form email: ' . $e->getMessage());
        }

        return redirect()->back()->with('success', 'Thank you for your message! We will get back to you soon.');
    }
}
