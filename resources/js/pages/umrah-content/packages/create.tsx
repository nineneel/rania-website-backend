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
    type UmrahAdditionalService,
    type UmrahAirline,
    type UmrahCategory,
    type UmrahHotel,
    type UmrahItinerary,
    type UmrahPackageFormData,
    type UmrahTransportation,
} from '@/types';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Head, useForm } from '@inertiajs/react';
import { ArrowLeft, Check, DollarSign, Moon, Plus, X } from 'lucide-react';
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
    additionalServices: UmrahAdditionalService[];
    categories: UmrahCategory[];
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
    additionalServices,
    categories,
}: CreatePackageProps) {
    const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);

    const { data, setData, post, processing, errors } = useForm<UmrahPackageFormData>({
        umrah_category_id: '',
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
        date: '',
        price_idr: '',
        price_usd: '',
        price_sar: '',
        link: '',
        is_active: true,
        hotel_ids: [],
        hotel_nights: {},
        airline_ids: [],
        airline_classes: {},
        airline_meals: {},
        airline_baggages: {},
        transportation_ids: [],
        itinerary_ids: [],
        additional_service_ids: [],
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

    const addHotel = (hotelId: number) => {
        if (data.hotel_ids.includes(hotelId)) {
            return;
        }
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
        if (data.airline_ids.includes(airlineId)) {
            return;
        }
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
        if (data.transportation_ids.includes(transportationId)) {
            return;
        }
        setData('transportation_ids', [...data.transportation_ids, transportationId]);
    };

    const removeTransportation = (transportationId: number) => {
        setData(
            'transportation_ids',
            data.transportation_ids.filter((id) => id !== transportationId),
        );
    };

    const addItinerary = (itineraryId: number) => {
        if (data.itinerary_ids.includes(itineraryId)) {
            return;
        }
        setData('itinerary_ids', [...data.itinerary_ids, itineraryId]);
    };

    const removeItinerary = (itineraryId: number) => {
        setData('itinerary_ids', data.itinerary_ids.filter((id) => id !== itineraryId));
    };

    const addAdditionalService = (serviceId: number) => {
        if (data.additional_service_ids.includes(serviceId)) {
            return;
        }
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
                                <Label htmlFor="umrah_category_id">Category (Optional)</Label>
                                <Select
                                    value={
                                        data.umrah_category_id === ''
                                            ? 'none'
                                            : String(data.umrah_category_id)
                                    }
                                    onValueChange={(value) =>
                                        setData(
                                            'umrah_category_id',
                                            value === 'none' ? '' : Number(value),
                                        )
                                    }
                                >
                                    <SelectTrigger id="umrah_category_id">
                                        <SelectValue placeholder="Select a category..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">No category</SelectItem>
                                        {categories.map((category) => (
                                            <SelectItem
                                                key={category.id}
                                                value={String(category.id)}
                                            >
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.umrah_category_id && (
                                    <p className="text-sm text-destructive">
                                        {errors.umrah_category_id}
                                    </p>
                                )}
                            </div>

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
                                    <Label htmlFor="date">Date (Optional)</Label>
                                    <Input
                                        id="date"
                                        type="text"
                                        value={data.date}
                                        onChange={(e) => setData('date', e.target.value)}
                                        placeholder="e.g., 15 Mar 2026 or 15-20 Mar 2026"
                                    />
                                    {errors.date && (
                                        <p className="text-sm text-destructive">{errors.date}</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Prices (per locale)</Label>
                                <p className="text-xs text-muted-foreground">
                                    Enter the price for each locale. IDR is required; USD &amp; SAR are
                                    optional.
                                </p>
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
                                            placeholder="54800000.00"
                                            required
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
                                            placeholder="3500.00"
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
                                            placeholder="13125.00"
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
                                <Label>Hotels</Label>
                                <p className="text-xs text-muted-foreground">
                                    Add hotels and set the number of nights spent in each
                                    (default {DEFAULT_HOTEL_NIGHTS} nights).
                                </p>
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
                                <p className="text-xs text-muted-foreground">
                                    Pick the travel class for each airline (default Economy).
                                </p>
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
                                                                    setAirlineClass(airline.id, value);
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
                                                            placeholder="e.g., 2× Hidangan Premium Selama Penerbangan"
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
                                                            placeholder="e.g., 23 Kg (2Pcs)"
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
                                                <TransportationItem transportation={transportation} />
                                            </div>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="size-8 shrink-0 p-0 text-muted-foreground hover:text-destructive"
                                                onClick={() => removeTransportation(transportation.id)}
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
                                    renderItem={(service) => <AdditionalServiceItem service={service} />}
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
