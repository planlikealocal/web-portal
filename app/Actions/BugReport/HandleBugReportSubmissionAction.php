<?php

namespace App\Actions\BugReport;

use App\Models\BugReport;
use Carbon\Carbon;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class HandleBugReportSubmissionAction
{
    /**
     * Execute the bug report submission action.
     */
    public function execute(array $validatedData, ?UploadedFile $screenshot, int $userId): BugReport
    {
        $screenshotPath = null;
        if ($screenshot) {
            $screenshotPath = $screenshot->store('bug-report-screenshots', 'public');
        }

        $bugReport = BugReport::create([
            'user_id' => $userId,
            'issue_type' => $validatedData['issue_type'],
            'title' => $validatedData['title'],
            'description' => $validatedData['description'],
            'screenshot' => $screenshotPath,
            'status' => 'new',
        ]);

        $this->sendNotificationEmails($bugReport);

        return $bugReport;
    }

    /**
     * Send email notifications to configured addresses.
     */
    private function sendNotificationEmails(BugReport $bugReport): void
    {
        try {
            $notificationEmails = config('mail.bug_report_notification_emails', []);

            $notificationEmails = array_filter($notificationEmails, function ($email) {
                return !empty(trim($email)) && filter_var(trim($email), FILTER_VALIDATE_EMAIL);
            });

            if (empty($notificationEmails)) {
                $defaultEmail = config('mail.from.address', 'admin@example.com');
                if (!empty($defaultEmail) && filter_var($defaultEmail, FILTER_VALIDATE_EMAIL)) {
                    $notificationEmails = [$defaultEmail];
                } else {
                    Log::warning('No valid bug report notification emails configured', [
                        'bug_report_id' => $bugReport->id,
                        'default_email' => $defaultEmail,
                    ]);
                    return;
                }
            }

            $bugReport->load('user');
            $submittedAt = Carbon::now()->format('l, F j, Y \a\t g:i A');
            $adminUrl = url('/admin/bug-reports/' . $bugReport->id);

            $issueTypeLabels = [
                'ui_issue' => 'UI Issue',
                'crash' => 'Crash',
                'performance' => 'Performance',
                'feature_request' => 'Feature Request',
                'other' => 'Other',
            ];

            $screenshotUrl = null;
            if ($bugReport->screenshot) {
                $screenshotUrl = url('storage/' . $bugReport->screenshot);
            }

            $sentCount = 0;
            $failedEmails = [];

            foreach ($notificationEmails as $email) {
                $email = trim($email);
                try {
                    Mail::send('emails.bug-report-notification', [
                        'reporter_name' => $bugReport->user->name ?? ($bugReport->user->first_name . ' ' . $bugReport->user->last_name),
                        'reporter_email' => $bugReport->user->email,
                        'issue_type' => $issueTypeLabels[$bugReport->issue_type] ?? $bugReport->issue_type,
                        'report_title' => $bugReport->title,
                        'report_description' => $bugReport->description,
                        'screenshot_url' => $screenshotUrl,
                        'submitted_at' => $submittedAt,
                        'admin_url' => $adminUrl,
                    ], function ($message) use ($email, $bugReport) {
                        $message->to($email)
                               ->subject('New Bug Report: ' . $bugReport->title);
                    });
                    $sentCount++;
                } catch (\Exception $e) {
                    $failedEmails[] = $email;
                    Log::error('Failed to send bug report email to: ' . $email, [
                        'bug_report_id' => $bugReport->id,
                        'error' => $e->getMessage(),
                    ]);
                }
            }

            Log::info('Bug report notification emails processed', [
                'bug_report_id' => $bugReport->id,
                'total_recipients' => count($notificationEmails),
                'sent_count' => $sentCount,
                'failed_count' => count($failedEmails),
                'recipients' => $notificationEmails,
                'failed_emails' => $failedEmails,
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to send bug report email: ' . $e->getMessage(), [
                'bug_report_id' => $bugReport->id,
                'trace' => $e->getTraceAsString(),
            ]);
        }
    }
}
