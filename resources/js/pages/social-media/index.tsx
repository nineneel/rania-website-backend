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
import { type BreadcrumbItem, type SocialMedia } from '@/types';
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
import { Edit, ExternalLink, GripVertical, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface SocialMediaIndexProps {
    socialMedia: SocialMedia[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Social Media',
        href: '/social-media',
    },
];

function SortableRow({
    item,
    onDelete,
}: {
    item: SocialMedia;
    onDelete: () => void;
}) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
        useSortable({ id: item.id });

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
                {item.icon_url ? (
                    <img
                        src={item.icon_url}
                        alt={item.name}
                        className="h-8 w-8 rounded object-contain"
                    />
                ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded bg-muted text-xs text-muted-foreground">
                        No Icon
                    </div>
                )}
            </td>
            <td className="p-3 font-medium">{item.name}</td>
            <td className="p-3 text-muted-foreground">
                <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 hover:underline"
                >
                    {item.url.length > 50
                        ? item.url.substring(0, 50) + '...'
                        : item.url}
                    <ExternalLink className="h-3 w-3" />
                </a>
            </td>
            <td className="p-3">
                <Switch checked={item.is_active} disabled />
            </td>
            <td className="p-3">
                <div className="flex justify-end gap-2">
                    <Link href={`/social-media/${item.id}/edit`}>
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

export default function SocialMediaIndex({ socialMedia }: SocialMediaIndexProps) {
    const [items, setItems] = useState(socialMedia);

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

        setItems((currentItems) => {
            const oldIndex = currentItems.findIndex((item) => item.id === active.id);
            const newIndex = currentItems.findIndex((item) => item.id === over.id);
            const newItems = arrayMove(currentItems, oldIndex, newIndex);

            // Update order in backend
            const orderedItems = newItems.map((item, index) => ({
                id: item.id,
                order: index,
            }));

            router.post(
                '/social-media/reorder',
                { items: orderedItems },
                { preserveScroll: true },
            );

            return newItems;
        });
    };

    const handleDelete = (itemId: number) => {
        if (confirm('Are you sure you want to delete this social media?')) {
            router.delete(`/social-media/${itemId}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Social Media Management" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Social Media Management</CardTitle>
                                <CardDescription>
                                    Manage social media links displayed on the website. Drag
                                    to reorder.
                                </CardDescription>
                            </div>
                            <Link href="/social-media/create">
                                <Button>
                                    <Plus className="mr-2 size-4" />
                                    Add Social Media
                                </Button>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {items.length === 0 ? (
                            <div className="py-8 text-center text-muted-foreground">
                                No social media links yet. Add your first one!
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
                                                    Icon
                                                </th>
                                                <th className="p-3 text-left font-medium">
                                                    Name
                                                </th>
                                                <th className="p-3 text-left font-medium">
                                                    URL
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
                                            items={items.map((item) => item.id)}
                                            strategy={verticalListSortingStrategy}
                                        >
                                            <tbody>
                                                {items.map((item) => (
                                                    <SortableRow
                                                        key={item.id}
                                                        item={item}
                                                        onDelete={() =>
                                                            handleDelete(item.id)
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
