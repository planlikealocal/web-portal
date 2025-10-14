<?php

namespace Database\Seeders;

use App\Models\Location;
use Illuminate\Database\Seeder;

class LocationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $locations = [
            [
                'name' => 'Paris',
                'country' => 'France',
                'state_province' => 'Île-de-France',
                'city' => 'Paris',
            ],
            [
                'name' => 'Tokyo',
                'country' => 'Japan',
                'state_province' => 'Tokyo',
                'city' => 'Tokyo',
            ],
            [
                'name' => 'New York',
                'country' => 'USA',
                'state_province' => 'New York',
                'city' => 'New York',
            ],
            [
                'name' => 'London',
                'country' => 'United Kingdom',
                'state_province' => 'England',
                'city' => 'London',
            ],
            [
                'name' => 'Sydney',
                'country' => 'Australia',
                'state_province' => 'New South Wales',
                'city' => 'Sydney',
            ],
            [
                'name' => 'Rome',
                'country' => 'Italy',
                'state_province' => 'Lazio',
                'city' => 'Rome',
            ],
            [
                'name' => 'Barcelona',
                'country' => 'Spain',
                'state_province' => 'Catalonia',
                'city' => 'Barcelona',
            ],
            [
                'name' => 'Dubai',
                'country' => 'UAE',
                'state_province' => 'Dubai',
                'city' => 'Dubai',
            ],
        ];

        foreach ($locations as $location) {
            Location::create($location);
        }
    }
}