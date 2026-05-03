import { ImageUpload } from '@/components/image-upload';
import { ItemPickerDialog } from '@/components/item-picker-dialog';
import { MultiImageUpload } from '@/components/multi-image-upload';
import {
    AdditionalServiceItem,
    AirlineItem,
    HotelItem,
    ItineraryItem,
    TransportationItem,
} from '@/components/umrah-picker-items';
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
    type HajjPackage,
    type HajjPackageFormData,
    type UmrahAdditionalService,
    type UmrahAirline,
    type UmrahHotel,
    type UmrahItinerary,
    type UmrahTransportation,
} from '@/types';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Head, router, useForm } from '@inertiajs/react';
import { ArrowLeft, BedDouble, Check, DollarSign, Moon, Plus, Trash2, X } from 'lucide-react';
import { FormEvent, useState } from 'react';

const DEFAULT_HOTEL_NIGHTS = 3;
const DEFAULT_AIRLINE_CLASS = 'economy';
const PRESET_AIRLINE_CLASSES = ['economy', 'business', 'first'] as const;
const AIRLINE_CLASS_LABELS: Record<string, string> = {
    economy: 'Economy',
    business: 'Business',
    first: 'First Class',
};

const DEFAULT_PACKAGE_SERVICES: { title: string; is_included: boolean }[] = [
    { title: 'Visa', is_included: true },
    { title: 'Hajj Insurance Program (for International Pilgrims)', is_included: true },
    { title: 'Makkah Accommodation', is_included: true },
    { title: 'Madinah Accommodation', is_included: true },
    { title: 'Hajj Services', is_included: true },
    { title: 'Air Travel', is_included: false },
    { title: 'Catering', is_included: true },
    { title: 'Transportation Between Cities', is_included: true },
];

const DEFAULT_PACKAGE_BEDS: { type: string; bed_count: number }[] = [
    { type: 'Quad', bed_count: 4 },
    { type: 'Triple', bed_count: 3 },
    { type: 'Double', bed_count: 2 },
];

