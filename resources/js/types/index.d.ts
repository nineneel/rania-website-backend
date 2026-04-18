import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export type UserRole = 'super-admin' | 'admin' | 'editor';

export interface User {
    id: number;
    name: string;
    email: string;
    role: UserRole;
    avatar?: string;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

export interface PaginatedData<T> {
    data: T[];
    current_page: number;
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: PaginationLink[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}

export interface HeroSlide {
    id: number;
    title: string;
    subtitle: string;
    image_path: string;
    image_url?: string;
    order: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface Event {
    id: number;
    title: string;
    description: string;
    image_path: string;
    image_url?: string;
    link: string | null;
    is_available: boolean;
    order: number;
    created_at: string;
    updated_at: string;
}

export interface HeroSlideFormData {
    title: string;
    subtitle: string;
    image: File | null;
    is_active: boolean;
}

export interface EventFormData {
    title: string;
    description: string;
    image: File | null;
    link: string;
    is_available: boolean;
}

// Umrah Types
export interface UmrahAirline {
    id: number;
    name: string;
    logo_path: string;
    logo_url: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface UmrahHotel {
    id: number;
    name: string;
    stars: number;
    location: string;
    description?: string;
    image_path?: string;
    image_url?: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface UmrahPackage {
    id: number;
    title: string;
    slug: string;
    subtitle?: string;
    description: string;
    image_path: string;
    image_url: string;
    departure: string;
    duration: string;
    departure_schedule: string;
    price: string;
    currency: string;
    link: string | null;
    is_active: boolean;
    order: number;
    hotels: UmrahHotel[];
    airlines: UmrahAirline[];
    transportations?: UmrahTransportation[];
    itineraries?: UmrahItinerary[];
    additional_services?: UmrahAdditionalService[];
    services?: UmrahPackageService[];
    package_services?: UmrahPackageService[];
    images?: UmrahPackageImage[];
    created_at: string;
    updated_at: string;
}

export interface UmrahPackageImage {
    id: number;
    image_path?: string;
    image_url?: string;
    order: number;
}

export interface UmrahTransportation {
    id: number;
    name: string;
    description?: string;
    icon_path?: string;
    icon_url?: string;
    is_active: boolean;
    order: number;
    created_at: string;
    updated_at: string;
}

export interface UmrahItinerary {
    id: number;
    title: string;
    location?: string;
    description: string;
    image_path?: string;
    image_url?: string;
    is_active: boolean;
    order: number;
    created_at: string;
    updated_at: string;
}

export interface UmrahAdditionalService {
    id: number;
    title: string;
    description: string;
    image_path?: string;
    image_url?: string;
    is_active: boolean;
    order: number;
    created_at: string;
    updated_at: string;
}

export interface UmrahPackageService {
    id: number;
    title: string;
    description?: string;
    is_included: boolean;
    order: number;
}

export interface UmrahPackageServiceFormData {
    title: string;
    is_included: boolean;
}

export interface UmrahAirlineFormData {
    name: string;
    logo: File | null;
    is_active: boolean;
}

export interface UmrahHotelFormData {
    name: string;
    stars: number;
    location: string;
    description: string;
    image: File | null;
    is_active: boolean;
}

export interface UmrahPackageFormData {
    title: string;
    slug: string;
    subtitle: string;
    description: string;
    image: File | null;
    gallery_images: File[];
    existing_gallery_image_ids: number[];
    departure: string;
    duration: string;
    departure_schedule: string;
    price: string;
    currency: string;
    link: string;
    is_active: boolean;
    hotel_ids: number[];
    airline_ids: number[];
    transportation_ids: number[];
    itinerary_ids: number[];
    additional_service_ids: number[];
    package_services: UmrahPackageServiceFormData[];
}

export interface UmrahTransportationFormData {
    name: string;
    description: string;
    icon: File | null;
    is_active: boolean;
}

export interface UmrahItineraryFormData {
    title: string;
    location: string;
    description: string;
    image: File | null;
    is_active: boolean;
}

export interface UmrahAdditionalServiceFormData {
    title: string;
    description: string;
    image: File | null;
    is_active: boolean;
}

// Contact Message Types
export type ContactMessageStatus = 'new' | 'read' | 'replied';

export interface ContactMessage {
    id: number;
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
    status: ContactMessageStatus;
    created_at: string;
    updated_at: string;
}

export interface ContactMessageCounts {
    all: number;
    new: number;
    read: number;
    replied: number;
}

// Social Media Types
export interface SocialMedia {
    id: number;
    name: string;
    url: string;
    icon_path: string | null;
    icon_url: string | null;
    order: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface SocialMediaFormData {
    name: string;
    url: string;
    icon: File | null;
    is_active: boolean;
}

// Testimonial Types
export interface Testimonial {
    id: number;
    name: string;
    subtitle: string | null;
    text: string;
    is_active: boolean;
    order: number;
    created_at: string;
    updated_at: string;
}

export interface TestimonialFormData {
    name: string;
    subtitle: string;
    text: string;
    is_active: boolean;
}

// Linktree Types
export interface LinktreeLink {
    id: number;
    title: string;
    url: string;
    order: number;
    is_active: boolean;
    click_count: number;
    created_at: string;
    updated_at: string;
}

export interface LinktreeLinkFormData {
    title: string;
    url: string;
    is_active: boolean;
}

export interface LinktreeAnalytics {
    total_clicks: number;
    total_clicks_today: number;
    total_clicks_this_week: number;
    top_links: Array<{
        id: number;
        title: string;
        click_count: number;
    }>;
    clicks_by_day: Array<{
        date: string;
        count: number;
    }>;
}

// FAQ Types
export interface FAQ {
    id: number;
    question: string;
    answer: string;
    is_active: boolean;
    order: number;
    created_at: string;
    updated_at: string;
}

export interface FAQFormData {
    question: string;
    answer: string;
    is_active: boolean;
}
