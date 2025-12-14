<?php

namespace App\Actions\SpecialistApplication;

use App\Models\SpecialistApplication;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class HandleSpecialistApplicationAction
{
    /**
     * Execute the specialist application submission action
     *
     * @param array $validatedData
     * @return SpecialistApplication
     */
    public function execute(array $validatedData): SpecialistApplication
    {
        // Save to database
        $application = SpecialistApplication::create([
            'first_name' => $validatedData['first_name'],
            'last_name' => $validatedData['last_name'],
            'email' => $validatedData['email'],
            'city_state' => $validatedData['city_state'],
            'phone' => $validatedData['phone'],
            'destination_known_for' => $validatedData['destination_known_for'],
            'qualified_expert' => $validatedData['qualified_expert'],
            'best_way_to_contact' => $validatedData['best_way_to_contact'],
            'status' => 'new',
        ]);

        // Send confirmation email to applicant
        $this->sendConfirmationEmail($application, $validatedData);

        // Send email notification to configured addresses
        $this->sendNotificationEmails($application, $validatedData);

        return $application;
    }

    /**
     * Send confirmation email to the applicant
     *
     * @param SpecialistApplication $application
     * @param array $validatedData
     * @return void
     */
    private function sendConfirmationEmail(SpecialistApplication $application, array $validatedData): void
    {
        try {
            // Format submission date
            $submittedAt = Carbon::now()->format('l, F j, Y \a\t g:i A');

            Mail::send('emails.specialist-application-confirmation', [
                'first_name' => $validatedData['first_name'],
                'last_name' => $validatedData['last_name'],
                'email' => $validatedData['email'],
                'city_state' => $validatedData['city_state'],
                'submitted_at' => $submittedAt,
            ], function ($message) use ($validatedData) {
                $message->to($validatedData['email'], $validatedData['first_name'] . ' ' . $validatedData['last_name'])
                       ->subject('Thank You for Your Specialist Application - Plan Like A Local');
            });

            Log::info('Specialist application confirmation email sent', [
                'application_id' => $application->id,
                'applicant_email' => $validatedData['email'],
            ]);
        } catch (\Exception $e) {
            // Log error but don't fail the request
            Log::error('Failed to send specialist application confirmation email: ' . $e->getMessage(), [
                'application_id' => $application->id,
                'applicant_email' => $validatedData['email'],
                'trace' => $e->getTraceAsString(),
            ]);
        }
    }

    /**
     * Send email notifications to configured addresses
     *
     * @param SpecialistApplication $application
     * @param array $validatedData
     * @return void
     */
    private function sendNotificationEmails(SpecialistApplication $application, array $validatedData): void
    {
        try {
            // Get configured notification email addresses
            $notificationEmails = config('mail.specialist_application_notification_emails', []);
            
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
                    Log::warning('No valid specialist application notification emails configured', [
                        'application_id' => $application->id,
                        'default_email' => $defaultEmail,
                    ]);
                    return;
                }
            }

            // Format submission date
            $submittedAt = Carbon::now()->format('l, F j, Y \a\t g:i A');
            
            // Generate admin URL for viewing the application
            $adminUrl = url('/admin/specialist-applications/' . $application->id);

            $sentCount = 0;
            $failedEmails = [];

            // Send email to each configured address
            foreach ($notificationEmails as $email) {
                $email = trim($email);
                try {
                    Mail::send('emails.specialist-application-notification', [
                        'first_name' => $validatedData['first_name'],
                        'last_name' => $validatedData['last_name'],
                        'email' => $validatedData['email'],
                        'city_state' => $validatedData['city_state'],
                        'phone' => $validatedData['phone'],
                        'destination_known_for' => $validatedData['destination_known_for'],
                        'qualified_expert' => $validatedData['qualified_expert'],
                        'best_way_to_contact' => $validatedData['best_way_to_contact'],
                        'submitted_at' => $submittedAt,
                        'admin_url' => $adminUrl,
                    ], function ($message) use ($validatedData, $email) {
                        $message->to($email)
                               ->subject('New Specialist Application: ' . $validatedData['first_name'] . ' ' . $validatedData['last_name'])
                               ->replyTo($validatedData['email']);
                    });
                    $sentCount++;
                } catch (\Exception $e) {
                    $failedEmails[] = $email;
                    Log::error('Failed to send specialist application email to: ' . $email, [
                        'application_id' => $application->id,
                        'error' => $e->getMessage(),
                    ]);
                }
            }

            Log::info('Specialist application notification emails processed', [
                'application_id' => $application->id,
                'total_recipients' => count($notificationEmails),
                'sent_count' => $sentCount,
                'failed_count' => count($failedEmails),
                'recipients' => $notificationEmails,
                'failed_emails' => $failedEmails,
            ]);
        } catch (\Exception $e) {
            // Log error but don't fail the request
            Log::error('Failed to send specialist application email: ' . $e->getMessage(), [
                'application_id' => $application->id,
                'trace' => $e->getTraceAsString(),
            ]);
        }
    }
}

