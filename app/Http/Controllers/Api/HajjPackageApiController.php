<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\HajjPackage;
use App\Models\UmrahAdditionalService;
use Illuminate\Http\Request;

class HajjPackageApiController extends Controller
{
    /**
     * Supported locale codes and their matching currency.
     */
    private const LOCALE_MAP = [
        'id' => 'IDR',
        'en' => 'USD',
        'ar' => 'SAR',
    ];

    private const DEFAULT_LOCALE = 'id';

    /**
     * Resolve the locale from the request.
     *
     * Precedence: `?lang=xx` query param > `Accept-Language` header > default `id`.
     */
    private function resolveLocale(Request $request): string
    {
        $queryLocale = strtolower((string) $request->query('lang', ''));

        if (array_key_exists($queryLocale, self::LOCALE_MAP)) {
            return $queryLocale;
        }

        $headerLocale = strtolower(substr((string) $request->header('Accept-Language', ''), 0, 2));

        if (array_key_exists($headerLocale, self::LOCALE_MAP)) {
            return $headerLocale;
        }

        return self::DEFAULT_LOCALE;
    }

    /**
     * Map a locale code to the room price suffix on the package model.
     */
    private function localeToPriceSuffix(string $locale): string
    {
        return match ($locale) {
            'en' => 'usd',
            'ar' => 'sar',
            default => 'idr',
        };
    }

    /**
     * Build the room price object for the requested locale.
     *
     * @return array{quad: string|null, triple: string|null, double: string|null}
     */
    private function roomPricesForLocale(HajjPackage $package, string $locale): array
    {
        $suffix = $this->localeToPriceSuffix($locale);

        return [
            'quad' => $package->{"price_quad_{$suffix}"},
            'triple' => $package->{"price_triple_{$suffix}"},
            'double' => $package->{"price_double_{$suffix}"},
        ];
    }

    /**
     * All-currency room price object for clients that want every locale at once.
     *
     * @return array<string, array{quad: string|null, triple: string|null, double: string|null}>
     */
    private function allRoomPrices(HajjPackage $package): array
    {
        return [
            'idr' => [
                'quad' => $package->price_quad_idr,
                'triple' => $package->price_triple_idr,
                'double' => $package->price_double_idr,
            ],
            'usd' => [
                'quad' => $package->price_quad_usd,
                'triple' => $package->price_triple_usd,
                'double' => $package->price_double_usd,
            ],
            'sar' => [
                'quad' => $package->price_quad_sar,
                'triple' => $package->price_triple_sar,
                'double' => $package->price_double_sar,
            ],
        ];
    }

