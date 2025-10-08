<?php

namespace Database\Seeders;

use App\Models\Specialist;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SpecialistSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $specialists = [
            [
                'first_name' => 'John',
                'last_name' => 'Smith',
                'email' => 'john.smith@example.com',
                'contact_no' => '+1-555-0123',
                'country' => 'United States',
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
                'contact_no' => '+34-91-123-4567',
                'country' => 'Spain',
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
                'contact_no' => '+971-4-123-4567',
                'country' => 'UAE',
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
                'contact_no' => '+44-20-7946-0958',
                'country' => 'United Kingdom',
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
                'contact_no' => '+81-3-1234-5678',
                'country' => 'Japan',
                'state_province' => 'Tokyo',
                'city' => 'Tokyo',
                'address' => 'Shibuya Crossing, Shibuya City',
                'postal_code' => '150-0002',
                'status' => 'active',
                'no_of_trips' => 12,
            ],
        ];

        foreach ($specialists as $specialist) {
            Specialist::create($specialist);
        }
    }
}
