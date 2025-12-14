<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class TestEmail extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'email:test {email? : The email address to send the test email to}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send a test email to verify AWS SES SMTP configuration';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        // Get recipient email
        $recipientEmail = $this->argument('email');
        
        // If no email provided, use the configured from address
        if (empty($recipientEmail)) {
            $recipientEmail = config('mail.from.address');
            if (empty($recipientEmail)) {
                $this->error('No email address provided and MAIL_FROM_ADDRESS is not configured.');
                $this->info('Usage: php artisan email:test your-email@example.com');
                return 1;
            }
            $this->info("No recipient email provided. Using configured from address: {$recipientEmail}");
        }

        // Validate email format
        if (!filter_var($recipientEmail, FILTER_VALIDATE_EMAIL)) {
            $this->error('Invalid email format: ' . $recipientEmail);
            return 1;
        }

        // Display current mail configuration
        $this->info('Current Mail Configuration:');
        $this->line('  Mailer: ' . config('mail.default'));
        $this->line('  From Address: ' . config('mail.from.address'));
        $this->line('  From Name: ' . config('mail.from.name'));
        
        if (config('mail.default') === 'smtp') {
            $this->line('  SMTP Host: ' . config('mail.mailers.smtp.host'));
            $this->line('  SMTP Port: ' . config('mail.mailers.smtp.port'));
            $this->line('  SMTP Username: ' . (config('mail.mailers.smtp.username') ? '***configured***' : 'not set'));
        } elseif (config('mail.default') === 'ses') {
            $this->line('  AWS Region: ' . config('services.ses.region', 'not set'));
            $this->line('  AWS Access Key: ' . (config('services.ses.key') ? '***configured***' : 'not set'));
            $this->line('  AWS Secret Key: ' . (config('services.ses.secret') ? '***configured***' : 'not set'));
        }
        
        $this->newLine();

        // Send test email
        $this->info("Sending test email to: {$recipientEmail}");
        
        try {
            Mail::raw('This is a test email from your Laravel application to verify AWS SES SMTP configuration.

If you receive this email, your AWS SES SMTP setup is working correctly!

Sent at: ' . now()->format('Y-m-d H:i:s T'), function ($message) use ($recipientEmail) {
                $message->to($recipientEmail)
                        ->subject('Test Email - AWS SES SMTP Configuration');
            });

            $this->info('✓ Test email sent successfully!');
            $this->info("Please check the inbox for: {$recipientEmail}");
            $this->info('(Also check spam/junk folder if not found)');
            
            return 0;
        } catch (\Exception $e) {
            $this->error('✗ Failed to send test email!');
            $this->error('Error: ' . $e->getMessage());
            $this->newLine();
            
            // Check for common authentication errors
            $errorMessage = $e->getMessage();
            $smtpUsername = config('mail.mailers.smtp.username', '');
            
            // Detect if user is using AWS Access Key ID instead of SMTP credentials
            if (strpos($errorMessage, 'Authentication Credentials Invalid') !== false || 
                strpos($errorMessage, '535') !== false) {
                
                // Check if username looks like an AWS Access Key ID (starts with AKIA)
                if (strpos($smtpUsername, 'AKIA') === 0) {
                    $this->error('⚠️  CRITICAL: You are using AWS Access Key ID as SMTP username!');
                    $this->newLine();
                    $this->warn('AWS SES SMTP requires SEPARATE SMTP credentials, not AWS Access Keys!');
                    $this->newLine();
                    $this->info('How to get AWS SES SMTP credentials:');
                    $this->line('1. Go to AWS Console → SES → SMTP Settings');
                    $this->line('2. Click "Create SMTP credentials"');
                    $this->line('3. This will generate a NEW username and password specifically for SMTP');
                    $this->line('4. The SMTP username will look like: AKIAIOSFODNN7EXAMPLE');
                    $this->line('5. The SMTP password will be a long random string');
                    $this->line('6. Download and save these credentials - you can only see the password once!');
                    $this->newLine();
                    $this->info('Update your .env file with:');
                    $this->line('   MAIL_USERNAME=<the-smtp-username-from-step-4>');
                    $this->line('   MAIL_PASSWORD=<the-smtp-password-from-step-5>');
                    $this->newLine();
                    $this->line('⚠️  DO NOT use AWS_ACCESS_KEY_ID or AWS_SECRET_ACCESS_KEY for SMTP!');
                    $this->newLine();
                }
            }
            
            $this->warn('Troubleshooting tips:');
            
            if (config('mail.default') === 'smtp') {
                $this->line('1. Verify your .env file has correct AWS SES SMTP credentials:');
                $this->line('   - MAIL_MAILER=smtp');
                $this->line('   - MAIL_HOST=<your-ses-smtp-endpoint> (e.g., email-smtp.us-east-1.amazonaws.com)');
                $this->line('   - MAIL_PORT=587 (or 465 for SSL)');
                $this->line('   - MAIL_USERNAME=<your-ses-smtp-username> (NOT AWS Access Key ID!)');
                $this->line('   - MAIL_PASSWORD=<your-ses-smtp-password> (NOT AWS Secret Access Key!)');
                $this->line('   - MAIL_ENCRYPTION=tls (or ssl for port 465)');
                $this->line('   - MAIL_FROM_ADDRESS=<verified-email-in-ses>');
                $this->line('   - MAIL_FROM_NAME="Your App Name"');
                $this->newLine();
                $this->line('2. Ensure your EC2 instance has outbound access to port 587/465');
            } elseif (config('mail.default') === 'ses') {
                $this->line('1. Verify your .env file has correct AWS SES API credentials:');
                $this->line('   - MAIL_MAILER=ses');
                $this->line('   - AWS_ACCESS_KEY_ID=<your-aws-access-key>');
                $this->line('   - AWS_SECRET_ACCESS_KEY=<your-aws-secret-key>');
                $this->line('   - AWS_DEFAULT_REGION=<your-aws-region> (e.g., us-east-1)');
                $this->line('   - MAIL_FROM_ADDRESS=<verified-email-in-ses>');
                $this->line('   - MAIL_FROM_NAME="Your App Name"');
                $this->newLine();
                $this->line('2. Ensure AWS SDK is installed: composer require aws/aws-sdk-php');
                $this->line('3. Verify IAM permissions for SES (ses:SendEmail, ses:SendRawEmail)');
            }
            
            $this->line((config('mail.default') === 'smtp' ? '3' : '4') . '. Verify the email address is verified in AWS SES (if in sandbox mode)');
            $this->line((config('mail.default') === 'smtp' ? '4' : '5') . '. Check Laravel logs: storage/logs/laravel.log');
            
            Log::error('Test email failed', [
                'recipient' => $recipientEmail,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return 1;
        }
    }
}

