import { StatsCard } from '@/components/stats-card';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import {
    MessageCircleQuestion,
    MessageSquareQuote,
    Plane,
    Mail,
    Image,
    CalendarDays,
    Users,
} from 'lucide-react';

// Route URLs
const ROUTES = {
    faqs: '/faqs',
    testimonials: '/testimonials',
    umrahContent: '/umrah-content',
    contactMessages: '/contact-messages',
    homeContent: '/home-content',
    users: '/users',
};

interface DashboardStats {
    faqs: {
        total: number;
        active: number;
    };
    testimonials: {
        total: number;
        active: number;
    };
    umrahPackages: {
        total: number;
        active: number;
    };
    contactMessages: {
        total: number;
        new: number;
        read: number;
        replied: number;
    };
    heroSlides: {
        total: number;
        active: number;
    };
    events: {
        total: number;
        available: number;
    };
    users: {
        total: number;
        superAdmins: number;
        admins: number;
        editors: number;
    };
}

interface DashboardProps {
    stats: DashboardStats;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function Dashboard({ stats }: DashboardProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {/* Content Management Section */}
                <div className="space-y-2">
                    <h2 className="text-lg font-semibold">Content Management</h2>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <StatsCard
                            title="Hero Slides"
                            icon={Image}
                            href={ROUTES.homeContent}
                            iconClassName="text-orange-600"
                            stats={[
                                { label: 'Total', value: stats.heroSlides.total },
                                { label: 'Active', value: stats.heroSlides.active, variant: 'success' },
                            ]}
                        />
                        <StatsCard
                            title="Events"
                            icon={CalendarDays}
                            href={ROUTES.homeContent}
                            iconClassName="text-pink-600"
                            stats={[
                                { label: 'Total', value: stats.events.total },
                                { label: 'Available', value: stats.events.available, variant: 'success' },
                            ]}
                        />
                        <StatsCard
                            title="Umrah Packages"
                            icon={Plane}
                            href={ROUTES.umrahContent}
                            iconClassName="text-green-600"
                            stats={[
                                { label: 'Total', value: stats.umrahPackages.total },
                                { label: 'Active', value: stats.umrahPackages.active, variant: 'success' },
                            ]}
                        />
                        <StatsCard
                            title="Testimonials"
                            icon={MessageSquareQuote}
                            href={ROUTES.testimonials}
                            iconClassName="text-purple-600"
                            stats={[
                                { label: 'Total', value: stats.testimonials.total },
                                { label: 'Active', value: stats.testimonials.active, variant: 'success' },
                            ]}
                        />
                        <StatsCard
                            title="FAQs"
                            icon={MessageCircleQuestion}
                            href={ROUTES.faqs}
                            iconClassName="text-blue-600"
                            stats={[
                                { label: 'Total', value: stats.faqs.total },
                                { label: 'Active', value: stats.faqs.active, variant: 'success' },
                            ]}
                        />
                    </div>
                </div>

                {/* Messages & Users Section */}
                <div className="space-y-2">
                    <h2 className="text-lg font-semibold">Messages & Users</h2>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <StatsCard
                            title="Contact Messages"
                            icon={Mail}
                            href={ROUTES.contactMessages}
                            iconClassName="text-red-600"
                            stats={[
                                { label: 'Total', value: stats.contactMessages.total },
                                { label: 'New', value: stats.contactMessages.new, variant: 'warning' },
                                { label: 'Read', value: stats.contactMessages.read },
                                { label: 'Replied', value: stats.contactMessages.replied, variant: 'success' },
                            ]}
                        />
                        <StatsCard
                            title="Users"
                            icon={Users}
                            href={ROUTES.users}
                            iconClassName="text-indigo-600"
                            stats={[
                                { label: 'Total', value: stats.users.total },
                                { label: 'Super Admins', value: stats.users.superAdmins, variant: 'destructive' },
                                { label: 'Admins', value: stats.users.admins, variant: 'warning' },
                                { label: 'Editors', value: stats.users.editors },
                            ]}
                        />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
