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
    type UmrahAdditionalService,
    type UmrahAdditionalServiceFormData,
} from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { FormEvent } from 'react';

interface EditAdditionalServiceProps {
    additionalService: UmrahAdditionalService;
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
    {
        title: 'Edit Additional Service',
        href: '#',
    },
];

export default function EditAdditionalService({
    additionalService,
}: EditAdditionalServiceProps) {
    const { data, setData, processing, errors } =
        useForm<UmrahAdditionalServiceFormData>({
            title: additionalService.title,
            description: additionalService.description,
            image: null,
            is_active: additionalService.is_active,
        });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        router.post(
            `/umrah-content/additional-services/${additionalService.id}`,
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
            <Head title="Edit Additional Service" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="mb-4">
                    <Button variant="ghost" onClick={() => window.history.back()}>
                        <ArrowLeft className="mr-2 size-4" />
                        Back to Additional Services
                    </Button>
                </div>

                <Card className="mx-auto w-full max-w-2xl">
                    <CardHeader>
                        <CardTitle>Edit Additional Service</CardTitle>
                        <CardDescription>
                            Update additional service information
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="title">Title</Label>
                                <Input
                                    id="title"
                                    type="text"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    required
                                />
                                {errors.title && (
                                    <p className="text-sm text-destructive">{errors.title}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    rows={4}
                                    required
                                />
                                {errors.description && (
                                    <p className="text-sm text-destructive">
                                        {errors.description}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="image">Image</Label>
                                {additionalService.image_path && (
                                    <div className="mb-2">
                                        <img
                                            src={
                                                additionalService.image_url ||
                                                `/storage/${additionalService.image_path}`
                                            }
                                            alt={additionalService.title}
                                            className="h-24 w-auto rounded border object-cover"
                                        />
                                        <p className="mt-1 text-xs text-muted-foreground">
                                            Current image
                                        </p>
                                    </div>
                                )}
                                <ImageUpload
                                    value={data.image}
                                    onChange={(file) => setData('image', file)}
                                    error={errors.image}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Leave empty to keep the current image
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
                                    {processing ? 'Updating...' : 'Update Additional Service'}
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
