<?php

namespace App\Http\Controllers;

use App\Services\GoogleAnalyticsService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AnalyticsController extends Controller
{
    public function __construct(private GoogleAnalyticsService $analyticsService) {}

    /**
     * Display the analytics dashboard.
     */
    public function index(Request $request): Response
    {
        $period = $request->get('period', '30d');

        if (! in_array($period, ['7d', '30d', '90d'])) {
            $period = '30d';
        }

        $analytics = $this->analyticsService->getDashboardData($period);

        return Inertia::render('analytics/index', [
            'analytics' => $analytics,
        ]);
    }
}
