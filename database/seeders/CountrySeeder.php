<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Country;

class CountrySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $countries = [
            [
                'name' => 'France',
                'code' => 'FR',
                'flag_url' => 'https://upload.wikimedia.org/wikipedia/en/thumb/c/c3/Flag_of_France.svg/40px-Flag_of_France.svg.png',
            ],
            [
                'name' => 'Spain',
                'code' => 'ES',
                'flag_url' => 'https://upload.wikimedia.org/wikipedia/en/thumb/9/9a/Flag_of_Spain.svg/40px-Flag_of_Spain.svg.png',
            ],
            [
                'name' => 'United States',
                'code' => 'US',
                'flag_url' => 'https://upload.wikimedia.org/wikipedia/en/thumb/a/a4/Flag_of_the_United_States.svg/40px-Flag_of_the_United_States.svg.png',
            ],
            [
                'name' => 'Turkey',
                'code' => 'TR',
                'flag_url' => 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Flag_of_Turkey.svg/40px-Flag_of_Turkey.svg.png',
            ],
            [
                'name' => 'Italy',
                'code' => 'IT',
                'flag_url' => 'https://upload.wikimedia.org/wikipedia/en/thumb/0/03/Flag_of_Italy.svg/40px-Flag_of_Italy.svg.png',
            ],
            [
                'name' => 'Mexico',
                'code' => 'MX',
                'flag_url' => 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Flag_of_Mexico.svg/40px-Flag_of_Mexico.svg.png',
            ],
            [
                'name' => 'United Kingdom',
                'code' => 'GB',
                'flag_url' => 'https://upload.wikimedia.org/wikipedia/en/thumb/a/ae/Flag_of_the_United_Kingdom.svg/40px-Flag_of_the_United_Kingdom.svg.png',
            ],
            [
                'name' => 'Germany',
                'code' => 'DE',
                'flag_url' => 'https://upload.wikimedia.org/wikipedia/en/thumb/b/ba/Flag_of_Germany.svg/40px-Flag_of_Germany.svg.png',
            ],
            [
                'name' => 'Japan',
                'code' => 'JP',
                'flag_url' => 'https://upload.wikimedia.org/wikipedia/en/thumb/9/9e/Flag_of_Japan.svg/40px-Flag_of_Japan.svg.png',
            ],
            [
                'name' => 'Greece',
                'code' => 'GR',
                'flag_url' => 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Flag_of_Greece.svg/40px-Flag_of_Greece.svg.png',
            ],
        ];

        foreach ($countries as $country) {
            Country::create($country);
        }
    }
}
