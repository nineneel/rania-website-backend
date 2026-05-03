import { MultiImageUpload } from '@/components/multi-image-upload';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type UmrahHotel, type UmrahHotelFormData } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { FormEvent } from 'react';

const MAX_HOTEL_IMAGES = 5;

interface EditHotelProps {
    hotel: UmrahHotel;
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
    {
        title: 'Edit Hotel',
        href: '#',
    },
];

export default function EditHotel({ hotel }: EditHotelProps) {
    const { data, setData, post, processing, errors, transform } = useForm<UmrahHotelFormData>({
        name: hotel.name,
        stars: hotel.stars,
        location: hotel.location,
        description: hotel.description || '',
        images: [],
        existing_image_ids: hotel.images?.map((image) => image.id) || [],
        is_active: hotel.is_active,
    });

    const totalImages = data.existing_image_ids.length + data.images.length;
    const remainingSlots = Math.max(0, MAX_HOTEL_IMAGES - data.existing_image_ids.length);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        transform((current) => ({ ...current, _method: 'put' }));
        post(`/umrah-content/hotels/${hotel.id}`, {
            forceFormData: true,
        });
    };

    const handleImagesChange = (files: File[]) => {
        setData('images', files.slice(0, remainingSlots));
    };

    const removeExistingImage = (imageId: number) => {
        setData(
            'existing_image_ids',
            data.existing_image_ids.filter((id) => id !== imageId),
        );
    };

    const retainedImages =
        hotel.images?.filter((image) => data.existing_image_ids.includes(image.id)) || [];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Hotel" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="mb-4">
                    <Button
                        variant="ghost"
                        onClick={() => window.history.back()}
                    >
                        <ArrowLeft className="mr-2 size-4" />
                        Back to Hotels
                    </Button>
                </div>

                <Card className="mx-auto w-full max-w-2xl">
                    <CardHeader>
                        <CardTitle>Edit Hotel</CardTitle>
                        <CardDescription>
                            Update hotel information
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Hotel Name</Label>
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

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="stars">Star Rating</Label>
                                    <Select
                                        value={data.stars.toString()}
                                        onValueChange={(value) => setData('stars', parseInt(value))}
                                    >
                                        <SelectTrigger id="stars">
                                            <SelectValue placeholder="Select rating" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {[1, 2, 3, 4, 5].map((num) => (
                                                <SelectItem key={num} value={num.toString()}>
                                                    {num} Star{num > 1 ? 's' : ''}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.stars && (
                                        <p className="text-sm text-destructive">
                                            {errors.stars}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="location">Location</Label>
                                    <Input
                                        id="location"
                                        type="text"
                                        value={data.location}
                                        onChange={(e) => setData('location', e.target.value)}
                                        placeholder="e.g., Makkah, Madinah"
                                        required
                                    />
                                    {errors.location && (
                                        <p className="text-sm text-destructive">
                                            {errors.location}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Optional description about the hotel"
                                    rows={4}
                                />
                                {errors.description && (
                                    <p className="text-sm text-destructive">
                                        {errors.description}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-3">
                                <Label>Images (up to {MAX_HOTEL_IMAGES})</Label>
                                <p className="text-xs text-muted-foreground">
                                    The first image is used as the thumbnail. Add up to{' '}
                                    {MAX_HOTEL_IMAGES} images for the carousel.
                                </p>

                                {retainedImages.length > 0 && (
                                    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                                        {retainedImages.map((image) => (
                                            <div
                                                key={image.id}
                                                className="group relative overflow-hidden rounded-lg border"
                                            >
                                                <img
                                                    src={
                                                        image.image_url ||
                                                        (image.image_path
                                                            ? `/storage/${image.image_path}`
                                                            : '')
                                                    }
                                                    alt={`Hotel ${image.id}`}
                                                    className="h-24 w-full object-cover"
                                                />
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    variant="destructive"
                                                    className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100"
                                                    onClick={() => removeExistingImage(image.id)}
                                                >
                                                    <Trash2 className="size-3" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <MultiImageUpload
                                    value={data.images}
                                    onChange={handleImagesChange}
                                    error={errors.images as string | undefined}
                                    compact={retainedImages.length > 0}
                                />

                                <p className="text-xs text-muted-foreground">
                                    {totalImages} of {MAX_HOTEL_IMAGES} images.
                                </p>
                                {totalImages >= MAX_HOTEL_IMAGES && (
                                    <p className="text-xs text-amber-600">
                                        Maximum of {MAX_HOTEL_IMAGES} images reached.
                                    </p>
                                )}
                                {errors.existing_image_ids && (
                                    <p className="text-sm text-destructive">
                                        {errors.existing_image_ids}
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
                                    {processing ? 'Updating...' : 'Update Hotel'}
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
