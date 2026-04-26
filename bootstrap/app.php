<?php

use App\Exceptions\FileUploadFailedException;
use App\Http\Middleware\EnforcePostMaxSize;
use App\Http\Middleware\EnsureUserHasRole;
use App\Http\Middleware\HandleAppearance;
use App\Http\Middleware\HandleInertiaRequests;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;
use Illuminate\Http\Request;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->encryptCookies(except: ['appearance', 'sidebar_state']);

        $middleware->web(prepend: [
            EnforcePostMaxSize::class,
        ], append: [
            HandleAppearance::class,
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);

        $middleware->alias([
            'role' => EnsureUserHasRole::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        $exceptions->render(function (FileUploadFailedException $e, Request $request) {
            $message = 'Failed to save the uploaded file. Please try again.';

            if ($request->header('X-Inertia') || $request->expectsJson()) {
                return response()->json([
                    'message' => $message,
                    'errors' => ['image' => [$message]],
                ], 422);
            }

            return back()
                ->withErrors(['image' => $message])
                ->withInput();
        });
    })->create();
