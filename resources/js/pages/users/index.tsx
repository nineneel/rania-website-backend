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
import usersRoute from '@/routes/users';
import { type BreadcrumbItem, type PaginatedData, type User } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Edit, Plus, Trash2 } from 'lucide-react';

interface UsersIndexProps {
    users: PaginatedData<User>;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'User Management',
        href: usersRoute.index().url,
    },
];

const roleColors = {
    'super-admin': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    'admin': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    'editor': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
};

const roleLabels = {
    'super-admin': 'Super Admin',
    'admin': 'Admin',
    'editor': 'Editor',
};

export default function UsersIndex({ users }: UsersIndexProps) {
    const handleDelete = (userId: number) => {
        if (confirm('Are you sure you want to delete this user?')) {
            router.delete(usersRoute.destroy(userId).url);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="User Management" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>User Management</CardTitle>
                                <CardDescription>
                                    Manage users and their roles in the system
                                </CardDescription>
                            </div>
                            <Link href={usersRoute.create().url}>
                                <Button>
                                    <Plus className="mr-2 size-4" />
                                    Add User
                                </Button>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="border-b">
                                    <tr className="text-sm text-muted-foreground">
                                        <th className="p-3 text-left font-medium">Name</th>
                                        <th className="p-3 text-left font-medium">Email</th>
                                        <th className="p-3 text-left font-medium">Role</th>
                                        <th className="p-3 text-left font-medium">
                                            Joined Date
                                        </th>
                                        <th className="p-3 text-right font-medium">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.data.map((user) => (
                                        <tr
                                            key={user.id}
                                            className="border-b last:border-0 hover:bg-muted/50"
                                        >
                                            <td className="p-3 font-medium">{user.name}</td>
                                            <td className="p-3 text-muted-foreground">
                                                {user.email}
                                            </td>
                                            <td className="p-3">
                                                <Badge
                                                    variant="secondary"
                                                    className={roleColors[user.role]}
                                                >
                                                    {roleLabels[user.role]}
                                                </Badge>
                                            </td>
                                            <td className="p-3 text-muted-foreground">
                                                {new Date(user.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="p-3">
                                                <div className="flex justify-end gap-2">
                                                    <Link
                                                        href={usersRoute.edit(user.id).url}
                                                    >
                                                        <Button variant="ghost" size="sm">
                                                            <Edit className="size-4" />
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleDelete(user.id)}
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
                        {users.last_page > 1 && (
                            <div className="mt-4 flex items-center justify-between">
                                <p className="text-sm text-muted-foreground">
                                    Showing {users.from} to {users.to} of {users.total}{' '}
                                    users
                                </p>
                                <div className="flex gap-2">
                                    {users.links.map((link, index) => (
                                        <Link
                                            key={index}
                                            href={link.url || '#'}
                                            preserveScroll
                                        >
                                            <Button
                                                variant={
                                                    link.active ? 'default' : 'outline'
                                                }
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
