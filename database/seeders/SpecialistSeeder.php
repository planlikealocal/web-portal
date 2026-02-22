<?php

namespace Database\Seeders;

use App\Models\Specialist;
use App\Models\Country;
use App\Models\WorkingHour;
use App\Actions\Auth\CreateUserAccountAction;
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
        $newZealandId = Country::where('name', 'New Zealand')->first()?->id;
        $australiaId = Country::where('name', 'Australia')->first()?->id;
        $maldivesId = Country::where('name', 'Maldives')->first()?->id;

        $specialists = [
            [
                'first_name' => 'John',
                'last_name' => 'Smith',
                'email' => 'john.smith@example.com',
                'bio' => 'Experienced adventure guide with 15+ years in outdoor activities. Specializes in hiking, mountain climbing, and wilderness survival.',
                'contact_no' => '+1-555-0123',
                'country_id' => $usaId,
                'state_province' => 'Alaska',
                'city' => 'Anchorage',
                'address' => '123 Adventure Street',
                'postal_code' => '99501',
                'status' => 'active',
                'no_of_trips' => 15,
                'profile_pic' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
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
                'profile_pic' => 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
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
                'status' => 'active',
                'no_of_trips' => 5,
                'profile_pic' => 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
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
                'profile_pic' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop',
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
                'profile_pic' => 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
            ],
            // Specialists for new destinations
            [
                'first_name' => 'Hiroshi',
                'last_name' => 'Yamamoto',
                'email' => 'hiroshi.yamamoto@example.com',
                'bio' => 'Local Tokyo guide specializing in hidden neighborhoods and authentic everyday experiences. Discover Japan beyond tourist spots.',
                'contact_no' => '+81-3-5678-9012',
                'country_id' => $japanId,
                'state_province' => 'Tokyo',
                'city' => 'Tokyo',
                'address' => 'Shibuya District, Tokyo',
                'postal_code' => '150-0001',
                'status' => 'active',
                'no_of_trips' => 28,
                'profile_pic' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
            ],
            [
                'first_name' => 'Aisha',
                'last_name' => 'Mohamed',
                'email' => 'aisha.mohamed@example.com',
                'bio' => 'Maldives resort and island life specialist. Expert in luxury travel and tropical paradise experiences.',
                'contact_no' => '+960-7-123-4567',
                'country_id' => $maldivesId,
                'state_province' => 'Malé',
                'city' => 'Malé',
                'address' => 'Malé City Center',
                'postal_code' => '20000',
                'status' => 'active',
                'no_of_trips' => 35,
                'profile_pic' => 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
            ],
            [
                'first_name' => 'Michael',
                'last_name' => 'Chen',
                'email' => 'michael.chen@example.com',
                'bio' => 'New York City nightlife and urban culture expert. Specializes in local bars, music venues, and city lights after dark.',
                'contact_no' => '+1-212-555-7890',
                'country_id' => $usaId,
                'state_province' => 'New York',
                'city' => 'New York',
                'address' => 'Times Square, Manhattan',
                'postal_code' => '10036',
                'status' => 'active',
                'no_of_trips' => 42,
                'profile_pic' => 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop',
            ],
            [
                'first_name' => 'David',
                'last_name' => 'Williams',
                'email' => 'david.williams@example.com',
                'bio' => 'Alabama local guide specializing in southern culture, history, and hospitality.',
                'contact_no' => '+1-205-555-1234',
                'country_id' => $usaId,
                'state_province' => 'Alabama',
                'city' => 'Birmingham',
                'address' => 'Downtown Birmingham',
                'postal_code' => '35203',
                'status' => 'active',
                'no_of_trips' => 10,
                'profile_pic' => 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
            ],
            [
                'first_name' => 'Thabo',
                'last_name' => 'Mbeki',
                'email' => 'thabo.mbeki@example.com',
                'bio' => 'Cape Town adventure guide and mountain specialist. Expert in Table Mountain, wine regions, and coastal experiences.',
                'contact_no' => '+27-21-987-6543',
                'country_id' => $southAfricaId,
                'state_province' => 'Western Cape',
                'city' => 'Cape Town',
                'address' => 'V&A Waterfront, Cape Town',
                'postal_code' => '8001',
                'status' => 'active',
                'no_of_trips' => 31,
                'profile_pic' => 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
            ],
            [
                'first_name' => 'James',
                'last_name' => 'Mitchell',
                'email' => 'james.mitchell@example.com',
                'bio' => 'New Zealand wilderness and adventure specialist. Expert in fjords, hiking trails, and Maori cultural experiences.',
                'contact_no' => '+64-9-876-5432',
                'country_id' => $newZealandId,
                'state_province' => 'Auckland',
                'city' => 'Auckland',
                'address' => 'Auckland Central',
                'postal_code' => '1010',
                'status' => 'active',
                'no_of_trips' => 26,
                'profile_pic' => 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop',
            ],
            [
                'first_name' => 'Olivia',
                'last_name' => 'Taylor',
                'email' => 'olivia.taylor@example.com',
                'bio' => 'Australian surf and beach culture expert. Specializes in coastal adventures, surfing, and Great Barrier Reef experiences.',
                'contact_no' => '+61-2-9876-5432',
                'country_id' => $australiaId,
                'state_province' => 'New South Wales',
                'city' => 'Sydney',
                'address' => 'Bondi Beach, Sydney',
                'postal_code' => '2026',
                'status' => 'active',
                'no_of_trips' => 33,
                'profile_pic' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop',
            ],
        ];

        // Country ID to timezone mapping
        $countryTimezones = [
            $usaId => 'America/New_York',
            $spainId => 'Europe/Madrid',
            $uaeId => 'Asia/Dubai',
            $ukId => 'Europe/London',
            $japanId => 'Asia/Tokyo',
            $mexicoId => 'America/Cancun',
            $indiaId => 'Asia/Kolkata',
            $southAfricaId => 'Africa/Johannesburg',
            $italyId => 'Europe/Rome',
            $franceId => 'Europe/Paris',
            $brazilId => 'America/Sao_Paulo',
            $switzerlandId => 'Europe/Zurich',
            $newZealandId => 'Pacific/Auckland',
            $australiaId => 'Australia/Sydney',
            $maldivesId => 'Indian/Maldives',
        ];

        foreach ($specialists as $specialistData) {
            // Skip if country_id is null (country not found)
            if (!$specialistData['country_id']) {
                continue;
            }

            // Check if specialist already exists
            $existingSpecialist = Specialist::where('email', $specialistData['email'])->first();
            if ($existingSpecialist) {
                // Ensure existing specialists have working hours and timezone
                if (!$existingSpecialist->timezone) {
                    $existingSpecialist->update([
                        'timezone' => $countryTimezones[$specialistData['country_id']] ?? 'UTC',
                    ]);
                }
                if ($existingSpecialist->workingHours()->count() === 0) {
                    WorkingHour::create([
                        'specialist_id' => $existingSpecialist->id,
                        'start_time' => '09:00',
                        'end_time' => '17:00',
                    ]);
                }
                continue;
            }

            // Add timezone based on country
            $specialistData['timezone'] = $countryTimezones[$specialistData['country_id']] ?? 'UTC';

            // Create the specialist record
            $specialist = Specialist::create($specialistData);

            // Create default working hours (9 AM - 5 PM)
            WorkingHour::create([
                'specialist_id' => $specialist->id,
                'start_time' => '09:00',
                'end_time' => '17:00',
            ]);

            // Create corresponding user account for authentication
            try {
                $createUserAction = new CreateUserAccountAction();
                $userResult = $createUserAction->execute([
                    'name' => $specialistData['first_name'] . ' ' . $specialistData['last_name'],
                    'email' => $specialistData['email'],
                    'role' => 'specialist',
                    'password' => 'password123', // Default password for seeded specialists
                ], false); // Don't send welcome email for seeded specialists
            } catch (\Exception $e) {
                // If user creation fails (e.g., email already exists), continue
                \Log::warning('Failed to create user for specialist: ' . $specialistData['email'] . ' - ' . $e->getMessage());
            }
        }
    }
}