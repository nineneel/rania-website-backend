import { ImageUpload } from '@/components/image-upload';
import { MultiImageUpload } from '@/components/multi-image-upload';
import { SelectionCard } from '@/components/selection-card';
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
import { cn, formatPrice } from '@/lib/utils';
import AppLayout from '@/layouts/app-layout';
import {
    type BreadcrumbItem,
    type UmrahAirline,
    type UmrahHotel,
    type UmrahItinerary,
    type UmrahPackageFormData,
    type UmrahTransportation,
} from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { ArrowLeft, Building2, Bus, MapPin, Plane, Plus, Star, X } from 'lucide-react';
import { FormEvent, useState } from 'react';

const DEFAULT_PACKAGE_SERVICES: { title: string; is_included: boolean }[] = [
    { title: 'Visa', is_included: true },
    { title: 'Umrah Insurance Program (for International Pilgrims)', is_included: true },
    { title: 'Makkah Accommodation', is_included: true },
    { title: 'Madinah Accommodation', is_included: true },
    { title: 'Umrah Services', is_included: true },
    { title: 'Air Travel', is_included: false },
    { title: 'Catering', is_included: true },
    { title: 'Transportation Between Cities', is_included: true },
];

interface CreatePackageProps {
    hotels: UmrahHotel[];
    airlines: UmrahAirline[];
    transportations: UmrahTransportation[];
    itineraries: UmrahItinerary[];
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
        title: 'Create Package',
        href: '/umrah-content/packages/create',
    },
];

const toSlug = (value: string): string => {
    return value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
};

