<?php

namespace Database\Seeders;

use App\Models\Destination;
use App\Models\DestinationImage;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DestinationImageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $destinations = Destination::all();
        
        if ($destinations->isEmpty()) {
            $this->command->warn('No destinations found. Please seed destinations first.');
            return;
        }

        $sampleImages = [
            [
                'name' => 'Eiffel Tower View',
                'description' => 'Beautiful view of the Eiffel Tower from Trocadéro',
                'image_type' => 'banner',
                'url' => 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=800&h=600&fit=crop',
            ],
            [
                'name' => 'Louvre Museum',
                'description' => 'The iconic glass pyramid of the Louvre Museum',
                'image_type' => 'gallery',
                'url' => 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800&h=600&fit=crop',
            ],
            [
                'name' => 'Notre-Dame Cathedral',
                'description' => 'Gothic architecture masterpiece in the heart of Paris',
                'image_type' => 'gallery',
                'url' => 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=800&h=600&fit=crop',
            ],
            [
                'name' => 'Seine River Cruise',
                'description' => 'Romantic boat cruise along the Seine River',
                'image_type' => 'gallery',
                'url' => 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=800&h=600&fit=crop',
            ],
            [
                'name' => 'Montmartre District',
                'description' => 'Artistic neighborhood with Sacré-Cœur Basilica',
                'image_type' => 'gallery',
                'url' => 'https://images.unsplash.com/photo-1520637836862-4d197d17c0a4?w=800&h=600&fit=crop',
            ],
            [
                'name' => 'Champs-Élysées',
                'description' => 'Famous avenue with luxury shops and cafes',
                'image_type' => 'gallery',
                'url' => 'https://images.unsplash.com/photo-1550340499-a6c60fc8287c?w=800&h=600&fit=crop',
            ],
            [
                'name' => 'Tokyo Skyline',
                'description' => 'Modern skyline of Tokyo with Mount Fuji in background',
                'image_type' => 'banner',
                'url' => 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&h=600&fit=crop',
            ],
            [
                'name' => 'Senso-ji Temple',
                'description' => 'Ancient Buddhist temple in Asakusa district',
                'image_type' => 'gallery',
                'url' => 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&h=600&fit=crop',
            ],
            [
                'name' => 'Shibuya Crossing',
                'description' => 'World\'s busiest pedestrian crossing',
                'image_type' => 'gallery',
                'url' => 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&h=600&fit=crop',
            ],
            [
                'name' => 'Cherry Blossoms',
                'description' => 'Beautiful cherry blossoms in Ueno Park',
                'image_type' => 'gallery',
                'url' => 'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=800&h=600&fit=crop',
            ],
            [
                'name' => 'Times Square',
                'description' => 'Bright lights and energy of Times Square',
                'image_type' => 'banner',
                'url' => 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&h=600&fit=crop',
            ],
            [
                'name' => 'Central Park',
                'description' => 'Green oasis in the heart of Manhattan',
                'image_type' => 'gallery',
                'url' => 'https://images.unsplash.com/photo-1500916434205-0c77489c6cf7?w=800&h=600&fit=crop',
            ],
            [
                'name' => 'Statue of Liberty',
                'description' => 'Iconic symbol of freedom and democracy',
                'image_type' => 'gallery',
                'url' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop',
            ],
            [
                'name' => 'Big Ben',
                'description' => 'Historic clock tower and London landmark',
                'image_type' => 'banner',
                'url' => 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&h=600&fit=crop',
            ],
            [
                'name' => 'Tower Bridge',
                'description' => 'Victorian suspension bridge over the Thames',
                'image_type' => 'gallery',
                'url' => 'https://images.unsplash.com/photo-1529655683826-aba9b3e77383?w=800&h=600&fit=crop',
            ],
            [
                'name' => 'Westminster Abbey',
                'description' => 'Gothic church and royal coronation site',
                'image_type' => 'gallery',
                'url' => 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&h=600&fit=crop',
            ],
        ];

        foreach ($destinations as $destination) {
            // Add 3-6 random images to each destination
            $imageCount = rand(3, 6);
            $selectedImages = array_rand($sampleImages, min($imageCount, count($sampleImages)));
            
            if (!is_array($selectedImages)) {
                $selectedImages = [$selectedImages];
            }

            foreach ($selectedImages as $imageIndex) {
                $imageData = $sampleImages[$imageIndex];
                $imageData['destination_id'] = $destination->id;
                
                DestinationImage::create($imageData);
            }
        }

        $this->command->info('Destination images seeded successfully!');
    }
}