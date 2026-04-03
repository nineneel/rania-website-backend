import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import {
    BarChart3,
    Clock,
    Eye,
    Globe,
    Monitor,
    MousePointerClick,
    Smartphone,
    Tablet,
    TrendingUp,
    UserPlus,
    Users,
} from 'lucide-react';
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

const DEVICE_COLORS = ['#3b82f6', '#f59e0b', '#10b981', '#8b5cf6'];

interface OverviewData {
    totalUsers: number;
    pageViews: number;
    sessions: number;
    bounceRate: number;
    avgSessionDuration: number;
    newUsers: number;
}

interface ChartDataPoint {
    date: string;
    visitors: number;
    pageViews: number;
}

interface TopPage {
    path: string;
    title: string;
    views: number;
    users: number;
    avgDuration: number;
}

interface TrafficSource {
    source: string;
    sessions: number;
    users: number;
}

interface DeviceData {
    device: string;
    sessions: number;
    users: number;
}

interface CountryData {
    country: string;
    city: string;
    users: number;
    sessions: number;
}

interface AnalyticsData {
    overview: OverviewData;
    visitorsChart: ChartDataPoint[];
    topPages: TopPage[];
    trafficSources: TrafficSource[];
    devices: DeviceData[];
    countries: CountryData[];
    isConfigured: boolean;
    period: string;
}

interface AnalyticsProps {
    analytics: AnalyticsData;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Analytics',
        href: '/analytics',
    },
];

