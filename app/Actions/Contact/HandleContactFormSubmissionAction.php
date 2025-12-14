<?php

namespace App\Actions\Contact;

use App\Models\ContactedUser;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class HandleContactFormSubmissionAction
{
    /**
     * Execute the contact form submission action
     *
     * @param array $validatedData
     * @return ContactedUser
     */
    public function execute(array $validatedData): ContactedUser
    {
        // Save to database
        $contactedUser = ContactedUser::create([
            'first_name' => $validatedData['first_name'],
            'last_name' => $validatedData['last_name'],
            'email' => $validatedData['email'],
            'topic' => $validatedData['topic'],
            'message' => $validatedData['message'],
            'status' => 'new',
        ]);

        // Send email notification to configured addresses
        $this->sendNotificationEmails($contactedUser, $validatedData);

        return $contactedUser;
    }

    /**
     * Send email notifications to configured addresses
     *
     * @param ContactedUser $contactedUser
     * @param array $validatedData
     * @return void
     */
    private function sendNotificationEmails(ContactedUser $contactedUser, array $validatedData): void
    {
        try {
            // Get configured notification email addresses
            $notificationEmails = config('mail.contact_notification_emails', []);
            
            // Filter out empty values and validate email addresses
            $notificationEmails = array_filter($notificationEmails, function($email) {
                return !empty(trim($email)) && filter_var(trim($email), FILTER_VALIDATE_EMAIL);
            });
            
            // If no emails configured, fall back to default from address
            if (empty($notificationEmails)) {
                $defaultEmail = config('mail.from.address', 'admin@example.com');
                if (!empty($defaultEmail) && filter_var($defaultEmail, FILTER_VALIDATE_EMAIL)) {
                    $notificationEmails = [$defaultEmail];
                } else {
                    Log::warning('No valid contact notification emails configured', [
                        'contacted_user_id' => $contactedUser->id,
                        'default_email' => $defaultEmail,
                    ]);
                    return;
                }
            }

            // Format submission date
            $submittedAt = Carbon::now()->format('l, F j, Y \a\t g:i A');
            
            // Generate admin URL for viewing the contact request
            $adminUrl = url('/admin/contact-requests/' . $contactedUser->id);

            $sentCount = 0;
            $failedEmails = [];

            // Send email to each configured address
            foreach ($notificationEmails as $email) {
                $email = trim($email);
                try {
                    Mail::send('emails.contact-form-notification', [
                        'first_name' => $validatedData['first_name'],
                        'last_name' => $validatedData['last_name'],
                        'email' => $validatedData['email'],
                        'topic' => $validatedData['topic'],
                        'contact_message' => $validatedData['message'],
                        'submitted_at' => $submittedAt,
                        'admin_url' => $adminUrl,
                    ], function ($message) use ($validatedData, $email) {
                        $message->to($email)
                               ->subject('New Contact Form Submission: ' . $validatedData['topic'])
                               ->replyTo($validatedData['email']);
                    });
                    $sentCount++;
                } catch (\Exception $e) {
                    $failedEmails[] = $email;
                    Log::error('Failed to send contact form email to: ' . $email, [
                        'contacted_user_id' => $contactedUser->id,
                        'error' => $e->getMessage(),
                    ]);
                }
            }

            Log::info('Contact form notification emails processed', [
                'contacted_user_id' => $contactedUser->id,
                'total_recipients' => count($notificationEmails),
                'sent_count' => $sentCount,
                'failed_count' => count($failedEmails),
                'recipients' => $notificationEmails,
                'failed_emails' => $failedEmails,
            ]);
        } catch (\Exception $e) {
            // Log error but don't fail the request
            Log::error('Failed to send contact form email: ' . $e->getMessage(), [
                'contacted_user_id' => $contactedUser->id,
                'trace' => $e->getTraceAsString(),
            ]);
        }
    }
}