    /**
     * Get all active hajj packages with hotels and airlines.
     */
    public function index(Request $request)
    {
        $locale = $this->resolveLocale($request);

        $packages = HajjPackage::active()
            ->ordered()
            ->with(['hotels.images', 'airlines', 'additionalServices', 'beds'])
            ->paginate(10);

        $allAdditionalServices = UmrahAdditionalService::active()->ordered()->get();

        $data = $packages->getCollection()->map(function (HajjPackage $package) use ($allAdditionalServices, $locale) {
            $hasOverrides = $package->additionalServices->isNotEmpty();
            $additionalServices = $hasOverrides
                ? $package->additionalServices->where('is_active', true)->values()
                : $allAdditionalServices;

            $priceInfo = $package->priceForLocale($locale);

            return [
                'id' => $package->id,
                'title' => $package->title,
                'slug' => $package->slug,
                'subtitle' => $package->subtitle,
                'description' => $package->description,
                'image_url' => $package->image_url,
                'color' => $package->color,
                'departure' => $package->departure,
                'duration' => $package->duration,
                'departure_schedule' => $package->departure_schedule,
                'date' => $package->date,
                'price' => $priceInfo['price'],
                'currency' => $priceInfo['currency'],
                'prices' => [
                    'idr' => $package->price_idr,
                    'usd' => $package->price_usd,
                    'sar' => $package->price_sar,
                ],
                'room_prices' => $this->roomPricesForLocale($package, $locale),
                'room_prices_all' => $this->allRoomPrices($package),
                'beds' => $package->beds->map(fn ($bed) => [
                    'id' => $bed->id,
                    'type' => $bed->type,
                    'bed_count' => $bed->bed_count,
                    'order' => $bed->order,
                ]),
                'link' => $package->link,
                'hotels' => $package->hotels->map(function ($hotel) {
                    return [
                        'id' => $hotel->id,
                        'name' => $hotel->name,
                        'stars' => $hotel->stars,
                        'location' => $hotel->location,
                        'description' => $hotel->description,
                        'image_url' => $hotel->image_url,
                        'images' => $hotel->images->map(fn ($image) => [
                            'id' => $image->id,
                            'image_url' => $image->image_url,
                            'order' => $image->order,
                        ]),
                        'order' => $hotel->pivot->order,
                        'total_nights' => (int) $hotel->pivot->total_nights,
                    ];
                }),
                'airlines' => $package->airlines->map(function ($airline) {
                    return [
                        'id' => $airline->id,
                        'name' => $airline->name,
                        'logo_url' => $airline->logo_url,
                        'class' => $airline->pivot->class ?? 'economy',
                        'meal' => $airline->pivot->meal,
                        'baggage' => $airline->pivot->baggage,
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
            'locale' => $locale,
            'currency' => self::LOCALE_MAP[$locale],
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
     * Get one active hajj package detail by slug.
     */
    public function show(Request $request, string $slug)
    {
        $locale = $this->resolveLocale($request);

        $package = HajjPackage::active()
            ->where('slug', $slug)
            ->with([
                'hotels.images',
                'airlines',
                'transportations',
                'itineraries',
                'additionalServices',
                'services',
                'beds',
                'images',
            ])
            ->firstOrFail();

        $hasAdditionalOverrides = $package->additionalServices()->exists();
        $additionalServices = $hasAdditionalOverrides
            ? $package->additionalServices()->where('umrah_additional_services.is_active', true)->get()
            : UmrahAdditionalService::active()->ordered()->get();

        $priceInfo = $package->priceForLocale($locale);

        return response()->json([
            'success' => true,
            'locale' => $locale,
            'currency' => self::LOCALE_MAP[$locale],
            'data' => [
                'id' => $package->id,
                'title' => $package->title,
                'slug' => $package->slug,
                'subtitle' => $package->subtitle,
                'description' => $package->description,
                'image_url' => $package->image_url,
                'thumbnail_image_url' => $package->image_url,
                'color' => $package->color,
                'departure' => $package->departure,
                'duration' => $package->duration,
                'departure_schedule' => $package->departure_schedule,
                'date' => $package->date,
                'price' => $priceInfo['price'],
                'currency' => $priceInfo['currency'],
                'prices' => [
                    'idr' => $package->price_idr,
                    'usd' => $package->price_usd,
                    'sar' => $package->price_sar,
                ],
                'room_prices' => $this->roomPricesForLocale($package, $locale),
                'room_prices_all' => $this->allRoomPrices($package),
                'beds' => $package->beds->map(fn ($bed) => [
                    'id' => $bed->id,
                    'type' => $bed->type,
                    'bed_count' => $bed->bed_count,
                    'order' => $bed->order,
                ]),
                'link' => $package->link,
                'hotels' => $package->hotels->map(function ($hotel) {
                    return [
                        'id' => $hotel->id,
                        'name' => $hotel->name,
                        'stars' => $hotel->stars,
                        'location' => $hotel->location,
                        'description' => $hotel->description,
                        'image_url' => $hotel->image_url,
                        'images' => $hotel->images->map(fn ($image) => [
                            'id' => $image->id,
                            'image_url' => $image->image_url,
                            'order' => $image->order,
                        ]),
                        'order' => $hotel->pivot->order,
                        'total_nights' => (int) $hotel->pivot->total_nights,
                    ];
                }),
                'airlines' => $package->airlines->map(function ($airline) {
                    return [
                        'id' => $airline->id,
                        'name' => $airline->name,
                        'logo_url' => $airline->logo_url,
                        'class' => $airline->pivot->class ?? 'economy',
                        'meal' => $airline->pivot->meal,
                        'baggage' => $airline->pivot->baggage,
                    ];
                }),
                'transportations' => $package->transportations->map(function ($transportation) {
                    return [
                        'id' => $transportation->id,
                        'name' => $transportation->name,
                        'subtitle' => $transportation->subtitle,
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
        $package = HajjPackage::active()
            ->where('slug', $slug)
            ->firstOrFail();

        $includedIds = $package->additionalServices()->pluck('umrah_additional_services.id')->all();

        $others = UmrahAdditionalService::active()
            ->ordered()
            ->whereNotIn('id', $includedIds)
            ->paginate(12);

        $data = $others->getCollection()->map(function ($service) {
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
