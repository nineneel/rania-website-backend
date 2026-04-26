<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

/**
 * When a multipart request exceeds PHP's `post_max_size`, PHP discards both
 * `$_POST` and `$_FILES` and continues with an empty request body. This
 * normally surfaces as a confusing batch of validation errors (or, on
 * optional-image flows, as a silent persistence with no image_path written).
 *
 * This middleware detects that condition early and returns a 413 with a
 * useful message so the user knows the upload was too large.
 */
class EnforcePostMaxSize
{
    public function handle(Request $request, Closure $next): Response
    {
        if (! $request->isMethod('POST')) {
            return $next($request);
        }

        $contentLength = (int) $request->server('CONTENT_LENGTH', 0);
        $postMaxBytes = $this->parseShorthandBytes((string) ini_get('post_max_size'));

        if ($postMaxBytes > 0 && $contentLength > $postMaxBytes && empty($_POST) && empty($_FILES)) {
            Log::warning('Request rejected: exceeded post_max_size', [
                'content_length' => $contentLength,
                'post_max_size' => $postMaxBytes,
                'path' => $request->path(),
            ]);

            $message = sprintf(
                'The uploaded data is too large. Maximum allowed is %s.',
                ini_get('post_max_size'),
            );

            if ($request->header('X-Inertia') || $request->expectsJson()) {
                return response()->json([
                    'message' => $message,
                    'errors' => ['image' => [$message]],
                ], 413);
            }

            return back()
                ->withErrors(['image' => $message])
                ->withInput();
        }

        return $next($request);
    }

    /**
     * Convert php.ini shorthand values like "100M" or "1G" to bytes.
     */
    protected function parseShorthandBytes(string $value): int
    {
        $value = trim($value);

        if ($value === '') {
            return 0;
        }

        $suffix = strtolower(substr($value, -1));
        $number = (int) $value;

        return match ($suffix) {
            'g' => $number * 1024 * 1024 * 1024,
            'm' => $number * 1024 * 1024,
            'k' => $number * 1024,
            default => (int) $value,
        };
    }
}
