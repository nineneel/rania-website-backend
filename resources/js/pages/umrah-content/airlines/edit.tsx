import { ImageUpload } from '@/components/image-upload';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type UmrahAirline, type UmrahAirlineFormData } from '@/types';
import { Head, useForm, router } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { FormEvent } from 'react';

interface EditAirlineProps {
    airline: UmrahAirline;
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
    {
        title: 'Edit Airline',
        href: '#',
    },
];

export default function EditAirline({ airline }: EditAirlineProps) {
    const { data, setData, processing, errors } = useForm<UmrahAirlineFormData>({
        name: airline.name,
        logo: null,
        is_active: airline.is_active,
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        router.post(`/umrah-content/airlines/${airline.id}`, {
            ...data,
            _method: 'PUT',
        }, {
            forceFormData: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Airline" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="mb-4">
                    <Button
                        variant="ghost"
                        onClick={() => window.history.back()}
                    >
                        <ArrowLeft className="mr-2 size-4" />
                        Back to Airlines
                    </Button>
                </div>

                <Card className="mx-auto w-full max-w-2xl">
                    <CardHeader>
                        <CardTitle>Edit Airline</CardTitle>
                        <CardDescription>
                            Update airline information
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Airline Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                />
                                {errors.name && (
                                    <p className="text-sm text-destructive">
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="logo">Logo</Label>
                                <div className="mb-2">
                                    <img
                                        src={airline.logo_url || `/storage/${airline.logo_path}`}
                                        alt={airline.name}
                                        className="h-20 w-auto rounded border object-contain bg-white p-2"
                                    />
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        Current logo
                                    </p>
                                </div>
                                <ImageUpload
                                    value={data.logo}
                                    onChange={(file) => setData('logo', file)}
                                    error={errors.logo}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Leave empty to keep the current logo
                                </p>
                                {errors.logo && (
                                    <p className="text-sm text-destructive">
                                        {errors.logo}
                                    </p>
                                )}
                            </div>

                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="is_active"
                                    checked={data.is_active}
                                    onCheckedChange={(checked) =>
                                        setData('is_active', checked)
                                    }
                                />
                                <Label htmlFor="is_active">Active</Label>
                            </div>

                            <div className="flex gap-3">
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Updating...' : 'Update Airline'}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => window.history.back()}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
