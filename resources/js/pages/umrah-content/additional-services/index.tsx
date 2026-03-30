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
import { type BreadcrumbItem, type UmrahAdditionalService } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Edit, Plus, Trash2 } from 'lucide-react';

interface AdditionalServicesIndexProps {
    additionalServices: UmrahAdditionalService[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Umrah Content',
        href: '/umrah-content',
    },
    {
        title: 'Additional Services',
        href: '/umrah-content/additional-services',
    },
];

export default function AdditionalServicesIndex({
    additionalServices,
}: AdditionalServicesIndexProps) {
    const handleDelete = (additionalServiceId: number) => {
        if (confirm('Are you sure you want to delete this additional service?')) {
            router.delete(`/umrah-content/additional-services/${additionalServiceId}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Additional Services Management" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Additional Services Management</CardTitle>
                                <CardDescription>
                                    Manage global additional services used for all packages
                                </CardDescription>
                            </div>
                            <Link href="/umrah-content/additional-services/create">
                                <Button>
                                    <Plus className="mr-2 size-4" />
                                    Add Service
                                </Button>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {additionalServices.length === 0 ? (
                            <div className="py-8 text-center text-muted-foreground">
                                No additional services yet. Add your first one!
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="border-b">
                                        <tr className="text-sm text-muted-foreground">
                                            <th className="p-3 text-left font-medium">Image</th>
                                            <th className="p-3 text-left font-medium">Title</th>
                                            <th className="p-3 text-left font-medium">Description</th>
                                            <th className="p-3 text-left font-medium">Status</th>
                                            <th className="p-3 text-right font-medium">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {additionalServices.map((additionalService) => (
                                            <tr
                                                key={additionalService.id}
                                                className="border-b last:border-0 hover:bg-muted/50"
                                            >
                                                <td className="p-3">
                                                    {additionalService.image_path ? (
                                                        <img
                                                            src={
                                                                additionalService.image_url ||
                                                                `/storage/${additionalService.image_path}`
                                                            }
                                                            alt={additionalService.title}
                                                            className="h-14 w-20 rounded object-cover"
                                                        />
                                                    ) : (
                                                        <span className="text-xs text-muted-foreground">
                                                            No image
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="p-3 font-medium">
                                                    {additionalService.title}
                                                </td>
                                                <td className="p-3 text-muted-foreground">
                                                    {additionalService.description}
                                                </td>
                                                <td className="p-3">
                                                    <Switch checked={additionalService.is_active} disabled />
                                                </td>
                                                <td className="p-3">
                                                    <div className="flex justify-end gap-2">
                                                        <Link
                                                            href={`/umrah-content/additional-services/${additionalService.id}/edit`}
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
                                                                    additionalService.id,
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
