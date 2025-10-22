<?php

use App\Http\Controllers\HomeContentController;
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
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // User Management Routes - Only accessible by super-admin and admin
    Route::resource('users', UserManagementController::class)
        ->except(['show']);

    // Home Content Management Routes - Only accessible by super-admin and admin
    Route::prefix('home-content')->name('home-content.')->group(function () {
        Route::get('/', [HomeContentController::class, 'index'])->name('index');

        // Hero Slides
        Route::get('/hero-slides', [HomeContentController::class, 'indexHeroSlides'])->name('hero-slides.index');
        Route::get('/hero-slides/create', [HomeContentController::class, 'createHeroSlide'])->name('hero-slides.create');
        Route::post('/hero-slides', [HomeContentController::class, 'storeHeroSlide'])->name('hero-slides.store');
        Route::get('/hero-slides/{heroSlide}/edit', [HomeContentController::class, 'editHeroSlide'])->name('hero-slides.edit');
        Route::put('/hero-slides/{heroSlide}', [HomeContentController::class, 'updateHeroSlide'])->name('hero-slides.update');
        Route::delete('/hero-slides/{heroSlide}', [HomeContentController::class, 'destroyHeroSlide'])->name('hero-slides.destroy');
        Route::post('/hero-slides/reorder', [HomeContentController::class, 'updateHeroSlidesOrder'])->name('hero-slides.reorder');

        // Events
        Route::get('/events', [HomeContentController::class, 'indexEvents'])->name('events.index');
        Route::get('/events/create', [HomeContentController::class, 'createEvent'])->name('events.create');
        Route::post('/events', [HomeContentController::class, 'storeEvent'])->name('events.store');
        Route::get('/events/{event}/edit', [HomeContentController::class, 'editEvent'])->name('events.edit');
        Route::put('/events/{event}', [HomeContentController::class, 'updateEvent'])->name('events.update');
        Route::delete('/events/{event}', [HomeContentController::class, 'destroyEvent'])->name('events.destroy');
        Route::post('/events/reorder', [HomeContentController::class, 'updateEventsOrder'])->name('events.reorder');
    });
});

require __DIR__.'/settings.php';
