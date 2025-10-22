import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, UmrahPackage, UmrahHotel, UmrahAirline } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowRight, Package, Building2, Plane } from 'lucide-react';

interface UmrahContentProps {
    packages: UmrahPackage[];
    hotels: UmrahHotel[];
    airlines: UmrahAirline[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Umrah Content',
        href: '/umrah-content',
    },
];

export default function UmrahContentIndex({ packages, hotels, airlines }: UmrahContentProps) {

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Umrah Content Management" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold">Umrah Content Management</h1>
                    <p className="mt-2 text-muted-foreground">
                        Manage umrah packages, hotels, and airlines displayed on the umrah page
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    {/* Packages Card */}
                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                                    <Package className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <CardTitle>Packages</CardTitle>
                                    <CardDescription>
                                        {packages.length} package{packages.length !== 1 ? 's' : ''}
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="mb-4 text-sm text-muted-foreground">
                                Manage umrah packages with hotels and airlines
                            </p>
                            <Link href="/umrah-content/packages">
                                <Button className="w-full">
                                    Manage Packages
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>

                    {/* Hotels Card */}
                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                                    <Building2 className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <CardTitle>Hotels</CardTitle>
                                    <CardDescription>
                                        {hotels.length} hotel{hotels.length !== 1 ? 's' : ''}
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="mb-4 text-sm text-muted-foreground">
                                Manage hotels in Makkah and Madinah
                            </p>
                            <Link href="/umrah-content/hotels">
                                <Button className="w-full">
                                    Manage Hotels
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>

                    {/* Airlines Card */}
                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                                    <Plane className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <CardTitle>Airlines</CardTitle>
                                    <CardDescription>
                                        {airlines.length} airline{airlines.length !== 1 ? 's' : ''}
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="mb-4 text-sm text-muted-foreground">
                                Manage airlines available for umrah packages
                            </p>
                            <Link href="/umrah-content/airlines">
                                <Button className="w-full">
                                    Manage Airlines
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
                        <div className="grid gap-4 md:grid-cols-3">
                            <div className="rounded-lg border p-4">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Package className="h-4 w-4" />
                                    Active Packages
                                </div>
                                <p className="mt-2 text-2xl font-bold">
                                    {packages.filter((pkg) => pkg.is_active).length}
                                </p>
                            </div>
                            <div className="rounded-lg border p-4">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Building2 className="h-4 w-4" />
                                    Active Hotels
                                </div>
                                <p className="mt-2 text-2xl font-bold">
                                    {hotels.filter((hotel) => hotel.is_active).length}
                                </p>
                            </div>
                            <div className="rounded-lg border p-4">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Plane className="h-4 w-4" />
                                    Active Airlines
                                </div>
                                <p className="mt-2 text-2xl font-bold">
                                    {airlines.filter((airline) => airline.is_active).length}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
