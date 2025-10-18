<?php

namespace Database\Seeders;

use App\Models\Specialist;
use App\Models\Country;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SpecialistSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get country IDs
        $usaId = Country::where('name', 'United States')->first()?->id;
        $spainId = Country::where('name', 'Spain')->first()?->id;
        $uaeId = Country::where('name', 'United Arab Emirates')->first()?->id;
        $ukId = Country::where('name', 'United Kingdom')->first()?->id;
        $japanId = Country::where('name', 'Japan')->first()?->id;
        $mexicoId = Country::where('name', 'Mexico')->first()?->id;
        $indiaId = Country::where('name', 'India')->first()?->id;
        $southAfricaId = Country::where('name', 'South Africa')->first()?->id;
        $italyId = Country::where('name', 'Italy')->first()?->id;
        $franceId = Country::where('name', 'France')->first()?->id;
        $brazilId = Country::where('name', 'Brazil')->first()?->id;
        $switzerlandId = Country::where('name', 'Switzerland')->first()?->id;

        $specialists = [
            [
                'first_name' => 'John',
                'last_name' => 'Smith',
                'email' => 'john.smith@example.com',
                'bio' => 'Experienced adventure guide with 15+ years in outdoor activities. Specializes in hiking, mountain climbing, and wilderness survival.',
                'contact_no' => '+1-555-0123',
                'country_id' => $usaId,
                'state_province' => 'California',
                'city' => 'San Francisco',
                'address' => '123 Tech Street, Downtown',
                'postal_code' => '94105',
                'status' => 'active',
                'no_of_trips' => 15,
            ],
            [
                'first_name' => 'Maria',
                'last_name' => 'Garcia',
                'email' => 'maria.garcia@example.com',
                'bio' => 'Cultural heritage specialist and local historian. Expert in Spanish art, architecture, and traditional cuisine.',
                'contact_no' => '+34-91-123-4567',
                'country_id' => $spainId,
                'state_province' => 'Madrid',
                'city' => 'Madrid',
                'address' => 'Calle Gran Via 45',
                'postal_code' => '28013',
                'status' => 'active',
                'no_of_trips' => 8,
            ],
            [
                'first_name' => 'Ahmed',
                'last_name' => 'Hassan',
                'email' => 'ahmed.hassan@example.com',
                'bio' => 'Desert safari expert and wildlife photographer. Knows every dune and oasis in the Arabian Peninsula.',
                'contact_no' => '+971-4-123-4567',
                'country_id' => $uaeId,
                'state_province' => 'Dubai',
                'city' => 'Dubai',
                'address' => 'Sheikh Zayed Road, Business Bay',
                'postal_code' => '12345',
                'status' => 'active',
                'no_of_trips' => 22,
            ],
            [
                'first_name' => 'Sarah',
                'last_name' => 'Johnson',
                'email' => 'sarah.johnson@example.com',
                'bio' => 'Urban exploration specialist and food tour guide. Expert in London\'s hidden gems and culinary scene.',
                'contact_no' => '+44-20-7946-0958',
                'country_id' => $ukId,
                'state_province' => 'England',
                'city' => 'London',
                'address' => '10 Downing Street',
                'postal_code' => 'SW1A 2AA',
                'status' => 'inactive',
                'no_of_trips' => 5,
            ],
            [
                'first_name' => 'Yuki',
                'last_name' => 'Tanaka',
                'email' => 'yuki.tanaka@example.com',
                'bio' => 'Traditional Japanese culture expert and tea ceremony master. Specializes in authentic cultural experiences.',
                'contact_no' => '+81-3-1234-5678',
                'country_id' => $japanId,
                'state_province' => 'Tokyo',
                'city' => 'Tokyo',
                'address' => 'Shibuya Crossing, Shibuya City',
                'postal_code' => '150-0002',
                'status' => 'active',
                'no_of_trips' => 12,
            ],
            [
                'first_name' => 'Isabella',
                'last_name' => 'Rodriguez',
                'email' => 'isabella.rodriguez@example.com',
                'bio' => 'Beach and water sports specialist. Certified diving instructor and marine life expert.',
                'contact_no' => '+52-998-123-4567',
                'country_id' => $mexicoId,
                'state_province' => 'Quintana Roo',
                'city' => 'Cancun',
                'address' => 'Hotel Zone, Cancun',
                'postal_code' => '77500',
                'status' => 'active',
                'no_of_trips' => 18,
            ],
            [
                'first_name' => 'Raj',
                'last_name' => 'Patel',
                'email' => 'raj.patel@example.com',
                'bio' => 'Spiritual and wellness guide. Expert in yoga, meditation, and ancient Indian traditions.',
                'contact_no' => '+91-11-2345-6789',
                'country_id' => $indiaId,
                'state_province' => 'Delhi',
                'city' => 'New Delhi',
                'address' => 'Connaught Place, Central Delhi',
                'postal_code' => '110001',
                'status' => 'active',
                'no_of_trips' => 25,
            ],
            [
                'first_name' => 'Emma',
                'last_name' => 'Thompson',
                'email' => 'emma.thompson@example.com',
                'bio' => 'Wildlife conservation specialist and safari guide. Expert in African wildlife and conservation efforts.',
                'contact_no' => '+27-11-123-4567',
                'country_id' => $southAfricaId,
                'state_province' => 'Gauteng',
                'city' => 'Johannesburg',
                'address' => 'Sandton City, Johannesburg',
                'postal_code' => '2196',
                'status' => 'active',
                'no_of_trips' => 30,
            ],
            [
                'first_name' => 'Luca',
                'last_name' => 'Rossi',
                'email' => 'luca.rossi@example.com',
                'bio' => 'Art and architecture historian. Expert in Renaissance art and Italian cultural heritage.',
                'contact_no' => '+39-06-1234-5678',
                'country_id' => $italyId,
                'state_province' => 'Lazio',
                'city' => 'Rome',
                'address' => 'Via del Corso, Rome',
                'postal_code' => '00186',
                'status' => 'active',
                'no_of_trips' => 14,
            ],
            [
                'first_name' => 'Sophie',
                'last_name' => 'Martin',
                'email' => 'sophie.martin@example.com',
                'bio' => 'Wine and gastronomy expert. Certified sommelier and French cuisine specialist.',
                'contact_no' => '+33-1-23-45-67-89',
                'country_id' => $franceId,
                'state_province' => 'Île-de-France',
                'city' => 'Paris',
                'address' => 'Champs-Élysées, Paris',
                'postal_code' => '75008',
                'status' => 'active',
                'no_of_trips' => 20,
            ],
            [
                'first_name' => 'Carlos',
                'last_name' => 'Silva',
                'email' => 'carlos.silva@example.com',
                'bio' => 'Amazon rainforest specialist and eco-tourism guide. Expert in biodiversity and sustainable travel.',
                'contact_no' => '+55-11-9876-5432',
                'country_id' => $brazilId,
                'state_province' => 'São Paulo',
                'city' => 'São Paulo',
                'address' => 'Avenida Paulista, São Paulo',
                'postal_code' => '01310-100',
                'status' => 'active',
                'no_of_trips' => 16,
            ],
            [
                'first_name' => 'Anna',
                'last_name' => 'Kowalski',
                'email' => 'anna.kowalski@example.com',
                'bio' => 'Mountain hiking and winter sports specialist. Expert in Alpine activities and safety.',
                'contact_no' => '+41-44-123-4567',
                'country_id' => $switzerlandId,
                'state_province' => 'Zurich',
                'city' => 'Zurich',
                'address' => 'Bahnhofstrasse, Zurich',
                'postal_code' => '8001',
                'status' => 'active',
                'no_of_trips' => 19,
            ],
        ];

        foreach ($specialists as $specialist) {
            Specialist::create($specialist);
        }
    }
}