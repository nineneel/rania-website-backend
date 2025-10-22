import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type UmrahHotel } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Edit, Plus, Star, Trash2 } from 'lucide-react';

interface HotelsIndexProps {
    hotels: UmrahHotel[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Umrah Content',
        href: '/umrah-content',
    },
    {
        title: 'Hotels',
        href: '/umrah-content/hotels',
    },
];

export default function HotelsIndex({ hotels }: HotelsIndexProps) {

    const handleDelete = (hotelId: number) => {
        if (confirm('Are you sure you want to delete this hotel?')) {
            router.delete(`/umrah-content/hotels/${hotelId}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Hotels Management" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Hotels Management</CardTitle>
                                <CardDescription>
                                    Manage hotels in Makkah and Madinah
                                </CardDescription>
                            </div>
                            <Link href="/umrah-content/hotels/create">
                                <Button>
                                    <Plus className="mr-2 size-4" />
                                    Add Hotel
                                </Button>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {hotels.length === 0 ? (
                            <div className="py-8 text-center text-muted-foreground">
                                No hotels yet. Add your first one!
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="border-b">
                                        <tr className="text-sm text-muted-foreground">
                                            <th className="p-3 text-left font-medium">
                                                Name
                                            </th>
                                            <th className="p-3 text-left font-medium">
                                                Rating
                                            </th>
                                            <th className="p-3 text-left font-medium">
                                                Location
                                            </th>
                                            <th className="p-3 text-left font-medium">
                                                Status
                                            </th>
                                            <th className="p-3 text-right font-medium">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {hotels.map((hotel) => (
                                            <tr
                                                key={hotel.id}
                                                className="border-b last:border-0 hover:bg-muted/50"
                                            >
                                                <td className="p-3 font-medium">{hotel.name}</td>
                                                <td className="p-3">
                                                    <div className="flex items-center gap-1">
                                                        {[...Array(hotel.stars)].map((_, i) => (
                                                            <Star
                                                                key={i}
                                                                className="h-4 w-4 fill-yellow-400 text-yellow-400"
                                                            />
                                                        ))}
                                                    </div>
                                                </td>
                                                <td className="p-3 text-muted-foreground">
                                                    {hotel.location}
                                                </td>
                                                <td className="p-3">
                                                    <Switch checked={hotel.is_active} disabled />
                                                </td>
                                                <td className="p-3">
                                                    <div className="flex justify-end gap-2">
                                                        <Link href={`/umrah-content/hotels/${hotel.id}/edit`}>
                                                            <Button variant="ghost" size="sm">
                                                                <Edit className="size-4" />
                                                            </Button>
                                                        </Link>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleDelete(hotel.id)}
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
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