function formatDuration(seconds: number): string {
    if (seconds < 60) return `${seconds}s`;
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}m ${sec}s`;
}

function formatNumber(num: number): string {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
}

function DeviceIcon({ device }: { device: string }) {
    switch (device.toLowerCase()) {
        case 'mobile':
            return <Smartphone className="h-4 w-4" />;
        case 'tablet':
            return <Tablet className="h-4 w-4" />;
        default:
            return <Monitor className="h-4 w-4" />;
    }
}

export default function Analytics({ analytics }: AnalyticsProps) {
    const { overview, visitorsChart, topPages, trafficSources, devices, countries, isConfigured, period } = analytics;

    const totalDeviceSessions = devices.reduce((sum, d) => sum + d.sessions, 0);

    function handlePeriodChange(value: string) {
        router.get('/analytics', { period: value }, { preserveState: true, preserveScroll: true });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Analytics" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Website Analytics</h1>
                        <p className="text-muted-foreground text-sm">
                            {isConfigured
                                ? 'Monitor your main website performance'
                                : 'Google Analytics is not configured yet. Showing empty data.'}
                        </p>
                    </div>
                    <Select value={period} onValueChange={handlePeriodChange}>
                        <SelectTrigger className="w-[140px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="7d">Last 7 days</SelectItem>
                            <SelectItem value="30d">Last 30 days</SelectItem>
                            <SelectItem value="90d">Last 90 days</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Not configured banner */}
                {!isConfigured && (
                    <Card className="border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950">
                        <CardContent className="pt-6">
                            <div className="flex items-start gap-3">
                                <BarChart3 className="mt-0.5 h-5 w-5 text-amber-600" />
                                <div>
                                    <p className="font-medium text-amber-800 dark:text-amber-200">Setup Required</p>
                                    <p className="text-sm text-amber-700 dark:text-amber-300">
                                        To see real analytics data, add your Google Analytics credentials:
                                    </p>
                                    <ol className="mt-2 list-inside list-decimal space-y-1 text-sm text-amber-700 dark:text-amber-300">
                                        <li>Create a Google Cloud service account with GA4 read access</li>
                                        <li>
                                            Download the JSON credentials file to{' '}
                                            <code className="rounded bg-amber-100 px-1 dark:bg-amber-900">
                                                storage/app/analytics/service-account-credentials.json
                                            </code>
                                        </li>
                                        <li>
                                            Set <code className="rounded bg-amber-100 px-1 dark:bg-amber-900">ANALYTICS_PROPERTY_ID</code> in
                                            your <code className="rounded bg-amber-100 px-1 dark:bg-amber-900">.env</code> file
                                        </li>
                                    </ol>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Overview Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                    <OverviewCard icon={Users} label="Total Visitors" value={formatNumber(overview.totalUsers)} color="text-blue-600" />
                    <OverviewCard icon={Eye} label="Page Views" value={formatNumber(overview.pageViews)} color="text-green-600" />
                    <OverviewCard
                        icon={MousePointerClick}
                        label="Sessions"
                        value={formatNumber(overview.sessions)}
                        color="text-purple-600"
                    />
                    <OverviewCard icon={TrendingUp} label="Bounce Rate" value={`${overview.bounceRate}%`} color="text-orange-600" />
                    <OverviewCard
                        icon={Clock}
                        label="Avg. Duration"
                        value={formatDuration(overview.avgSessionDuration)}
                        color="text-pink-600"
                    />
                    <OverviewCard icon={UserPlus} label="New Users" value={formatNumber(overview.newUsers)} color="text-teal-600" />
                </div>

                {/* Visitors Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle>Visitors Over Time</CardTitle>
                        <CardDescription>Daily visitors and page views</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={visitorsChart} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                                    <defs>
                                        <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorPageViews" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                                    <XAxis
                                        dataKey="date"
                                        className="text-xs"
                                        tick={{ fill: 'currentColor' }}
                                        tickLine={false}
                                        interval="preserveStartEnd"
                                    />
                                    <YAxis className="text-xs" tick={{ fill: 'currentColor' }} tickLine={false} axisLine={false} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'hsl(var(--card))',
                                            border: '1px solid hsl(var(--border))',
                                            borderRadius: '8px',
                                            fontSize: '12px',
                                        }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="visitors"
                                        stroke="#3b82f6"
                                        fillOpacity={1}
                                        fill="url(#colorVisitors)"
                                        strokeWidth={2}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="pageViews"
                                        stroke="#10b981"
                                        fillOpacity={1}
                                        fill="url(#colorPageViews)"
                                        strokeWidth={2}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Two column: Top Pages + Traffic Sources */}
                <div className="grid gap-4 lg:grid-cols-2">
                    {/* Top Pages */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Top Pages</CardTitle>
                            <CardDescription>Most visited pages on your website</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {topPages.length > 0 ? (
                                <div className="space-y-3">
                                    {topPages.map((page, i) => (
                                        <div key={i} className="flex items-center justify-between gap-4">
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-sm font-medium">{page.title || page.path}</p>
                                                <p className="text-muted-foreground truncate text-xs">{page.path}</p>
                                            </div>
                                            <div className="flex shrink-0 items-center gap-3 text-sm">
                                                <span className="text-muted-foreground">{page.users} users</span>
                                                <span className="font-medium">{formatNumber(page.views)} views</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <EmptyState message="No page data available" />
                            )}
                        </CardContent>
                    </Card>

                    {/* Traffic Sources */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Traffic Sources</CardTitle>
                            <CardDescription>Where your visitors come from</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {trafficSources.length > 0 ? (
                                <div className="h-[300px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={trafficSources} layout="vertical" margin={{ top: 5, right: 20, left: 80, bottom: 5 }}>
                                            <CartesianGrid strokeDasharray="3 3" className="stroke-border" horizontal={false} />
                                            <XAxis type="number" className="text-xs" tick={{ fill: 'currentColor' }} tickLine={false} />
                                            <YAxis
                                                dataKey="source"
                                                type="category"
                                                className="text-xs"
                                                tick={{ fill: 'currentColor' }}
                                                tickLine={false}
                                                width={75}
                                            />
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: 'hsl(var(--card))',
                                                    border: '1px solid hsl(var(--border))',
                                                    borderRadius: '8px',
                                                    fontSize: '12px',
                                                }}
                                            />
                                            <Bar dataKey="sessions" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            ) : (
                                <EmptyState message="No traffic source data available" />
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Two column: Devices + Countries */}
                <div className="grid gap-4 lg:grid-cols-2">
                    {/* Devices */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Device Breakdown</CardTitle>
                            <CardDescription>Sessions by device type</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {devices.length > 0 ? (
                                <div className="flex items-center gap-8">
                                    <div className="h-[200px] w-[200px] shrink-0">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={devices}
                                                    dataKey="sessions"
                                                    nameKey="device"
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={50}
                                                    outerRadius={80}
                                                    paddingAngle={4}
                                                >
                                                    {devices.map((_, i) => (
                                                        <Cell key={i} fill={DEVICE_COLORS[i % DEVICE_COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip
                                                    contentStyle={{
                                                        backgroundColor: 'hsl(var(--card))',
                                                        border: '1px solid hsl(var(--border))',
                                                        borderRadius: '8px',
                                                        fontSize: '12px',
                                                    }}
                                                />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div className="flex-1 space-y-3">
                                        {devices.map((device, i) => (
                                            <div key={i} className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        className="h-3 w-3 rounded-full"
                                                        style={{ backgroundColor: DEVICE_COLORS[i % DEVICE_COLORS.length] }}
                                                    />
                                                    <DeviceIcon device={device.device} />
                                                    <span className="text-sm">{device.device}</span>
                                                </div>
                                                <div className="text-sm">
                                                    <span className="font-medium">{formatNumber(device.sessions)}</span>
                                                    <span className="text-muted-foreground ml-1">
                                                        ({totalDeviceSessions > 0 ? Math.round((device.sessions / totalDeviceSessions) * 100) : 0}
                                                        %)
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <EmptyState message="No device data available" />
                            )}
                        </CardContent>
                    </Card>

                    {/* Countries */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Top Locations</CardTitle>
                            <CardDescription>Visitors by country and city</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {countries.length > 0 ? (
                                <div className="space-y-3">
                                    {countries.map((item, i) => (
                                        <div key={i} className="flex items-center justify-between gap-4">
                                            <div className="flex min-w-0 flex-1 items-center gap-2">
                                                <Globe className="text-muted-foreground h-4 w-4 shrink-0" />
                                                <div className="min-w-0">
                                                    <p className="truncate text-sm font-medium">{item.city}</p>
                                                    <p className="text-muted-foreground text-xs">{item.country}</p>
                                                </div>
                                            </div>
                                            <div className="flex shrink-0 items-center gap-3 text-sm">
                                                <span className="text-muted-foreground">{item.sessions} sessions</span>
                                                <span className="font-medium">{item.users} users</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <EmptyState message="No geographic data available" />
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}

function OverviewCard({ icon: Icon, label, value, color }: { icon: React.ElementType; label: string; value: string; color: string }) {
    return (
        <Card>
            <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                    <Icon className={`h-5 w-5 ${color}`} />
                    <div>
                        <p className="text-muted-foreground text-xs">{label}</p>
                        <p className="text-xl font-bold">{value}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

function EmptyState({ message }: { message: string }) {
    return (
        <div className="flex h-[200px] items-center justify-center">
            <p className="text-muted-foreground text-sm">{message}</p>
        </div>
    );
}
