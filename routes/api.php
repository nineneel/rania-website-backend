<?php

use App\Http\Controllers\Api\ContactApiController;
use App\Http\Controllers\Api\FAQApiController;
use App\Http\Controllers\Api\HajjPackageApiController;
use App\Http\Controllers\Api\HomeContentApiController;
use App\Http\Controllers\Api\LinktreeApiController;
use App\Http\Controllers\Api\NewsArticleApiController;
use App\Http\Controllers\Api\RaniaGalleryApiController;
use App\Http\Controllers\Api\SocialMediaApiController;
use App\Http\Controllers\Api\TestimonialApiController;
use App\Http\Controllers\Api\UmrahPackageApiController;
use App\Http\Controllers\NewsletterController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Public API routes for the main Rania website to consume home content.
| These routes are prefixed with /api and do not require authentication.
|
*/

Route::get('/hero-slides', [HomeContentApiController::class, 'getHeroSlides']);
Route::get('/events', [HomeContentApiController::class, 'getEvents']);
Route::get('/social-media', [SocialMediaApiController::class, 'index']);
Route::get('/faqs', [FAQApiController::class, 'index']);
Route::get('/testimonials', [TestimonialApiController::class, 'index']);
Route::get('/rania-galleries', [RaniaGalleryApiController::class, 'index']);
Route::get('/news-articles', [NewsArticleApiController::class, 'index']);
Route::get('/umrah-categories', [UmrahPackageApiController::class, 'categories']);
Route::get('/umrah-packages', [UmrahPackageApiController::class, 'index']);
Route::get('/umrah-packages/{slug}', [UmrahPackageApiController::class, 'show']);
Route::get('/umrah-packages/{slug}/other-additional-services', [UmrahPackageApiController::class, 'otherAdditionalServices']);
Route::get('/hajj-packages', [HajjPackageApiController::class, 'index']);
Route::get('/hajj-packages/{slug}', [HajjPackageApiController::class, 'show']);
Route::get('/hajj-packages/{slug}/other-additional-services', [HajjPackageApiController::class, 'otherAdditionalServices']);
Route::post('/contact', [ContactApiController::class, 'store']);
Route::post('/newsletter/subscribe', [NewsletterController::class, 'subscribe']);

// Linktree (public)
Route::get('/linktree', [LinktreeApiController::class, 'show']);
Route::post('/linktree/links/{id}/click', [LinktreeApiController::class, 'trackClick'])
    ->whereNumber('id')
    ->middleware('throttle:60,1');
