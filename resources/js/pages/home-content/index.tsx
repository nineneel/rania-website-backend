import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Event, HeroSlide } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowRight, Image, Calendar } from 'lucide-react';

interface HomeContentProps {
    heroSlides: HeroSlide[];
    events: Event[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Home Content',
        href: '/home-content',
    },
];

export default function HomeContentIndex({ heroSlides, events }: HomeContentProps) {

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Home Content Management" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold">Home Content Management</h1>
                    <p className="mt-2 text-muted-foreground">
                        Manage hero slides and events displayed on the home page
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Hero Slides Card */}
                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                                    <Image className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <CardTitle>Hero Slides</CardTitle>
                                    <CardDescription>
                                        {heroSlides.length} slide{heroSlides.length !== 1 ? 's' : ''}
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="mb-4 text-sm text-muted-foreground">
                                Manage the carousel slides displayed at the top of the home
                                page
                            </p>
                            <Link href="/home-content/hero-slides">
                                <Button className="w-full">
                                    Manage Hero Slides
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>

                    {/* Events Card */}
                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                                    <Calendar className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <CardTitle>Events</CardTitle>
                                    <CardDescription>
                                        {events.length} event{events.length !== 1 ? 's' : ''}
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="mb-4 text-sm text-muted-foreground">
                                Manage events and activities shown on the home page
                            </p>
                            <Link href="/home-content/events">
                                <Button className="w-full">
                                    Manage Events
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Stats */}
                <Card>
                    <CardHeader>
                        <CardTitle>Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="rounded-lg border p-4">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Image className="h-4 w-4" />
                                    Active Hero Slides
                                </div>
                                <p className="mt-2 text-2xl font-bold">
                                    {heroSlides.filter((slide) => slide.is_active).length}
                                </p>
                            </div>
                            <div className="rounded-lg border p-4">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Calendar className="h-4 w-4" />
                                    Available Events
                                </div>
                                <p className="mt-2 text-2xl font-bold">
                                    {events.filter((event) => event.is_available).length}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
