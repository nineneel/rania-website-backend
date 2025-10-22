<?php

namespace App\Http\Controllers;

use App\Models\UmrahAirline;
use App\Models\UmrahHotel;
use App\Models\UmrahPackage;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class UmrahContentController extends Controller
{
    /**
     * Get the authenticated user.
     *
     * @return User
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
        if (!$this->user()->canManageHomeContent()) {
            return Inertia::render('errors/403', [
                'message' => 'You do not have permission to manage umrah content.',
            ])->toResponse(request())->setStatusCode(403);
        }

        $packages = UmrahPackage::with(['hotels', 'airlines'])->ordered()->get();

        return Inertia::render('umrah-content/packages/index', [
            'packages' => $packages,
            'showNavigation' => true, // Flag to show Hotels and Airlines buttons
        ]);
    }

    // ==================== AIRLINES ====================

    /**
     * Display airlines index page.
     */
    public function indexAirlines()
    {
        if (!$this->user()->canManageHomeContent()) {
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
        if (!$this->user()->canManageHomeContent()) {
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
        if (!$this->user()->canManageHomeContent()) {
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
        if (!$this->user()->canManageHomeContent()) {
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
        if (!$this->user()->canManageHomeContent()) {
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
        if (!$this->user()->canManageHomeContent()) {
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
        if (!$this->user()->canManageHomeContent()) {
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
        if (!$this->user()->canManageHomeContent()) {
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
        if (!$this->user()->canManageHomeContent()) {
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
        if (!$this->user()->canManageHomeContent()) {
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
        if (!$this->user()->canManageHomeContent()) {
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
        if (!$this->user()->canManageHomeContent()) {
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

    // ==================== PACKAGES ====================

    /**
     * Display packages index page.
     */
    public function indexPackages()
    {
        if (!$this->user()->canManageHomeContent()) {
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
        if (!$this->user()->canManageHomeContent()) {
            return Inertia::render('errors/403', [
                'message' => 'You do not have permission to manage umrah content.',
            ])->toResponse(request())->setStatusCode(403);
        }

        $hotels = UmrahHotel::active()->orderBy('name')->get();
        $airlines = UmrahAirline::active()->orderBy('name')->get();

        return Inertia::render('umrah-content/packages/create', [
            'hotels' => $hotels,
            'airlines' => $airlines,
        ]);
    }

    /**
     * Store a new package.
     */
    public function storePackage(Request $request)
    {
        if (!$this->user()->canManageHomeContent()) {
            abort(403, 'You do not have permission to manage umrah content.');
        }

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string', 'max:500'],
            'image' => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
            'departure' => ['required', 'string', 'max:255'],
            'duration' => ['required', 'string', 'max:50'],
            'frequency' => ['required', 'string', 'max:50'],
            'price' => ['required', 'numeric', 'min:0'],
            'currency' => ['required', 'string', 'max:10'],
            'is_active' => ['boolean'],
            'hotel_ids' => ['nullable', 'array'],
            'hotel_ids.*' => ['exists:umrah_hotels,id'],
            'airline_ids' => ['nullable', 'array'],
            'airline_ids.*' => ['exists:umrah_airlines,id'],
        ]);

        // Auto-assign order as the last item
        $validated['order'] = (UmrahPackage::max('order') ?? -1) + 1;

        // Handle image upload
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('umrah/packages', 'public');
            $validated['image_path'] = $imagePath;
        }

        $package = UmrahPackage::create($validated);

        // Attach hotels with order
        if ($request->has('hotel_ids') && is_array($request->hotel_ids)) {
            $hotelData = [];
            foreach ($request->hotel_ids as $index => $hotelId) {
                $hotelData[$hotelId] = ['order' => $index];
            }
            $package->hotels()->attach($hotelData);
        }

        // Attach airlines
        if ($request->has('airline_ids') && is_array($request->airline_ids)) {
            $package->airlines()->attach($request->airline_ids);
        }

        return redirect()->route('umrah-content.packages.index')
            ->with('success', 'Package created successfully.');
    }

    /**
     * Show the form for editing a package.
     */
    public function editPackage(UmrahPackage $package)
    {
        if (!$this->user()->canManageHomeContent()) {
            return Inertia::render('errors/403', [
                'message' => 'You do not have permission to manage umrah content.',
            ])->toResponse(request())->setStatusCode(403);
        }

        $package->load(['hotels', 'airlines']);
        $hotels = UmrahHotel::active()->orderBy('name')->get();
        $airlines = UmrahAirline::active()->orderBy('name')->get();

        return Inertia::render('umrah-content/packages/edit', [
            'package' => $package,
            'hotels' => $hotels,
            'airlines' => $airlines,
        ]);
    }

    /**
     * Update an existing package.
     */
    public function updatePackage(Request $request, UmrahPackage $package)
    {
        if (!$this->user()->canManageHomeContent()) {
            abort(403, 'You do not have permission to manage umrah content.');
        }

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string', 'max:500'],
            'image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
            'departure' => ['required', 'string', 'max:255'],
            'duration' => ['required', 'string', 'max:50'],
            'frequency' => ['required', 'string', 'max:50'],
            'price' => ['required', 'numeric', 'min:0'],
            'currency' => ['required', 'string', 'max:10'],
            'is_active' => ['boolean'],
            'hotel_ids' => ['nullable', 'array'],
            'hotel_ids.*' => ['exists:umrah_hotels,id'],
            'airline_ids' => ['nullable', 'array'],
            'airline_ids.*' => ['exists:umrah_airlines,id'],
        ]);

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
        if ($request->has('hotel_ids')) {
            $hotelData = [];
            foreach ($request->hotel_ids as $index => $hotelId) {
                $hotelData[$hotelId] = ['order' => $index];
            }
            $package->hotels()->sync($hotelData);
        } else {
            $package->hotels()->sync([]);
        }

        // Sync airlines
        if ($request->has('airline_ids')) {
            $package->airlines()->sync($request->airline_ids);
        } else {
            $package->airlines()->sync([]);
        }

        return redirect()->route('umrah-content.packages.index')
            ->with('success', 'Package updated successfully.');
    }

    /**
     * Delete a package.
     */
    public function destroyPackage(UmrahPackage $package)
    {
        if (!$this->user()->canManageHomeContent()) {
            abort(403, 'You do not have permission to manage umrah content.');
        }

        // Delete image from storage
        if ($package->image_path) {
            Storage::disk('public')->delete($package->image_path);
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
        if (!$this->user()->canManageHomeContent()) {
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
}
