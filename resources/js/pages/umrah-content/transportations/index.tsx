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
import { type BreadcrumbItem, type UmrahTransportation } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Edit, Plus, Trash2 } from 'lucide-react';

interface TransportationsIndexProps {
    transportations: UmrahTransportation[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Umrah Content',
        href: '/umrah-content',
    },
    {
        title: 'Transportations',
        href: '/umrah-content/transportations',
    },
];

export default function TransportationsIndex({ transportations }: TransportationsIndexProps) {
    const handleDelete = (transportationId: number) => {
        if (confirm('Are you sure you want to delete this transportation?')) {
            router.delete(`/umrah-content/transportations/${transportationId}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Transportations Management" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Transportations Management</CardTitle>
                                <CardDescription>
                                    Manage transportation options used in package details
                                </CardDescription>
                            </div>
                            <Link href="/umrah-content/transportations/create">
                                <Button>
                                    <Plus className="mr-2 size-4" />
                                    Add Transportation
                                </Button>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {transportations.length === 0 ? (
                            <div className="py-8 text-center text-muted-foreground">
                                No transportation options yet. Add your first one!
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="border-b">
                                        <tr className="text-sm text-muted-foreground">
                                            <th className="p-3 text-left font-medium">Icon</th>
                                            <th className="p-3 text-left font-medium">Name</th>
                                            <th className="p-3 text-left font-medium">Description</th>
                                            <th className="p-3 text-left font-medium">Status</th>
                                            <th className="p-3 text-right font-medium">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {transportations.map((transportation) => (
                                            <tr
                                                key={transportation.id}
                                                className="border-b last:border-0 hover:bg-muted/50"
                                            >
                                                <td className="p-3">
                                                    {transportation.icon_path ? (
                                                        <img
                                                            src={
                                                                transportation.icon_url ||
                                                                `/storage/${transportation.icon_path}`
                                                            }
                                                            alt={transportation.name}
                                                            className="h-12 w-12 rounded object-cover"
                                                        />
                                                    ) : (
                                                        <span className="text-xs text-muted-foreground">
                                                            No icon
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="p-3">
                                                    <p className="font-medium">
                                                        {transportation.name}
                                                    </p>
                                                    {transportation.subtitle && (
                                                        <p className="text-xs text-muted-foreground">
                                                            {transportation.subtitle}
                                                        </p>
                                                    )}
                                                </td>
                                                <td className="p-3 text-muted-foreground">
                                                    {transportation.description || '-'}
                                                </td>
                                                <td className="p-3">
                                                    <Switch
                                                        checked={transportation.is_active}
                                                        disabled
                                                    />
                                                </td>
                                                <td className="p-3">
                                                    <div className="flex justify-end gap-2">
                                                        <Link
                                                            href={`/umrah-content/transportations/${transportation.id}/edit`}
                                                        >
                                                            <Button variant="ghost" size="sm">
                                                                <Edit className="size-4" />
                                                            </Button>
                                                        </Link>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    transportation.id,
                                                                )
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
