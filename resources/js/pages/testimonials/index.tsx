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
import { type BreadcrumbItem, type PaginatedData, type Testimonial } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Edit, Plus, Trash2 } from 'lucide-react';

interface TestimonialsIndexProps {
    testimonials: PaginatedData<Testimonial>;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Testimonials',
        href: '/testimonials',
    },
];

export default function TestimonialsIndex({ testimonials }: TestimonialsIndexProps) {
    const handleDelete = (testimonialId: number) => {
        if (confirm('Are you sure you want to delete this testimonial?')) {
            router.delete(`/testimonials/${testimonialId}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Testimonials Management" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Testimonials Management</CardTitle>
                                <CardDescription>
                                    Manage customer testimonials displayed on the website.
                                </CardDescription>
                            </div>
                            <Link href="/testimonials/create">
                                <Button>
                                    <Plus className="mr-2 size-4" />
                                    Add Testimonial
                                </Button>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {testimonials.data.length === 0 ? (
                            <div className="py-8 text-center text-muted-foreground">
                                No testimonials yet. Add your first one!
                            </div>
                        ) : (
                            <>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="border-b">
                                            <tr className="text-sm text-muted-foreground">
                                                <th className="p-3 text-left font-medium">
                                                    Name
                                                </th>
                                                <th className="p-3 text-left font-medium">
                                                    Subtitle
                                                </th>
                                                <th className="p-3 text-left font-medium">
                                                    Testimonial
                                                </th>
                                                <th className="p-3 text-left font-medium">
                                                    Status
                                                </th>
                                                <th className="p-3 text-right font-medium">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {testimonials.data.map((testimonial) => (
                                                <tr
                                                    key={testimonial.id}
                                                    className="border-b last:border-0 hover:bg-muted/50"
                                                >
                                                    <td className="p-3 font-medium">
                                                        {testimonial.name}
                                                    </td>
                                                    <td className="p-3 text-muted-foreground">
                                                        {testimonial.subtitle || '-'}
                                                    </td>
                                                    <td className="p-3 text-muted-foreground">
                                                        <div className="max-w-md truncate">
                                                            {testimonial.text}
                                                        </div>
                                                    </td>
                                                    <td className="p-3">
                                                        <Badge
                                                            variant={
                                                                testimonial.is_active
                                                                    ? 'default'
                                                                    : 'secondary'
                                                            }
                                                        >
                                                            {testimonial.is_active
                                                                ? 'Active'
                                                                : 'Inactive'}
                                                        </Badge>
                                                    </td>
                                                    <td className="p-3">
                                                        <div className="flex justify-end gap-2">
                                                            <Link
                                                                href={`/testimonials/${testimonial.id}/edit`}
                                                            >
                                                                <Button variant="ghost" size="sm">
                                                                    <Edit className="size-4" />
                                                                </Button>
                                                            </Link>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() =>
                                                                    handleDelete(testimonial.id)
                                                                }
                                                            >
                                                                <Trash2 className="size-4" />
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Pagination */}
                                {testimonials.last_page > 1 && (
                                    <div className="mt-4 flex items-center justify-between border-t pt-4">
                                        <div className="text-sm text-muted-foreground">
                                            Showing {testimonials.from} to {testimonials.to} of{' '}
                                            {testimonials.total} testimonials
                                        </div>
                                        <div className="flex gap-1">
                                            {testimonials.links.map((link, index) => {
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
