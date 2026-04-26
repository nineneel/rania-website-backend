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
import { type BreadcrumbItem, type UmrahCategory } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Edit, Plus, Trash2 } from 'lucide-react';

interface CategoriesIndexProps {
    categories: UmrahCategory[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Umrah Content',
        href: '/umrah-content',
    },
    {
        title: 'Categories',
        href: '/umrah-content/categories',
    },
];

export default function CategoriesIndex({ categories }: CategoriesIndexProps) {
    const handleDelete = (categoryId: number, packagesCount: number) => {
        const message =
            packagesCount > 0
                ? `This category has ${packagesCount} package(s). Deleting it will unlink those packages from any category. Continue?`
                : 'Are you sure you want to delete this category?';

        if (confirm(message)) {
            router.delete(`/umrah-content/categories/${categoryId}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Umrah Categories Management" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Umrah Categories</CardTitle>
                                <CardDescription>
                                    Manage package categories (e.g. Umrah Private, Umrah Plus).
                                </CardDescription>
                            </div>
                            <Link href="/umrah-content/categories/create">
                                <Button>
                                    <Plus className="mr-2 size-4" />
                                    Add Category
                                </Button>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {categories.length === 0 ? (
                            <div className="py-8 text-center text-muted-foreground">
                                No categories yet. Add your first one!
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="border-b">
                                        <tr className="text-sm text-muted-foreground">
                                            <th className="p-3 text-left font-medium">Name</th>
                                            <th className="p-3 text-left font-medium">Slug</th>
                                            <th className="p-3 text-left font-medium">
                                                Description
                                            </th>
                                            <th className="p-3 text-left font-medium">Packages</th>
                                            <th className="p-3 text-left font-medium">Status</th>
                                            <th className="p-3 text-right font-medium">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {categories.map((category) => (
                                            <tr
                                                key={category.id}
                                                className="border-b last:border-0 hover:bg-muted/50"
                                            >
                                                <td className="p-3 font-medium">{category.name}</td>
                                                <td className="p-3 font-mono text-xs text-muted-foreground">
                                                    {category.slug}
                                                </td>
                                                <td className="p-3 text-muted-foreground">
                                                    {category.description || '-'}
                                                </td>
                                                <td className="p-3">
                                                    {category.packages_count ?? 0}
                                                </td>
                                                <td className="p-3">
                                                    <Badge
                                                        variant={
                                                            category.is_active
                                                                ? 'default'
                                                                : 'secondary'
                                                        }
                                                    >
                                                        {category.is_active ? 'Active' : 'Inactive'}
                                                    </Badge>
                                                </td>
                                                <td className="p-3">
                                                    <div className="flex justify-end gap-2">
                                                        <Link
                                                            href={`/umrah-content/categories/${category.id}/edit`}
                                                        >
                                                            <Button variant="ghost" size="sm">
                                                                <Edit className="size-4" />
                                                            </Button>
                                                        </Link>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    category.id,
                                                                    category.packages_count ?? 0,
                                                                )
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
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
