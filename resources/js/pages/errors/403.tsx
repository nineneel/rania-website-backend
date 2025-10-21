import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { ShieldAlert } from 'lucide-react';

interface ForbiddenProps {
    message?: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Access Denied',
        href: '#',
    },
];

export default function Forbidden({ message = 'You do not have permission to access this resource.' }: ForbiddenProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="403 - Forbidden" />
            <div className="flex h-full flex-1 flex-col items-center justify-center p-4">
                <div className="mx-auto max-w-md text-center">
                    <div className="mb-6 flex justify-center">
                        <div className="rounded-full bg-destructive/10 p-6">
                            <ShieldAlert className="h-16 w-16 text-destructive" />
                        </div>
                    </div>

                    <h1 className="mb-2 text-4xl font-bold tracking-tight">403</h1>
                    <h2 className="mb-4 text-xl font-semibold tracking-tight">Access Denied</h2>

                    <p className="mb-8 text-muted-foreground">
                        {message}
                    </p>

                    <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
                        <Button
                            onClick={() => router.visit('/')}
                        >
                            Go to Dashboard
                        </Button>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
