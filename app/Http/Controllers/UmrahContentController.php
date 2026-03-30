<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreUmrahAdditionalServiceRequest;
use App\Http\Requests\StoreUmrahItineraryRequest;
use App\Http\Requests\StoreUmrahPackageRequest;
use App\Http\Requests\StoreUmrahTransportationRequest;
use App\Http\Requests\UpdateUmrahAdditionalServiceRequest;
use App\Http\Requests\UpdateUmrahItineraryRequest;
use App\Http\Requests\UpdateUmrahPackageRequest;
use App\Http\Requests\UpdateUmrahTransportationRequest;
use App\Models\UmrahAdditionalService;
use App\Models\UmrahAirline;
use App\Models\UmrahHotel;
use App\Models\UmrahItinerary;
use App\Models\UmrahPackage;
use App\Models\UmrahTransportation;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class UmrahContentController extends Controller
{
    /**
     * Get the authenticated user.
     */
    protected function user(): User
    {
        return Auth::user();
    }

    /**
     * Display umrah content management page (now shows packages list).
     */
    public function index()
    {
        // Check if user can manage home content
        if (! $this->user()->canManageHomeContent()) {
            return Inertia::render('errors/403', [
                'message' => 'You do not have permission to manage umrah content.',
            ])->toResponse(request())->setStatusCode(403);
        }

        $packages = UmrahPackage::with(['hotels', 'airlines'])->ordered()->get();

        return Inertia::render('umrah-content/packages/index', [
            'packages' => $packages,
            'showNavigation' => true,
        ]);
    }

    // ==================== AIRLINES ====================

    /**
     * Display airlines index page.
     */
    public function indexAirlines()
    {
        if (! $this->user()->canManageHomeContent()) {
            return Inertia::render('errors/403', [
                'message' => 'You do not have permission to manage umrah content.',
            ])->toResponse(request())->setStatusCode(403);
        }

        $airlines = UmrahAirline::orderBy('name')->get();

        return Inertia::render('umrah-content/airlines/index', [
            'airlines' => $airlines,
        ]);
    }

    /**
     * Show the form for creating a new airline.
     */
    public function createAirline()
    {
        if (! $this->user()->canManageHomeContent()) {
            return Inertia::render('errors/403', [
                'message' => 'You do not have permission to manage umrah content.',
            ])->toResponse(request())->setStatusCode(403);
        }

        return Inertia::render('umrah-content/airlines/create');
    }

    /**
     * Store a new airline.
     */
    public function storeAirline(Request $request)
    {
        if (! $this->user()->canManageHomeContent()) {
            abort(403, 'You do not have permission to manage umrah content.');
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'logo' => ['required', 'image', 'mimes:jpg,jpeg,png,webp,svg', 'max:2048'],
            'is_active' => ['boolean'],
        ]);

        // Handle logo upload
        if ($request->hasFile('logo')) {
            $logoPath = $request->file('logo')->store('umrah/airlines', 'public');
            $validated['logo_path'] = $logoPath;
        }

        UmrahAirline::create($validated);

        return redirect()->route('umrah-content.airlines.index')
            ->with('success', 'Airline created successfully.');
    }

    /**
     * Show the form for editing an airline.
     */
    public function editAirline(UmrahAirline $airline)
    {
        if (! $this->user()->canManageHomeContent()) {
            return Inertia::render('errors/403', [
                'message' => 'You do not have permission to manage umrah content.',
            ])->toResponse(request())->setStatusCode(403);
        }

        return Inertia::render('umrah-content/airlines/edit', [
            'airline' => $airline,
        ]);
    }

    /**
     * Update an existing airline.
     */
    public function updateAirline(Request $request, UmrahAirline $airline)
    {
        if (! $this->user()->canManageHomeContent()) {
            abort(403, 'You do not have permission to manage umrah content.');
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'logo' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp,svg', 'max:2048'],
            'is_active' => ['boolean'],
        ]);

        // Handle logo upload if new logo provided
        if ($request->hasFile('logo')) {
            // Delete old logo
            if ($airline->logo_path) {
                Storage::disk('public')->delete($airline->logo_path);
            }

            $logoPath = $request->file('logo')->store('umrah/airlines', 'public');
            $validated['logo_path'] = $logoPath;
        }

        $airline->update($validated);

        return redirect()->route('umrah-content.airlines.index')
            ->with('success', 'Airline updated successfully.');
    }

    /**
     * Delete an airline.
     */
    public function destroyAirline(UmrahAirline $airline)
    {
        if (! $this->user()->canManageHomeContent()) {
            abort(403, 'You do not have permission to manage umrah content.');
        }

        // Delete logo from storage
        if ($airline->logo_path) {
            Storage::disk('public')->delete($airline->logo_path);
        }

        $airline->delete();

        return redirect()->route('umrah-content.airlines.index')
            ->with('success', 'Airline deleted successfully.');
    }

    // ==================== HOTELS ====================

    /**
     * Display hotels index page.
     */
    public function indexHotels()
    {
        if (! $this->user()->canManageHomeContent()) {
            return Inertia::render('errors/403', [
                'message' => 'You do not have permission to manage umrah content.',
            ])->toResponse(request())->setStatusCode(403);
        }

        $hotels = UmrahHotel::orderBy('name')->get();

        return Inertia::render('umrah-content/hotels/index', [
            'hotels' => $hotels,
        ]);
    }

    /**
     * Show the form for creating a new hotel.
     */
    public function createHotel()
    {
        if (! $this->user()->canManageHomeContent()) {
            return Inertia::render('errors/403', [
                'message' => 'You do not have permission to manage umrah content.',
            ])->toResponse(request())->setStatusCode(403);
        }

        return Inertia::render('umrah-content/hotels/create');
    }

    /**
     * Store a new hotel.
     */
    public function storeHotel(Request $request)
    {
        if (! $this->user()->canManageHomeContent()) {
            abort(403, 'You do not have permission to manage umrah content.');
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'stars' => ['required', 'integer', 'min:1', 'max:5'],
            'location' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
            'is_active' => ['boolean'],
        ]);

        // Handle image upload
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('umrah/hotels', 'public');
            $validated['image_path'] = $imagePath;
        }

        UmrahHotel::create($validated);

        return redirect()->route('umrah-content.hotels.index')
            ->with('success', 'Hotel created successfully.');
    }

    /**
     * Show the form for editing a hotel.
     */
    public function editHotel(UmrahHotel $hotel)
    {
        if (! $this->user()->canManageHomeContent()) {
            return Inertia::render('errors/403', [
                'message' => 'You do not have permission to manage umrah content.',
            ])->toResponse(request())->setStatusCode(403);
        }

        return Inertia::render('umrah-content/hotels/edit', [
            'hotel' => $hotel,
        ]);
    }

    /**
     * Update an existing hotel.
     */
    public function updateHotel(Request $request, UmrahHotel $hotel)
    {
        if (! $this->user()->canManageHomeContent()) {
            abort(403, 'You do not have permission to manage umrah content.');
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'stars' => ['required', 'integer', 'min:1', 'max:5'],
            'location' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
            'is_active' => ['boolean'],
        ]);

        // Handle image upload if new image provided
        if ($request->hasFile('image')) {
            // Delete old image
            if ($hotel->image_path) {
                Storage::disk('public')->delete($hotel->image_path);
            }

            $imagePath = $request->file('image')->store('umrah/hotels', 'public');
            $validated['image_path'] = $imagePath;
        }

        $hotel->update($validated);

        return redirect()->route('umrah-content.hotels.index')
            ->with('success', 'Hotel updated successfully.');
    }

    /**
     * Delete a hotel.
     */
    public function destroyHotel(UmrahHotel $hotel)
    {
        if (! $this->user()->canManageHomeContent()) {
            abort(403, 'You do not have permission to manage umrah content.');
        }

        // Delete image from storage
        if ($hotel->image_path) {
            Storage::disk('public')->delete($hotel->image_path);
        }

        $hotel->delete();

        return redirect()->route('umrah-content.hotels.index')
            ->with('success', 'Hotel deleted successfully.');
    }

    // ==================== TRANSPORTATIONS ====================

    /**
     * Display transportations index page.
     */
    public function indexTransportations()
    {
        if (! $this->user()->canManageHomeContent()) {
            return Inertia::render('errors/403', [
                'message' => 'You do not have permission to manage umrah content.',
            ])->toResponse(request())->setStatusCode(403);
        }

        $transportations = UmrahTransportation::ordered()->get();

        return Inertia::render('umrah-content/transportations/index', [
            'transportations' => $transportations,
        ]);
    }

    /**
     * Show the form for creating a new transportation.
     */
    public function createTransportation()
    {
        if (! $this->user()->canManageHomeContent()) {
            return Inertia::render('errors/403', [
                'message' => 'You do not have permission to manage umrah content.',
            ])->toResponse(request())->setStatusCode(403);
        }

        return Inertia::render('umrah-content/transportations/create');
    }

    /**
     * Store a new transportation.
     */
    public function storeTransportation(StoreUmrahTransportationRequest $request)
    {
        $validated = $request->validated();
        $validated['order'] = (UmrahTransportation::max('order') ?? -1) + 1;

        if ($request->hasFile('icon')) {
            $iconPath = $request->file('icon')->store('umrah/transportations', 'public');
            $validated['icon_path'] = $iconPath;
        }

        UmrahTransportation::create($validated);

        return redirect()->route('umrah-content.transportations.index')
            ->with('success', 'Transportation created successfully.');
    }

    /**
     * Show the form for editing a transportation.
     */
    public function editTransportation(UmrahTransportation $transportation)
    {
        if (! $this->user()->canManageHomeContent()) {
            return Inertia::render('errors/403', [
                'message' => 'You do not have permission to manage umrah content.',
            ])->toResponse(request())->setStatusCode(403);
        }

        return Inertia::render('umrah-content/transportations/edit', [
            'transportation' => $transportation,
        ]);
    }

    /**
     * Update an existing transportation.
     */
    public function updateTransportation(UpdateUmrahTransportationRequest $request, UmrahTransportation $transportation)
    {
        $validated = $request->validated();

        if ($request->hasFile('icon')) {
            if ($transportation->icon_path) {
                Storage::disk('public')->delete($transportation->icon_path);
            }

            $iconPath = $request->file('icon')->store('umrah/transportations', 'public');
            $validated['icon_path'] = $iconPath;
        }

        $transportation->update($validated);

        return redirect()->route('umrah-content.transportations.index')
            ->with('success', 'Transportation updated successfully.');
    }

    /**
     * Delete a transportation.
     */
    public function destroyTransportation(UmrahTransportation $transportation)
    {
        if (! $this->user()->canManageHomeContent()) {
            abort(403, 'You do not have permission to manage umrah content.');
        }

        if ($transportation->icon_path) {
            Storage::disk('public')->delete($transportation->icon_path);
        }

        $transportation->delete();

        return redirect()->route('umrah-content.transportations.index')
            ->with('success', 'Transportation deleted successfully.');
    }

    // ==================== ITINERARIES ====================

    /**
     * Display itineraries index page.
     */
    public function indexItineraries()
    {
        if (! $this->user()->canManageHomeContent()) {
            return Inertia::render('errors/403', [
                'message' => 'You do not have permission to manage umrah content.',
            ])->toResponse(request())->setStatusCode(403);
        }

        $itineraries = UmrahItinerary::ordered()->get();

        return Inertia::render('umrah-content/itineraries/index', [
            'itineraries' => $itineraries,
        ]);
    }

    /**
     * Show the form for creating a new itinerary point.
     */
    public function createItinerary()
    {
        if (! $this->user()->canManageHomeContent()) {
            return Inertia::render('errors/403', [
                'message' => 'You do not have permission to manage umrah content.',
            ])->toResponse(request())->setStatusCode(403);
        }

        return Inertia::render('umrah-content/itineraries/create');
    }

    /**
     * Store a new itinerary point.
     */
    public function storeItinerary(StoreUmrahItineraryRequest $request)
    {
        $validated = $request->validated();
        $validated['order'] = (UmrahItinerary::max('order') ?? -1) + 1;

        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('umrah/itineraries', 'public');
            $validated['image_path'] = $imagePath;
        }

        UmrahItinerary::create($validated);

        return redirect()->route('umrah-content.itineraries.index')
            ->with('success', 'Itinerary created successfully.');
    }

    /**
     * Show the form for editing an itinerary point.
     */
    public function editItinerary(UmrahItinerary $itinerary)
    {
        if (! $this->user()->canManageHomeContent()) {
            return Inertia::render('errors/403', [
                'message' => 'You do not have permission to manage umrah content.',
            ])->toResponse(request())->setStatusCode(403);
        }

        return Inertia::render('umrah-content/itineraries/edit', [
            'itinerary' => $itinerary,
        ]);
    }

    /**
     * Update an existing itinerary point.
     */
    public function updateItinerary(UpdateUmrahItineraryRequest $request, UmrahItinerary $itinerary)
    {
        $validated = $request->validated();

        if ($request->hasFile('image')) {
            if ($itinerary->image_path) {
                Storage::disk('public')->delete($itinerary->image_path);
            }

            $imagePath = $request->file('image')->store('umrah/itineraries', 'public');
            $validated['image_path'] = $imagePath;
        }

        $itinerary->update($validated);

        return redirect()->route('umrah-content.itineraries.index')
            ->with('success', 'Itinerary updated successfully.');
    }

    /**
     * Delete an itinerary point.
     */
    public function destroyItinerary(UmrahItinerary $itinerary)
    {
        if (! $this->user()->canManageHomeContent()) {
            abort(403, 'You do not have permission to manage umrah content.');
        }

        if ($itinerary->image_path) {
            Storage::disk('public')->delete($itinerary->image_path);
        }

        $itinerary->delete();

        return redirect()->route('umrah-content.itineraries.index')
            ->with('success', 'Itinerary deleted successfully.');
    }

    // ==================== ADDITIONAL SERVICES ====================

    /**
     * Display additional services index page.
     */
    public function indexAdditionalServices()
    {
        if (! $this->user()->canManageHomeContent()) {
            return Inertia::render('errors/403', [
                'message' => 'You do not have permission to manage umrah content.',
            ])->toResponse(request())->setStatusCode(403);
        }

        $additionalServices = UmrahAdditionalService::ordered()->get();

        return Inertia::render('umrah-content/additional-services/index', [
            'additionalServices' => $additionalServices,
        ]);
    }

    /**
     * Show the form for creating a new additional service.
     */
    public function createAdditionalService()
    {
        if (! $this->user()->canManageHomeContent()) {
            return Inertia::render('errors/403', [
                'message' => 'You do not have permission to manage umrah content.',
            ])->toResponse(request())->setStatusCode(403);
        }

        return Inertia::render('umrah-content/additional-services/create');
    }

    /**
     * Store a new additional service.
     */
    public function storeAdditionalService(StoreUmrahAdditionalServiceRequest $request)
    {
        $validated = $request->validated();
        $validated['order'] = (UmrahAdditionalService::max('order') ?? -1) + 1;

        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('umrah/additional-services', 'public');
            $validated['image_path'] = $imagePath;
        }

        UmrahAdditionalService::create($validated);

        return redirect()->route('umrah-content.additional-services.index')
            ->with('success', 'Additional service created successfully.');
    }

    /**
     * Show the form for editing an additional service.
     */
    public function editAdditionalService(UmrahAdditionalService $additionalService)
    {
        if (! $this->user()->canManageHomeContent()) {
            return Inertia::render('errors/403', [
                'message' => 'You do not have permission to manage umrah content.',
            ])->toResponse(request())->setStatusCode(403);
        }

        return Inertia::render('umrah-content/additional-services/edit', [
            'additionalService' => $additionalService,
        ]);
    }

    /**
     * Update an existing additional service.
     */
    public function updateAdditionalService(UpdateUmrahAdditionalServiceRequest $request, UmrahAdditionalService $additionalService)
    {
        $validated = $request->validated();

        if ($request->hasFile('image')) {
            if ($additionalService->image_path) {
                Storage::disk('public')->delete($additionalService->image_path);
            }

            $imagePath = $request->file('image')->store('umrah/additional-services', 'public');
            $validated['image_path'] = $imagePath;
        }

        $additionalService->update($validated);

        return redirect()->route('umrah-content.additional-services.index')
            ->with('success', 'Additional service updated successfully.');
    }

    /**
     * Delete an additional service.
     */
    public function destroyAdditionalService(UmrahAdditionalService $additionalService)
    {
        if (! $this->user()->canManageHomeContent()) {
            abort(403, 'You do not have permission to manage umrah content.');
        }

        if ($additionalService->image_path) {
            Storage::disk('public')->delete($additionalService->image_path);
        }

        $additionalService->delete();

        return redirect()->route('umrah-content.additional-services.index')
            ->with('success', 'Additional service deleted successfully.');
    }

    // ==================== PACKAGES ====================

    /**
     * Display packages index page.
     */
    public function indexPackages()
    {
        if (! $this->user()->canManageHomeContent()) {
            return Inertia::render('errors/403', [
                'message' => 'You do not have permission to manage umrah content.',
            ])->toResponse(request())->setStatusCode(403);
        }

        $packages = UmrahPackage::with(['hotels', 'airlines'])->ordered()->get();

        return Inertia::render('umrah-content/packages/index', [
            'packages' => $packages,
        ]);
    }

    /**
     * Show the form for creating a new package.
     */
    public function createPackage()
    {
        if (! $this->user()->canManageHomeContent()) {
            return Inertia::render('errors/403', [
                'message' => 'You do not have permission to manage umrah content.',
            ])->toResponse(request())->setStatusCode(403);
        }

        $hotels = UmrahHotel::active()->orderBy('name')->get();
        $airlines = UmrahAirline::active()->orderBy('name')->get();
        $transportations = UmrahTransportation::active()->ordered()->get();
        $itineraries = UmrahItinerary::active()->ordered()->get();
        $additionalServices = UmrahAdditionalService::active()->ordered()->get();

        return Inertia::render('umrah-content/packages/create', [
            'hotels' => $hotels,
            'airlines' => $airlines,
            'transportations' => $transportations,
            'itineraries' => $itineraries,
            'additionalServices' => $additionalServices,
        ]);
    }

    /**
     * Store a new package.
     */
    public function storePackage(StoreUmrahPackageRequest $request)
    {
        $validated = $request->validated();

        $hotelIds = $validated['hotel_ids'] ?? [];
        $airlineIds = $validated['airline_ids'] ?? [];
        $transportationIds = $validated['transportation_ids'] ?? [];
        $itineraryIds = $validated['itinerary_ids'] ?? [];
        $additionalServiceIds = $validated['additional_service_ids'] ?? [];
        $packageServices = $validated['package_services'] ?? [];
        $galleryImages = $request->file('gallery_images', []);

        unset(
            $validated['image'],
            $validated['gallery_images'],
            $validated['hotel_ids'],
            $validated['airline_ids'],
            $validated['transportation_ids'],
            $validated['itinerary_ids'],
            $validated['additional_service_ids'],
            $validated['package_services']
        );

        // Auto-assign order as the last item
        $validated['order'] = (UmrahPackage::max('order') ?? -1) + 1;

        // Handle image upload
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('umrah/packages', 'public');
            $validated['image_path'] = $imagePath;
        }

        $package = UmrahPackage::create($validated);
        $this->storeGalleryImages($package, is_array($galleryImages) ? $galleryImages : []);

        // Attach hotels with order
        if (is_array($hotelIds)) {
            $hotelData = [];
            foreach ($hotelIds as $index => $hotelId) {
                $hotelData[$hotelId] = ['order' => $index];
            }
            $package->hotels()->attach($hotelData);
        }

        // Attach airlines
        if (is_array($airlineIds)) {
            $package->airlines()->attach($airlineIds);
        }

        // Attach transportations with order
        if (is_array($transportationIds)) {
            $transportationData = [];
            foreach ($transportationIds as $index => $transportationId) {
                $transportationData[$transportationId] = ['order' => $index];
            }
            $package->transportations()->attach($transportationData);
        }

        // Attach itineraries with order
        if (is_array($itineraryIds)) {
            $itineraryData = [];
            foreach ($itineraryIds as $index => $itineraryId) {
                $itineraryData[$itineraryId] = ['order' => $index];
            }
            $package->itineraries()->attach($itineraryData);
        }

        // Attach additional services with order
        if (is_array($additionalServiceIds)) {
            $additionalServiceData = [];
            foreach ($additionalServiceIds as $index => $serviceId) {
                $additionalServiceData[$serviceId] = ['order' => $index];
            }
            $package->additionalServices()->attach($additionalServiceData);
        }

        // Save package services
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

        return redirect()->route('umrah-content.packages.index')
            ->with('success', 'Package created successfully.');
    }

    /**
     * Show the form for editing a package.
     */
    public function editPackage(UmrahPackage $package)
    {
        if (! $this->user()->canManageHomeContent()) {
            return Inertia::render('errors/403', [
                'message' => 'You do not have permission to manage umrah content.',
            ])->toResponse(request())->setStatusCode(403);
        }

        $package->load(['hotels', 'airlines', 'transportations', 'itineraries', 'additionalServices', 'services', 'images']);

        $hotels = UmrahHotel::active()->orderBy('name')->get();
        $airlines = UmrahAirline::active()->orderBy('name')->get();
        $transportations = UmrahTransportation::active()->ordered()->get();
        $itineraries = UmrahItinerary::active()->ordered()->get();
        $additionalServices = UmrahAdditionalService::active()->ordered()->get();

        return Inertia::render('umrah-content/packages/edit', [
            'package' => $package,
            'hotels' => $hotels,
            'airlines' => $airlines,
            'transportations' => $transportations,
            'itineraries' => $itineraries,
            'additionalServices' => $additionalServices,
        ]);
    }

    /**
     * Update an existing package.
     */
    public function updatePackage(UpdateUmrahPackageRequest $request, UmrahPackage $package)
    {
        $validated = $request->validated();

        $hotelIds = $validated['hotel_ids'] ?? [];
        $airlineIds = $validated['airline_ids'] ?? [];
        $transportationIds = $validated['transportation_ids'] ?? [];
        $itineraryIds = $validated['itinerary_ids'] ?? [];
        $additionalServiceIds = $validated['additional_service_ids'] ?? [];
        $packageServices = $validated['package_services'] ?? [];
        $existingGalleryImageIds = $validated['existing_gallery_image_ids'] ?? [];
        $galleryImages = $request->file('gallery_images', []);

        unset(
            $validated['image'],
            $validated['gallery_images'],
            $validated['existing_gallery_image_ids'],
            $validated['hotel_ids'],
            $validated['airline_ids'],
            $validated['transportation_ids'],
            $validated['itinerary_ids'],
            $validated['additional_service_ids'],
            $validated['package_services']
        );

        // Handle image upload if new image provided
        if ($request->hasFile('image')) {
            // Delete old image
            if ($package->image_path) {
                Storage::disk('public')->delete($package->image_path);
            }

            $imagePath = $request->file('image')->store('umrah/packages', 'public');
            $validated['image_path'] = $imagePath;
        }

        $package->update($validated);

        // Sync hotels with order
        $hotelData = [];
        foreach ($hotelIds as $index => $hotelId) {
            $hotelData[$hotelId] = ['order' => $index];
        }
        $package->hotels()->sync($hotelData);

        // Sync airlines
        $package->airlines()->sync($airlineIds);

        // Sync transportations with order
        $transportationData = [];
        foreach ($transportationIds as $index => $transportationId) {
            $transportationData[$transportationId] = ['order' => $index];
        }
        $package->transportations()->sync($transportationData);

        // Sync itineraries with order
        $itineraryData = [];
        foreach ($itineraryIds as $index => $itineraryId) {
            $itineraryData[$itineraryId] = ['order' => $index];
        }
        $package->itineraries()->sync($itineraryData);

        // Sync additional services with order
        $additionalServiceData = [];
        foreach ($additionalServiceIds as $index => $serviceId) {
            $additionalServiceData[$serviceId] = ['order' => $index];
        }
        $package->additionalServices()->sync($additionalServiceData);

        // Replace package services
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

        $this->syncGalleryImages(
            $package,
            is_array($existingGalleryImageIds) ? $existingGalleryImageIds : [],
            is_array($galleryImages) ? $galleryImages : [],
        );

        return redirect()->route('umrah-content.packages.index')
            ->with('success', 'Package updated successfully.');
    }

    /**
     * Delete a package.
     */
    public function destroyPackage(UmrahPackage $package)
    {
        if (! $this->user()->canManageHomeContent()) {
            abort(403, 'You do not have permission to manage umrah content.');
        }

        // Delete image from storage
        if ($package->image_path) {
            Storage::disk('public')->delete($package->image_path);
        }

        foreach ($package->images as $image) {
            Storage::disk('public')->delete($image->image_path);
        }

        // Relationships will be automatically deleted due to cascade
        $package->delete();

        return redirect()->route('umrah-content.packages.index')
            ->with('success', 'Package deleted successfully.');
    }

    /**
     * Update the order of packages.
     */
    public function updatePackagesOrder(Request $request)
    {
        if (! $this->user()->canManageHomeContent()) {
            abort(403, 'You do not have permission to manage umrah content.');
        }

        $validated = $request->validate([
            'items' => ['required', 'array'],
            'items.*.id' => ['required', 'exists:umrah_packages,id'],
            'items.*.order' => ['required', 'integer', 'min:0'],
        ]);

        foreach ($validated['items'] as $item) {
            UmrahPackage::where('id', $item['id'])->update(['order' => $item['order']]);
        }

        return back();
    }

    /**
     * Store detail gallery images for a package.
     *
     * @param  array<int, UploadedFile>  $galleryImages
     */
    protected function storeGalleryImages(UmrahPackage $package, array $galleryImages): void
    {
        foreach ($galleryImages as $index => $galleryImage) {
            $imagePath = $galleryImage->store('umrah/packages/gallery', 'public');

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
    protected function syncGalleryImages(UmrahPackage $package, array $existingGalleryImageIds, array $newGalleryImages): void
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
            $imagePath = $galleryImage->store('umrah/packages/gallery', 'public');

            $package->images()->create([
                'image_path' => $imagePath,
                'order' => $nextOrder,
            ]);

            $nextOrder++;
        }
    }
}
