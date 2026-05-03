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
import { type BreadcrumbItem, type PaginatedData, type RaniaGallery } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Edit, Plus, Trash2 } from 'lucide-react';

interface RaniaGalleriesIndexProps {
    galleries: PaginatedData<RaniaGallery>;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Rania Gallery',
        href: '/rania-galleries',
    },
];

export default function RaniaGalleriesIndex({ galleries }: RaniaGalleriesIndexProps) {
    const handleDelete = (galleryId: number) => {
        if (confirm('Are you sure you want to delete this gallery image?')) {
            router.delete(`/rania-galleries/${galleryId}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Rania Gallery" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Rania Gallery</CardTitle>
                                <CardDescription>
                                    Manage gallery images displayed on the Rania Gallery section.
                                </CardDescription>
                            </div>
                            <Link href="/rania-galleries/create">
                                <Button>
                                    <Plus className="mr-2 size-4" />
                                    Add Image
                                </Button>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {galleries.data.length === 0 ? (
                            <div className="py-8 text-center text-muted-foreground">
                                No gallery images yet. Add your first one!
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                    {galleries.data.map((gallery) => (
                                        <div
                                            key={gallery.id}
                                            className="group relative overflow-hidden rounded-lg border bg-card"
                                        >
                                            <div className="aspect-[4/3] w-full overflow-hidden bg-muted">
                                                <img
                                                    src={
                                                        gallery.image_url ||
                                                        `/storage/${gallery.image_path}`
                                                    }
                                                    alt={gallery.title || 'Gallery image'}
                                                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                                                />
                                            </div>
                                            <div className="flex items-center justify-between gap-2 p-3">
                                                <div className="min-w-0 flex-1">
                                                    <p className="truncate text-sm font-medium">
                                                        {gallery.title || 'Untitled'}
                                                    </p>
                                                    <Badge
                                                        variant={
                                                            gallery.is_active
                                                                ? 'default'
                                                                : 'secondary'
                                                        }
                                                        className="mt-1"
                                                    >
                                                        {gallery.is_active
                                                            ? 'Active'
                                                            : 'Inactive'}
                                                    </Badge>
                                                </div>
                                                <div className="flex shrink-0 gap-1">
                                                    <Link
                                                        href={`/rania-galleries/${gallery.id}/edit`}
                                                    >
                                                        <Button variant="ghost" size="sm">
                                                            <Edit className="size-4" />
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleDelete(gallery.id)}
                                                    >
                                                        <Trash2 className="size-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {galleries.last_page > 1 && (
                                    <div className="mt-4 flex items-center justify-between border-t pt-4">
                                        <div className="text-sm text-muted-foreground">
                                            Showing {galleries.from} to {galleries.to} of{' '}
                                            {galleries.total} images
                                        </div>
                                        <div className="flex gap-1">
                                            {galleries.links.map((link, index) => {
                                                if (!link.url) {
                                                    return (
                                                        <Button
                                                            key={index}
                                                            variant="ghost"
                                                            size="sm"
                                                            disabled
                                                            dangerouslySetInnerHTML={{
                                                                __html: link.label,
                                                            }}
                                                        />
                                                    );
                                                }

                                                return (
                                                    <Link key={index} href={link.url}>
                                                        <Button
                                                            variant={
                                                                link.active ? 'default' : 'ghost'
                                                            }
                                                            size="sm"
                                                            dangerouslySetInnerHTML={{
                                                                __html: link.label,
                                                            }}
                                                        />
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
