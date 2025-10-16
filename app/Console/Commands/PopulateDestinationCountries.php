<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Destination;
use App\Models\Country;

class PopulateDestinationCountries extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'destinations:populate-countries';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Populate existing destinations with country relationships based on country field';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting to populate destination countries...');
        
        $destinations = Destination::whereNull('country_id')->get();
        $countries = Country::all()->keyBy('name');
        
        $updated = 0;
        $notFound = [];
        
        // Create a mapping for common country name variations
        $countryMappings = [
            'USA' => 'United States',
            'US' => 'United States',
            'UK' => 'United Kingdom',
            'Britain' => 'United Kingdom',
        ];
        
        foreach ($destinations as $destination) {
            if ($destination->country) {
                $countryName = $countryMappings[$destination->country] ?? $destination->country;
                $country = $countries->get($countryName);
                
                if ($country) {
                    $destination->update(['country_id' => $country->id]);
                    $updated++;
                    $this->line("✓ Updated {$destination->name} -> {$country->name}");
                } else {
                    $notFound[] = $destination->country;
                    $this->warn("⚠ Country '{$destination->country}' not found for destination '{$destination->name}'");
                }
            }
        }
        
        $this->info("\nSummary:");
        $this->info("Updated: {$updated} destinations");
        
        if (!empty($notFound)) {
            $this->warn("Countries not found: " . implode(', ', array_unique($notFound)));
            $this->info("\nAvailable countries:");
            foreach ($countries as $country) {
                $this->line("- {$country->name} ({$country->code})");
            }
        }
        
        $this->info("\nDone!");
    }
}