<?php

namespace Database\Seeders;

use App\Models\Destination;
use App\Models\DestinationImage;
use App\Models\Country;
use Illuminate\Database\Seeder;

class USADestinationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get USA country ID
        $usaCountry = Country::where('code', 'US')->first();
        
        if (!$usaCountry) {
            $this->command->error('USA country not found. Please run CountrySeeder first.');
            return;
        }

        $destinations = [
            [
                'name' => 'New York City',
                'description' => 'Experience the energy and excitement of the Big Apple.',
                'overview_title' => 'The City That Never Sleeps',
                'overview' => 'New York City is a vibrant metropolis offering world-class museums, Broadway shows, iconic landmarks like the Statue of Liberty and Empire State Building, diverse neighborhoods, and unparalleled dining experiences. From Central Park to Times Square, NYC has something for everyone.',
                'status' => 'active',
                'country_id' => $usaCountry->id,
                'state_province' => 'New York',
                'city' => 'New York City',
                'home_image' => 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800',
                'grid_image' => 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400',
                'banner_image' => 'https://images.unsplash.com/photo-1518391846015-55a9cc003b25?w=1200',
                'gallery_images' => [
                    ['name' => 'Times Square', 'description' => 'The vibrant heart of NYC', 'url' => 'https://images.unsplash.com/photo-1546436836-07a910c21bd9?w=800'],
                    ['name' => 'Central Park', 'description' => 'A peaceful oasis in the city', 'url' => 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800'],
                    ['name' => 'Brooklyn Bridge', 'description' => 'Iconic bridge connecting Manhattan and Brooklyn', 'url' => 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800'],
                ],
            ],
            [
                'name' => 'Los Angeles',
                'description' => 'Discover the glamour and culture of the City of Angels.',
                'overview_title' => 'Hollywood Dreams and Beach Vibes',
                'overview' => 'Los Angeles is a sprawling metropolis known for its entertainment industry, beautiful beaches, diverse culture, and year-round sunshine. Visit Hollywood, Beverly Hills, Santa Monica Pier, and explore the vibrant food scene.',
                'status' => 'active',
                'country_id' => $usaCountry->id,
                'state_province' => 'California',
                'city' => 'Los Angeles',
                'home_image' => 'https://images.unsplash.com/photo-1515895306158-7b5c3b0e3b5b?w=800',
                'grid_image' => 'https://images.unsplash.com/photo-1515895306158-7b5c3b0e3b5b?w=400',
                'banner_image' => 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=1200',
                'gallery_images' => [
                    ['name' => 'Hollywood Sign', 'description' => 'The iconic Hollywood landmark', 'url' => 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=800'],
                    ['name' => 'Santa Monica Pier', 'description' => 'Historic pier with amusement park', 'url' => 'https://images.unsplash.com/photo-1511882150382-421056c89033?w=800'],
                    ['name' => 'Venice Beach', 'description' => 'Famous beach boardwalk', 'url' => 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800'],
                ],
            ],
            [
                'name' => 'San Francisco',
                'description' => 'Explore the hilly city by the bay with its iconic landmarks.',
                'overview_title' => 'Golden Gate and Tech Innovation',
                'overview' => 'San Francisco is famous for its Golden Gate Bridge, Alcatraz Island, cable cars, and diverse neighborhoods. Experience the tech culture of Silicon Valley, enjoy fresh seafood at Fisherman\'s Wharf, and explore the historic Mission District.',
                'status' => 'active',
                'country_id' => $usaCountry->id,
                'state_province' => 'California',
                'city' => 'San Francisco',
                'home_image' => 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800',
                'grid_image' => 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400',
                'banner_image' => 'https://images.unsplash.com/photo-1539667547529-b1a7c310366e?w=1200',
                'gallery_images' => [
                    ['name' => 'Golden Gate Bridge', 'description' => 'Iconic suspension bridge', 'url' => 'https://images.unsplash.com/photo-1542223616-740ef5d55983?w=800'],
                    ['name' => 'Alcatraz Island', 'description' => 'Historic former prison', 'url' => 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800'],
                    ['name' => 'Lombard Street', 'description' => 'The crookedest street in the world', 'url' => 'https://images.unsplash.com/photo-1539667547529-b1a7c310366e?w=800'],
                ],
            ],
            [
                'name' => 'Las Vegas',
                'description' => 'Experience the entertainment capital of the world.',
                'overview_title' => 'Sin City Extravaganza',
                'overview' => 'Las Vegas is known for its vibrant nightlife, world-class casinos, luxury resorts, and spectacular shows. Beyond the Strip, explore Red Rock Canyon, Hoover Dam, and enjoy fine dining at celebrity chef restaurants.',
                'status' => 'active',
                'country_id' => $usaCountry->id,
                'state_province' => 'Nevada',
                'city' => 'Las Vegas',
                'home_image' => 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=800',
                'grid_image' => 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=400',
                'banner_image' => 'https://images.unsplash.com/photo-1605837816178-57d6c0e5e0a3?w=1200',
                'gallery_images' => [
                    ['name' => 'Las Vegas Strip', 'description' => 'The famous casino-lined boulevard', 'url' => 'https://images.unsplash.com/photo-1605837816178-57d6c0e5e0a3?w=800'],
                    ['name' => 'Bellagio Fountains', 'description' => 'Synchronized water show', 'url' => 'https://images.unsplash.com/photo-1605634739213-3e4c1b0a3b5b?w=800'],
                    ['name' => 'Red Rock Canyon', 'description' => 'Stunning desert landscape', 'url' => 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800'],
                ],
            ],
            [
                'name' => 'Miami',
                'description' => 'Enjoy the tropical paradise with beautiful beaches and vibrant nightlife.',
                'overview_title' => 'Tropical Paradise and Art Deco',
                'overview' => 'Miami offers pristine beaches, Art Deco architecture in South Beach, vibrant Cuban culture in Little Havana, world-class dining, and exciting nightlife. Experience the perfect blend of relaxation and excitement.',
                'status' => 'active',
                'country_id' => $usaCountry->id,
                'state_province' => 'Florida',
                'city' => 'Miami',
                'home_image' => 'https://images.unsplash.com/photo-1514214246283-d427a95c5d2f?w=800',
                'grid_image' => 'https://images.unsplash.com/photo-1514214246283-d427a95c5d2f?w=400',
                'banner_image' => 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200',
                'gallery_images' => [
                    ['name' => 'South Beach', 'description' => 'Famous beach with Art Deco hotels', 'url' => 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800'],
                    ['name' => 'Little Havana', 'description' => 'Vibrant Cuban neighborhood', 'url' => 'https://images.unsplash.com/photo-1514214246283-d427a95c5d2f?w=800'],
                    ['name' => 'Wynwood Walls', 'description' => 'Outdoor street art museum', 'url' => 'https://images.unsplash.com/photo-1511882150382-421056c89033?w=800'],
                ],
            ],
            [
                'name' => 'Grand Canyon',
                'description' => 'Witness one of the world\'s most spectacular natural wonders.',
                'overview_title' => 'Nature\'s Masterpiece',
                'overview' => 'The Grand Canyon is a breathtaking natural wonder carved by the Colorado River over millions of years. Experience stunning vistas, hiking trails, river rafting, and stargazing in this UNESCO World Heritage Site.',
                'status' => 'active',
                'country_id' => $usaCountry->id,
                'state_province' => 'Arizona',
                'city' => 'Grand Canyon',
                'home_image' => 'https://images.unsplash.com/photo-1474044159687-1ee9f3a51722?w=800',
                'grid_image' => 'https://images.unsplash.com/photo-1474044159687-1ee9f3a51722?w=400',
                'banner_image' => 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200',
                'gallery_images' => [
                    ['name' => 'Grand Canyon Vista', 'description' => 'Breathtaking canyon views', 'url' => 'https://images.unsplash.com/photo-1474044159687-1ee9f3a51722?w=800'],
                    ['name' => 'Colorado River', 'description' => 'The river that carved the canyon', 'url' => 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800'],
                    ['name' => 'Desert View Watchtower', 'description' => 'Historic observation tower', 'url' => 'https://images.unsplash.com/photo-1511882150382-421056c89033?w=800'],
                ],
            ],
            [
                'name' => 'Yellowstone National Park',
                'description' => 'Explore America\'s first national park with geysers and wildlife.',
                'overview_title' => 'Geothermal Wonders and Wildlife',
                'overview' => 'Yellowstone National Park is home to Old Faithful geyser, colorful hot springs, diverse wildlife including bison and bears, and stunning natural landscapes. Experience hiking, camping, and the raw beauty of nature.',
                'status' => 'active',
                'country_id' => $usaCountry->id,
                'state_province' => 'Wyoming',
                'city' => 'Yellowstone',
                'home_image' => 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
                'grid_image' => 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
                'banner_image' => 'https://images.unsplash.com/photo-1474044159687-1ee9f3a51722?w=1200',
                'gallery_images' => [
                    ['name' => 'Old Faithful', 'description' => 'Famous geyser eruption', 'url' => 'https://images.unsplash.com/photo-1474044159687-1ee9f3a51722?w=800'],
                    ['name' => 'Grand Prismatic Spring', 'description' => 'Colorful hot spring', 'url' => 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800'],
                    ['name' => 'Bison Herd', 'description' => 'Wildlife in natural habitat', 'url' => 'https://images.unsplash.com/photo-1511882150382-421056c89033?w=800'],
                ],
            ],
            [
                'name' => 'Chicago',
                'description' => 'Discover the Windy City\'s architecture, culture, and deep-dish pizza.',
                'overview_title' => 'Architecture and Culture Hub',
                'overview' => 'Chicago is renowned for its stunning architecture, world-class museums, vibrant music scene, and delicious food. Visit Millennium Park, Navy Pier, the Art Institute, and enjoy the city\'s famous deep-dish pizza.',
                'status' => 'active',
                'country_id' => $usaCountry->id,
                'state_province' => 'Illinois',
                'city' => 'Chicago',
                'home_image' => 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=800',
                'grid_image' => 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=400',
                'banner_image' => 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1200',
                'gallery_images' => [
                    ['name' => 'Cloud Gate', 'description' => 'The Bean sculpture in Millennium Park', 'url' => 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800'],
                    ['name' => 'Chicago Skyline', 'description' => 'Iconic city architecture', 'url' => 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=800'],
                    ['name' => 'Navy Pier', 'description' => 'Historic pier on Lake Michigan', 'url' => 'https://images.unsplash.com/photo-1539667547529-b1a7c310366e?w=800'],
                ],
            ],
            [
                'name' => 'Seattle',
                'description' => 'Experience the Emerald City with coffee culture and tech innovation.',
                'overview_title' => 'Coffee Culture and Natural Beauty',
                'overview' => 'Seattle is known for its coffee culture, tech industry, stunning natural surroundings, and vibrant music scene. Visit the Space Needle, Pike Place Market, explore the surrounding mountains and water, and enjoy fresh seafood.',
                'status' => 'active',
                'country_id' => $usaCountry->id,
                'state_province' => 'Washington',
                'city' => 'Seattle',
                'home_image' => 'https://images.unsplash.com/photo-1539667547529-b1a7c310366e?w=800',
                'grid_image' => 'https://images.unsplash.com/photo-1539667547529-b1a7c310366e?w=400',
                'banner_image' => 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1200',
                'gallery_images' => [
                    ['name' => 'Space Needle', 'description' => 'Iconic observation tower', 'url' => 'https://images.unsplash.com/photo-1539667547529-b1a7c310366e?w=800'],
                    ['name' => 'Pike Place Market', 'description' => 'Historic public market', 'url' => 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800'],
                    ['name' => 'Mount Rainier', 'description' => 'Majestic mountain backdrop', 'url' => 'https://images.unsplash.com/photo-1542223616-740ef5d55983?w=800'],
                ],
            ],
            [
                'name' => 'New Orleans',
                'description' => 'Immerse yourself in the vibrant culture, music, and cuisine of the Big Easy.',
                'overview_title' => 'Jazz, Creole Culture, and Festivals',
                'overview' => 'New Orleans is famous for its jazz music, Creole cuisine, historic French Quarter, Mardi Gras celebrations, and unique architecture. Experience the vibrant nightlife, enjoy beignets and gumbo, and explore the rich cultural heritage.',
                'status' => 'active',
                'country_id' => $usaCountry->id,
                'state_province' => 'Louisiana',
                'city' => 'New Orleans',
                'home_image' => 'https://images.unsplash.com/photo-1511882150382-421056c89033?w=800',
                'grid_image' => 'https://images.unsplash.com/photo-1511882150382-421056c89033?w=400',
                'banner_image' => 'https://images.unsplash.com/photo-1514214246283-d427a95c5d2f?w=1200',
                'gallery_images' => [
                    ['name' => 'French Quarter', 'description' => 'Historic district with colorful buildings', 'url' => 'https://images.unsplash.com/photo-1511882150382-421056c89033?w=800'],
                    ['name' => 'Bourbon Street', 'description' => 'Famous entertainment district', 'url' => 'https://images.unsplash.com/photo-1514214246283-d427a95c5d2f?w=800'],
                    ['name' => 'Jackson Square', 'description' => 'Historic park in French Quarter', 'url' => 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800'],
                ],
            ],
        ];

        foreach ($destinations as $destinationData) {
            // Extract gallery images before creating destination
            $galleryImages = $destinationData['gallery_images'] ?? [];
            unset($destinationData['gallery_images']);

            // Create the destination
            $destination = Destination::create($destinationData);

            // Create gallery images
            foreach ($galleryImages as $imageData) {
                DestinationImage::create([
                    'name' => $imageData['name'],
                    'description' => $imageData['description'] ?? null,
                    'image_type' => 'gallery',
                    'url' => $imageData['url'],
                    'destination_id' => $destination->id,
                ]);
            }

            $this->command->info("Created destination: {$destination->name} with " . count($galleryImages) . " gallery images");
        }

        $this->command->info('Successfully seeded 10 USA destinations with images!');
    }
}

