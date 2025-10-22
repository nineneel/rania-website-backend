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
    type ContactMessageStatus,
} from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Mail, Phone, User } from 'lucide-react';
import { useState } from 'react';

interface ContactMessageShowProps {
    message: ContactMessage;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Contact Messages',
        href: '/contact-messages',
    },
    {
        title: 'View Message',
        href: '#',
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
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(date);
};

export default function ContactMessageShow({ message }: ContactMessageShowProps) {
    const [status, setStatus] = useState<ContactMessageStatus>(message.status);

    const handleStatusChange = (newStatus: string) => {
        setStatus(newStatus as ContactMessageStatus);
        router.patch(
            `/contact-messages/${message.id}/status`,
            { status: newStatus },
            {
                preserveScroll: true,
                onSuccess: () => {
                    // Status updated successfully
                },
            },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Message from ${message.name}`} />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center gap-2">
                    <Link href="/contact-messages">
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="mr-2 size-4" />
                            Back to Messages
                        </Button>
                    </Link>
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex items-start justify-between">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <CardTitle>{message.subject}</CardTitle>
                                    <Badge variant={getStatusBadgeVariant(status)}>
                                        {status}
                                    </Badge>
                                </div>
                                <CardDescription>
                                    Received on {formatDate(message.created_at)}
                                </CardDescription>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">
                                    Status:
                                </span>
                                <Select value={status} onValueChange={handleStatusChange}>
                                    <SelectTrigger className="w-[150px]">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="new">New</SelectItem>
                                        <SelectItem value="read">Read</SelectItem>
                                        <SelectItem value="replied">Replied</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Contact Information */}
                        <div className="grid gap-4 md:grid-cols-3">
                            <div className="flex items-start gap-3 rounded-lg border p-4">
                                <div className="rounded-md bg-primary/10 p-2">
                                    <User className="size-5 text-primary" />
                                </div>
                                <div className="flex-1 space-y-1">
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Name
                                    </p>
                                    <p className="font-semibold">{message.name}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 rounded-lg border p-4">
                                <div className="rounded-md bg-primary/10 p-2">
                                    <Mail className="size-5 text-primary" />
                                </div>
                                <div className="flex-1 space-y-1">
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Email
                                    </p>
                                    <a
                                        href={`mailto:${message.email}`}
                                        className="font-semibold text-primary hover:underline"
                                    >
                                        {message.email}
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 rounded-lg border p-4">
                                <div className="rounded-md bg-primary/10 p-2">
                                    <Phone className="size-5 text-primary" />
                                </div>
                                <div className="flex-1 space-y-1">
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Phone
                                    </p>
                                    <a
                                        href={`tel:${message.phone}`}
                                        className="font-semibold text-primary hover:underline"
                                    >
                                        {message.phone}
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Message Content */}
                        <div className="space-y-2">
                            <h3 className="font-semibold">Message</h3>
                            <div className="rounded-lg border bg-muted/50 p-4">
                                <p className="whitespace-pre-wrap leading-relaxed">
                                    {message.message}
                                </p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 border-t pt-4">
                            <Button asChild>
                                <a href={`mailto:${message.email}`}>Reply via Email</a>
                            </Button>
                            <Button variant="outline" asChild>
                                <a href={`tel:${message.phone}`}>Call</a>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
