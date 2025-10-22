<?php

use App\Http\Controllers\Api\ContactApiController;
use App\Http\Controllers\Api\FAQApiController;
use App\Http\Controllers\Api\HomeContentApiController;
use App\Http\Controllers\Api\SocialMediaApiController;
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
Route::post('/contact', [ContactApiController::class, 'store']);
