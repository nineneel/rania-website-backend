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
import { type BreadcrumbItem, type UmrahItinerary } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Edit, Plus, Trash2 } from 'lucide-react';

interface ItinerariesIndexProps {
    itineraries: UmrahItinerary[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Umrah Content',
        href: '/umrah-content',
    },
    {
        title: 'Itineraries',
        href: '/umrah-content/itineraries',
    },
];

export default function ItinerariesIndex({ itineraries }: ItinerariesIndexProps) {
    const handleDelete = (itineraryId: number) => {
        if (confirm('Are you sure you want to delete this itinerary item?')) {
            router.delete(`/umrah-content/itineraries/${itineraryId}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Itineraries Management" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Itineraries Management</CardTitle>
                                <CardDescription>
                                    Manage itinerary points for package detail pages
                                </CardDescription>
                            </div>
                            <Link href="/umrah-content/itineraries/create">
                                <Button>
                                    <Plus className="mr-2 size-4" />
                                    Add Itinerary
                                </Button>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {itineraries.length === 0 ? (
                            <div className="py-8 text-center text-muted-foreground">
                                No itinerary items yet. Add your first one!
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="border-b">
                                        <tr className="text-sm text-muted-foreground">
                                            <th className="p-3 text-left font-medium">Image</th>
                                            <th className="p-3 text-left font-medium">Title</th>
                                            <th className="p-3 text-left font-medium">Location</th>
                                            <th className="p-3 text-left font-medium">Status</th>
                                            <th className="p-3 text-right font-medium">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {itineraries.map((itinerary) => (
                                            <tr
                                                key={itinerary.id}
                                                className="border-b last:border-0 hover:bg-muted/50"
                                            >
                                                <td className="p-3">
                                                    {itinerary.image_path ? (
                                                        <img
                                                            src={
                                                                itinerary.image_url ||
                                                                `/storage/${itinerary.image_path}`
                                                            }
                                                            alt={itinerary.title}
                                                            className="h-14 w-20 rounded object-cover"
                                                        />
                                                    ) : (
                                                        <span className="text-xs text-muted-foreground">
                                                            No image
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="p-3 font-medium">
                                                    {itinerary.title}
                                                </td>
                                                <td className="p-3 text-muted-foreground">
                                                    {itinerary.location || '-'}
                                                </td>
                                                <td className="p-3">
                                                    <Switch checked={itinerary.is_active} disabled />
                                                </td>
                                                <td className="p-3">
                                                    <div className="flex justify-end gap-2">
                                                        <Link
                                                            href={`/umrah-content/itineraries/${itinerary.id}/edit`}
                                                        >
                                                            <Button variant="ghost" size="sm">
                                                                <Edit className="size-4" />
                                                            </Button>
                                                        </Link>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() =>
                                                                handleDelete(itinerary.id)
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
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