export default function CreatePackage({
    hotels,
    airlines,
    transportations,
    itineraries,
}: CreatePackageProps) {
    const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);

    const { data, setData, post, processing, errors } = useForm<UmrahPackageFormData>({
        title: '',
        slug: '',
        subtitle: '',
        description: '',
        image: null,
        gallery_images: [],
        existing_gallery_image_ids: [],
        departure: '',
        duration: '',
        departure_schedule: '',
        price: '',
        currency: 'Rp',
        link: '',
        is_active: true,
        hotel_ids: [],
        airline_ids: [],
        transportation_ids: [],
        itinerary_ids: [],
        package_services: DEFAULT_PACKAGE_SERVICES,
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post('/umrah-content/packages', {
            forceFormData: true,
        });
    };

    const handleTitleChange = (value: string) => {
        setData('title', value);

        if (!isSlugManuallyEdited) {
            setData('slug', toSlug(value));
        }
    };

    const toggleHotel = (hotelId: number) => {
        setData(
            'hotel_ids',
            data.hotel_ids.includes(hotelId)
                ? data.hotel_ids.filter((id) => id !== hotelId)
                : [...data.hotel_ids, hotelId],
        );
    };

    const toggleAirline = (airlineId: number) => {
        setData(
            'airline_ids',
            data.airline_ids.includes(airlineId)
                ? data.airline_ids.filter((id) => id !== airlineId)
                : [...data.airline_ids, airlineId],
        );
    };

    const toggleTransportation = (transportationId: number) => {
        setData(
            'transportation_ids',
            data.transportation_ids.includes(transportationId)
                ? data.transportation_ids.filter((id) => id !== transportationId)
                : [...data.transportation_ids, transportationId],
        );
    };

    const toggleItinerary = (itineraryId: number) => {
        setData(
            'itinerary_ids',
            data.itinerary_ids.includes(itineraryId)
                ? data.itinerary_ids.filter((id) => id !== itineraryId)
                : [...data.itinerary_ids, itineraryId],
        );
    };

    const [newServiceTitle, setNewServiceTitle] = useState('');

    const removeService = (index: number) => {
        setData('package_services', data.package_services.filter((_, i) => i !== index));
    };

    const addService = () => {
        const title = newServiceTitle.trim();
        if (!title) {
            return;
        }
        setData('package_services', [...data.package_services, { title, is_included: true }]);
        setNewServiceTitle('');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Package" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="mb-4">
                    <Button variant="ghost" onClick={() => window.history.back()}>
                        <ArrowLeft className="mr-2 size-4" />
                        Back to Packages
                    </Button>
                </div>

                <Card className="mx-auto w-full max-w-3xl">
                    <CardHeader>
                        <CardTitle>Create New Package</CardTitle>
                        <CardDescription>
                            Add a new umrah package with hotels, airlines, transportation, itinerary,
                            and services
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
                                    onChange={(e) => handleTitleChange(e.target.value)}
                                    required
                                />
                                {errors.title && (
                                    <p className="text-sm text-destructive">{errors.title}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="slug">Slug</Label>
                                <Input
                                    id="slug"
                                    type="text"
                                    value={data.slug}
                                    onChange={(e) => {
                                        setIsSlugManuallyEdited(true);
                                        setData('slug', e.target.value);
                                    }}
                                    placeholder="e.g., royal-hilton-signature"
                                    required
                                />
                                {errors.slug && (
                                    <p className="text-sm text-destructive">{errors.slug}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="subtitle">Subtitle (Optional)</Label>
                                <Input
                                    id="subtitle"
                                    type="text"
                                    value={data.subtitle}
                                    onChange={(e) => setData('subtitle', e.target.value)}
                                    placeholder="e.g., Periode Low Season"
                                />
                                {errors.subtitle && (
                                    <p className="text-sm text-destructive">{errors.subtitle}</p>
                                )}
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
                                {errors.description && (
                                    <p className="text-sm text-destructive">{errors.description}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="image">Thumbnail Image</Label>
                                <ImageUpload
                                    value={data.image}
                                    onChange={(file) => setData('image', file)}
                                    error={errors.image}
                                />
                                {errors.image && (
                                    <p className="text-sm text-destructive">{errors.image}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label>Detail Gallery Images (Minimum 4)</Label>
                                <MultiImageUpload
                                    value={data.gallery_images}
                                    onChange={(files) => setData('gallery_images', files)}
                                    error={errors.gallery_images}
                                    minCount={4}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="departure">Departure</Label>
                                    <Input
                                        id="departure"
                                        type="text"
                                        value={data.departure}
                                        onChange={(e) => setData('departure', e.target.value)}
                                        placeholder="e.g., Soekarno-Hatta airport (CGK) Jakarta"
                                        required
                                    />
                                    {errors.departure && (
                                        <p className="text-sm text-destructive">
                                            {errors.departure}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="duration">Duration</Label>
                                    <Input
                                        id="duration"
                                        type="text"
                                        value={data.duration}
                                        onChange={(e) => setData('duration', e.target.value)}
                                        placeholder="e.g., 9 Days"
                                        required
                                    />
                                    {errors.duration && (
                                        <p className="text-sm text-destructive">{errors.duration}</p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="departure_schedule">Pax</Label>
                                    <Input
                                        id="departure_schedule"
                                        type="text"
                                        value={data.departure_schedule}
                                        onChange={(e) =>
                                            setData('departure_schedule', e.target.value)
                                        }
                                        placeholder="e.g., 1-10 Pax"
                                        required
                                    />
                                    {errors.departure_schedule && (
                                        <p className="text-sm text-destructive">
                                            {errors.departure_schedule}
                                        </p>
                                    )}
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
                                        <div className="flex-1 space-y-1">
                                            <Input
                                                id="price"
                                                type="number"
                                                step="0.01"
                                                value={data.price}
                                                onChange={(e) => setData('price', e.target.value)}
                                                placeholder="54800000.00"
                                                required
                                            />
                                            {data.price && (
                                                <p className="text-xs text-muted-foreground">
                                                    Preview: {data.currency}{' '}
                                                    {formatPrice(data.price)}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    {errors.price && (
                                        <p className="text-sm text-destructive">{errors.price}</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="link">Link (Optional)</Label>
                                <Input
                                    id="link"
                                    type="url"
                                    value={data.link}
                                    onChange={(e) => setData('link', e.target.value)}
                                    placeholder="e.g., https://example.com/package-details"
                                />
                                {errors.link && (
                                    <p className="text-sm text-destructive">{errors.link}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label>Select Hotels</Label>
                                {hotels.length === 0 ? (
                                    <p className="rounded-lg border p-4 text-sm text-muted-foreground">
                                        No hotels available. Add hotels first.
                                    </p>
                                ) : (
                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                        {hotels.map((hotel) => (
                                            <SelectionCard
                                                key={hotel.id}
                                                selected={data.hotel_ids.includes(hotel.id)}
                                                onToggle={() => toggleHotel(hotel.id)}
                                            >
                                                <div className="flex gap-3">
                                                    {hotel.image_url ? (
                                                        <img
                                                            src={hotel.image_url}
                                                            alt={hotel.name}
                                                            className="size-12 shrink-0 rounded-md object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex size-12 shrink-0 items-center justify-center rounded-md bg-muted">
                                                            <Building2 className="size-6 text-muted-foreground" />
                                                        </div>
                                                    )}
                                                    <div className="min-w-0 flex-1">
                                                        <p className="truncate pr-6 text-sm font-medium">{hotel.name}</p>
                                                        <div className="mt-1 flex items-center gap-0.5">
                                                            {Array.from({ length: 5 }).map((_, i) => (
                                                                <Star
                                                                    key={i}
                                                                    className={cn(
                                                                        'size-3',
                                                                        i < hotel.stars
                                                                            ? 'fill-amber-400 text-amber-400'
                                                                            : 'text-muted-foreground/30',
                                                                    )}
                                                                />
                                                            ))}
                                                        </div>
                                                        <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                                                            <MapPin className="size-3 shrink-0" />
                                                            {hotel.location}
                                                        </p>
                                                    </div>
                                                </div>
                                            </SelectionCard>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label>Select Airlines</Label>
                                {airlines.length === 0 ? (
                                    <p className="rounded-lg border p-4 text-sm text-muted-foreground">
                                        No airlines available. Add airlines first.
                                    </p>
                                ) : (
                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                        {airlines.map((airline) => (
                                            <SelectionCard
                                                key={airline.id}
                                                selected={data.airline_ids.includes(airline.id)}
                                                onToggle={() => toggleAirline(airline.id)}
                                            >
                                                <div className="flex items-center gap-3">
                                                    {airline.logo_url ? (
                                                        <img
                                                            src={airline.logo_url}
                                                            alt={airline.name}
                                                            className="h-8 w-auto shrink-0 object-contain"
                                                        />
                                                    ) : (
                                                        <Plane className="size-8 shrink-0 text-muted-foreground" />
                                                    )}
                                                    <p className="pr-6 text-sm font-medium">{airline.name}</p>
                                                </div>
                                            </SelectionCard>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label>Select Transportations</Label>
                                {transportations.length === 0 ? (
                                    <p className="rounded-lg border p-4 text-sm text-muted-foreground">
                                        No transportations available. Add transportations first.
                                    </p>
                                ) : (
                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                        {transportations.map((transportation) => (
                                            <SelectionCard
                                                key={transportation.id}
                                                selected={data.transportation_ids.includes(transportation.id)}
                                                onToggle={() => toggleTransportation(transportation.id)}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-white">
                                                        {transportation.icon_url ? (
                                                            <img
                                                                src={transportation.icon_url}
                                                                alt={transportation.name}
                                                                className="size-5 object-contain"
                                                            />
                                                        ) : (
                                                            <Bus className="size-5 text-muted-foreground" />
                                                        )}
                                                    </div>
                                                    <p className="pr-6 text-sm font-medium">{transportation.name}</p>
                                                </div>
                                            </SelectionCard>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label>Select Itinerary</Label>
                                {itineraries.length === 0 ? (
                                    <p className="rounded-lg border p-4 text-sm text-muted-foreground">
                                        No itinerary items available. Add itinerary items first.
                                    </p>
                                ) : (
                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                        {itineraries.map((itinerary) => (
                                            <SelectionCard
                                                key={itinerary.id}
                                                selected={data.itinerary_ids.includes(itinerary.id)}
                                                onToggle={() => toggleItinerary(itinerary.id)}
                                            >
                                                <div className="flex gap-3">
                                                    {itinerary.image_url ? (
                                                        <img
                                                            src={itinerary.image_url}
                                                            alt={itinerary.title}
                                                            className="size-12 shrink-0 rounded-md object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex size-12 shrink-0 items-center justify-center rounded-md bg-muted">
                                                            <MapPin className="size-6 text-muted-foreground" />
                                                        </div>
                                                    )}
                                                    <div className="min-w-0 flex-1">
                                                        <p className="truncate pr-6 text-sm font-medium">{itinerary.title}</p>
                                                        {itinerary.location && (
                                                            <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                                                                <MapPin className="size-3 shrink-0" />
                                                                {itinerary.location}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </SelectionCard>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label>Package Services</Label>
                                <div className="space-y-2">
                                    {data.package_services.map((service, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between rounded-lg border px-3 py-2"
                                        >
                                            <span className="text-sm">{service.title}</span>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="size-7 p-0 text-muted-foreground hover:text-destructive"
                                                onClick={() => removeService(index)}
                                            >
                                                <X className="size-4" />
                                            </Button>
                                        </div>
                                    ))}
                                    <div className="flex gap-2">
                                        <Input
                                            placeholder="Add custom service..."
                                            value={newServiceTitle}
                                            onChange={(e) => setNewServiceTitle(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    addService();
                                                }
                                            }}
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={addService}
                                            disabled={!newServiceTitle.trim()}
                                        >
                                            <Plus className="mr-1 size-4" />
                                            Add
                                        </Button>
                                    </div>
                                </div>
                                {errors.package_services && (
                                    <p className="text-sm text-destructive">
                                        {errors.package_services}
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
                                    {processing ? 'Creating...' : 'Create Package'}
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
