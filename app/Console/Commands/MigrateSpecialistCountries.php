<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Specialist;
use App\Models\Country;
use Illuminate\Support\Facades\DB;

class MigrateSpecialistCountries extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'specialists:migrate-countries';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Migrate specialist country strings to country_id foreign keys';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting migration of specialist countries...');

        // Get all specialists that have a country string but no country_id
        $specialists = DB::table('specialists')
            ->whereNotNull('country')
            ->whereNull('country_id')
            ->get();

        $this->info("Found {$specialists->count()} specialists to migrate");

        $migrated = 0;
        $notFound = 0;

        foreach ($specialists as $specialist) {
            // Try to find matching country by name
            $country = Country::where('name', $specialist->country)->first();
            
            if ($country) {
                DB::table('specialists')
                    ->where('id', $specialist->id)
                    ->update(['country_id' => $country->id]);
                
                $migrated++;
                $this->line("Migrated specialist {$specialist->id}: {$specialist->country} -> {$country->name}");
            } else {
                $notFound++;
                $this->warn("Country not found for specialist {$specialist->id}: {$specialist->country}");
            }
        }

        $this->info("Migration completed!");
        $this->info("Migrated: {$migrated}");
        $this->warn("Not found: {$notFound}");

        return 0;
    }
}
