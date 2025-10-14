<?php

namespace Database\Seeders;

use App\Models\Destination;
use App\Models\Location;
use Illuminate\Database\Seeder;

class DestinationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $locations = Location::all();

        if ($locations->isEmpty()) {
            $this->command->info('No locations found. Please run LocationSeeder first.');
            return;
        }

        $destinations = [
            [
                'name' => 'Paris City Tour',
                'description' => 'Experience the magic of Paris with our comprehensive city tour.',
                'overview_title' => 'Discover the City of Light',
                'overview' => 'Paris, the capital of France, is renowned for its art, fashion, and culture. Our tour takes you through the most iconic landmarks including the Eiffel Tower, Louvre Museum, and Notre-Dame Cathedral.',
                'status' => 'active',
                'location_id' => $locations->where('name', 'Paris')->first()->id,
            ],
            [
                'name' => 'Tokyo Cultural Experience',
                'description' => 'Immerse yourself in Japanese culture and traditions.',
                'overview_title' => 'Explore Traditional and Modern Japan',
                'overview' => 'Tokyo offers a unique blend of ancient traditions and modern innovation. Visit historic temples, experience traditional tea ceremonies, and explore the bustling districts of Shibuya and Harajuku.',
                'status' => 'active',
                'location_id' => $locations->where('name', 'Tokyo')->first()->id,
            ],
            [
                'name' => 'New York Adventure',
                'description' => 'Discover the Big Apple with our guided tour.',
                'overview_title' => 'The City That Never Sleeps',
                'overview' => 'New York City is a melting pot of cultures and experiences. From Times Square to Central Park, from Broadway shows to world-class museums, NYC has something for everyone.',
                'status' => 'draft',
                'location_id' => $locations->where('name', 'New York')->first()->id,
            ],
            [
                'name' => 'London Heritage Tour',
                'description' => 'Explore the rich history and royal heritage of London.',
                'overview_title' => 'Royal London Experience',
                'overview' => 'London is steeped in history and royal tradition. Visit Buckingham Palace, the Tower of London, Westminster Abbey, and enjoy a traditional afternoon tea experience.',
                'status' => 'active',
                'location_id' => $locations->where('name', 'London')->first()->id,
            ],
        ];

        foreach ($destinations as $destination) {
            Destination::create($destination);
        }
    }
}