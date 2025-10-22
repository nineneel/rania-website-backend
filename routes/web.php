<?php

use App\Http\Controllers\ContactMessageController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\FAQController;
use App\Http\Controllers\HomeContentController;
use App\Http\Controllers\SocialMediaController;
use App\Http\Controllers\TestimonialController;
use App\Http\Controllers\UmrahContentController;
use App\Http\Controllers\UserManagementController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    if (Auth::check()) {
        return redirect()->route('dashboard');
    }
    return redirect()->route('login');
})->name('home');

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // User Management Routes - Only accessible by super-admin and admin
    Route::resource('users', UserManagementController::class)
        ->except(['show']);

    // Home Content Management Routes - Only accessible by super-admin and admin
    Route::prefix('home-content')->name('home-content.')->group(function () {
        // Main index with tabs
        Route::get('/', [HomeContentController::class, 'index'])->name('index');

        // Hero Slides - redirect to main index with hero-slides tab
        Route::get('/hero-slides', function () {
            return redirect()->route('home-content.index');
        })->name('hero-slides.index');
        Route::get('/hero-slides/create', [HomeContentController::class, 'createHeroSlide'])->name('hero-slides.create');
        Route::post('/hero-slides', [HomeContentController::class, 'storeHeroSlide'])->name('hero-slides.store');
        Route::get('/hero-slides/{heroSlide}/edit', [HomeContentController::class, 'editHeroSlide'])->name('hero-slides.edit');
        Route::put('/hero-slides/{heroSlide}', [HomeContentController::class, 'updateHeroSlide'])->name('hero-slides.update');
        Route::delete('/hero-slides/{heroSlide}', [HomeContentController::class, 'destroyHeroSlide'])->name('hero-slides.destroy');
        Route::post('/hero-slides/reorder', [HomeContentController::class, 'updateHeroSlidesOrder'])->name('hero-slides.reorder');

        // Events - redirect to main index with events tab
        Route::get('/events', function () {
            return redirect()->route('home-content.index');
        })->name('events.index');
        Route::get('/events/create', [HomeContentController::class, 'createEvent'])->name('events.create');
        Route::post('/events', [HomeContentController::class, 'storeEvent'])->name('events.store');
        Route::get('/events/{event}/edit', [HomeContentController::class, 'editEvent'])->name('events.edit');
        Route::put('/events/{event}', [HomeContentController::class, 'updateEvent'])->name('events.update');
        Route::delete('/events/{event}', [HomeContentController::class, 'destroyEvent'])->name('events.destroy');
        Route::post('/events/reorder', [HomeContentController::class, 'updateEventsOrder'])->name('events.reorder');
    });

    // Umrah Content Management Routes - Only accessible by super-admin and admin
    Route::prefix('umrah-content')->name('umrah-content.')->group(function () {
        // Main index now shows packages list
        Route::get('/', [UmrahContentController::class, 'index'])->name('index');

        // Airlines
        Route::get('/airlines', [UmrahContentController::class, 'indexAirlines'])->name('airlines.index');
        Route::get('/airlines/create', [UmrahContentController::class, 'createAirline'])->name('airlines.create');
        Route::post('/airlines', [UmrahContentController::class, 'storeAirline'])->name('airlines.store');
        Route::get('/airlines/{airline}/edit', [UmrahContentController::class, 'editAirline'])->name('airlines.edit');
        Route::put('/airlines/{airline}', [UmrahContentController::class, 'updateAirline'])->name('airlines.update');
        Route::delete('/airlines/{airline}', [UmrahContentController::class, 'destroyAirline'])->name('airlines.destroy');

        // Hotels
        Route::get('/hotels', [UmrahContentController::class, 'indexHotels'])->name('hotels.index');
        Route::get('/hotels/create', [UmrahContentController::class, 'createHotel'])->name('hotels.create');
        Route::post('/hotels', [UmrahContentController::class, 'storeHotel'])->name('hotels.store');
        Route::get('/hotels/{hotel}/edit', [UmrahContentController::class, 'editHotel'])->name('hotels.edit');
        Route::put('/hotels/{hotel}', [UmrahContentController::class, 'updateHotel'])->name('hotels.update');
        Route::delete('/hotels/{hotel}', [UmrahContentController::class, 'destroyHotel'])->name('hotels.destroy');

        // Packages - redirect to main index for backward compatibility
        Route::get('/packages', function () {
            return redirect()->route('umrah-content.index');
        })->name('packages.index');
        Route::get('/packages/create', [UmrahContentController::class, 'createPackage'])->name('packages.create');
        Route::post('/packages', [UmrahContentController::class, 'storePackage'])->name('packages.store');
        Route::get('/packages/{package}/edit', [UmrahContentController::class, 'editPackage'])->name('packages.edit');
        Route::put('/packages/{package}', [UmrahContentController::class, 'updatePackage'])->name('packages.update');
        Route::delete('/packages/{package}', [UmrahContentController::class, 'destroyPackage'])->name('packages.destroy');
        Route::post('/packages/reorder', [UmrahContentController::class, 'updatePackagesOrder'])->name('packages.reorder');
    });

    // Contact Messages Routes - Accessible by all authenticated users
    Route::prefix('contact-messages')->name('contact-messages.')->group(function () {
        Route::get('/', [ContactMessageController::class, 'index'])->name('index');
        Route::get('/{contactMessage}', [ContactMessageController::class, 'show'])->name('show');
        Route::patch('/{contactMessage}/status', [ContactMessageController::class, 'updateStatus'])->name('update-status');
        Route::delete('/{contactMessage}', [ContactMessageController::class, 'destroy'])->name('destroy');
    });

    // Social Media Routes - Only accessible by super-admin and admin
    Route::prefix('social-media')->name('social-media.')->group(function () {
        Route::get('/', [SocialMediaController::class, 'index'])->name('index');
        Route::get('/create', [SocialMediaController::class, 'create'])->name('create');
        Route::post('/', [SocialMediaController::class, 'store'])->name('store');
        Route::get('/{socialMedia}/edit', [SocialMediaController::class, 'edit'])->name('edit');
        Route::put('/{socialMedia}', [SocialMediaController::class, 'update'])->name('update');
        Route::delete('/{socialMedia}', [SocialMediaController::class, 'destroy'])->name('destroy');
        Route::post('/reorder', [SocialMediaController::class, 'updateOrder'])->name('reorder');
    });

    // Testimonial Routes - Only accessible by super-admin and admin
    Route::prefix('testimonials')->name('testimonials.')->group(function () {
        Route::get('/', [TestimonialController::class, 'index'])->name('index');
        Route::get('/create', [TestimonialController::class, 'create'])->name('create');
        Route::post('/', [TestimonialController::class, 'store'])->name('store');
        Route::get('/{testimonial}/edit', [TestimonialController::class, 'edit'])->name('edit');
        Route::put('/{testimonial}', [TestimonialController::class, 'update'])->name('update');
        Route::delete('/{testimonial}', [TestimonialController::class, 'destroy'])->name('destroy');
        Route::post('/reorder', [TestimonialController::class, 'updateOrder'])->name('reorder');
    });

    // FAQ Routes - Only accessible by super-admin and admin
    Route::prefix('faqs')->name('faqs.')->group(function () {
        Route::get('/', [FAQController::class, 'index'])->name('index');
        Route::get('/create', [FAQController::class, 'create'])->name('create');
        Route::post('/', [FAQController::class, 'store'])->name('store');
        Route::get('/{faq}/edit', [FAQController::class, 'edit'])->name('edit');
        Route::put('/{faq}', [FAQController::class, 'update'])->name('update');
        Route::delete('/{faq}', [FAQController::class, 'destroy'])->name('destroy');
        Route::post('/reorder', [FAQController::class, 'updateOrder'])->name('reorder');
    });
});

require __DIR__.'/settings.php';
