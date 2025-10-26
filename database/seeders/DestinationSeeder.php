<?php

namespace Database\Seeders;

use App\Models\Destination;
use Illuminate\Database\Seeder;

class DestinationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $destinations = [
            [
                'name' => 'Paris City Tour',
                'description' => 'Experience the magic of Paris with our comprehensive city tour.',
                'overview_title' => 'Discover the City of Light',
                'overview' => 'Paris, the capital of France, is renowned for its art, fashion, and culture. Our tour takes you through the most iconic landmarks including the Eiffel Tower, Louvre Museum, and Notre-Dame Cathedral.',
                'status' => 'active',
                'country_id' => 1, // France
                'state_province' => 'Île-de-France',
                'city' => 'Paris',
                'home_image' => 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=800',
                'grid_image' => 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=400',
            ],
            [
                'name' => 'Tokyo Cultural Experience',
                'description' => 'Immerse yourself in Japanese culture and traditions.',
                'overview_title' => 'Explore Traditional and Modern Japan',
                'overview' => 'Tokyo offers a unique blend of ancient traditions and modern innovation. Visit historic temples, experience traditional tea ceremonies, and explore the bustling districts of Shibuya and Harajuku.',
                'status' => 'active',
                'country_id' => 9, // Japan
                'state_province' => 'Tokyo',
                'city' => 'Tokyo',
                'home_image' => 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800',
                'grid_image' => 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400',
            ],
            [
                'name' => 'New York Adventure',
                'description' => 'Discover the Big Apple with our guided tour.',
                'overview_title' => 'The City That Never Sleeps',
                'overview' => 'New York City is a melting pot of cultures and experiences. From Times Square to Central Park, from Broadway shows to world-class museums, NYC has something for everyone.',
                'status' => 'draft',
                'country_id' => 3, // United States
                'state_province' => 'New York',
                'city' => 'New York',
                'home_image' => 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800',
                'grid_image' => 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400',
            ],
            [
                'name' => 'London Heritage Tour',
                'description' => 'Explore the rich history and royal heritage of London.',
                'overview_title' => 'Royal London Experience',
                'overview' => 'London is steeped in history and royal tradition. Visit Buckingham Palace, the Tower of London, Westminster Abbey, and enjoy a traditional afternoon tea experience.',
                'status' => 'active',
                'country_id' => 7, // United Kingdom
                'state_province' => 'England',
                'city' => 'London',
                'home_image' => 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800',
                'grid_image' => 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400',
            ],
            [
                'name' => 'Rome Historical Journey',
                'description' => 'Step back in time and explore ancient Rome.',
                'overview_title' => 'Eternal City Experience',
                'overview' => 'Rome, the Eternal City, is home to some of the world\'s most iconic historical sites. Visit the Colosseum, Roman Forum, Vatican City, and Sistine Chapel.',
                'status' => 'active',
                'country_id' => 5, // Italy
                'state_province' => 'Lazio',
                'city' => 'Rome',
                'home_image' => 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800',
                'grid_image' => 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400',
            ],
            [
                'name' => 'Barcelona Art & Architecture',
                'description' => 'Discover the artistic wonders of Barcelona.',
                'overview_title' => 'Gaudi\'s Masterpieces',
                'overview' => 'Barcelona is famous for its unique architecture, especially the works of Antoni Gaudí. Explore the Sagrada Familia, Park Güell, and the Gothic Quarter.',
                'status' => 'active',
                'country_id' => 2, // Spain
                'state_province' => 'Catalonia',
                'city' => 'Barcelona',
                'home_image' => 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800',
                'grid_image' => 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=400',
            ],
            [
                'name' => 'Athens Ancient Wonders',
                'description' => 'Explore the birthplace of democracy and Western civilization.',
                'overview_title' => 'Classical Greece Experience',
                'overview' => 'Athens is the cradle of Western civilization. Visit the Acropolis, Parthenon, Ancient Agora, and the National Archaeological Museum.',
                'status' => 'active',
                'country_id' => 10, // Greece
                'state_province' => 'Attica',
                'city' => 'Athens',
                'home_image' => 'https://images.unsplash.com/photo-1570077185710-c03b1b0a0a4a?w=800',
                'grid_image' => 'https://images.unsplash.com/photo-1570077185710-c03b1b0a0a4a?w=400',
            ],
            [
                'name' => 'Berlin Cultural Capital',
                'description' => 'Experience the vibrant culture and history of Berlin.',
                'overview_title' => 'Modern German Experience',
                'overview' => 'Berlin is a city of contrasts, where history meets modernity. Visit the Brandenburg Gate, Berlin Wall Memorial, Museum Island, and enjoy the vibrant nightlife.',
                'status' => 'active',
                'country_id' => 8, // Germany
                'state_province' => 'Berlin',
                'city' => 'Berlin',
                'home_image' => 'https://images.unsplash.com/photo-1587330979470-3595ac045cc0?w=800',
                'grid_image' => 'https://images.unsplash.com/photo-1587330979470-3595ac045cc0?w=400',
            ],
        ];

        foreach ($destinations as $destination) {
            Destination::create($destination);
        }
    }
}