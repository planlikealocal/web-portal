<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\ProcessStep;

class ProcessStepSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $steps = [
            [
                'title' => 'Schedule Appointment',
                'description' => 'Pick a time and share your travel ideas.',
                'icon' => 'calendar',
                'background_color' => '#3B82F6',
                'order' => 1,
                'is_active' => true,
            ],
            [
                'title' => 'Payment',
                'description' => 'Confirm your booking securely and easily.',
                'icon' => 'cash',
                'background_color' => '#E5E7EB',
                'order' => 2,
                'is_active' => true,
            ],
            [
                'title' => 'Video Meeting (Planning)',
                'description' => 'Discuss your style, needs, and preferences with a local.',
                'icon' => 'videocam',
                'background_color' => '#3B82F6',
                'order' => 3,
                'is_active' => true,
            ],
            [
                'title' => 'Delivery',
                'description' => 'Receive your personalized, ready-to-use travel plan.',
                'icon' => 'checkmark',
                'background_color' => '#E5E7EB',
                'order' => 4,
                'is_active' => true,
            ],
        ];

        foreach ($steps as $step) {
            ProcessStep::create($step);
        }
    }
}
