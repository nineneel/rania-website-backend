<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\UmrahAdditionalService;
use App\Models\UmrahPackage;

class UmrahPackageApiController extends Controller
{
    /**
     * Get all active umrah packages with their hotels and airlines.
     */
    public function index()
    {
        $packages = UmrahPackage::active()
            ->ordered()
            ->with(['hotels', 'airlines', 'additionalServices'])
            ->paginate(10);

        $allAdditionalServices = UmrahAdditionalService::active()->ordered()->get();

        $data = $packages->map(function (UmrahPackage $package) use ($allAdditionalServices) {
            $hasOverrides = $package->additionalServices->isNotEmpty();
            $additionalServices = $hasOverrides
                ? $package->additionalServices->where('is_active', true)->values()
                : $allAdditionalServices;

            return [
                'id' => $package->id,
                'title' => $package->title,
                'slug' => $package->slug,
                'subtitle' => $package->subtitle,
                'description' => $package->description,
                'image_url' => $package->image_url,
                'departure' => $package->departure,
                'duration' => $package->duration,
                'departure_schedule' => $package->departure_schedule,
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
                'additional_services' => $additionalServices->values()->map(function ($service, $index) {
                    return [
                        'id' => $service->id,
                        'title' => $service->title,
                        'description' => $service->description,
                        'image_url' => $service->image_url,
                        'order' => $service->pivot->order ?? $service->order ?? $index,
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

    /**
     * Get one active umrah package detail by slug.
     */
    public function show(string $slug)
    {
        $package = UmrahPackage::active()
            ->where('slug', $slug)
            ->with([
                'hotels',
                'airlines',
                'transportations',
                'itineraries',
                'additionalServices',
                'services',
                'images',
            ])
            ->firstOrFail();

        $hasAdditionalOverrides = $package->additionalServices()->exists();
        $additionalServices = $hasAdditionalOverrides
            ? $package->additionalServices()->where('umrah_additional_services.is_active', true)->get()
            : UmrahAdditionalService::active()->ordered()->get();

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $package->id,
                'title' => $package->title,
                'slug' => $package->slug,
                'subtitle' => $package->subtitle,
                'description' => $package->description,
                'image_url' => $package->image_url,
                'thumbnail_image_url' => $package->image_url,
                'departure' => $package->departure,
                'duration' => $package->duration,
                'departure_schedule' => $package->departure_schedule,
                'price' => $package->price,
                'currency' => $package->currency,
                'link' => $package->link,
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
                'transportations' => $package->transportations->map(function ($transportation) {
                    return [
                        'id' => $transportation->id,
                        'name' => $transportation->name,
                        'description' => $transportation->description,
                        'icon_url' => $transportation->icon_url,
                        'order' => $transportation->pivot->order,
                    ];
                }),
                'itineraries' => $package->itineraries->map(function ($itinerary) {
                    return [
                        'id' => $itinerary->id,
                        'title' => $itinerary->title,
                        'location' => $itinerary->location,
                        'description' => $itinerary->description,
                        'image_url' => $itinerary->image_url,
                        'order' => $itinerary->pivot->order,
                    ];
                }),
                'additional_services' => $additionalServices->values()->map(function ($additionalService, $index) {
                    return [
                        'id' => $additionalService->id,
                        'title' => $additionalService->title,
                        'description' => $additionalService->description,
                        'image_url' => $additionalService->image_url,
                        'order' => $additionalService->pivot->order ?? $additionalService->order ?? $index,
                    ];
                }),
                'package_services' => $package->services->map(function ($service) {
                    return [
                        'id' => $service->id,
                        'title' => $service->title,
                        'description' => $service->description,
                        'is_included' => $service->is_included,
                        'order' => $service->order,
                    ];
                }),
                'gallery_images' => $package->images->map(function ($image) {
                    return [
                        'id' => $image->id,
                        'image_url' => $image->image_url,
                        'order' => $image->order,
                    ];
                }),
            ],
        ]);
    }

    /**
     * Get additional services that are NOT included in a specific package.
     */
    public function otherAdditionalServices(string $slug)
    {
        $package = UmrahPackage::active()
            ->where('slug', $slug)
            ->firstOrFail();

        $includedIds = $package->additionalServices()->pluck('umrah_additional_services.id')->all();

        $others = UmrahAdditionalService::active()
            ->ordered()
            ->whereNotIn('id', $includedIds)
            ->paginate(12);

        $data = $others->map(function ($service) {
            return [
                'id' => $service->id,
                'title' => $service->title,
                'description' => $service->description,
                'image_url' => $service->image_url,
                'order' => $service->order,
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $data,
            'meta' => [
                'current_page' => $others->currentPage(),
                'last_page' => $others->lastPage(),
                'per_page' => $others->perPage(),
                'total' => $others->total(),
            ],
            'links' => [
                'first' => $others->url(1),
                'last' => $others->url($others->lastPage()),
                'prev' => $others->previousPageUrl(),
                'next' => $others->nextPageUrl(),
            ],
        ]);
    }
}
