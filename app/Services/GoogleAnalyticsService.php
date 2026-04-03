<?php

namespace App\Services;

use Google\Analytics\Data\V1beta\BetaAnalyticsDataClient;
use Google\Analytics\Data\V1beta\DateRange;
use Google\Analytics\Data\V1beta\Dimension;
use Google\Analytics\Data\V1beta\Metric;
use Google\Analytics\Data\V1beta\OrderBy;
use Google\Analytics\Data\V1beta\OrderBy\MetricOrderBy;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Cache;

class GoogleAnalyticsService
{
    private ?BetaAnalyticsDataClient $client = null;

    private string $propertyId;

    private int $cacheMinutes;

    public function __construct()
    {
        $this->propertyId = config('analytics.property_id');
        $this->cacheMinutes = config('analytics.cache_minutes', 30);
    }

    /**
     * Check if Google Analytics is properly configured.
     */
    public function isConfigured(): bool
    {
        return ! empty($this->propertyId)
            && file_exists(config('analytics.credentials_path'));
    }

    /**
     * Get all analytics data for the dashboard.
     *
     * @param  string  $period  '7d', '30d', or '90d'
     */
    public function getDashboardData(string $period = '30d'): array
    {
        if (! $this->isConfigured()) {
            return $this->getPlaceholderData($period);
        }

        $cacheKey = "analytics_dashboard_{$period}";

        if ($this->cacheMinutes > 0) {
            return Cache::remember($cacheKey, now()->addMinutes($this->cacheMinutes), function () use ($period) {
                return $this->fetchDashboardData($period);
            });
        }

        return $this->fetchDashboardData($period);
    }

    private function getClient(): BetaAnalyticsDataClient
    {
        if (! $this->client) {
            $this->client = new BetaAnalyticsDataClient([
                'credentials' => config('analytics.credentials_path'),
            ]);
        }

        return $this->client;
    }

    private function getDateRange(string $period): array
    {
        $days = match ($period) {
            '7d' => 7,
            '90d' => 90,
            default => 30,
        };

        return [
            'start' => Carbon::now()->subDays($days)->format('Y-m-d'),
            'end' => Carbon::now()->format('Y-m-d'),
            'days' => $days,
        ];
    }

    private function fetchDashboardData(string $period): array
    {
        $dateRange = $this->getDateRange($period);
        $property = "properties/{$this->propertyId}";

        return [
            'overview' => $this->fetchOverview($property, $dateRange),
            'visitorsChart' => $this->fetchVisitorsChart($property, $dateRange),
            'topPages' => $this->fetchTopPages($property, $dateRange),
            'trafficSources' => $this->fetchTrafficSources($property, $dateRange),
            'devices' => $this->fetchDevices($property, $dateRange),
            'countries' => $this->fetchCountries($property, $dateRange),
            'isConfigured' => true,
            'period' => $period,
        ];
    }

    private function fetchOverview(string $property, array $dateRange): array
    {
        $response = $this->getClient()->runReport([
            'property' => $property,
            'dateRanges' => [
                new DateRange(['start_date' => $dateRange['start'], 'end_date' => $dateRange['end']]),
            ],
            'metrics' => [
                new Metric(['name' => 'totalUsers']),
                new Metric(['name' => 'screenPageViews']),
                new Metric(['name' => 'sessions']),
                new Metric(['name' => 'bounceRate']),
                new Metric(['name' => 'averageSessionDuration']),
                new Metric(['name' => 'newUsers']),
            ],
        ]);

        $row = $response->getRows()[0] ?? null;

        return [
            'totalUsers' => $row ? (int) $row->getMetricValues()[0]->getValue() : 0,
            'pageViews' => $row ? (int) $row->getMetricValues()[1]->getValue() : 0,
            'sessions' => $row ? (int) $row->getMetricValues()[2]->getValue() : 0,
            'bounceRate' => $row ? round((float) $row->getMetricValues()[3]->getValue() * 100, 1) : 0,
            'avgSessionDuration' => $row ? round((float) $row->getMetricValues()[4]->getValue()) : 0,
            'newUsers' => $row ? (int) $row->getMetricValues()[5]->getValue() : 0,
        ];
    }

    private function fetchVisitorsChart(string $property, array $dateRange): array
    {
        $response = $this->getClient()->runReport([
            'property' => $property,
            'dateRanges' => [
                new DateRange(['start_date' => $dateRange['start'], 'end_date' => $dateRange['end']]),
            ],
            'dimensions' => [
                new Dimension(['name' => 'date']),
            ],
            'metrics' => [
                new Metric(['name' => 'totalUsers']),
                new Metric(['name' => 'screenPageViews']),
            ],
            'orderBys' => [
                new OrderBy(['dimension' => new OrderBy\DimensionOrderBy(['dimension_name' => 'date'])]),
            ],
        ]);

        $data = [];
        foreach ($response->getRows() as $row) {
            $date = $row->getDimensionValues()[0]->getValue();
            $data[] = [
                'date' => Carbon::createFromFormat('Ymd', $date)->format('M d'),
                'visitors' => (int) $row->getMetricValues()[0]->getValue(),
                'pageViews' => (int) $row->getMetricValues()[1]->getValue(),
            ];
        }

        return $data;
    }

