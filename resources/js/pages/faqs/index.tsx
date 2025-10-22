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
import { type BreadcrumbItem, type FAQ, type PaginatedData } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Edit, Plus, Trash2 } from 'lucide-react';

interface FAQsIndexProps {
    faqs: PaginatedData<FAQ>;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'FAQs',
        href: '/faqs',
    },
];

export default function FAQsIndex({ faqs }: FAQsIndexProps) {
    const handleDelete = (faqId: number) => {
        if (confirm('Are you sure you want to delete this FAQ?')) {
            router.delete(`/faqs/${faqId}`);
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
                                    Manage frequently asked questions displayed on the Support & Help page.
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
                        {faqs.data.length === 0 ? (
                            <div className="py-8 text-center text-muted-foreground">
                                No FAQs yet. Add your first one!
                            </div>
                        ) : (
                            <>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="border-b">
                                            <tr className="text-sm text-muted-foreground">
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
                                        <tbody>
                                            {faqs.data.map((faq) => (
                                                <tr
                                                    key={faq.id}
                                                    className="border-b last:border-0 hover:bg-muted/50"
                                                >
                                                    <td className="p-3 font-medium">
                                                        <div className="max-w-md">
                                                            {faq.question}
                                                        </div>
                                                    </td>
                                                    <td className="p-3 text-muted-foreground">
                                                        <div className="max-w-lg truncate">
                                                            {faq.answer}
                                                        </div>
                                                    </td>
                                                    <td className="p-3">
                                                        <Badge
                                                            variant={
                                                                faq.is_active
                                                                    ? 'default'
                                                                    : 'secondary'
                                                            }
                                                        >
                                                            {faq.is_active
                                                                ? 'Active'
                                                                : 'Inactive'}
                                                        </Badge>
                                                    </td>
                                                    <td className="p-3">
                                                        <div className="flex justify-end gap-2">
                                                            <Link
                                                                href={`/faqs/${faq.id}/edit`}
                                                            >
                                                                <Button variant="ghost" size="sm">
                                                                    <Edit className="size-4" />
                                                                </Button>
                                                            </Link>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() =>
                                                                    handleDelete(faq.id)
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
                                {faqs.last_page > 1 && (
                                    <div className="mt-4 flex items-center justify-between border-t pt-4">
                                        <div className="text-sm text-muted-foreground">
                                            Showing {faqs.from} to {faqs.to} of{' '}
                                            {faqs.total} FAQs
                                        </div>
                                        <div className="flex gap-1">
                                            {faqs.links.map((link, index) => {
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
