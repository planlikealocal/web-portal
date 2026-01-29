<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\PricingPlan;

class PricingPlanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $plans = [
            [
                'name' => 'Personal Local Travel Plan',
                'price' => 100.00,
                'price_description' => 'per personalized trip plan',
                'features' => [
                    '75-minute 1:1 video chat with a local expert',
                    'Personalized travel plan delivered in mobile-friendly & PDF formats',
                    'Trip booking guidance and planning support',
                    'Weather & park monitoring for better trip timing',
                    'On-trip service',
                ],
                'background_color' => '#FFFFFF',
                'order' => 1,
                'is_active' => true,
            ],
            [
                'name' => 'Personal Local Travel Plan',
                'price' => 140.00,
                'price_description' => 'per personalized trip plan',
                'features' => [
                    '75-minute 1:1 video chat with a local expert',
                    'Personalized travel plan delivered in mobile-friendly & PDF formats',
                    'Trip booking guidance and planning support',
                    'Weather & park monitoring for better trip timing',
                    'On-trip service',
                ],
                'background_color' => '#FF6B6B',
                'order' => 2,
                'is_active' => true,
            ],
            [
                'name' => 'Premium Travel Experience',
                'price' => 200.00,
                'price_description' => 'per personalized trip plan',
                'features' => [
                    '90-minute 1:1 video chat with a local expert',
                    'Personalized travel plan delivered in mobile-friendly & PDF formats',
                    'Priority trip booking guidance and planning support',
                    'Real-time weather & park monitoring for better trip timing',
                    '24/7 on-trip service and support',
                    'Exclusive access to local events and experiences',
                    'Custom itinerary adjustments during your trip',
                ],
                'background_color' => '#4ECDC4',
                'order' => 3,
                'is_active' => true,
            ],
        ];

        foreach ($plans as $plan) {
            PricingPlan::create($plan);
        }
    }
}