interface EditPackageProps {
    package: HajjPackage;
    hotels: UmrahHotel[];
    airlines: UmrahAirline[];
    transportations: UmrahTransportation[];
    itineraries: UmrahItinerary[];
    additionalServices: UmrahAdditionalService[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Hajj Content',
        href: '/hajj-content',
    },
    {
        title: 'Packages',
        href: '/hajj-content/packages',
    },
    {
        title: 'Edit Package',
        href: '#',
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

export default function EditPackage({
    package: pkg,
    hotels,
    airlines,
    transportations,
    itineraries,
    additionalServices,
}: EditPackageProps) {
    const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);

    const { data, setData, processing, errors } = useForm<HajjPackageFormData>({
        title: pkg.title,
        slug: pkg.slug,
        subtitle: pkg.subtitle || '',
        description: pkg.description,
        image: null,
        color: pkg.color || '#d4af37',
        gallery_images: [],
        existing_gallery_image_ids: pkg.images?.map((image) => image.id) || [],
        departure: pkg.departure,
        duration: pkg.duration,
        departure_schedule: pkg.departure_schedule,
        date: pkg.date ?? '',
        price_idr: pkg.price_idr?.toString() ?? '',
        price_usd: pkg.price_usd?.toString() ?? '',
        price_sar: pkg.price_sar?.toString() ?? '',
        price_quad_idr: pkg.price_quad_idr?.toString() ?? '',
        price_triple_idr: pkg.price_triple_idr?.toString() ?? '',
        price_double_idr: pkg.price_double_idr?.toString() ?? '',
        price_quad_usd: pkg.price_quad_usd?.toString() ?? '',
        price_triple_usd: pkg.price_triple_usd?.toString() ?? '',
        price_double_usd: pkg.price_double_usd?.toString() ?? '',
        price_quad_sar: pkg.price_quad_sar?.toString() ?? '',
        price_triple_sar: pkg.price_triple_sar?.toString() ?? '',
        price_double_sar: pkg.price_double_sar?.toString() ?? '',
        link: pkg.link || '',
        is_active: pkg.is_active,
        hotel_ids: pkg.hotels?.map((h) => h.id) || [],
        hotel_nights:
            pkg.hotels?.reduce<Record<number, number>>((acc, h) => {
                acc[h.id] = h.pivot?.total_nights ?? DEFAULT_HOTEL_NIGHTS;
                return acc;
            }, {}) || {},
        airline_ids: pkg.airlines?.map((a) => a.id) || [],
        airline_classes:
            pkg.airlines?.reduce<Record<number, string>>((acc, a) => {
                acc[a.id] = a.pivot?.class ?? DEFAULT_AIRLINE_CLASS;
                return acc;
            }, {}) || {},
        airline_meals:
            pkg.airlines?.reduce<Record<number, string>>((acc, a) => {
                acc[a.id] = a.pivot?.meal ?? '';
                return acc;
            }, {}) || {},
        airline_baggages:
            pkg.airlines?.reduce<Record<number, string>>((acc, a) => {
                acc[a.id] = a.pivot?.baggage ?? '';
                return acc;
            }, {}) || {},
        transportation_ids: pkg.transportations?.map((t) => t.id) || [],
        itinerary_ids: pkg.itineraries?.map((i) => i.id) || [],
        additional_service_ids: pkg.additional_services?.map((s) => s.id) || [],
        package_services:
            pkg.services && pkg.services.length > 0
                ? pkg.services.map((service) => ({
                      title: service.title,
                      is_included: service.is_included,
                  }))
                : DEFAULT_PACKAGE_SERVICES,
        package_beds:
            pkg.beds && pkg.beds.length > 0
                ? pkg.beds.map((bed) => ({
                      type: bed.type,
                      bed_count: bed.bed_count,
                  }))
                : DEFAULT_PACKAGE_BEDS,
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        const payload: Record<string, unknown> = {
            ...data,
            package_services: data.package_services.map((service) => ({
                title: service.title,
                is_included: service.is_included,
            })),
            package_beds: data.package_beds.map((bed) => ({
                type: bed.type,
                bed_count: bed.bed_count,
            })),
            _method: 'PUT',
        };

        router.post(`/hajj-content/packages/${pkg.id}`, payload as any, {
            forceFormData: true,
        });
    };

    const handleTitleChange = (value: string) => {
        setData('title', value);

        if (!isSlugManuallyEdited) {
            setData('slug', toSlug(value));
        }
    };

    const removeExistingGalleryImage = (imageId: number) => {
        setData(
            'existing_gallery_image_ids',
            data.existing_gallery_image_ids.filter((id) => id !== imageId),
        );
    };

    const addHotel = (hotelId: number) => {
        if (data.hotel_ids.includes(hotelId)) return;
        setData('hotel_ids', [...data.hotel_ids, hotelId]);
        setData('hotel_nights', {
            ...data.hotel_nights,
            [hotelId]: data.hotel_nights[hotelId] ?? DEFAULT_HOTEL_NIGHTS,
        });
    };
    const removeHotel = (hotelId: number) => {
        const nextNights = { ...data.hotel_nights };
        delete nextNights[hotelId];
        setData('hotel_ids', data.hotel_ids.filter((id) => id !== hotelId));
        setData('hotel_nights', nextNights);
    };
    const setHotelNights = (hotelId: number, value: string) => {
        const parsed = Number.parseInt(value, 10);
        const nights = Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_HOTEL_NIGHTS;
        setData('hotel_nights', { ...data.hotel_nights, [hotelId]: nights });
    };

    const addAirline = (airlineId: number) => {
        if (data.airline_ids.includes(airlineId)) return;
        setData('airline_ids', [...data.airline_ids, airlineId]);
        setData('airline_classes', {
            ...data.airline_classes,
            [airlineId]: data.airline_classes[airlineId] ?? DEFAULT_AIRLINE_CLASS,
        });
    };
    const removeAirline = (airlineId: number) => {
        const nextClasses = { ...data.airline_classes };
        const nextMeals = { ...data.airline_meals };
        const nextBaggages = { ...data.airline_baggages };
        delete nextClasses[airlineId];
        delete nextMeals[airlineId];
        delete nextBaggages[airlineId];
        setData('airline_ids', data.airline_ids.filter((id) => id !== airlineId));
        setData('airline_classes', nextClasses);
        setData('airline_meals', nextMeals);
        setData('airline_baggages', nextBaggages);
    };
    const setAirlineClass = (airlineId: number, value: string) => {
        setData('airline_classes', { ...data.airline_classes, [airlineId]: value });
    };
    const setAirlineMeal = (airlineId: number, value: string) => {
        setData('airline_meals', { ...data.airline_meals, [airlineId]: value });
    };
    const setAirlineBaggage = (airlineId: number, value: string) => {
        setData('airline_baggages', { ...data.airline_baggages, [airlineId]: value });
    };

    const addTransportation = (transportationId: number) => {
        if (data.transportation_ids.includes(transportationId)) return;
        setData('transportation_ids', [...data.transportation_ids, transportationId]);
    };
    const removeTransportation = (transportationId: number) => {
        setData(
            'transportation_ids',
            data.transportation_ids.filter((id) => id !== transportationId),
        );
    };

    const addItinerary = (itineraryId: number) => {
        if (data.itinerary_ids.includes(itineraryId)) return;
        setData('itinerary_ids', [...data.itinerary_ids, itineraryId]);
    };
    const removeItinerary = (itineraryId: number) => {
        setData('itinerary_ids', data.itinerary_ids.filter((id) => id !== itineraryId));
    };

    const addAdditionalService = (serviceId: number) => {
        if (data.additional_service_ids.includes(serviceId)) return;
        setData('additional_service_ids', [...data.additional_service_ids, serviceId]);
    };
    const removeAdditionalService = (serviceId: number) => {
        setData(
            'additional_service_ids',
            data.additional_service_ids.filter((id) => id !== serviceId),
        );
    };

    const selectedHotels = data.hotel_ids
        .map((id) => hotels.find((h) => h.id === id))
        .filter((h): h is UmrahHotel => h !== undefined);
    const selectedAirlines = data.airline_ids
        .map((id) => airlines.find((a) => a.id === id))
        .filter((a): a is UmrahAirline => a !== undefined);
    const selectedTransportations = data.transportation_ids
        .map((id) => transportations.find((t) => t.id === id))
        .filter((t): t is UmrahTransportation => t !== undefined);
    const selectedItineraries = data.itinerary_ids
        .map((id) => itineraries.find((i) => i.id === id))
        .filter((i): i is UmrahItinerary => i !== undefined);
    const selectedAdditionalServices = data.additional_service_ids
        .map((id) => additionalServices.find((s) => s.id === id))
        .filter((s): s is UmrahAdditionalService => s !== undefined);

    const [newServiceTitle, setNewServiceTitle] = useState('');

    const toggleServiceIncluded = (index: number) => {
        const updated = [...data.package_services];
        updated[index] = { ...updated[index], is_included: !updated[index].is_included };
        setData('package_services', updated);
    };
    const removeService = (index: number) => {
        setData('package_services', data.package_services.filter((_, i) => i !== index));
    };
    const addService = () => {
        const title = newServiceTitle.trim();
        if (!title) return;
        setData('package_services', [...data.package_services, { title, is_included: true }]);
        setNewServiceTitle('');
    };

    const updateBedType = (index: number, type: string) => {
        const updated = [...data.package_beds];
        updated[index] = { ...updated[index], type };
        setData('package_beds', updated);
    };
    const updateBedCount = (index: number, count: string) => {
        const parsed = Number.parseInt(count, 10);
        const value = Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
        const updated = [...data.package_beds];
        updated[index] = { ...updated[index], bed_count: value };
        setData('package_beds', updated);
    };
    const addBed = () => {
        setData('package_beds', [...data.package_beds, { type: '', bed_count: 1 }]);
    };
    const removeBed = (index: number) => {
        setData('package_beds', data.package_beds.filter((_, i) => i !== index));
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
                        <CardDescription>Update package information</CardDescription>
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
                                    placeholder="e.g., Discover Your Sacred Hajj Journey"
                                />
                                {errors.subtitle && (
                                    <p className="text-sm text-destructive">{errors.subtitle}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="color">Card Color (Optional)</Label>
                                <div className="flex items-center gap-3">
                                    <Input
                                        id="color"
                                        type="color"
                                        value={data.color || '#d4af37'}
                                        onChange={(e) => setData('color', e.target.value)}
                                        className="h-10 w-16 cursor-pointer p-1"
                                    />
                                    <Input
                                        type="text"
                                        value={data.color}
                                        onChange={(e) => setData('color', e.target.value)}
                                        placeholder="e.g., #d4af37"
                                        className="flex-1"
                                    />
                                </div>
                                {errors.color && (
                                    <p className="text-sm text-destructive">{errors.color}</p>
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
                                {errors.image && (
                                    <p className="text-sm text-destructive">{errors.image}</p>
                                )}
                            </div>

                            <div className="space-y-3">
                                <Label>Detail Gallery Images (Minimum 4)</Label>

                                {pkg.images && pkg.images.length > 0 && (
                                    <div className="grid grid-cols-2 gap-3">
                                        {pkg.images
                                            .filter((image) =>
                                                data.existing_gallery_image_ids.includes(image.id),
                                            )
                                            .map((image) => (
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
                                                        alt={`Gallery ${image.id}`}
                                                        className="aspect-video w-full object-cover"
                                                    />
                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        variant="destructive"
                                                        className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100"
                                                        onClick={() =>
                                                            removeExistingGalleryImage(image.id)
                                                        }
                                                    >
                                                        <Trash2 className="size-3" />
                                                    </Button>
                                                </div>
                                            ))}
                                    </div>
                                )}

                                <MultiImageUpload
                                    value={data.gallery_images}
                                    onChange={(files) => setData('gallery_images', files)}
                                    error={errors.gallery_images}
                                    minCount={4}
                                    compact={data.existing_gallery_image_ids.length > 0}
                                />
                                {errors.existing_gallery_image_ids && (
                                    <p className="text-sm text-destructive">
                                        {errors.existing_gallery_image_ids}
                                    </p>
                                )}
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
                                    {errors.departure && (
                                        <p className="text-sm text-destructive">{errors.departure}</p>
                                    )}
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
                                        required
                                    />
                                    {errors.departure_schedule && (
                                        <p className="text-sm text-destructive">
                                            {errors.departure_schedule}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="date">Date (Optional)</Label>
                                    <Input
                                        id="date"
                                        type="text"
                                        value={data.date}
                                        onChange={(e) => setData('date', e.target.value)}
                                    />
                                    {errors.date && (
                                        <p className="text-sm text-destructive">{errors.date}</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Headline Prices (per locale)</Label>
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                                    <div className="space-y-1">
                                        <Label htmlFor="price_idr" className="text-xs">
                                            IDR (Indonesia)
                                        </Label>
                                        <Input
                                            id="price_idr"
                                            type="number"
                                            step="0.01"
                                            value={data.price_idr}
                                            onChange={(e) => setData('price_idr', e.target.value)}
                                        />
                                        {data.price_idr && (
                                            <p className="text-xs text-muted-foreground">
                                                IDR {formatPrice(data.price_idr)}
                                            </p>
                                        )}
                                        {errors.price_idr && (
                                            <p className="text-sm text-destructive">
                                                {errors.price_idr}
                                            </p>
                                        )}
                                    </div>
                                    <div className="space-y-1">
                                        <Label htmlFor="price_usd" className="text-xs">
                                            USD (English)
                                        </Label>
                                        <Input
                                            id="price_usd"
                                            type="number"
                                            step="0.01"
                                            value={data.price_usd}
                                            onChange={(e) => setData('price_usd', e.target.value)}
                                        />
                                        {data.price_usd && (
                                            <p className="text-xs text-muted-foreground">
                                                USD {formatPrice(data.price_usd)}
                                            </p>
                                        )}
                                        {errors.price_usd && (
                                            <p className="text-sm text-destructive">
                                                {errors.price_usd}
                                            </p>
                                        )}
                                    </div>
                                    <div className="space-y-1">
                                        <Label htmlFor="price_sar" className="text-xs">
                                            SAR (Arabic)
                                        </Label>
                                        <Input
                                            id="price_sar"
                                            type="number"
                                            step="0.01"
                                            value={data.price_sar}
                                            onChange={(e) => setData('price_sar', e.target.value)}
                                        />
                                        {data.price_sar && (
                                            <p className="text-xs text-muted-foreground">
                                                SAR {formatPrice(data.price_sar)}
                                            </p>
                                        )}
                                        {errors.price_sar && (
                                            <p className="text-sm text-destructive">
                                                {errors.price_sar}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Room Prices (Quad / Triple / Double)</Label>
                                {(['idr', 'usd', 'sar'] as const).map((currency) => (
                                    <div key={currency} className="rounded-lg border p-3">
                                        <p className="mb-2 text-xs font-medium uppercase text-muted-foreground">
                                            {currency.toUpperCase()}
                                        </p>
                                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                                            {(['quad', 'triple', 'double'] as const).map((room) => {
                                                const fieldName =
                                                    `price_${room}_${currency}` as keyof HajjPackageFormData;
                                                const labelMap = {
                                                    quad: 'Quad',
                                                    triple: 'Triple',
                                                    double: 'Double',
                                                };
                                                return (
                                                    <div key={room} className="space-y-1">
                                                        <Label
                                                            htmlFor={fieldName}
                                                            className="text-xs"
                                                        >
                                                            {labelMap[room]}
                                                        </Label>
                                                        <Input
                                                            id={fieldName}
                                                            type="number"
                                                            step="0.01"
                                                            value={
                                                                (data[fieldName] as string) ?? ''
                                                            }
                                                            onChange={(e) =>
                                                                setData(
                                                                    fieldName,
                                                                    e.target
                                                                        .value as never,
                                                                )
                                                            }
                                                        />
                                                        {errors[fieldName] && (
                                                            <p className="text-sm text-destructive">
                                                                {errors[fieldName] as string}
                                                            </p>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-2">
                                <Label>Bed Configuration</Label>
                                <div className="space-y-2">
                                    {data.package_beds.map((bed, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center gap-2 rounded-lg border p-3"
                                        >
                                            <BedDouble className="size-4 shrink-0 text-muted-foreground" />
                                            <Input
                                                type="text"
                                                value={bed.type}
                                                onChange={(e) =>
                                                    updateBedType(index, e.target.value)
                                                }
                                                placeholder="Type (e.g., Quad)"
                                                className="h-8 flex-1 text-sm"
                                            />
                                            <Input
                                                type="number"
                                                min={0}
                                                max={100}
                                                value={bed.bed_count}
                                                onChange={(e) =>
                                                    updateBedCount(index, e.target.value)
                                                }
                                                className="h-8 w-24 text-sm"
                                            />
                                            <span className="text-xs text-muted-foreground">
                                                beds
                                            </span>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="size-8 shrink-0 p-0 text-muted-foreground hover:text-destructive"
                                                onClick={() => removeBed(index)}
                                            >
                                                <X className="size-4" />
                                            </Button>
                                        </div>
                                    ))}
                                    <Button type="button" variant="outline" size="sm" onClick={addBed}>
                                        <Plus className="mr-1 size-4" />
                                        Add Bed Configuration
                                    </Button>
                                </div>
                                {errors.package_beds && (
                                    <p className="text-sm text-destructive">
                                        {errors.package_beds}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="link">Link (Optional)</Label>
                                <Input
                                    id="link"
                                    type="url"
                                    value={data.link}
                                    onChange={(e) => setData('link', e.target.value)}
                                />
                                {errors.link && (
                                    <p className="text-sm text-destructive">{errors.link}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label>Hotels</Label>
                                <div className="space-y-2">
                                    {selectedHotels.map((hotel) => (
                                        <div
                                            key={hotel.id}
                                            className="flex flex-col gap-3 rounded-lg border p-3 sm:flex-row sm:items-center"
                                        >
                                            <div className="flex-1">
                                                <HotelItem hotel={hotel} />
                                            </div>
                                            <div className="flex items-center gap-2 sm:border-l sm:pl-3">
                                                <Moon className="size-3.5 shrink-0 text-muted-foreground" />
                                                <Label
                                                    htmlFor={`hotel_nights_${hotel.id}`}
                                                    className="text-xs font-normal text-muted-foreground"
                                                >
                                                    Nights
                                                </Label>
                                                <Input
                                                    id={`hotel_nights_${hotel.id}`}
                                                    type="number"
                                                    min={1}
                                                    max={365}
                                                    value={
                                                        data.hotel_nights[hotel.id] ??
                                                        DEFAULT_HOTEL_NIGHTS
                                                    }
                                                    onChange={(e) =>
                                                        setHotelNights(hotel.id, e.target.value)
                                                    }
                                                    className="h-8 w-16 text-sm"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    className="size-8 shrink-0 p-0 text-muted-foreground hover:text-destructive"
                                                    onClick={() => removeHotel(hotel.id)}
                                                >
                                                    <X className="size-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <ItemPickerDialog
                                    triggerLabel="Add Hotel"
                                    title="Add Hotel"
                                    description="Pick a hotel to include in this package."
                                    items={hotels}
                                    selectedIds={data.hotel_ids}
                                    onSelect={addHotel}
                                    renderItem={(hotel) => <HotelItem hotel={hotel} />}
                                    getSearchText={(hotel) => `${hotel.name} ${hotel.location}`}
                                    emptyAvailableMessage="All hotels are already added."
                                    emptyAllMessage="No hotels available. Add hotels first."
                                />
                                {errors.hotel_nights && (
                                    <p className="text-sm text-destructive">{errors.hotel_nights}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label>Airlines</Label>
                                <div className="space-y-2">
                                    {selectedAirlines.map((airline) => {
                                        const currentClass =
                                            data.airline_classes[airline.id] ?? DEFAULT_AIRLINE_CLASS;
                                        const isPreset = (
                                            PRESET_AIRLINE_CLASSES as readonly string[]
                                        ).includes(currentClass);
                                        return (
                                            <div
                                                key={airline.id}
                                                className="flex flex-col gap-3 rounded-lg border p-3"
                                            >
                                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                                                    <div className="flex-1">
                                                        <AirlineItem airline={airline} />
                                                    </div>
                                                    <div className="flex items-center gap-2 sm:border-l sm:pl-3">
                                                        <Select
                                                            value={isPreset ? currentClass : 'custom'}
                                                            onValueChange={(value) => {
                                                                if (value === 'custom') {
                                                                    setAirlineClass(
                                                                        airline.id,
                                                                        isPreset ? '' : currentClass,
                                                                    );
                                                                } else {
                                                                    setAirlineClass(
                                                                        airline.id,
                                                                        value,
                                                                    );
                                                                }
                                                            }}
                                                        >
                                                            <SelectTrigger className="h-8 w-32 text-sm">
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {PRESET_AIRLINE_CLASSES.map(
                                                                    (preset) => (
                                                                        <SelectItem
                                                                            key={preset}
                                                                            value={preset}
                                                                        >
                                                                            {
                                                                                AIRLINE_CLASS_LABELS[
                                                                                    preset
                                                                                ]
                                                                            }
                                                                        </SelectItem>
                                                                    ),
                                                                )}
                                                                <SelectItem value="custom">
                                                                    Custom...
                                                                </SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        {!isPreset && (
                                                            <Input
                                                                type="text"
                                                                value={currentClass}
                                                                onChange={(e) =>
                                                                    setAirlineClass(
                                                                        airline.id,
                                                                        e.target.value,
                                                                    )
                                                                }
                                                                placeholder="Custom class"
                                                                className="h-8 w-32 text-sm"
                                                            />
                                                        )}
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            className="size-8 shrink-0 p-0 text-muted-foreground hover:text-destructive"
                                                            onClick={() => removeAirline(airline.id)}
                                                        >
                                                            <X className="size-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:border-t sm:pt-3">
                                                    <div className="space-y-1">
                                                        <Label
                                                            htmlFor={`airline_meal_${airline.id}`}
                                                            className="text-xs font-normal text-muted-foreground"
                                                        >
                                                            Meal (optional)
                                                        </Label>
                                                        <Input
                                                            id={`airline_meal_${airline.id}`}
                                                            type="text"
                                                            value={
                                                                data.airline_meals[airline.id] ?? ''
                                                            }
                                                            onChange={(e) =>
                                                                setAirlineMeal(
                                                                    airline.id,
                                                                    e.target.value,
                                                                )
                                                            }
                                                            className="h-8 text-sm"
                                                        />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <Label
                                                            htmlFor={`airline_baggage_${airline.id}`}
                                                            className="text-xs font-normal text-muted-foreground"
                                                        >
                                                            Baggage (optional)
                                                        </Label>
                                                        <Input
                                                            id={`airline_baggage_${airline.id}`}
                                                            type="text"
                                                            value={
                                                                data.airline_baggages[airline.id] ??
                                                                ''
                                                            }
                                                            onChange={(e) =>
                                                                setAirlineBaggage(
                                                                    airline.id,
                                                                    e.target.value,
                                                                )
                                                            }
                                                            className="h-8 text-sm"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                <ItemPickerDialog
                                    triggerLabel="Add Airline"
                                    title="Add Airline"
                                    description="Pick an airline to include in this package."
                                    items={airlines}
                                    selectedIds={data.airline_ids}
                                    onSelect={addAirline}
                                    renderItem={(airline) => <AirlineItem airline={airline} />}
                                    getSearchText={(airline) => airline.name}
                                    emptyAvailableMessage="All airlines are already added."
                                    emptyAllMessage="No airlines available. Add airlines first."
                                />
                                {errors.airline_classes && (
                                    <p className="text-sm text-destructive">
                                        {errors.airline_classes}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label>Transportations</Label>
                                <div className="space-y-2">
                                    {selectedTransportations.map((transportation) => (
                                        <div
                                            key={transportation.id}
                                            className="flex items-center gap-3 rounded-lg border p-3"
                                        >
                                            <div className="flex-1">
                                                <TransportationItem
                                                    transportation={transportation}
                                                />
                                            </div>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="size-8 shrink-0 p-0 text-muted-foreground hover:text-destructive"
                                                onClick={() =>
                                                    removeTransportation(transportation.id)
                                                }
                                            >
                                                <X className="size-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                                <ItemPickerDialog
                                    triggerLabel="Add Transportation"
                                    title="Add Transportation"
                                    description="Pick a transportation option to include in this package."
                                    items={transportations}
                                    selectedIds={data.transportation_ids}
                                    onSelect={addTransportation}
                                    renderItem={(transportation) => (
                                        <TransportationItem transportation={transportation} />
                                    )}
                                    getSearchText={(transportation) =>
                                        `${transportation.name} ${transportation.subtitle ?? ''}`
                                    }
                                    emptyAvailableMessage="All transportations are already added."
                                    emptyAllMessage="No transportations available. Add transportations first."
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Itinerary</Label>
                                <div className="space-y-2">
                                    {selectedItineraries.map((itinerary) => (
                                        <div
                                            key={itinerary.id}
                                            className="flex items-center gap-3 rounded-lg border p-3"
                                        >
                                            <div className="flex-1">
                                                <ItineraryItem itinerary={itinerary} />
                                            </div>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="size-8 shrink-0 p-0 text-muted-foreground hover:text-destructive"
                                                onClick={() => removeItinerary(itinerary.id)}
                                            >
                                                <X className="size-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                                <ItemPickerDialog
                                    triggerLabel="Add Itinerary"
                                    title="Add Itinerary"
                                    description="Pick an itinerary item to include in this package."
                                    items={itineraries}
                                    selectedIds={data.itinerary_ids}
                                    onSelect={addItinerary}
                                    renderItem={(itinerary) => <ItineraryItem itinerary={itinerary} />}
                                    getSearchText={(itinerary) =>
                                        `${itinerary.title} ${itinerary.location ?? ''}`
                                    }
                                    emptyAvailableMessage="All itinerary items are already added."
                                    emptyAllMessage="No itinerary items available. Add itinerary items first."
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Additional Services</Label>
                                <div className="space-y-2">
                                    {selectedAdditionalServices.map((service) => (
                                        <div
                                            key={service.id}
                                            className="flex items-center gap-3 rounded-lg border p-3"
                                        >
                                            <div className="flex-1">
                                                <AdditionalServiceItem service={service} />
                                            </div>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="size-8 shrink-0 p-0 text-muted-foreground hover:text-destructive"
                                                onClick={() => removeAdditionalService(service.id)}
                                            >
                                                <X className="size-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                                <ItemPickerDialog
                                    triggerLabel="Add Additional Service"
                                    title="Add Additional Service"
                                    description="Pick an additional service to include in this package."
                                    items={additionalServices}
                                    selectedIds={data.additional_service_ids}
                                    onSelect={addAdditionalService}
                                    renderItem={(service) => (
                                        <AdditionalServiceItem service={service} />
                                    )}
                                    getSearchText={(service) => service.title}
                                    emptyAvailableMessage="All additional services are already added."
                                    emptyAllMessage="No additional services available. Add additional services first."
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Package Services</Label>
                                <div className="space-y-2">
                                    {data.package_services.map((service, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center gap-2.5 rounded-lg border px-3 py-2"
                                        >
                                            <button
                                                type="button"
                                                onClick={() => toggleServiceIncluded(index)}
                                                className={cn(
                                                    'flex shrink-0 items-center gap-1.5 rounded-full py-0.5 pl-1 pr-2 text-xs font-medium transition-colors',
                                                    service.is_included
                                                        ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                                                        : 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
                                                )}
                                            >
                                                {service.is_included ? (
                                                    <Check className="size-3.5" />
                                                ) : (
                                                    <DollarSign className="size-3.5" />
                                                )}
                                                {service.is_included ? 'Included' : 'Extra fee'}
                                            </button>
                                            <span className="flex-1 text-sm">{service.title}</span>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="size-7 shrink-0 p-0 text-muted-foreground hover:text-destructive"
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
                                    onCheckedChange={(checked) => setData('is_active', checked)}
                                />
                                <Label htmlFor="is_active">Active</Label>
                            </div>

                            <div className="flex gap-3">
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Updating...' : 'Update Package'}
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
