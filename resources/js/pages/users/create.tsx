import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import usersRoute from '@/routes/users';
import { type BreadcrumbItem, type UserRole } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { FormEvent } from 'react';

interface CreateUserProps {
    assignableRoles: string[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'User Management',
        href: usersRoute.index().url,
    },
    {
        title: 'Create User',
        href: usersRoute.create().url,
    },
];

const roleLabels: Record<string, string> = {
    'super-admin': 'Super Admin',
    'admin': 'Admin',
    'editor': 'Editor',
};

export default function CreateUser({ assignableRoles }: CreateUserProps) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: assignableRoles[0] || 'editor',
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post(usersRoute.store().url);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create User" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="mb-4">
                    <Button
                        variant="ghost"
                        onClick={() => window.history.back()}
                    >
                        <ArrowLeft className="mr-2 size-4" />
                        Back to Users
                    </Button>
                </div>

                <Card className="mx-auto w-full max-w-2xl">
                    <CardHeader>
                        <CardTitle>Create New User</CardTitle>
                        <CardDescription>
                            Add a new user to the system with a specific role
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                />
                                {errors.name && (
                                    <p className="text-sm text-destructive">
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                />
                                {errors.email && (
                                    <p className="text-sm text-destructive">
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="role">Role</Label>
                                <Select
                                    value={data.role}
                                    onValueChange={(value) => setData('role', value as UserRole)}
                                >
                                    <SelectTrigger id="role">
                                        <SelectValue placeholder="Select a role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {assignableRoles.map((role) => (
                                            <SelectItem key={role} value={role}>
                                                {roleLabels[role] || role}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.role && (
                                    <p className="text-sm text-destructive">
                                        {errors.role}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    required
                                />
                                {errors.password && (
                                    <p className="text-sm text-destructive">
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password_confirmation">
                                    Confirm Password
                                </Label>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    value={data.password_confirmation}
                                    onChange={(e) =>
                                        setData('password_confirmation', e.target.value)
                                    }
                                    required
                                />
                                {errors.password_confirmation && (
                                    <p className="text-sm text-destructive">
                                        {errors.password_confirmation}
                                    </p>
                                )}
                            </div>

                            <div className="flex gap-3">
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Creating...' : 'Create User'}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => window.history.back()}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
