<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\UmrahPackage;
use Illuminate\Http\Request;

class UmrahPackageApiController extends Controller
{
    /**
     * Get all active umrah packages with their hotels and airlines.
     */
    public function index()
    {
        $packages = UmrahPackage::active()
            ->ordered()
            ->with(['hotels', 'airlines'])
            ->paginate(10);

        $data = $packages->map(function ($package) {
            return [
                'id' => $package->id,
                'title' => $package->title,
                'description' => $package->description,
                'image_url' => $package->image_url,
                'departure' => $package->departure,
                'duration' => $package->duration,
                'frequency' => $package->frequency,
                'price' => $package->price,
                'link' => $package->link,
                'currency' => $package->currency,
                'hotels' => $package->hotels->map(function ($hotel) {
                    return [
                        'id' => $hotel->id,
                        'name' => $hotel->name,
                        'stars' => $hotel->stars,
                        'location' => $hotel->location,
                        'description' => $hotel->description,
                        'image_url' => $hotel->image_url,
                        'order' => $hotel->pivot->order,
                    ];
                }),
                'airlines' => $package->airlines->map(function ($airline) {
                    return [
                        'id' => $airline->id,
                        'name' => $airline->name,
                        'logo_url' => $airline->logo_url,
                    ];
                }),
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $data,
            'meta' => [
                'current_page' => $packages->currentPage(),
                'last_page' => $packages->lastPage(),
                'per_page' => $packages->perPage(),
                'total' => $packages->total(),
            ],
            'links' => [
                'first' => $packages->url(1),
                'last' => $packages->url($packages->lastPage()),
                'prev' => $packages->previousPageUrl(),
                'next' => $packages->nextPageUrl(),
            ],
        ]);
    }
}
