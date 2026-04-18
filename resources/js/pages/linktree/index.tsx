import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import {
    type BreadcrumbItem,
    type LinktreeAnalytics,
    type LinktreeLink,
} from '@/types';
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
import {
    BarChart3,
    Edit,
    ExternalLink,
    GripVertical,
    MousePointerClick,
    Plus,
    Trash2,
} from 'lucide-react';
import { useState } from 'react';

interface LinktreeIndexProps {
    links: LinktreeLink[];
    analytics: LinktreeAnalytics;
    activeTab?: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Linktree',
        href: '/linktree',
    },
];

function LinkSortableRow({
    item,
    onDelete,
}: {
    item: LinktreeLink;
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
            <td className="p-3 font-medium">{item.title}</td>
            <td className="p-3 text-muted-foreground">
                <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 hover:underline"
                >
                    {item.url.length > 60 ? item.url.substring(0, 60) + '...' : item.url}
                    <ExternalLink className="h-3 w-3" />
                </a>
            </td>
            <td className="p-3 text-center text-muted-foreground">
                {item.click_count.toLocaleString()}
            </td>
            <td className="p-3">
                <Badge variant={item.is_active ? 'default' : 'secondary'}>
                    {item.is_active ? 'Active' : 'Inactive'}
                </Badge>
            </td>
            <td className="p-3">
                <div className="flex justify-end gap-2">
                    <Link href={`/linktree/links/${item.id}/edit`}>
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

export default function LinktreeIndex({
    links,
    analytics,
    activeTab = 'links',
}: LinktreeIndexProps) {
    const [items, setItems] = useState(links);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
    );

    const handleLinksDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) {
            return;
        }

        setItems((currentItems) => {
            const oldIndex = currentItems.findIndex((item) => item.id === active.id);
            const newIndex = currentItems.findIndex((item) => item.id === over.id);
            const newItems = arrayMove(currentItems, oldIndex, newIndex);

            const orderedItems = newItems.map((item, index) => ({
                id: item.id,
                order: index,
            }));

            router.post(
                '/linktree/links/reorder',
                { items: orderedItems },
                { preserveScroll: true },
            );

            return newItems;
        });
    };

    const handleDeleteLink = (itemId: number) => {
        if (confirm('Are you sure you want to delete this link?')) {
            router.delete(`/linktree/links/${itemId}`, {
                preserveScroll: true,
                onSuccess: () => {
                    setItems((current) => current.filter((item) => item.id !== itemId));
                },
            });
        }
    };

    const handleTabChange = (value: string) => {
        router.get(
            '/linktree',
            { tab: value },
            { preserveScroll: true, preserveState: true, replace: true },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Linktree Management" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <Tabs defaultValue={activeTab} onValueChange={handleTabChange} className="w-full">
                    <TabsList className="grid w-full max-w-md grid-cols-2">
                        <TabsTrigger value="links">Links</TabsTrigger>
                        <TabsTrigger value="analytics">Analytics</TabsTrigger>
                    </TabsList>

                    {/* Links Tab */}
                    <TabsContent value="links">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle>Linktree Links</CardTitle>
                                        <CardDescription>
                                            Manage the buttons shown on the Linktree page. Drag to
                                            reorder.
                                        </CardDescription>
                                    </div>
                                    <Link href="/linktree/links/create">
                                        <Button>
                                            <Plus className="mr-2 size-4" />
                                            Add Link
                                        </Button>
                                    </Link>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {items.length === 0 ? (
                                    <div className="py-8 text-center text-muted-foreground">
                                        No links yet. Add your first one!
                                    </div>
                                ) : (
                                    <DndContext
                                        sensors={sensors}
                                        collisionDetection={closestCenter}
                                        onDragEnd={handleLinksDragEnd}
                                    >
                                        <div className="overflow-x-auto">
                                            <table className="w-full">
                                                <thead className="border-b">
                                                    <tr className="text-sm text-muted-foreground">
                                                        <th className="w-12 p-3"></th>
                                                        <th className="p-3 text-left font-medium">
                                                            Title
                                                        </th>
                                                        <th className="p-3 text-left font-medium">
                                                            URL
                                                        </th>
                                                        <th className="p-3 text-center font-medium">
                                                            Clicks
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
                                                            <LinkSortableRow
                                                                key={item.id}
                                                                item={item}
                                                                onDelete={() => handleDeleteLink(item.id)}
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
                    </TabsContent>

                    {/* Analytics Tab */}
                    <TabsContent value="analytics">
                        <div className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-3">
                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardDescription>Total Clicks</CardDescription>
                                        <CardTitle className="flex items-center gap-2 text-3xl">
                                            <MousePointerClick className="size-6 text-muted-foreground" />
                                            {analytics.total_clicks.toLocaleString()}
                                        </CardTitle>
                                    </CardHeader>
                                </Card>
                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardDescription>Today</CardDescription>
                                        <CardTitle className="text-3xl">
                                            {analytics.total_clicks_today.toLocaleString()}
                                        </CardTitle>
                                    </CardHeader>
                                </Card>
                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardDescription>This Week</CardDescription>
                                        <CardTitle className="text-3xl">
                                            {analytics.total_clicks_this_week.toLocaleString()}
                                        </CardTitle>
                                    </CardHeader>
                                </Card>
                            </div>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <BarChart3 className="size-5" />
                                        Top Links
                                    </CardTitle>
                                    <CardDescription>
                                        Most clicked links of all time.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {analytics.top_links.length === 0 ? (
                                        <div className="py-6 text-center text-muted-foreground">
                                            No click data yet.
                                        </div>
                                    ) : (
                                        <div className="overflow-x-auto">
                                            <table className="w-full">
                                                <thead className="border-b">
                                                    <tr className="text-sm text-muted-foreground">
                                                        <th className="p-3 text-left font-medium">
                                                            Title
                                                        </th>
                                                        <th className="p-3 text-right font-medium">
                                                            Clicks
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {analytics.top_links.map((row) => (
                                                        <tr
                                                            key={row.id}
                                                            className="border-b last:border-0"
                                                        >
                                                            <td className="p-3 font-medium">
                                                                {row.title}
                                                            </td>
                                                            <td className="p-3 text-right">
                                                                {row.click_count.toLocaleString()}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Clicks by Day (last 14 days)</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {analytics.clicks_by_day.length === 0 ? (
                                        <div className="py-6 text-center text-muted-foreground">
                                            No click data yet.
                                        </div>
                                    ) : (
                                        <div className="overflow-x-auto">
                                            <table className="w-full">
                                                <thead className="border-b">
                                                    <tr className="text-sm text-muted-foreground">
                                                        <th className="p-3 text-left font-medium">
                                                            Date
                                                        </th>
                                                        <th className="p-3 text-right font-medium">
                                                            Clicks
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {analytics.clicks_by_day.map((row) => (
                                                        <tr
                                                            key={row.date}
                                                            className="border-b last:border-0"
                                                        >
                                                            <td className="p-3">{row.date}</td>
                                                            <td className="p-3 text-right">
                                                                {row.count.toLocaleString()}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </AppLayout>
    );
}
