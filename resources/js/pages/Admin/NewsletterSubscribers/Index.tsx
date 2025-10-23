import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type PaginatedData } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Search, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface NewsletterSubscriber {
    id: number;
    email: string;
    status: 'active' | 'unsubscribed';
    verified_at: string | null;
    created_at: string;
}

interface Stats {
    total: number;
    active: number;
    unsubscribed: number;
}

interface Filters {
    status: string;
    search: string;
}

interface NewsletterSubscribersIndexProps {
    subscribers: PaginatedData<NewsletterSubscriber>;
    stats: Stats;
    filters: Filters;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Newsletter Subscribers',
        href: '/newsletter-subscribers',
    },
];

const statusColors: Record<string, 'default' | 'secondary' | 'destructive'> = {
    active: 'default',
    pending: 'secondary',
    unsubscribed: 'destructive',
};

export default function NewsletterSubscribersIndex({
    subscribers,
    stats,
    filters,
}: NewsletterSubscribersIndexProps) {
    const [search, setSearch] = useState(filters.search);
    const [status, setStatus] = useState(filters.status);

    const handleDelete = (subscriberId: number) => {
        if (confirm('Are you sure you want to delete this subscriber?')) {
            router.delete(`/newsletter-subscribers/${subscriberId}`);
        }
    };

    const handleSearch = () => {
        router.get(
            '/newsletter-subscribers',
            { search, status },
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    const handleStatusFilter = (newStatus: string) => {
        setStatus(newStatus);
        router.get(
            '/newsletter-subscribers',
            { search, status: newStatus },
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Newsletter Subscribers" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                {/* Statistics Cards */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Total Subscribers</CardDescription>
                            <CardTitle className="text-3xl">{stats.total}</CardTitle>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Active</CardDescription>
                            <CardTitle className="text-3xl text-green-600">
                                {stats.active}
                            </CardTitle>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Unsubscribed</CardDescription>
                            <CardTitle className="text-3xl text-red-600">
                                {stats.unsubscribed}
                            </CardTitle>
                        </CardHeader>
                    </Card>
                </div>

                {/* Main Content */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Newsletter Subscribers</CardTitle>
                                <CardDescription>
                                    View and manage newsletter subscribers.
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {/* Filters */}
                        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex flex-wrap gap-2">
                                <Button
                                    variant={status === 'all' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => handleStatusFilter('all')}
                                >
                                    All
                                </Button>
                                <Button
                                    variant={status === 'active' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => handleStatusFilter('active')}
                                >
                                    Active
                                </Button>
                                <Button
                                    variant={
                                        status === 'unsubscribed' ? 'default' : 'outline'
                                    }
                                    size="sm"
                                    onClick={() => handleStatusFilter('unsubscribed')}
                                >
                                    Unsubscribed
                                </Button>
                            </div>

                            <div className="flex gap-2">
                                <Input
                                    type="text"
                                    placeholder="Search by email..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            handleSearch();
                                        }
                                    }}
                                    className="w-full sm:w-64"
                                />
                                <Button onClick={handleSearch} variant="secondary">
                                    <Search className="size-4" />
                                </Button>
                            </div>
                        </div>

                        {subscribers.data.length === 0 ? (
                            <div className="py-8 text-center text-muted-foreground">
                                No subscribers found.
                            </div>
                        ) : (
                            <>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="border-b">
                                            <tr className="text-sm text-muted-foreground">
                                                <th className="p-3 text-left font-medium">
                                                    Email
                                                </th>
                                                <th className="p-3 text-left font-medium">
                                                    Status
                                                </th>
                                                <th className="p-3 text-left font-medium">
                                                    Subscribed At
                                                </th>
                                                <th className="p-3 text-left font-medium">
                                                    Verified At
                                                </th>
                                                <th className="p-3 text-right font-medium">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {subscribers.data.map((subscriber) => (
                                                <tr
                                                    key={subscriber.id}
                                                    className="border-b last:border-0 hover:bg-muted/50"
                                                >
                                                    <td className="p-3 font-medium">
                                                        {subscriber.email}
                                                    </td>
                                                    <td className="p-3">
                                                        <Badge
                                                            variant={
                                                                statusColors[
                                                                    subscriber.status
                                                                ]
                                                            }
                                                        >
                                                            {subscriber.status}
                                                        </Badge>
                                                    </td>
                                                    <td className="p-3 text-muted-foreground">
                                                        {formatDate(subscriber.created_at)}
                                                    </td>
                                                    <td className="p-3 text-muted-foreground">
                                                        {subscriber.verified_at
                                                            ? formatDate(
                                                                  subscriber.verified_at
                                                              )
                                                            : '-'}
                                                    </td>
                                                    <td className="p-3">
                                                        <div className="flex justify-end gap-2">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() =>
                                                                    handleDelete(subscriber.id)
                                                                }
                                                            >
                                                                <Trash2 className="size-4" />
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Pagination */}
                                {subscribers.last_page > 1 && (
                                    <div className="mt-4 flex items-center justify-between border-t pt-4">
                                        <div className="text-sm text-muted-foreground">
                                            Showing {subscribers.from} to {subscribers.to} of{' '}
                                            {subscribers.total} subscribers
                                        </div>
                                        <div className="flex gap-1">
                                            {subscribers.links.map((link, index) => {
                                                if (!link.url) {
                                                    return (
                                                        <Button
                                                            key={index}
                                                            variant="ghost"
                                                            size="sm"
                                                            disabled
                                                            dangerouslySetInnerHTML={{
                                                                __html: link.label,
                                                            }}
                                                        />
                                                    );
                                                }

                                                return (
                                                    <Link key={index} href={link.url}>
                                                        <Button
                                                            variant={
                                                                link.active ? 'default' : 'ghost'
                                                            }
                                                            size="sm"
                                                            dangerouslySetInnerHTML={{
                                                                __html: link.label,
                                                            }}
                                                        />
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
