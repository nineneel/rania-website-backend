<?php

namespace Database\Seeders;

use App\Models\UmrahAirline;
use App\Models\UmrahHotel;
use App\Models\UmrahPackage;
use Illuminate\Database\Seeder;

class UmrahPackageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create Airlines
        $saudia = UmrahAirline::firstOrCreate(
            ['name' => 'Saudia'],
            [
                'logo_path' => 'airlines/saudia-logo.png',
                'is_active' => true,
            ]
        );

        $emirates = UmrahAirline::firstOrCreate(
            ['name' => 'Emirates'],
            [
                'logo_path' => 'airlines/emirates-logo.png',
                'is_active' => true,
            ]
        );

        // Create Hotels
        $madenHotel = UmrahHotel::firstOrCreate(
            ['name' => 'Maden Hotel madinah'],
            [
                'stars' => 5,
                'location' => 'Madinah',
                'description' => 'Premium 5-star accommodation in Madinah',
                'image_path' => 'hotels/maden-hotel-madinah.jpg',
                'is_active' => true,
            ]
        );

        $marwaRotana = UmrahHotel::firstOrCreate(
            ['name' => 'Marwa Rotana hotel Makkah'],
            [
                'stars' => 5,
                'location' => 'Makkah',
                'description' => 'Premium 5-star accommodation in Makkah',
                'image_path' => 'hotels/marwa-rotana-makkah.jpg',
                'is_active' => true,
            ]
        );

        $ansarGoldenTulip = UmrahHotel::firstOrCreate(
            ['name' => 'Ansar Golden Tulip'],
            [
                'stars' => 4,
                'location' => 'Madinah',
                'description' => 'Comfortable 4-star accommodation in Madinah',
                'image_path' => 'hotels/ansar-golden-tulip.jpg',
                'is_active' => true,
            ]
        );

        $makaremAjyad = UmrahHotel::firstOrCreate(
            ['name' => 'Makarem Ajyad Hotel'],
            [
                'stars' => 4,
                'location' => 'Makkah',
                'description' => 'Comfortable 4-star accommodation in Makkah',
                'image_path' => 'hotels/makarem-ajyad.jpg',
                'is_active' => true,
            ]
        );

        // Create Packages
        $packages = [
            [
                'title' => 'Umrah Regular',
                'description' => 'Discover Your Sacred Umrah Journey',
                'image_path' => 'packages/umrah-regular-5star.jpg',
                'departure' => 'Soekarno-Hatta airport (CGK) Jakarta',
                'duration' => '9 Days',
                'frequency' => 'Weekly',
                'price' => 54800000.00,
                'currency' => 'Rp',
                'is_active' => true,
                'order' => 0,
                'hotels' => [$madenHotel, $marwaRotana],
                'airlines' => [$saudia, $emirates],
            ],
            [
                'title' => 'Umrah Regular',
                'description' => 'Discover Your Sacred Umrah Journey',
                'image_path' => 'packages/umrah-regular-4star.jpg',
                'departure' => 'Soekarno-Hatta airport (CGK) Jakarta',
                'duration' => '9 Days',
                'frequency' => 'Weekly',
                'price' => 43800000.00,
                'currency' => 'Rp',
                'is_active' => true,
                'order' => 1,
                'hotels' => [$ansarGoldenTulip, $makaremAjyad],
                'airlines' => [$saudia, $emirates],
            ],
            [
                'title' => 'Umrah Dubai',
                'description' => 'Discover Your Sacred Umrah Journey and Amazing Dubai',
                'image_path' => 'packages/umrah-dubai-5star.jpg',
                'departure' => 'Soekarno-Hatta airport (CGK) Jakarta',
                'duration' => '12 Days',
                'frequency' => 'Weekly',
                'price' => 57000000.00,
                'currency' => 'Rp',
                'is_active' => true,
                'order' => 2,
                'hotels' => [$madenHotel, $marwaRotana],
                'airlines' => [$saudia, $emirates],
            ],
            [
                'title' => 'Umrah Dubai',
                'description' => 'Discover Your Sacred Umrah Journey and Amazing Dubai',
                'image_path' => 'packages/umrah-dubai-4star.jpg',
                'departure' => 'Soekarno-Hatta airport (CGK) Jakarta',
                'duration' => '12 Days',
                'frequency' => 'Weekly',
                'price' => 46100000.00,
                'currency' => 'Rp',
                'is_active' => true,
                'order' => 3,
                'hotels' => [$ansarGoldenTulip, $makaremAjyad],
                'airlines' => [$saudia, $emirates],
            ],
            [
                'title' => 'Umrah Turkiye',
                'description' => 'Discover Your Sacred Umrah and Wonderful Turkiye',
                'image_path' => 'packages/umrah-turkiye-5star.jpg',
                'departure' => 'Soekarno-Hatta airport (CGK) Jakarta',
                'duration' => '14 Days',
                'frequency' => 'Weekly',
                'price' => 68800000.00,
                'currency' => 'Rp',
                'is_active' => true,
                'order' => 4,
                'hotels' => [$madenHotel, $marwaRotana],
                'airlines' => [$saudia, $emirates],
            ],
            [
                'title' => 'Umrah Turkiye',
                'description' => 'Discover Your Sacred Umrah and Wonderful Turkiye',
                'image_path' => 'packages/umrah-turkiye-4star.jpg',
                'departure' => 'Soekarno-Hatta airport (CGK) Jakarta',
                'duration' => '14 Days',
                'frequency' => 'Weekly',
                'price' => 57900000.00,
                'currency' => 'Rp',
                'is_active' => true,
                'order' => 5,
                'hotels' => [$ansarGoldenTulip, $makaremAjyad],
                'airlines' => [$saudia, $emirates],
            ],
        ];

        foreach ($packages as $index => $packageData) {
            $hotels = $packageData['hotels'];
            $airlines = $packageData['airlines'];
            unset($packageData['hotels'], $packageData['airlines']);

            $package = UmrahPackage::create($packageData);

            // Attach hotels with order
            foreach ($hotels as $hotelIndex => $hotel) {
                $package->hotels()->attach($hotel->id, ['order' => $hotelIndex]);
            }

            // Attach airlines
            foreach ($airlines as $airline) {
                $package->airlines()->attach($airline->id);
            }
        }
    }
}
