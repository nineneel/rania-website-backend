import { ImageUpload } from '@/components/image-upload';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type UmrahPackage, type UmrahHotel, type UmrahAirline, type UmrahPackageFormData } from '@/types';
import { Head, useForm, router } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { FormEvent } from 'react';

interface EditPackageProps {
    package: UmrahPackage;
    hotels: UmrahHotel[];
    airlines: UmrahAirline[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Umrah Content',
        href: '/umrah-content',
    },
    {
        title: 'Packages',
        href: '/umrah-content/packages',
    },
    {
        title: 'Edit Package',
        href: '#',
    },
];

export default function EditPackage({ package: pkg, hotels, airlines }: EditPackageProps) {
    const { data, setData, processing, errors } = useForm<UmrahPackageFormData>({
        title: pkg.title,
        description: pkg.description,
        image: null,
        departure: pkg.departure,
        duration: pkg.duration,
        frequency: pkg.frequency,
        price: pkg.price.toString(),
        currency: pkg.currency,
        is_active: pkg.is_active,
        hotel_ids: pkg.hotels?.map(h => h.id) || [],
        airline_ids: pkg.airlines?.map(a => a.id) || [],
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        router.post(`/umrah-content/packages/${pkg.id}`, {
            ...data,
            _method: 'PUT',
        }, {
            forceFormData: true,
        });
    };

    const toggleHotel = (hotelId: number) => {
        setData('hotel_ids', data.hotel_ids.includes(hotelId)
            ? data.hotel_ids.filter(id => id !== hotelId)
            : [...data.hotel_ids, hotelId]
        );
    };

    const toggleAirline = (airlineId: number) => {
        setData('airline_ids', data.airline_ids.includes(airlineId)
            ? data.airline_ids.filter(id => id !== airlineId)
            : [...data.airline_ids, airlineId]
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Package" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="mb-4">
                    <Button variant="ghost" onClick={() => window.history.back()}>
                        <ArrowLeft className="mr-2 size-4" />
                        Back to Packages
                    </Button>
                </div>

                <Card className="mx-auto w-full max-w-3xl">
                    <CardHeader>
                        <CardTitle>Edit Package</CardTitle>
                        <CardDescription>
                            Update package information
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="title">Package Title</Label>
                                <Input
                                    id="title"
                                    type="text"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    required
                                />
                                {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    required
                                    rows={3}
                                />
                                {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="image">Package Image</Label>
                                <div className="mb-2">
                                    <img
                                        src={pkg.image_url || `/storage/${pkg.image_path}`}
                                        alt={pkg.title}
                                        className="h-32 w-auto rounded border object-cover"
                                    />
                                    <p className="mt-1 text-xs text-muted-foreground">Current image</p>
                                </div>
                                <ImageUpload
                                    value={data.image}
                                    onChange={(file) => setData('image', file)}
                                    error={errors.image}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Leave empty to keep the current image
                                </p>
                                {errors.image && <p className="text-sm text-destructive">{errors.image}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="departure">Departure</Label>
                                    <Input
                                        id="departure"
                                        type="text"
                                        value={data.departure}
                                        onChange={(e) => setData('departure', e.target.value)}
                                        required
                                    />
                                    {errors.departure && <p className="text-sm text-destructive">{errors.departure}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="duration">Duration</Label>
                                    <Input
                                        id="duration"
                                        type="text"
                                        value={data.duration}
                                        onChange={(e) => setData('duration', e.target.value)}
                                        required
                                    />
                                    {errors.duration && <p className="text-sm text-destructive">{errors.duration}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="frequency">Frequency</Label>
                                    <Input
                                        id="frequency"
                                        type="text"
                                        value={data.frequency}
                                        onChange={(e) => setData('frequency', e.target.value)}
                                        required
                                    />
                                    {errors.frequency && <p className="text-sm text-destructive">{errors.frequency}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="price">Price</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            id="currency"
                                            type="text"
                                            value={data.currency}
                                            onChange={(e) => setData('currency', e.target.value)}
                                            className="w-20"
                                            required
                                        />
                                        <Input
                                            id="price"
                                            type="text"
                                            value={data.price}
                                            onChange={(e) => setData('price', e.target.value)}
                                            className="flex-1"
                                            required
                                        />
                                    </div>
                                    {errors.price && <p className="text-sm text-destructive">{errors.price}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Select Hotels</Label>
                                <div className="grid gap-3 rounded-lg border p-4">
                                    {hotels.length === 0 ? (
                                        <p className="text-sm text-muted-foreground">No hotels available.</p>
                                    ) : (
                                        hotels.map((hotel) => (
                                            <div key={hotel.id} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`hotel-${hotel.id}`}
                                                    checked={data.hotel_ids.includes(hotel.id)}
                                                    onCheckedChange={() => toggleHotel(hotel.id)}
                                                />
                                                <Label htmlFor={`hotel-${hotel.id}`} className="flex-1 cursor-pointer">
                                                    {hotel.name} ({hotel.stars} ⭐ - {hotel.location})
                                                </Label>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Select Airlines</Label>
                                <div className="grid gap-3 rounded-lg border p-4">
                                    {airlines.length === 0 ? (
                                        <p className="text-sm text-muted-foreground">No airlines available.</p>
                                    ) : (
                                        airlines.map((airline) => (
                                            <div key={airline.id} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`airline-${airline.id}`}
                                                    checked={data.airline_ids.includes(airline.id)}
                                                    onCheckedChange={() => toggleAirline(airline.id)}
                                                />
                                                <Label htmlFor={`airline-${airline.id}`} className="flex-1 cursor-pointer">
                                                    {airline.name}
                                                </Label>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="is_active"
                                    checked={data.is_active}
                                    onCheckedChange={(checked) => setData('is_active', checked)}
                                />
                                <Label htmlFor="is_active">Active</Label>
                            </div>

                            <div className="flex gap-3">
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Updating...' : 'Update Package'}
                                </Button>
                                <Button type="button" variant="outline" onClick={() => window.history.back()}>
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
