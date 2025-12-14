<?php

namespace App\Console\Commands;

use App\Models\Specialist;
use App\Models\User;
use App\Actions\Auth\CreateUserAccountAction;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;

class CreateSpecialistUsers extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'specialists:create-users {--password=password123}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create User accounts for specialists who don\'t have them';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $password = $this->option('password');
        $created = 0;
        $skipped = 0;

        $this->info('Creating User accounts for specialists...');

        $specialists = Specialist::all();
        $createUserAction = new CreateUserAccountAction();

        foreach ($specialists as $specialist) {
            // Check if user already exists
            $existingUser = User::where('email', $specialist->email)->first();
            
            if ($existingUser) {
                $this->line("Skipping {$specialist->email} - User account already exists");
                $skipped++;
                continue;
            }

            // Create user account using the action
            $result = $createUserAction->execute([
                'name' => $specialist->first_name . ' ' . $specialist->last_name,
                'email' => $specialist->email,
                'role' => 'specialist',
                'password' => $password,
            ], false); // Don't send welcome email for existing specialists

            if ($result['success']) {
                $this->line("Created user account for {$specialist->email}");
                $created++;
            } else {
                $this->error("Failed to create user account for {$specialist->email}: {$result['message']}");
            }
        }

        $this->info("Completed! Created: {$created}, Skipped: {$skipped}");
        
        if ($created > 0) {
            $this->info("Default password for new accounts: {$password}");
        }

        return 0;
    }
}
