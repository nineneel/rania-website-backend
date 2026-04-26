import { cn } from '@/lib/utils';
import {
    type UmrahAdditionalService,
    type UmrahAirline,
    type UmrahHotel,
    type UmrahItinerary,
    type UmrahTransportation,
} from '@/types';
import { Building2, Bus, MapPin, Plane, Star } from 'lucide-react';

export function HotelItem({ hotel }: { hotel: UmrahHotel }) {
    return (
        <div className="flex w-full gap-3">
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
    );
}

export function AirlineItem({ airline }: { airline: UmrahAirline }) {
    return (
        <div className="flex w-full items-center gap-3">
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
    );
}

export function TransportationItem({ transportation }: { transportation: UmrahTransportation }) {
    return (
        <div className="flex w-full items-center gap-3">
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
    );
}

export function ItineraryItem({ itinerary }: { itinerary: UmrahItinerary }) {
    return (
        <div className="flex w-full gap-3">
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
    );
}

export function AdditionalServiceItem({ service }: { service: UmrahAdditionalService }) {
    return (
        <div className="flex w-full gap-3">
            {service.image_url ? (
                <img
                    src={service.image_url}
                    alt={service.title}
                    className="size-12 shrink-0 rounded-md object-cover"
                />
            ) : (
                <div className="flex size-12 shrink-0 items-center justify-center rounded-md bg-muted">
                    <Star className="size-5 text-muted-foreground" />
                </div>
            )}
            <div className="min-w-0 flex-1">
                <p className="truncate pr-6 text-sm font-medium">{service.title}</p>
                {service.description && (
                    <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                        {service.description}
                    </p>
                )}
            </div>
        </div>
    );
}
