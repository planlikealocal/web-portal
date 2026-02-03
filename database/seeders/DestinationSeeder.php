<?php

namespace Database\Seeders;

use App\Models\Destination;
use App\Models\Country;
use Illuminate\Database\Seeder;

class DestinationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get country IDs dynamically
        $japanId = Country::where('code', 'JP')->first()?->id;
        $maldivesId = Country::where('code', 'MV')->first()?->id;
        $usaId = Country::where('code', 'US')->first()?->id;
        $southAfricaId = Country::where('code', 'ZA')->first()?->id;
        $newZealandId = Country::where('code', 'NZ')->first()?->id;
        $australiaId = Country::where('code', 'AU')->first()?->id;
        $franceId = Country::where('code', 'FR')->first()?->id;
        $spainId = Country::where('code', 'ES')->first()?->id;
        $ukId = Country::where('code', 'GB')->first()?->id;
        $italyId = Country::where('code', 'IT')->first()?->id;
        $greeceId = Country::where('code', 'GR')->first()?->id;
        $germanyId = Country::where('code', 'DE')->first()?->id;

        $destinations = [
            // Home page destinations (home_page = 1)
            [
                'name' => 'Experience Japan Beyond',
                'description' => 'Explore Japan through everyday life. Local hidden neighborhoods.',
                'overview_title' => 'Discover Authentic Japan',
                'overview' => 'Experience the real Japan beyond tourist spots. Discover local neighborhoods, hidden gems, and authentic cultural experiences that locals love.',
                'status' => 'active',
                'home_page' => true,
                'country_id' => $japanId,
                'state_province' => 'Tokyo',
                'city' => 'Tokyo',
                'home_image' => 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&h=600&fit=crop',
                'grid_image' => 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&h=300&fit=crop',
                'banner_image' => 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1200&h=400&fit=crop',
            ],
            [
                'name' => 'Maldives Resort',
                'description' => 'Discover island life and every moment of paradise.',
                'overview_title' => 'Tropical Paradise Awaits',
                'overview' => 'Experience the ultimate luxury in the Maldives. Crystal clear waters, pristine beaches, and world-class resorts await you in this tropical paradise.',
                'status' => 'active',
                'home_page' => true,
                'country_id' => $maldivesId,
                'state_province' => null,
                'city' => 'Malé',
                'home_image' => 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
                'grid_image' => 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
                'banner_image' => 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=400&fit=crop',
            ],
            [
                'name' => 'New York Nights',
                'description' => 'Experience the city that never sleeps.',
                'overview_title' => 'The Big Apple Awaits',
                'overview' => 'Discover New York City\'s vibrant nightlife, iconic landmarks, and diverse neighborhoods. From Times Square to Brooklyn, experience the energy of NYC.',
                'status' => 'active',
                'home_page' => true,
                'country_id' => $usaId,
                'state_province' => 'New York',
                'city' => 'New York',
                'home_image' => 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&h=600&fit=crop',
                'grid_image' => 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=300&fit=crop',
                'banner_image' => 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=1200&h=400&fit=crop',
            ],
            [
                'name' => 'Cape Town Adventure',
                'description' => 'Explore the Mother City\'s stunning landscapes and vibrant culture.',
                'overview_title' => 'Where Mountains Meet the Sea',
                'overview' => 'Cape Town offers breathtaking views, world-class wine regions, and rich cultural experiences. From Table Mountain to the Cape of Good Hope, discover South Africa\'s crown jewel.',
                'status' => 'active',
                'home_page' => true,
                'country_id' => $southAfricaId,
                'state_province' => 'Western Cape',
                'city' => 'Cape Town',
                'home_image' => 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800&h=600&fit=crop',
                'grid_image' => 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=400&h=300&fit=crop',
                'banner_image' => 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=1200&h=400&fit=crop',
            ],
            [
                'name' => 'New Zealand Wild',
                'description' => 'Discover pristine nature and adventure in Middle Earth.',
                'overview_title' => 'Adventure Awaits',
                'overview' => 'From stunning fjords to rolling hills, New Zealand offers unparalleled natural beauty. Experience adventure sports, Maori culture, and breathtaking landscapes.',
                'status' => 'active',
                'home_page' => true,
                'country_id' => $newZealandId,
                'state_province' => 'Auckland',
                'city' => 'Auckland',
                'home_image' => 'https://images.unsplash.com/photo-1507692049790-de58290a4334?w=800&h=600&fit=crop',
                'grid_image' => 'https://images.unsplash.com/photo-1507692049790-de58290a4334?w=400&h=300&fit=crop',
                'banner_image' => 'https://images.unsplash.com/photo-1507692049790-de58290a4334?w=1200&h=400&fit=crop',
            ],
            [
                'name' => 'Australia Surf',
                'description' => 'Ride the waves and explore the land down under.',
                'overview_title' => 'Sun, Surf, and Adventure',
                'overview' => 'Australia offers world-famous beaches, unique wildlife, and vibrant cities. From Sydney\'s Opera House to the Great Barrier Reef, experience the best of Australia.',
                'status' => 'active',
                'home_page' => true,
                'country_id' => $australiaId,
                'state_province' => 'New South Wales',
                'city' => 'Sydney',
                'home_image' => 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800&h=600&fit=crop',
                'grid_image' => 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=400&h=300&fit=crop',
                'banner_image' => 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=1200&h=400&fit=crop',
            ],
            // Regular destinations (home_page = 0 or false)
            [
                'name' => 'Paris City Tour',
                'description' => 'Experience the magic of Paris with our comprehensive city tour.',
                'overview_title' => 'Discover the City of Light',
                'overview' => 'Paris, the capital of France, is renowned for its art, fashion, and culture. Our tour takes you through the most iconic landmarks including the Eiffel Tower, Louvre Museum, and Notre-Dame Cathedral.',
                'status' => 'active',
                'home_page' => false,
                'country_id' => $franceId,
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
                'home_page' => false,
                'country_id' => $japanId,
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
                'status' => 'active',
                'home_page' => false,
                'country_id' => $usaId,
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
                'home_page' => false,
                'country_id' => $ukId,
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
                'home_page' => false,
                'country_id' => $italyId,
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
                'home_page' => false,
                'country_id' => $spainId,
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
                'home_page' => false,
                'country_id' => $greeceId,
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
                'home_page' => false,
                'country_id' => $germanyId,
                'state_province' => 'Berlin',
                'city' => 'Berlin',
                'home_image' => 'https://images.unsplash.com/photo-1587330979470-3595ac045cc0?w=800',
                'grid_image' => 'https://images.unsplash.com/photo-1587330979470-3595ac045cc0?w=400',
            ],
        ];

        foreach ($destinations as $destination) {
            // Skip if country_id is null (country not found)
            if (!$destination['country_id']) {
                continue;
            }
            Destination::firstOrCreate(
                [
                    'name' => $destination['name'],
                    'country_id' => $destination['country_id'],
                ],
                $destination
            );
        }
    }
}