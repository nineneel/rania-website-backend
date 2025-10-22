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
import { type BreadcrumbItem, type UmrahAirline } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Edit, Plus, Trash2 } from 'lucide-react';

interface AirlinesIndexProps {
    airlines: UmrahAirline[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Umrah Content',
        href: '/umrah-content',
    },
    {
        title: 'Airlines',
        href: '/umrah-content/airlines',
    },
];

export default function AirlinesIndex({ airlines }: AirlinesIndexProps) {

    const handleDelete = (airlineId: number) => {
        if (confirm('Are you sure you want to delete this airline?')) {
            router.delete(`/umrah-content/airlines/${airlineId}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Airlines Management" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Airlines Management</CardTitle>
                                <CardDescription>
                                    Manage airlines available for umrah packages
                                </CardDescription>
                            </div>
                            <Link href="/umrah-content/airlines/create">
                                <Button>
                                    <Plus className="mr-2 size-4" />
                                    Add Airline
                                </Button>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {airlines.length === 0 ? (
                            <div className="py-8 text-center text-muted-foreground">
                                No airlines yet. Add your first one!
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="border-b">
                                        <tr className="text-sm text-muted-foreground">
                                            <th className="p-3 text-left font-medium">
                                                Logo
                                            </th>
                                            <th className="p-3 text-left font-medium">
                                                Name
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
                                        {airlines.map((airline) => (
                                            <tr
                                                key={airline.id}
                                                className="border-b last:border-0 hover:bg-muted/50"
                                            >
                                                <td className="p-3">
                                                    <img
                                                        src={airline.logo_url || `/storage/${airline.logo_path}`}
                                                        alt={airline.name}
                                                        className="h-12 w-auto rounded object-contain bg-white"
                                                    />
                                                </td>
                                                <td className="p-3 font-medium">{airline.name}</td>
                                                <td className="p-3">
                                                    <Switch checked={airline.is_active} disabled />
                                                </td>
                                                <td className="p-3">
                                                    <div className="flex justify-end gap-2">
                                                        <Link href={`/umrah-content/airlines/${airline.id}/edit`}>
                                                            <Button variant="ghost" size="sm">
                                                                <Edit className="size-4" />
                                                            </Button>
                                                        </Link>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleDelete(airline.id)}
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
