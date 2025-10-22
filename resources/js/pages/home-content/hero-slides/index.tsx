import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type HeroSlide } from '@/types';
import {
    DndContext,
    DragEndEvent,
    PointerSensor,
    closestCenter,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    SortableContext,
    arrayMove,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Head, Link, router } from '@inertiajs/react';
import { Edit, GripVertical, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface HeroSlidesIndexProps {
    heroSlides: HeroSlide[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Home Content',
        href: '/home-content',
    },
    {
        title: 'Hero Slides',
        href: '/home-content/hero-slides',
    },
];

function SortableRow({ slide, onDelete }: { slide: HeroSlide; onDelete: () => void }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
        useSortable({ id: slide.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <tr
            ref={setNodeRef}
            style={style}
            className="border-b last:border-0 hover:bg-muted/50"
        >
            <td className="p-3">
                <div
                    {...attributes}
                    {...listeners}
                    className="flex cursor-grab items-center active:cursor-grabbing"
                >
                    <GripVertical className="h-5 w-5 text-muted-foreground" />
                </div>
            </td>
            <td className="p-3">
                <img
                    src={slide.image_url || `/storage/${slide.image_path}`}
                    alt={slide.title}
                    className="h-16 w-24 rounded object-cover"
                />
            </td>
            <td className="p-3 font-medium">{slide.title}</td>
            <td className="p-3 text-muted-foreground">{slide.subtitle}</td>
            <td className="p-3">
                <Switch checked={slide.is_active} disabled />
            </td>
            <td className="p-3">
                <div className="flex justify-end gap-2">
                    <Link href={`/home-content/hero-slides/${slide.id}/edit`}>
                        <Button variant="ghost" size="sm">
                            <Edit className="size-4" />
                        </Button>
                    </Link>
                    <Button variant="ghost" size="sm" onClick={onDelete}>
                        <Trash2 className="size-4" />
                    </Button>
                </div>
            </td>
        </tr>
    );
}

export default function HeroSlidesIndex({ heroSlides }: HeroSlidesIndexProps) {
    const [slides, setSlides] = useState(heroSlides);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        setSlides((items) => {
            const oldIndex = items.findIndex((item) => item.id === active.id);
            const newIndex = items.findIndex((item) => item.id === over.id);
            const newItems = arrayMove(items, oldIndex, newIndex);

            // Update order in backend
            const orderedItems = newItems.map((item, index) => ({
                id: item.id,
                order: index,
            }));

            router.post(
                '/home-content/hero-slides/reorder',
                { items: orderedItems },
                { preserveScroll: true },
            );

            return newItems;
        });
    };

    const handleDelete = (slideId: number) => {
        if (confirm('Are you sure you want to delete this hero slide?')) {
            router.delete(`/home-content/hero-slides/${slideId}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Hero Slides Management" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Hero Slides Management</CardTitle>
                                <CardDescription>
                                    Manage hero slides displayed on the home page. Drag to
                                    reorder.
                                </CardDescription>
                            </div>
                            <Link href="/home-content/hero-slides/create">
                                <Button>
                                    <Plus className="mr-2 size-4" />
                                    Add Hero Slide
                                </Button>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {slides.length === 0 ? (
                            <div className="py-8 text-center text-muted-foreground">
                                No hero slides yet. Add your first one!
                            </div>
                        ) : (
                            <DndContext
                                sensors={sensors}
                                collisionDetection={closestCenter}
                                onDragEnd={handleDragEnd}
                            >
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="border-b">
                                            <tr className="text-sm text-muted-foreground">
                                                <th className="w-12 p-3"></th>
                                                <th className="p-3 text-left font-medium">
                                                    Image
                                                </th>
                                                <th className="p-3 text-left font-medium">
                                                    Title
                                                </th>
                                                <th className="p-3 text-left font-medium">
                                                    Subtitle
                                                </th>
                                                <th className="p-3 text-left font-medium">
                                                    Status
                                                </th>
                                                <th className="p-3 text-right font-medium">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <SortableContext
                                            items={slides.map((s) => s.id)}
                                            strategy={verticalListSortingStrategy}
                                        >
                                            <tbody>
                                                {slides.map((slide) => (
                                                    <SortableRow
                                                        key={slide.id}
                                                        slide={slide}
                                                        onDelete={() =>
                                                            handleDelete(slide.id)
                                                        }
                                                    />
                                                ))}
                                            </tbody>
                                        </SortableContext>
                                    </table>
                                </div>
                            </DndContext>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
