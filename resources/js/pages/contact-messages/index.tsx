import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import {
    type BreadcrumbItem,
    type ContactMessage,
    type ContactMessageCounts,
    type ContactMessageStatus,
    type PaginatedData,
} from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Eye, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface ContactMessagesIndexProps {
    messages: PaginatedData<ContactMessage>;
    counts: ContactMessageCounts;
    currentStatus?: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Contact Messages',
        href: '/contact-messages',
    },
];

const getStatusBadgeVariant = (
    status: ContactMessageStatus,
): 'default' | 'secondary' | 'destructive' | 'outline' => {
    switch (status) {
        case 'new':
            return 'destructive';
        case 'read':
            return 'secondary';
        case 'replied':
            return 'default';
        default:
            return 'outline';
    }
};

const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(date);
};

export default function ContactMessagesIndex({
    messages,
    counts,
    currentStatus,
}: ContactMessagesIndexProps) {
    const [statusFilter, setStatusFilter] = useState<string>(currentStatus || 'all');

    const handleStatusChange = (value: string) => {
        setStatusFilter(value);
        if (value === 'all') {
            router.get('/contact-messages');
        } else {
            router.get('/contact-messages', { status: value });
        }
    };

    const handleDelete = (messageId: number) => {
        if (confirm('Are you sure you want to delete this message?')) {
            router.delete(`/contact-messages/${messageId}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Contact Messages" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Contact Messages</CardTitle>
                                <CardDescription>
                                    View and manage incoming contact messages from the website
                                </CardDescription>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-muted-foreground">
                                        Filter:
                                    </span>
                                    <Select
                                        value={statusFilter}
                                        onValueChange={handleStatusChange}
                                    >
                                        <SelectTrigger className="w-[150px]">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">
                                                All ({counts.all})
                                            </SelectItem>
                                            <SelectItem value="new">
                                                New ({counts.new})
                                            </SelectItem>
                                            <SelectItem value="read">
                                                Read ({counts.read})
                                            </SelectItem>
                                            <SelectItem value="replied">
                                                Replied ({counts.replied})
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {messages.data.length === 0 ? (
                            <div className="py-8 text-center text-muted-foreground">
                                No contact messages yet.
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="border-b">
                                        <tr className="text-sm text-muted-foreground">
                                            <th className="p-3 text-left font-medium">
                                                Status
                                            </th>
                                            <th className="p-3 text-left font-medium">Name</th>
                                            <th className="p-3 text-left font-medium">
                                                Email
                                            </th>
                                            <th className="p-3 text-left font-medium">
                                                Phone
                                            </th>
                                            <th className="p-3 text-left font-medium">
                                                Subject
                                            </th>
                                            <th className="p-3 text-left font-medium">Date</th>
                                            <th className="p-3 text-right font-medium">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {messages.data.map((message) => (
                                            <tr
                                                key={message.id}
                                                className="border-b last:border-0 hover:bg-muted/50"
                                            >
                                                <td className="p-3">
                                                    <Badge
                                                        variant={getStatusBadgeVariant(
                                                            message.status,
                                                        )}
                                                    >
                                                        {message.status}
                                                    </Badge>
                                                </td>
                                                <td className="p-3 font-medium">
                                                    {message.name}
                                                </td>
                                                <td className="p-3 text-muted-foreground">
                                                    {message.email}
                                                </td>
                                                <td className="p-3 text-muted-foreground">
                                                    {message.phone}
                                                </td>
                                                <td className="p-3">
                                                    <div className="line-clamp-1 max-w-md">
                                                        {message.subject}
                                                    </div>
                                                </td>
                                                <td className="p-3 text-sm text-muted-foreground">
                                                    {formatDate(message.created_at)}
                                                </td>
                                                <td className="p-3">
                                                    <div className="flex justify-end gap-2">
                                                        <Link
                                                            href={`/contact-messages/${message.id}`}
                                                        >
                                                            <Button variant="ghost" size="sm">
                                                                <Eye className="size-4" />
                                                            </Button>
                                                        </Link>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() =>
                                                                handleDelete(message.id)
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
                        )}

                        {/* Pagination */}
                        {messages.last_page > 1 && (
                            <div className="mt-4 flex items-center justify-between">
                                <p className="text-sm text-muted-foreground">
                                    Showing {messages.from} to {messages.to} of{' '}
                                    {messages.total} messages
                                </p>
                                <div className="flex gap-2">
                                    {messages.links.map((link, index) => (
                                        <Link
                                            key={index}
                                            href={link.url || '#'}
                                            preserveScroll
                                        >
                                            <Button
                                                variant={link.active ? 'default' : 'outline'}
                                                size="sm"
                                                disabled={!link.url}
                                                dangerouslySetInnerHTML={{
                                                    __html: link.label,
                                                }}
                                            />
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
