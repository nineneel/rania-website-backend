<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserHasRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @param  string  ...$roles  The allowed roles for this route
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        if (!$request->user()) {
            abort(401, 'Unauthenticated.');
        }

        $userRole = $request->user()->role;

        if (!in_array($userRole, $roles)) {
            abort(403, 'Unauthorized access. Insufficient permissions.');
        }

        return $next($request);
    }
}
