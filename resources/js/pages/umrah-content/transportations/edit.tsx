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
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import {
    type BreadcrumbItem,
    type UmrahTransportation,
    type UmrahTransportationFormData,
} from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { FormEvent } from 'react';

interface EditTransportationProps {
    transportation: UmrahTransportation;
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
    {
        title: 'Edit Transportation',
        href: '#',
    },
];

export default function EditTransportation({ transportation }: EditTransportationProps) {
    const { data, setData, processing, errors } = useForm<UmrahTransportationFormData>({
        name: transportation.name,
        subtitle: transportation.subtitle || '',
        description: transportation.description || '',
        icon: null,
        is_active: transportation.is_active,
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        router.post(
            `/umrah-content/transportations/${transportation.id}`,
            {
                ...data,
                _method: 'PUT',
            },
            {
                forceFormData: true,
            },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Transportation" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="mb-4">
                    <Button variant="ghost" onClick={() => window.history.back()}>
                        <ArrowLeft className="mr-2 size-4" />
                        Back to Transportations
                    </Button>
                </div>

                <Card className="mx-auto w-full max-w-2xl">
                    <CardHeader>
                        <CardTitle>Edit Transportation</CardTitle>
                        <CardDescription>Update transportation information</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                />
                                {errors.name && (
                                    <p className="text-sm text-destructive">{errors.name}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="subtitle">Subtitle (Optional)</Label>
                                <Input
                                    id="subtitle"
                                    type="text"
                                    value={data.subtitle}
                                    onChange={(e) => setData('subtitle', e.target.value)}
                                    placeholder="e.g., GMC, Haramain High Speed Railway"
                                />
                                {errors.subtitle && (
                                    <p className="text-sm text-destructive">{errors.subtitle}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description (Optional)</Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    rows={3}
                                />
                                {errors.description && (
                                    <p className="text-sm text-destructive">
                                        {errors.description}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="icon">Icon</Label>
                                {transportation.icon_path && (
                                    <div className="mb-2">
                                        <img
                                            src={
                                                transportation.icon_url ||
                                                `/storage/${transportation.icon_path}`
                                            }
                                            alt={transportation.name}
                                            className="h-20 w-20 rounded border object-cover"
                                        />
                                        <p className="mt-1 text-xs text-muted-foreground">
                                            Current icon
                                        </p>
                                    </div>
                                )}
                                <ImageUpload
                                    value={data.icon}
                                    onChange={(file) => setData('icon', file)}
                                    error={errors.icon}
                                    accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Leave empty to keep the current icon
                                </p>
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
                                    {processing ? 'Updating...' : 'Update Transportation'}
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
