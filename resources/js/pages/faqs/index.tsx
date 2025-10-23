import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type FAQ } from '@/types';
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

interface FAQsIndexProps {
    faqs: FAQ[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'FAQs',
        href: '/faqs',
    },
];

function SortableRow({
    item,
    onDelete,
}: {
    item: FAQ;
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
            <td className="p-3 font-medium">
                <div className="max-w-md">
                    {item.question}
                </div>
            </td>
            <td className="p-3 text-muted-foreground">
                <div className="max-w-lg truncate">
                    {item.answer}
                </div>
            </td>
            <td className="p-3">
                <Badge
                    variant={
                        item.is_active
                            ? 'default'
                            : 'secondary'
                    }
                >
                    {item.is_active
                        ? 'Active'
                        : 'Inactive'}
                </Badge>
            </td>
            <td className="p-3">
                <div className="flex justify-end gap-2">
                    <Link
                        href={`/faqs/${item.id}/edit`}
                    >
                        <Button variant="ghost" size="sm">
                            <Edit className="size-4" />
                        </Button>
                    </Link>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onDelete}
                    >
                        <Trash2 className="size-4" />
                    </Button>
                </div>
            </td>
        </tr>
    );
}

export default function FAQsIndex({ faqs }: FAQsIndexProps) {
    const [items, setItems] = useState(faqs);

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
                '/faqs/reorder',
                { items: orderedItems },
                { preserveScroll: true },
            );

            return newItems;
        });
    };

    const handleDelete = (faqId: number) => {
        if (confirm('Are you sure you want to delete this FAQ?')) {
            router.delete(`/faqs/${faqId}`, {
                onSuccess: () => {
                    setItems((currentItems) =>
                        currentItems.filter((item) => item.id !== faqId),
                    );
                },
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="FAQ Management" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>FAQ Management</CardTitle>
                                <CardDescription>
                                    Manage frequently asked questions displayed on the Support & Help page. Drag to reorder.
                                </CardDescription>
                            </div>
                            <Link href="/faqs/create">
                                <Button>
                                    <Plus className="mr-2 size-4" />
                                    Add FAQ
                                </Button>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {items.length === 0 ? (
                            <div className="py-8 text-center text-muted-foreground">
                                No FAQs yet. Add your first one!
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
                                                    Question
                                                </th>
                                                <th className="p-3 text-left font-medium">
                                                    Answer
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
