<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\WhoWeAre;

class WhoWeAreSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $members = [
            [
                'name' => 'Alex Morgan',
                'designation' => 'Product Developer',
                'description' => 'Alex is passionate about creating innovative travel experiences and ensuring our platform delivers exceptional value to travelers worldwide. With years of experience in product development, Alex leads our team in building features that make travel planning seamless and enjoyable.',
                'order' => 1,
            ],
            [
                'name' => 'Liam Carter',
                'designation' => 'Marketing & Growth',
                'description' => 'Liam drives our marketing strategy and growth initiatives, connecting travelers with amazing destinations and experiences. His expertise in digital marketing and user acquisition has been instrumental in expanding our reach and helping more people discover the joy of travel.',
                'order' => 2,
            ],
        ];

        foreach ($members as $member) {
            WhoWeAre::create($member);
        }
    }
}
