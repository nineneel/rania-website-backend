<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreHajjPackageRequest;
use App\Http\Requests\UpdateHajjPackageRequest;
use App\Models\HajjPackage;
use App\Models\UmrahAdditionalService;
use App\Models\UmrahAirline;
use App\Models\UmrahHotel;
use App\Models\UmrahItinerary;
use App\Models\UmrahTransportation;
use App\Models\User;
use App\Services\UploadedFileStorage;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class HajjContentController extends Controller
{
    use UploadedFileStorage;

    /**
     * Get the authenticated user.
     */
    protected function user(): User
    {
        return Auth::user();
    }

    /**
     * Display hajj content management page (now shows packages list).
     */
    public function index()
    {
        if (! $this->user()->canManageHomeContent()) {
            return Inertia::render('errors/403', [
                'message' => 'You do not have permission to manage hajj content.',
            ])->toResponse(request())->setStatusCode(403);
        }

        $packages = HajjPackage::with(['hotels', 'airlines'])->ordered()->get();

        return Inertia::render('hajj-content/packages/index', [
            'packages' => $packages,
            'showNavigation' => true,
        ]);
    }

    // ==================== PACKAGES ====================

    public function indexPackages()
    {
        if (! $this->user()->canManageHomeContent()) {
            return Inertia::render('errors/403', [
                'message' => 'You do not have permission to manage hajj content.',
            ])->toResponse(request())->setStatusCode(403);
        }

        $packages = HajjPackage::with(['hotels', 'airlines'])->ordered()->get();

        return Inertia::render('hajj-content/packages/index', [
            'packages' => $packages,
        ]);
    }

    public function createPackage()
    {
        if (! $this->user()->canManageHomeContent()) {
            return Inertia::render('errors/403', [
                'message' => 'You do not have permission to manage hajj content.',
            ])->toResponse(request())->setStatusCode(403);
        }

        $hotels = UmrahHotel::active()->with('images')->orderBy('name')->get();
        $airlines = UmrahAirline::active()->orderBy('name')->get();
        $transportations = UmrahTransportation::active()->ordered()->get();
        $itineraries = UmrahItinerary::active()->ordered()->get();
        $additionalServices = UmrahAdditionalService::active()->ordered()->get();

        return Inertia::render('hajj-content/packages/create', [
            'hotels' => $hotels,
            'airlines' => $airlines,
            'transportations' => $transportations,
            'itineraries' => $itineraries,
            'additionalServices' => $additionalServices,
        ]);
    }

    public function storePackage(StoreHajjPackageRequest $request)
    {
        $validated = $request->validated();

        $hotelIds = $validated['hotel_ids'] ?? [];
        $hotelNights = $validated['hotel_nights'] ?? [];
        $airlineIds = $validated['airline_ids'] ?? [];
        $airlineClasses = $validated['airline_classes'] ?? [];
        $airlineMeals = $validated['airline_meals'] ?? [];
        $airlineBaggages = $validated['airline_baggages'] ?? [];
        $transportationIds = $validated['transportation_ids'] ?? [];
        $itineraryIds = $validated['itinerary_ids'] ?? [];
        $additionalServiceIds = $validated['additional_service_ids'] ?? [];
        $packageServices = $validated['package_services'] ?? [];
        $packageBeds = $validated['package_beds'] ?? [];
        $galleryImages = $request->file('gallery_images', []);

        unset(
            $validated['image'],
            $validated['gallery_images'],
            $validated['hotel_ids'],
            $validated['hotel_nights'],
            $validated['airline_ids'],
            $validated['airline_classes'],
            $validated['airline_meals'],
            $validated['airline_baggages'],
            $validated['transportation_ids'],
            $validated['itinerary_ids'],
            $validated['additional_service_ids'],
            $validated['package_services'],
            $validated['package_beds'],
        );

        $validated['order'] = (HajjPackage::max('order') ?? -1) + 1;

        if ($request->hasFile('image')) {
            $validated['image_path'] = $this->storeUploadedFile($request->file('image'), 'hajj/packages');
        }

        $package = HajjPackage::create($validated);
        $this->storeGalleryImages($package, is_array($galleryImages) ? $galleryImages : []);

        if (is_array($hotelIds)) {
            $hotelData = [];
            foreach ($hotelIds as $index => $hotelId) {
                $hotelData[$hotelId] = [
                    'order' => $index,
                    'total_nights' => $this->resolveHotelNights($hotelNights, $hotelId),
                ];
            }
            $package->hotels()->attach($hotelData);
        }

        if (is_array($airlineIds)) {
            $airlineData = [];
            foreach ($airlineIds as $airlineId) {
                $airlineData[$airlineId] = [
                    'class' => $this->resolveAirlineClass($airlineClasses, $airlineId),
                    'meal' => $this->resolveAirlinePivotString($airlineMeals, $airlineId),
                    'baggage' => $this->resolveAirlinePivotString($airlineBaggages, $airlineId),
                ];
            }
            $package->airlines()->attach($airlineData);
        }

        if (is_array($transportationIds)) {
            $transportationData = [];
            foreach ($transportationIds as $index => $transportationId) {
                $transportationData[$transportationId] = ['order' => $index];
            }
            $package->transportations()->attach($transportationData);
        }

        if (is_array($itineraryIds)) {
            $itineraryData = [];
            foreach ($itineraryIds as $index => $itineraryId) {
                $itineraryData[$itineraryId] = ['order' => $index];
            }
            $package->itineraries()->attach($itineraryData);
        }

        if (is_array($additionalServiceIds)) {
            $additionalServiceData = [];
            foreach ($additionalServiceIds as $index => $serviceId) {
                $additionalServiceData[$serviceId] = ['order' => $index];
            }
            $package->additionalServices()->attach($additionalServiceData);
        }

        if (is_array($packageServices)) {
            $serviceRows = [];
            foreach ($packageServices as $index => $service) {
                $serviceRows[] = [
                    'title' => $service['title'],
                    'description' => $service['description'] ?? null,
                    'is_included' => $service['is_included'] ?? true,
                    'order' => $index,
                ];
            }

            if ($serviceRows !== []) {
                $package->services()->createMany($serviceRows);
            }
        }

        if (is_array($packageBeds)) {
            $bedRows = [];
            foreach ($packageBeds as $index => $bed) {
                $bedRows[] = [
                    'type' => $bed['type'],
                    'bed_count' => (int) ($bed['bed_count'] ?? 0),
                    'order' => $index,
                ];
            }

            if ($bedRows !== []) {
                $package->beds()->createMany($bedRows);
            }
        }

        return redirect()->route('hajj-content.packages.index')
            ->with('success', 'Package created successfully.');
    }

    public function editPackage(HajjPackage $package)
    {
        if (! $this->user()->canManageHomeContent()) {
            return Inertia::render('errors/403', [
                'message' => 'You do not have permission to manage hajj content.',
            ])->toResponse(request())->setStatusCode(403);
        }

        $package->load(['hotels.images', 'airlines', 'transportations', 'itineraries', 'additionalServices', 'services', 'beds', 'images']);

        $hotels = UmrahHotel::active()->with('images')->orderBy('name')->get();
        $airlines = UmrahAirline::active()->orderBy('name')->get();
        $transportations = UmrahTransportation::active()->ordered()->get();
        $itineraries = UmrahItinerary::active()->ordered()->get();
        $additionalServices = UmrahAdditionalService::active()->ordered()->get();

        return Inertia::render('hajj-content/packages/edit', [
            'package' => $package,
            'hotels' => $hotels,
            'airlines' => $airlines,
            'transportations' => $transportations,
            'itineraries' => $itineraries,
            'additionalServices' => $additionalServices,
        ]);
    }

    public function updatePackage(UpdateHajjPackageRequest $request, HajjPackage $package)
    {
        $validated = $request->validated();

        $hotelIds = $validated['hotel_ids'] ?? [];
        $hotelNights = $validated['hotel_nights'] ?? [];
        $airlineIds = $validated['airline_ids'] ?? [];
        $airlineClasses = $validated['airline_classes'] ?? [];
        $airlineMeals = $validated['airline_meals'] ?? [];
        $airlineBaggages = $validated['airline_baggages'] ?? [];
        $transportationIds = $validated['transportation_ids'] ?? [];
        $itineraryIds = $validated['itinerary_ids'] ?? [];
        $additionalServiceIds = $validated['additional_service_ids'] ?? [];
        $packageServices = $validated['package_services'] ?? [];
        $packageBeds = $validated['package_beds'] ?? [];
        $existingGalleryImageIds = $validated['existing_gallery_image_ids'] ?? [];
        $galleryImages = $request->file('gallery_images', []);

        unset(
            $validated['image'],
            $validated['gallery_images'],
            $validated['existing_gallery_image_ids'],
            $validated['hotel_ids'],
            $validated['hotel_nights'],
            $validated['airline_ids'],
            $validated['airline_classes'],
            $validated['airline_meals'],
            $validated['airline_baggages'],
            $validated['transportation_ids'],
            $validated['itinerary_ids'],
            $validated['additional_service_ids'],
            $validated['package_services'],
            $validated['package_beds'],
        );

        if ($request->hasFile('image')) {
            $newImagePath = $this->storeUploadedFile($request->file('image'), 'hajj/packages');

            if ($package->image_path) {
                Storage::disk('public')->delete($package->image_path);
            }

            $validated['image_path'] = $newImagePath;
        }

        $package->update($validated);

        $hotelData = [];
        foreach ($hotelIds as $index => $hotelId) {
            $hotelData[$hotelId] = [
                'order' => $index,
                'total_nights' => $this->resolveHotelNights($hotelNights, $hotelId),
            ];
        }
        $package->hotels()->sync($hotelData);

        $airlineData = [];
        foreach ($airlineIds as $airlineId) {
            $airlineData[$airlineId] = [
                'class' => $this->resolveAirlineClass($airlineClasses, $airlineId),
                'meal' => $this->resolveAirlinePivotString($airlineMeals, $airlineId),
                'baggage' => $this->resolveAirlinePivotString($airlineBaggages, $airlineId),
            ];
        }
        $package->airlines()->sync($airlineData);

        $transportationData = [];
        foreach ($transportationIds as $index => $transportationId) {
            $transportationData[$transportationId] = ['order' => $index];
        }
        $package->transportations()->sync($transportationData);

        $itineraryData = [];
        foreach ($itineraryIds as $index => $itineraryId) {
            $itineraryData[$itineraryId] = ['order' => $index];
        }
        $package->itineraries()->sync($itineraryData);

        $additionalServiceData = [];
        foreach ($additionalServiceIds as $index => $serviceId) {
            $additionalServiceData[$serviceId] = ['order' => $index];
        }
        $package->additionalServices()->sync($additionalServiceData);

        $package->services()->delete();

        if (is_array($packageServices) && $packageServices !== []) {
            $serviceRows = [];
            foreach ($packageServices as $index => $service) {
                $serviceRows[] = [
                    'title' => $service['title'],
                    'description' => $service['description'] ?? null,
                    'is_included' => $service['is_included'] ?? true,
                    'order' => $index,
                ];
            }
            $package->services()->createMany($serviceRows);
        }

        $package->beds()->delete();

        if (is_array($packageBeds) && $packageBeds !== []) {
            $bedRows = [];
            foreach ($packageBeds as $index => $bed) {
                $bedRows[] = [
                    'type' => $bed['type'],
                    'bed_count' => (int) ($bed['bed_count'] ?? 0),
                    'order' => $index,
                ];
            }
            $package->beds()->createMany($bedRows);
        }

        $this->syncGalleryImages(
            $package,
            is_array($existingGalleryImageIds) ? $existingGalleryImageIds : [],
            is_array($galleryImages) ? $galleryImages : [],
        );

        return redirect()->route('hajj-content.packages.index')
            ->with('success', 'Package updated successfully.');
    }

    public function destroyPackage(HajjPackage $package)
    {
        if (! $this->user()->canManageHomeContent()) {
            abort(403, 'You do not have permission to manage hajj content.');
        }

        if ($package->image_path) {
            Storage::disk('public')->delete($package->image_path);
        }

        foreach ($package->images as $image) {
            Storage::disk('public')->delete($image->image_path);
        }

        $package->delete();

        return redirect()->route('hajj-content.packages.index')
            ->with('success', 'Package deleted successfully.');
    }

    public function updatePackagesOrder(Request $request)
    {
        if (! $this->user()->canManageHomeContent()) {
            abort(403, 'You do not have permission to manage hajj content.');
        }

        $validated = $request->validate([
            'items' => ['required', 'array'],
            'items.*.id' => ['required', 'exists:hajj_packages,id'],
            'items.*.order' => ['required', 'integer', 'min:0'],
        ]);

        foreach ($validated['items'] as $item) {
            HajjPackage::where('id', $item['id'])->update(['order' => $item['order']]);
        }

        return back();
    }

    /**
     * Resolve the total nights for a hotel from the request map, defaulting to 3.
     *
     * @param  array<int|string, mixed>  $hotelNights
     */
    protected function resolveHotelNights(array $hotelNights, int $hotelId): int
    {
        $value = $hotelNights[$hotelId] ?? $hotelNights[(string) $hotelId] ?? null;
        $nights = is_numeric($value) ? (int) $value : 0;

        return $nights > 0 ? $nights : 3;
    }

    /**
     * Resolve the class for an airline from the request map, defaulting to 'economy'.
     *
     * @param  array<int|string, mixed>  $airlineClasses
     */
    protected function resolveAirlineClass(array $airlineClasses, int $airlineId): string
    {
        $value = $airlineClasses[$airlineId] ?? $airlineClasses[(string) $airlineId] ?? null;
        $class = is_string($value) ? trim($value) : '';

        return $class !== '' ? $class : 'economy';
    }

    /**
     * Resolve a nullable string pivot value (meal/baggage) for an airline, defaulting to null.
     *
     * @param  array<int|string, mixed>  $values
     */
    protected function resolveAirlinePivotString(array $values, int $airlineId): ?string
    {
        $value = $values[$airlineId] ?? $values[(string) $airlineId] ?? null;
        $string = is_string($value) ? trim($value) : '';

        return $string !== '' ? $string : null;
    }

    /**
     * Store detail gallery images for a package.
     *
     * @param  array<int, UploadedFile>  $galleryImages
     */
    protected function storeGalleryImages(HajjPackage $package, array $galleryImages): void
    {
        foreach ($galleryImages as $index => $galleryImage) {
            $imagePath = $this->storeUploadedFile($galleryImage, 'hajj/packages/gallery');

            $package->images()->create([
                'image_path' => $imagePath,
                'order' => $index,
            ]);
        }
    }

    /**
     * Sync gallery images with retained IDs and new uploads.
     *
     * @param  array<int, int|string>  $existingGalleryImageIds
     * @param  array<int, UploadedFile>  $newGalleryImages
     */
    protected function syncGalleryImages(HajjPackage $package, array $existingGalleryImageIds, array $newGalleryImages): void
    {
        $retainedIds = array_map('intval', $existingGalleryImageIds);
        $package->load('images');

        $imagesToDelete = $package->images
            ->filter(fn ($image) => ! in_array($image->id, $retainedIds, true));

        foreach ($imagesToDelete as $imageToDelete) {
            Storage::disk('public')->delete($imageToDelete->image_path);
            $imageToDelete->delete();
        }

        $retainedImages = $package->images()
            ->whereIn('id', $retainedIds)
            ->orderBy('order')
            ->get();

        foreach ($retainedImages as $index => $retainedImage) {
            $retainedImage->update(['order' => $index]);
        }

        $nextOrder = $retainedImages->count();

        foreach ($newGalleryImages as $galleryImage) {
            $imagePath = $this->storeUploadedFile($galleryImage, 'hajj/packages/gallery');

            $package->images()->create([
                'image_path' => $imagePath,
                'order' => $nextOrder,
            ]);

            $nextOrder++;
        }
    }
}