    private function fetchTopPages(string $property, array $dateRange): array
    {
        $response = $this->getClient()->runReport([
            'property' => $property,
            'dateRanges' => [
                new DateRange(['start_date' => $dateRange['start'], 'end_date' => $dateRange['end']]),
            ],
            'dimensions' => [
                new Dimension(['name' => 'pagePath']),
                new Dimension(['name' => 'pageTitle']),
            ],
            'metrics' => [
                new Metric(['name' => 'screenPageViews']),
                new Metric(['name' => 'totalUsers']),
                new Metric(['name' => 'averageSessionDuration']),
            ],
            'orderBys' => [
                new OrderBy(['metric' => new MetricOrderBy(['metric_name' => 'screenPageViews']), 'desc' => true]),
            ],
            'limit' => 10,
        ]);

        $data = [];
        foreach ($response->getRows() as $row) {
            $data[] = [
                'path' => $row->getDimensionValues()[0]->getValue(),
                'title' => $row->getDimensionValues()[1]->getValue(),
                'views' => (int) $row->getMetricValues()[0]->getValue(),
                'users' => (int) $row->getMetricValues()[1]->getValue(),
                'avgDuration' => round((float) $row->getMetricValues()[2]->getValue()),
            ];
        }

        return $data;
    }

    private function fetchTrafficSources(string $property, array $dateRange): array
    {
        $response = $this->getClient()->runReport([
            'property' => $property,
            'dateRanges' => [
                new DateRange(['start_date' => $dateRange['start'], 'end_date' => $dateRange['end']]),
            ],
            'dimensions' => [
                new Dimension(['name' => 'sessionDefaultChannelGroup']),
            ],
            'metrics' => [
                new Metric(['name' => 'sessions']),
                new Metric(['name' => 'totalUsers']),
            ],
            'orderBys' => [
                new OrderBy(['metric' => new MetricOrderBy(['metric_name' => 'sessions']), 'desc' => true]),
            ],
            'limit' => 8,
        ]);

        $data = [];
        foreach ($response->getRows() as $row) {
            $data[] = [
                'source' => $row->getDimensionValues()[0]->getValue(),
                'sessions' => (int) $row->getMetricValues()[0]->getValue(),
                'users' => (int) $row->getMetricValues()[1]->getValue(),
            ];
        }

        return $data;
    }

    private function fetchDevices(string $property, array $dateRange): array
    {
        $response = $this->getClient()->runReport([
            'property' => $property,
            'dateRanges' => [
                new DateRange(['start_date' => $dateRange['start'], 'end_date' => $dateRange['end']]),
            ],
            'dimensions' => [
                new Dimension(['name' => 'deviceCategory']),
            ],
            'metrics' => [
                new Metric(['name' => 'sessions']),
                new Metric(['name' => 'totalUsers']),
            ],
            'orderBys' => [
                new OrderBy(['metric' => new MetricOrderBy(['metric_name' => 'sessions']), 'desc' => true]),
            ],
        ]);

        $data = [];
        foreach ($response->getRows() as $row) {
            $data[] = [
                'device' => ucfirst($row->getDimensionValues()[0]->getValue()),
                'sessions' => (int) $row->getMetricValues()[0]->getValue(),
                'users' => (int) $row->getMetricValues()[1]->getValue(),
            ];
        }

        return $data;
    }

    private function fetchCountries(string $property, array $dateRange): array
    {
        $response = $this->getClient()->runReport([
            'property' => $property,
            'dateRanges' => [
                new DateRange(['start_date' => $dateRange['start'], 'end_date' => $dateRange['end']]),
            ],
            'dimensions' => [
                new Dimension(['name' => 'country']),
                new Dimension(['name' => 'city']),
            ],
            'metrics' => [
                new Metric(['name' => 'totalUsers']),
                new Metric(['name' => 'sessions']),
            ],
            'orderBys' => [
                new OrderBy(['metric' => new MetricOrderBy(['metric_name' => 'totalUsers']), 'desc' => true]),
            ],
            'limit' => 10,
        ]);

        $data = [];
        foreach ($response->getRows() as $row) {
            $data[] = [
                'country' => $row->getDimensionValues()[0]->getValue(),
                'city' => $row->getDimensionValues()[1]->getValue(),
                'users' => (int) $row->getMetricValues()[0]->getValue(),
                'sessions' => (int) $row->getMetricValues()[1]->getValue(),
            ];
        }

        return $data;
    }

    /**
     * Return placeholder data when GA is not configured.
     */
    private function getPlaceholderData(string $period): array
    {
        $dateRange = $this->getDateRange($period);
        $days = $dateRange['days'];

        $chartData = [];
        for ($i = $days - 1; $i >= 0; $i--) {
            $date = Carbon::now()->subDays($i);
            $chartData[] = [
                'date' => $date->format('M d'),
                'visitors' => 0,
                'pageViews' => 0,
            ];
        }

        return [
            'overview' => [
                'totalUsers' => 0,
                'pageViews' => 0,
                'sessions' => 0,
                'bounceRate' => 0,
                'avgSessionDuration' => 0,
                'newUsers' => 0,
            ],
            'visitorsChart' => $chartData,
            'topPages' => [],
            'trafficSources' => [],
            'devices' => [],
            'countries' => [],
            'isConfigured' => false,
            'period' => $period,
        ];
    }
}
